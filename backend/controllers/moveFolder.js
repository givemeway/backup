import {
  getDirectoryMap,
  getDstFilePaths,
  getSrcFilePaths,
} from "../controllers/utils.js";
import { delete_file_version_directory } from "./delete_file_version_directory.js";
import { copy_file_version_directory } from "./insert_file_directory.js";
import { Prisma, prisma } from "../config/prismaDBConfig.js";

const insert_file_version_directory_and_delete_files_directory = (
  username,
  path,
  device,
  directory,
  dstFiles,
  from
) => {
  return new Promise(async (resolve, reject) => {
    try {
      await prisma.$transaction(async (prisma) => {
        await copy_file_version_directory(
          prisma,
          path,
          username,
          device,
          directory,
          dstFiles
        );
        await delete_file_version_directory(prisma, "/" + from, username);
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
    const device = path.split("/")[1];
    let dir = path.split("/").slice(2).join("/");
    dir = dir === "" ? "/" : dir;
    await insert_file_version_directory_and_delete_files_directory(
      username,
      path,
      device,
      dir,
      files,
      fromPath
    );
  }
  console.log("completed!!");
};
