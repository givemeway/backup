import { prisma } from "../config/prismaDBConfig.js";
import { copy_file_version_directory } from "./insert_file_directory.js";
import { getSrcFilePaths, getDstFilePaths, getDirectoryMap } from "./utils.js";

export const copyFolder = async (fromPath, toPath, username) => {
  const srcDepth = fromPath.split("/").length;

  const files = await getSrcFilePaths(fromPath, username);
  const dstFiles = getDstFilePaths(files, toPath, srcDepth);

  const dstFilesObj = getDirectoryMap(dstFiles);

  for (const [path, files] of Object.entries(dstFilesObj)) {
    console.log(path, Array.from(files).length);
    const device = path.split("/")[1];
    let dir = path.split("/").slice(2).join("/");
    dir = dir === "" ? "/" : dir;
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
