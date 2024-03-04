import { prisma, Prisma } from "../config/prismaDBConfig.js";
import { v4 as uuidV4 } from "uuid";
import {
  insert_file_version_and_directory,
  copy_file_version_directory,
} from "./insert_file_directory.js";

const prismaOpts = {
  maxWait: 5000,
  timeout: 10000,
  isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
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

export const copyFolder = async (fromPath, toPath, username) => {
  const srcDepth = fromPath.split("/").length;
  let dir = fromPath.split("/").slice(1).join("/");
  dir = dir === "" ? "/" : dir;
  const device = fromPath.split("/")[0];
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

  const dstFiles = getDstFilePaths(files, toPath, srcDepth);

  let dstFilesObj = {};
  dstFiles.forEach((file) => {
    const path = file.path;
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

  for (const [path, files] of Object.entries(dstFilesObj)) {
    console.log(path, Array.from(files).length);
    const device = path.split("/")[1];
    let dir = path.split("/").slice(2).join("/");
    dir = dir === "" ? "/" : dir;
    // await insert_file_version_and_directory(username, path, device, dir, files);
    await prisma.$transaction(async (prisma) => {
      await copy_file_version_directory(
        prisma,
        path,
        username,
        device,
        dir,
        files
      );
    });
  }
};
