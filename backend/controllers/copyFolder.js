import { prisma } from "../config/prismaDBConfig.js";
import {
  copy_file_version_directory,
  createPaths,
  getPathTree,
} from "./insert_file_directory.js";
import { getSrcFilePaths, getDstFilePaths, getDirectoryMap } from "./utils.js";

export const copy_empty_directory = async (prisma, data) => {
  const { toPath, username, fromPath, srcDepth, rename } = data;
  const path = fromPath === "/" ? "/" : "/" + fromPath;
  const all_directories = await prisma.directory.findMany({
    where: {
      username,
      path: {
        contains: path + "%",
      },
    },
    select: {
      path: true,
    },
  });

  for (const dir of all_directories) {
    const sliceStart = rename ? srcDepth + 1 : srcDepth;
    const pathParts = dir.path.split("/").slice(sliceStart).join("/");
    const relPath = pathParts === "" ? "/" : pathParts;
    const dstPath = toPath + "/" + relPath;
    const device = dstPath.split("/")[1] === "" ? "/" : dstPath.split("/")[1];
    const paths = getPathTree(dstPath.split("/"));
    const data = { username, device };
    await createPaths(prisma, paths, data);
  }
};

export const copy_transaction = (data) => async (prisma) => {
  await copy_empty_directory(prisma, data);
};

export const copyFolder = async (fromPath, toPath, username) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("from-->", fromPath, " toPath-->", toPath);
      const srcDepth = fromPath.split("/").length;

      const files = await getSrcFilePaths(prisma, fromPath, username);

      if (files.length > 0) {
        const dstFiles = getDstFilePaths(files, toPath, srcDepth);

        const dstFilesObj = getDirectoryMap(dstFiles);

        for (const [path, files] of Object.entries(dstFilesObj)) {
          const [dstPath, srcPath] = path.split(";");
          const device = dstPath.split("/")[1];
          let dir = dstPath.split("/").slice(2).join("/");
          dir = dir === "" ? "/" : dir;
          const data = { dstPath, username, device, dir, files, srcPath };
          await prisma.$transaction(async (prisma) => {
            await copy_file_version_directory(prisma, data);
          });
        }
      } else {
        const data = { fromPath, toPath, username, srcDepth };
        await prisma.$transaction(copy_transaction(data));
      }
      resolve();
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
