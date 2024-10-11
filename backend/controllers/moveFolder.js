import {
  getDirectoryMap,
  getDstFilePaths,
  getSrcFilePaths,
} from "../controllers/utils.js";
import {
  delete_copied_directories,
  delete_file_version_directory,
} from "./delete_file_version_directory.js";
import { copy_file_version_directory } from "./insert_file_directory.js";
import { prisma } from "../config/prismaDBConfig.js";
import { copy_empty_directory } from "./copyFolder.js";

const move_transaction = (data) => async (prisma) => {
  const from = "/" + data.fromPath;
  await copy_file_version_directory(prisma, data);
  await delete_file_version_directory(prisma, from, data.username);
};

const move_empty_dir_transaction = (data) => async (prisma) => {
  await copy_empty_directory(prisma, data);
  await delete_copied_directories(prisma, data);
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
  if (files.length > 0) {
    for (const [path, files] of Object.entries(dstFilesObj)) {
      const [dstPath, srcPath] = path.split(";");
      const device = dstPath.split("/")[1];
      let dir = dstPath.split("/").slice(2).join("/");
      dir = dir === "" ? "/" : dir;
      const data = { dstPath, username, device, dir, files, fromPath, srcPath };
      await prisma.$transaction(move_transaction(data));
    }
  } else {
    const path = fromPath === "/" ? "/" : "/" + fromPath;
    let dir = path.split("/").slice(2).join("/");
    dir = dir === "" ? "/" : dir;
    const device = path.split("/")[1];
    const regex_dir = `^${dir}(/[^/]+)*$`;
    const regex_path = `^${path}(/[^/]+)*$`;
    const data = {
      fromPath,
      toPath,
      username,
      srcDepth,
      device,
      dir,
      regex_dir,
      regex_path,
      rename,
    };
    await prisma.$transaction(move_empty_dir_transaction(data));
  }

  console.log("completed!!");
};
