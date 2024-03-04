import { getDstFilePaths } from "./copyFolder.js";
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
  let dir = fromPath.split("/").slice(1).join("/");
  dir = dir === "" ? "/" : dir;
  const device = fromPath.split("/")[0];
  let dirMatch = `^${dir}(/[^/]+)*$`;
  let files = [];
  console.log("From Path ", fromPath);
  console.log("Directory: ", dir);
  console.log("To Path:", toPath);
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
  const dstFiles = getDstFilePaths(files, toPath, srcDepth, rename);
  let dstFilesObj = {};
  dstFiles.forEach((file) => {
    const path = file.path;
    if (dstFilesObj.hasOwnProperty(path)) {
      delete file.path;
      delete file.dirID;
      dstFilesObj[path].set(file.origin, file);
    } else {
      dstFilesObj[path] = new Map([]);
      delete file.path;
      delete file.dirID;
      dstFilesObj[path].set(file.origin, file);
    }
  });
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
