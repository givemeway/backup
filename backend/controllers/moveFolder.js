import {
  getDirectoryMap,
  getDstFilePaths,
  getSrcFilePaths,
} from "../controllers/utils.js";
import { delete_file_version_directory } from "./delete_file_version_directory.js";
import { copy_file_version_directory } from "./insert_file_directory.js";
import { prisma } from "../config/prismaDBConfig.js";

const copy_dir_delete_dir = (username, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await prisma.$transaction(async (prisma) => {
        const from = "/" + data.fromPath;
        await copy_file_version_directory(prisma, data);
        await delete_file_version_directory(prisma, from, username);
      });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

export const moveFolder = async (
  fromPath,
  toPath,
  username,
  rename = false
) => {
  const srcDepth = fromPath.split("/").length;
  const files = await getSrcFilePaths(prisma, fromPath, username);
  const dstFiles = getDstFilePaths(files, toPath, srcDepth, rename);
  const dstFilesObj = getDirectoryMap(dstFiles);
  // todo HANDLE the empty folder
  for (const [path, files] of Object.entries(dstFilesObj)) {
    console.log(path, Array.from(files).length);
    const [dstPath, srcPath] = path.split(";");
    const device = dstPath.split("/")[1];
    let dir = dstPath.split("/").slice(2).join("/");
    dir = dir === "" ? "/" : dir;
    const data = { dstPath, username, device, dir, files, fromPath, srcPath };

    await copy_dir_delete_dir(username, data);
  }
  console.log("completed!!");
};
