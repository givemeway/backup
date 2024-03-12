import { prisma } from "../config/prismaDBConfig.js";
import { copy_file_version_directory } from "./insert_file_directory.js";
import { getSrcFilePaths, getDstFilePaths, getDirectoryMap } from "./utils.js";

export const copyFolder = async (fromPath, toPath, username) => {
  const srcDepth = fromPath.split("/").length;

  const files = await getSrcFilePaths(prisma, fromPath, username);
  const dstFiles = getDstFilePaths(files, toPath, srcDepth);

  const dstFilesObj = getDirectoryMap(dstFiles);

  for (const [path, files] of Object.entries(dstFilesObj)) {
    console.log(path, Array.from(files).length);
    const [dstPath, srcPath] = path.split(";");
    const device = dstPath.split("/")[1];
    let dir = dstPath.split("/").slice(2).join("/");
    dir = dir === "" ? "/" : dir;
    const data = { dstPath, username, device, dir, files, srcPath };
    await prisma.$transaction(async (prisma) => {
      await copy_file_version_directory(prisma, data);
    });
  }
};
