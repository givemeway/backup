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
  const device = srcPath.split("/")[1];
  let dir = srcPath.split("/").slice(2).join("/");
  dir = dir === "" ? "/" : dir;
  const versions = await prisma.fileVersion.findMany({
    where: {
      username,
      directory: dir,
      device,
    },
  });

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

  return versionedFiles;
};

const getSrcPath = (device, dir) => {
  let srcPath;
  if (dir === "/" && device === "/") {
    srcPath = "/";
  } else if (dir === "/" && device !== "/") {
    srcPath = "/" + device;
  } else {
    srcPath = "/" + device + "/" + dir;
  }
  return srcPath;
};

export const getData = (path, begin, end, root, username) => {
  const dirParts = path.split("/").slice(2).join("/");
  const device = path.split("/")[1];
  let dir = dirParts === "" ? "/" : dirParts;
  dir = dir.replace(/\(/g, "\\(");
  dir = dir.replace(/\)/g, "\\)");
  const regexp = `^${dir}(/[^/]+)*$`;
  let data = {};
  data.root = root;
  data.dir = dir;
  data.device = device;
  data.username = username;
  data.reg = regexp;
  data.pg = end;
  data.bg = begin;
  return data;
};

const getPath_without_prefixed_slash = (device, dir, filename) => {
  let path;
  if (dir === "/") path = device + "/" + file.filename;
  else path = device + "/" + dir + "/" + file.filename;
  return path;
};

export const getRelPath = (path, srcDepth, rename = false) => {
  let relPath;
  if (rename) {
    relPath = path.split("/").slice(srcDepth).join("/");
    relPath = relPath === "" ? "/" : relPath;
  } else {
    relPath = path
      .split("/")
      .slice(srcDepth - 1)
      .join("/");
  }
  return relPath;
};

export const getDstPath = (toPath, relPath) => {
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
  return dstPath;
};

const get_dst_device_dir = (dstPath) => {
  const dst_device = dstPath.split("/")[1];
  const dst_path = dstPath.split("/").slice(0, -1).join("/");
  let dst_dir = dstPath.split("/").slice(2, -1).join("/");
  dst_dir = dst_dir === "" ? "/" : dst_dir;
  return { dst_device, dst_path, dst_dir };
};

export const get_src_device_dir = (path) => {
  const devicePart = path.split("/")[0];
  const device = devicePart === "" ? "/" : devicePart;
  const dirPart = path.split("/").slice(1).join("/");
  const dir = dirPart === "" ? "/" : dirPart;
  return { device, dir };
};

export const getDstFilePaths = (files, toPath, srcDepth, rename = false) => {
  let dstFiles = [];
  for (const file of files) {
    const device = `${file.device}`;
    const dir = file.directory;
    const srcPath = getSrcPath(device, dir);
    const path = getPath_without_prefixed_slash(device, dir, file.filename);
    const relPath = getRelPath(path, srcDepth, rename);
    const dstPath = getDstPath(toPath, relPath);
    const { dst_device, dst_dir, dst_path } = get_dst_device_dir(dstPath);
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
