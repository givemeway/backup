import { v4 as uuidv4 } from "uuid";
import { prisma, Prisma } from "../config/prismaDBConfig.js";

export const insert_file_and_directory = (path, insertData) => {
  return new Promise(async (resolve, reject) => {
    try {
      await prisma.$transaction(async (prisma) => {
        const pathParts = path.split("/");
        const username = insertData.username;
        const device = insertData.device;
        const paths = pathParts
          .map((part, idx) => [part, pathParts.slice(0, idx + 1).join("/")])
          .slice(1);
        const pathExists = await prisma.directory.findFirst({
          where: {
            username: insertData.username,
            path: paths.slice(-1)[0][1],
          },
        });
        if (pathExists === null) {
          let pathsCreated = 0;
          let fileUUID = "";
          for (const path of paths) {
            const uuid = uuidv4();
            try {
              await prisma.$executeRaw(Prisma.sql`INSERT INTO public."Directory" 
                VALUES (${uuid},${username},${device},${path[0]},${path[1]},CURRENT_TIMESTAMP)
                ON CONFLICT DO NOTHING`);

              pathsCreated++;

              if (pathsCreated === paths.length) fileUUID = uuid;
            } catch (err) {
              if (err?.code === "P2002") {
                pathsCreated++;
              } else {
                console.info(err);
                throw Error(err);
              }
            }
          }

          if (pathsCreated === paths.length)
            await prisma.file.create({
              data: {
                ...insertData,
                directoryID: {
                  connect: {
                    uuid: fileUUID,
                  },
                },
              },
            });
        } else {
          await prisma.file.create({
            data: {
              ...insertData,
              directoryID: {
                connect: {
                  uuid: pathExists.uuid,
                },
              },
            },
          });
        }
      });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

export const copy_file_version_directory = async (
  prisma,
  path,
  username,
  device,
  directory,
  files
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pathParts = path.split("/");
      const paths = pathParts
        .map((part, idx) => [part, pathParts.slice(0, idx + 1).join("/")])
        .slice(1);
      const pathExists = await prisma.directory.findFirst({
        where: {
          username,
          path: paths.slice(-1)[0][1],
        },
      });
      if (pathExists === null) {
        console.log("Path not found creating one....");
        let pathsCreated = 0;
        let dirID = "";
        for (const path of paths) {
          const uuid = uuidv4();
          await prisma.$executeRaw(Prisma.sql`INSERT INTO public."Directory" 
                    VALUES (${uuid},${username},${device},${path[0]},${path[1]},CURRENT_TIMESTAMP)
                    ON CONFLICT DO NOTHING`);
          pathsCreated++;

          if (pathsCreated === paths.length) dirID = uuid;
        }

        if (pathsCreated === paths.length) {
          const fileVersions = await updateVersionedFiles(
            device,
            directory,
            username,
            files
          );
          const fileList = Array.from(files).map(([_, value]) => ({
            ...value,
            dirID: dirID,
            origin: value.origin,
          }));
          if (fileVersions.length > 0) {
            await prisma.file.createMany({ data: fileList });
            await prisma.fileVersion.createMany({ data: fileVersions });
          } else {
            await prisma.file.createMany({
              data: fileList,
            });
          }
        } else {
          throw Error("Directory or File not insert or created");
        }
      } else {
        console.log("Path found updating files....");
        const fileList = Array.from(files).map(([_, value]) => ({
          ...value,
          dirID: pathExists.uuid,
          origin: value.origin,
        }));
        const fileVersions = await updateVersionedFiles(
          device,
          directory,
          username,
          files
        );

        if (fileVersions.length > 0) {
          await prisma.file.createMany({ data: fileList });
          await prisma.fileVersion.createMany({ data: fileVersions });
        } else {
          await prisma.file.createMany({
            data: fileList,
          });
        }
      }
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

const updateVersionedFiles = async (device, dir, username, files) => {
  const versions = await prisma.$queryRaw(Prisma.sql`
      SELECT * FROM public."FileVersion" 
      WHERE username = ${username} AND
      device = ${device} AND
      directory = ${dir}`);

  let versionedFiles = [];
  for (const file of versions) {
    const data = {
      ...file,
      // uuid: uuidv4(),
      origin: files.get(file.uuid).origin,
      directory: files.get(file.uuid).directory,
      device: files.get(file.uuid).device,
    };
    versionedFiles.push(data);
  }

  return versionedFiles;
};

export const insert_file_version_and_directory = (
  username,
  path,
  device,
  directory,
  files
) => {
  return new Promise(async (resolve, reject) => {
    try {
      await prisma.$transaction(async (prisma) => {
        const pathParts = path.split("/");
        const paths = pathParts
          .map((part, idx) => [part, pathParts.slice(0, idx + 1).join("/")])
          .slice(1);
        const pathExists = await prisma.directory.findFirst({
          where: {
            username,
            path: paths.slice(-1)[0][1],
          },
        });
        if (pathExists === null) {
          console.log("Path not found creating one....");
          let pathsCreated = 0;
          let dirID = "";
          for (const path of paths) {
            const uuid = uuidv4();
            try {
              await prisma.$executeRaw(Prisma.sql`INSERT INTO public."Directory" 
                VALUES (${uuid},${username},${device},${path[0]},${path[1]},CURRENT_TIMESTAMP)
                ON CONFLICT DO NOTHING`);

              pathsCreated++;

              if (pathsCreated === paths.length) dirID = uuid;
            } catch (err) {
              if (err?.code === "P2002") {
                pathsCreated++;
              } else {
                console.info(err);
                throw Error(err);
              }
            }
          }

          if (pathsCreated === paths.length) {
            const fileVersions = await updateVersionedFiles(
              device,
              directory,
              username,
              files
            );
            const fileList = Array.from(files).map(([_, value]) => ({
              ...value,
              dirID: dirID,
              origin: value.uuid,
            }));
            if (fileVersions.length > 0) {
              await prisma.file.createMany({ data: fileList });
              await prisma.fileVersion.createMany({ data: fileVersions });
            } else {
              await prisma.file.createMany({
                data: fileList,
              });
            }
          } else {
            throw Error("Directory or File not insert or created");
          }
        } else {
          console.log("Path found updating files....");
          const fileList = Array.from(files).map(([_, value]) => ({
            ...value,
            dirID: pathExists.uuid,
            origin: value.uuid,
          }));
          const fileVersions = await updateVersionedFiles(
            device,
            directory,
            username,
            files
          );
          if (fileVersions.length > 0) {
            await prisma.file.createMany({ data: fileList });
            await prisma.fileVersion.createMany({ data: fileVersions });
          } else {
            await prisma.file.createMany({
              data: fileList,
            });
          }
        }
      });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};
