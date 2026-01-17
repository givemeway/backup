import { prisma, Prisma } from "../config/prismaDBConfig.js";
import { restore_file_from_trash } from "./putBackFilesFromTrash.js";
const get_path = (device, directory) => {
  let path = "/";
  if (device === "/" && directory === "/") return path;
  if (device !== "/" && directory !== "/")
    return "/" + device + "/" + directory;
  if (device !== "/" && directory === "/") return "/" + device;
  if (device === "/" && directory !== "/") return "/" + directory;
};

export const insert_file_version = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const { filename, device, username, directory, origin, updateData } =
        data;
      let file = await prisma.file.findUnique({
        where: { origin, username },
      });
      if (!file) {
        // it means the file is removed. Need to resurect the file from trash
        let data = {};
        data.dir = directory;
        data.device = device;
        data.username = username;
        data.filename = filename;
        data.path = get_path(device, directory);
        await restore_file_from_trash(data);
        file = await prisma.file.findUnique({
          where: { origin, username },
        });

      }
      const fileVersionData = {
        username: file.username,
        salt: file.salt,
        iv: file.iv,
        uuid: file.uuid,
        last_modified: file.last_modified,
        size: file.size,
        hashvalue: file.hashvalue,
        enc_hashvalue: file.enc_hashvalue,
        versions: file.versions,
        filename: file.filename,
        directory: file.directory,
        device: file.device,
        height: file.height,
        width: file.width,
      };
      await prisma.$transaction([
        prisma.file.update({
          where: {
            username_device_directory_filename: {
              filename,
              device,
              username,
              directory,
            },
          },
          data: {
            ...updateData,
            directoryID: {
              connect: {
                uuid: file.dirID,
              },
            },
          },
        }),
        prisma.fileVersion.create({
          data: {
            ...fileVersionData,
            LatestFile: {
              connect: {
                origin: file.origin,
              },
            },
          },
        }),
      ]);
      resolve();
    } catch (err) {
      reject(err);
    }
  });

export const sync_insert_file_version = async (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const { filename, device, username, directory, origin, updateData } =
        data;
      let file = await prisma.file.findUnique({
        where: { origin, username },
      });
      if (!file) {
        // it means the file is removed. Need to resurect the file from trash
        let data = {};
        data.dir = directory;
        data.device = device;
        data.username = username;
        data.filename = filename;
        data.path = get_path(device, directory);
        await restore_file_from_trash(data);
        file = await prisma.file.findUnique({
          where: { origin, username },
        });

      }
      const fileVersionData = {
        username: file.username,
        salt: file.salt,
        iv: file.iv,
        uuid: file.uuid,
        last_modified: file.last_modified,
        size: file.size,
        hashvalue: file.hashvalue,
        enc_hashvalue: file.enc_hashvalue,
        versions: file.versions,
        filename: file.filename,
        directory: file.directory,
        device: file.device,
        height: file.height,
        width: file.width,
      };
      await prisma.$transaction([
        prisma.file.update({
          where: {
            username_device_directory_filename: {
              filename,
              device,
              username,
              directory,
            },
          },
          data: {
            ...updateData,
            directoryID: {
              connect: {
                uuid: file.dirID,
              },
            },
          },
        }),
        prisma.fileVersion.create({
          data: {
            ...fileVersionData,
            LatestFile: {
              connect: {
                origin: file.origin,
              },
            },
          },
        }),
      ]);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
