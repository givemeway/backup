import express from "express";
import path from "node:path";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();
import { verifyToken } from "../auth/auth.js";
import { prisma } from "../config/prismaDBConfig.js";
import { moveFolder } from "../controllers/moveFolder.js";

const FILE = "fi";
const FOLDER = "fo";

const findRelativePath = (base, pth) => {
  return path.relative(base, pth).replace(/\\/g, "/")
}

const getDirDeviceFolder = (path) => {
  if (path === "/") return { device: "/", folder: "/", directory: "/" }
  const pathParts = path.split("/");
  const device = pathParts[1];
  const dirPart = pathParts.slice(2).join("/")
  const directory = dirPart == "" ? "/" : dirPart;
  const folder = pathParts.at(-1) == "" ? "/" : pathParts.at(-1);
  return { device, folder, directory };

}

export const moveFolderV2 = (oldPath, newPath, username, rename = false) => new Promise(async (resolve, reject) => {
  try {
    console.log({ oldPath, newPath, username });
    const dirs = await prisma.directory.findMany({
      where: {
        username,
        AND: {
          OR: [{ path: oldPath }, { path: { startsWith: oldPath + "/" } }]
        }
      }
    });
    await prisma.$transaction(async (prisma) => {
      for (const dir of dirs) {
        let src = oldPath;
        if (!rename) src = path.dirname(oldPath)
        const movedSegment = findRelativePath(src, dir.path);
        let newPathSeg = "";
        if (movedSegment !== "") {
          if (newPath == "/") newPathSeg = "/" + movedSegment;
          else newPathSeg = newPath + "/" + movedSegment;
        } else {
          newPathSeg = newPath;
        }
        const { device, folder, directory } = getDirDeviceFolder(newPathSeg);
        await prisma.fileVersion.updateMany({
          where: { device: dir.device, directory: dir.directory },
          data: { device, directory }
        });
        await prisma.file.updateMany({
          where: {
            dirID: dir.uuid
          },
          data: { device, directory }
        });
        await prisma.directory.update({
          where: {
            username_device_folder_path: {
              username, device: dir.device, folder: dir.folder, path: dir.path
            }
          },
          data: { device, folder, path: newPathSeg }
        })

      }
    });
    resolve();
  } catch (err) {
    reject(err)
  }
});

export const syncRenameFolder = async (req, res, next) => {
  try {

    const { oldPath, newPath, username } = req.body;
    const pathExists = await prisma.directory.findFirst({
      where: {
        username,
        path: newPath,
      },
    });
    if (pathExists) return res.status(409).json({ success: false, message: "folder exists" });
    await moveFolderV2(oldPath, newPath, username, true);
    res.status(200).json({ success: true, message: "Rename successful" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "unable to move folder" })
  }
}

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
  let status;
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
        //        await moveFolder(src, to, username, true);
        await moveFolderV2(src == "/" ? "/" : "/" + src, to, username, true);
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
