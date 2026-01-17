import express from "express";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();
import { verifyToken } from "../auth/auth.js";
import { prisma } from "../config/prismaDBConfig.js";
import { moveFolder } from "../controllers/moveFolder.js";

const FILE = "fi";
const FOLDER = "fo";

export const renameFolder = async (req, res, next) => {
  try {
    const { oldPath, newPath, username } = req.body;
    const src = oldPath === "/" ? "/" : oldPath.split("/").slice(1).join("/");
    const pathExists = await prisma.directory.findFirst({
      where: {
        username,
        path: newPath,
      },
    });

    if (!pathExists) {
      await moveFolder(src, newPath, username, true);
      const renamedItemDirs = await prisma.directory.findMany({
        where: {
          OR: [{ path: newPath }, { path: { startsWith: newPath + "/" } }]
        },
        select: {
          uuid: true,
          device: true,
          folder: true,
          created_at: true,
          path: true,
          files: { select: { uuid: true, device: true, directory: true, filename: true, origin: true } }
        }
      });
      return res.status(200).json({
        success: true,
        msg: "Folder renamed successfully",
        oldName: oldPath,
        newName: newPath,
        renamedItem: renamedItemDirs,
      });
    }
    if (pathExists) {
      return res
        .status(409)
        .json({ success: false, msg: "Folder name already exists" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const renameFile = async (req, res, next) => {
  try {
    const { type, username } = req.body.data;
    if (type === FILE) {
      const { dir, filename, origin, to, device } = req.body.data;
      const oldname = filename;
      const newname = to;
      await prisma.$transaction([
        prisma.file.update({
          where: {
            username_device_directory_filename: {
              username,
              device,
              directory: dir,
              filename,
            },
          },
          data: {
            filename: to,
          },
        }),
        prisma.fileVersion.updateMany({
          where: {
            filename,
            origin: origin,
            username,
            device,
            directory: dir,
          },
          data: {
            filename: to,
          },
        }),
      ]);
      res
        .status(200)
        .json({ success: true, oldName: oldname, newName: newname });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
export const renameItems = async (req, res, next) => {
  const username = req.user.Username;
  const { type } = req.body;
  let failed = [];
  let status;
  let error;
  let oldname;
  let newname;
  try {
    if (type === FILE) {
      const { dir, filename, origin, to, device } = req.body;
      oldname = filename;
      newname = to;
      await prisma.$transaction([
        prisma.file.update({
          where: {
            username_device_directory_filename: {
              username,
              device,
              directory: dir,
              filename,
            },
          },
          data: {
            filename: to,
          },
        }),
        prisma.fileVersion.updateMany({
          where: {
            filename,
            origin: origin,
            username,
            device,
            directory: dir,
          },
          data: {
            filename: to,
          },
        }),
      ]);
    } else if (type === FOLDER) {
      const { oldPath, folder, value, to } = req.body;
      oldname = folder;
      newname = value;
      const src = oldPath === "/" ? "/" : oldPath.split("/").slice(1).join("/");
      const pathExists = await prisma.directory.findFirst({
        where: {
          username,
          path: to,
        },
      });

      if (pathExists === null) {
        await moveFolder(src, to, username, true);
        status = 200;
      } else {
        status = 409;
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    if (status === 200) {
      res
        .status(200)
        .json({ success: true, msg: `${oldname} renamed to ${newname}` });
    } else if (status === 409) {
      res.status(status).json({
        success: false,
        msg: `${newname} name exists`,
      });
    } else {
      res.status(500).json({ success: false, msg: "Internal server error" });
    }
  }
};

router.patch("/", verifyToken, renameItems);

export { router as renameItem };
