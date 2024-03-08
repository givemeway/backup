import { prisma, Prisma } from "../config/prismaDBConfig.js";
import { v4 as uuidV4 } from "uuid";

export const getSrcFilePaths = async (prisma, path, username) => {
  return new Promise(async (resolve, reject) => {
    try {
      let dir = path.split("/").slice(1).join("/");
      dir = dir === "" ? "/" : dir;
      const device = path.split("/")[0];
      let dirMatch = `^${dir}(/[^/]+)*$`;
      let files = [];
      if (dir === "/") {
        files = await prisma.$queryRaw(Prisma.sql`SELECT * FROM public."File"
                                                        WHERE username = ${username} 
                                                        AND device = ${device}
                                                        ORDER BY directory ASC;`);
      } else {
        files = await prisma.$queryRaw(Prisma.sql`SELECT * FROM public."File"
                                                         WHERE username = ${username} 
                                                         AND device = ${device}
                                                         AND directory ~ ${dirMatch}
                                                         ORDER BY directory ASC;`);
      }
      resolve(files);
    } catch (err) {
      reject(err);
    }
  });
};

export const updateVersionedFiles = async (device, dir, username, files) => {
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

export const getDstFilePaths = (files, toPath, srcDepth, rename = false) => {
  let dstFiles = [];
  for (const file of files) {
    const device = `${file.device}`;
    const dir = file.directory;
    let path;
    if (dir === "/") path = device + "/" + file.filename;
    else path = device + "/" + dir + "/" + file.filename;
    let relPath = "";
    if (rename) {
      relPath = path.split("/").slice(srcDepth).join("/");
      relPath = relPath === "" ? "/" : relPath;
    } else {
      relPath = path
        .split("/")
        .slice(srcDepth - 1)
        .join("/");
    }
    let dstPath;
    if (toPath === "/") {
      if (relPath === "/") {
        dstPath = "/";
      } else {
        dstPath = "/" + relPath;
      }
    } else {
      if (relPath === "/") {
        dstPath = toPath;
      } else {
        dstPath = toPath + "/" + relPath;
      }
    }
    const dst_device = dstPath.split("/")[1];
    const dst_path = dstPath.split("/").slice(0, -1).join("/");
    let dst_dir = dstPath.split("/").slice(2, -1).join("/");
    dst_dir = dst_dir === "" ? "/" : dst_dir;
    const uuid = uuidV4();
    const dstFileData = {
      ...file,
      origin: uuid,
      directory: dst_dir,
      device: dst_device,
      path: dst_path,
    };

    dstFiles.push(dstFileData);
  }

  return dstFiles;
};

export const getDirectoryMap = (files) => {
  let dstFilesObj = {};
  files.forEach((file) => {
    // const path = file.path;
    let path = "";
    if (file.directory === "/" && file.device !== "/") {
      path = "/" + file.device;
    } else {
      path = "/" + file.device + "/" + file.directory;
    }
    if (dstFilesObj.hasOwnProperty(path)) {
      delete file.path;
      delete file.dirID;
      dstFilesObj[path].set(file.uuid, file);
    } else {
      dstFilesObj[path] = new Map([]);
      delete file.path;
      delete file.dirID;
      dstFilesObj[path].set(file.uuid, file);
    }
  });
  return dstFilesObj;
};
