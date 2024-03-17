import { v4 as uuidv4 } from "uuid";
import { prisma, Prisma } from "../config/prismaDBConfig.js";
import { updateVersionedFiles } from "./utils.js";

export const createPaths = async (prisma, paths, data) => {
  const { username, device } = data;

  let pathsToInsert = [];
  for (const pth of paths) {
    const uuid = uuidv4();
    const pathObj = {
      uuid,
      username,
      device,
      folder: pth[0],
      path: pth[1],
      created_at: new Date().toISOString(),
    };
    pathsToInsert.push(pathObj);
  }
  console.log(pathsToInsert);
  await prisma.directory.createMany({
    data: pathsToInsert,
    skipDuplicates: true,
  });
};

const insertFile = async (prisma, data) => {
  const { username, device, folder, path, insertData } = data;
  const directory = await prisma.directory.findUnique({
    where: {
      username_device_folder_path: {
        username,
        device,
        path,
        folder: folder,
      },
    },
    select: {
      uuid: true,
    },
  });
  if (directory !== null) {
    await prisma.file.create({
      data: {
        ...insertData,
        directoryID: {
          connect: {
            uuid: directory.uuid,
          },
        },
      },
    });
  }
};

export const getPathTree = (pathParts) => {
  return pathParts
    .map((part, idx) => [
      part === "" ? "/" : part,
      pathParts.slice(0, idx + 1).join("/"),
    ])
    .slice(1);
};

export const insert_file_and_directory = (path, insertData) => {
  return new Promise(async (resolve, reject) => {
    try {
      await prisma.$transaction(async (prisma) => {
        const pathParts = path.split("/");
        const username = insertData.username;
        const device = insertData.device;
        const folderParts = path.split("/").slice(-1)[0];
        const folder = folderParts === "" ? "/" : folderParts;
        const data = { username, device, folder, path, insertData };
        const paths = getPathTree(pathParts);
        await createPaths(prisma, paths, data);
        await insertFile(prisma, data);
      });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

const insertFiles = async (prisma, data) => {
  const { username, dstPath, files } = data;
  const directory = await prisma.directory.findFirst({
    where: {
      username,
      path: dstPath,
    },
    select: {
      uuid: true,
    },
  });
  if (directory !== null) {
    const fileList = Array.from(files).map(([_, value]) => ({
      ...value,
      dirID: directory.uuid,
      origin: value.origin,
    }));
    await prisma.file.createMany({ data: fileList });
  }
};

const insertVersions = async (prisma, files) => {
  await prisma.fileVersion.createMany({ data: files });
};

export const copy_file_version_directory = async (prisma, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pathParts = data.dstPath.split("/");
      const paths = getPathTree(pathParts);
      const versions = await updateVersionedFiles(prisma, data);
      await createPaths(prisma, paths, data);
      await insertFiles(prisma, data);
      await insertVersions(prisma, versions);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
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
        const paths = getPathTree(pathParts);
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
            const fileList = Array.from(on).map(([_, value]) => ({
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
