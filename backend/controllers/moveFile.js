import { prisma, Prisma } from "../config/prismaDBConfig.js";
import { v4 as uuidV4 } from "uuid";

const prismaOpts = {
  maxWait: 5000,
  timeout: 10000,
  isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
};

export const moveFile = async (device, username, filename, dir, to) => {
  return new Promise(async (resolve, reject) => {
    try {
      let val = [];
      if (to === "/") {
        const directory = await prisma.directory.findUnique({
          where: {
            username_device_folder_path: {
              username,
              device: "/",
              folder: "/",
              path: "/",
            },
          },
          select: {
            uuid: true,
          },
        });
        let dirID = "";
        if (directory === null) {
          const { uuid } = await prisma.directory.create({
            data: {
              uuid: uuidV4(),
              username,
              folder: "/",
              path: "/",
              device: "/",
              created_at: new Date().toISOString(),
            },
          });
          dirID = uuid;
        } else {
          dirID = directory.uuid;
        }
        val = ["/", "/", filename, dir, device, username, dirID];
      } else {
        const to_device = to.split("/")[0];
        const to_dirParts = to.split("/").slice(1).join("/");
        const to_dir = to_dirParts === "" ? "/" : to_dirParts;
        const to_folder = to.split("/").slice(-1)[0];
        const path = "/" + to;
        const { uuid } = await prisma.directory.findUnique({
          where: {
            username_device_folder_path: {
              username,
              device: to_device,
              folder: to_folder,
              path,
            },
          },
          select: {
            uuid: true,
          },
        });
        val = [to_device, to_dir, filename, dir, device, username, uuid];
      }
      await prisma.$transaction(
        [
          prisma.$executeRaw(Prisma.sql`
            UPDATE public."File"

            SET device = ${val[0]},
                directory = ${val[1]},
                "dirID" = ${val[6]}

            WHERE   filename = ${val[2]} AND 
                    directory = ${val[3]} AND 
                    device = ${val[4]} AND 
                    username = ${val[5]};`),

          prisma.$executeRaw(Prisma.sql`
            UPDATE public."FileVersion"

            SET device = ${val[0]},
                directory = ${val[1]}

            WHERE   filename = ${val[2]} AND 
                    directory = ${val[3]} AND 
                    device = ${val[4]} AND 
                    username = ${val[5]};`),
        ],
        prismaOpts
      );
      resolve();
    } catch (err) {
      reject({
        success: false,
        msg: err,
        filename: filename,
        dir: dir,
        device: device,
      });
    }
  });
};
