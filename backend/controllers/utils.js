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

export const updateVersionedFiles = async (prisma, data) => {
  const { username, srcPath, files } = data;
  console.log("------------- inside version update-------------");
  const device = srcPath.split("/")[1];
  let dir = srcPath.split("/").slice(2).join("/");
  dir = dir === "" ? "/" : dir;
  console.log({ device, dir, username });
  console.log(files);
  const versions = await prisma.fileVersion.findMany({
    where: {
      username,
      directory: dir,
      device,
    },
  });
  console.log("---------------- versions identified ---------------------");
  console.log(versions);
  let versionedFiles = [];
  for (const file of versions) {
    const data = {
      ...file,
      origin: files.get(file.origin).origin,
      directory: files.get(file.origin).directory,
      device: files.get(file.origin).device,
    };
    versionedFiles.push(data);
  }
  console.log("---------------- versions identified ---------------------");

  console.log("------------- inside version update-------------");

  return versionedFiles;
};

export const getDstFilePaths = (files, toPath, srcDepth, rename = false) => {
  let dstFiles = [];
  for (const file of files) {
    const device = `${file.device}`;
    const dir = file.directory;
    let srcPath;
    if (dir === "/" && device === "/") {
      srcPath = "/";
    } else if (dir === "/" && device !== "/") {
      srcPath = "/" + device;
    } else {
      srcPath = "/" + device + "/" + dir;
    }
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
      origin_new: uuid,
      directory: dst_dir,
      device: dst_device,
      path: dst_path + ";" + srcPath,
    };

    dstFiles.push(dstFileData);
  }

  return dstFiles;
};

export const getDirectoryMap = (files) => {
  let dstFilesObj = {};
  files.forEach((file) => {
    const path = file.path;
    // let path = "";
    // if (file.directory === "/" && file.device === "/") {
    //   path = "/";
    // } else if (file.directory === "/" && file.device !== "/") {
    //   path = "/" + file.device;
    // } else {
    //   path = "/" + file.device + "/" + file.directory;
    // }
    if (dstFilesObj.hasOwnProperty(path)) {
      delete file.path;
      delete file.dirID;
      const origin = file.origin;
      file.origin = file.origin_new;
      delete file.origin_new;
      dstFilesObj[path].set(origin, file);
    } else {
      dstFilesObj[path] = new Map([]);
      delete file.path;
      delete file.dirID;
      const origin = file.origin;
      file.origin = file.origin_new;
      delete file.origin_new;
      dstFilesObj[path].set(origin, file);
    }
  });
  return dstFilesObj;
};
