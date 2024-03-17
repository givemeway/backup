import express from "express";
const router = express.Router();
import dotenv from "dotenv";
await dotenv.config();
import csurf from "csurf";
import { verifyToken } from "../auth/auth.js";
import { origin } from "../config/config.js";
import { prisma } from "../config/prismaDBConfig.js";
import { moveFolder } from "../controllers/moveFolder.js";

const root = process.env.VARIABLE;
const FILE = "fi";
const FOLDER = "fo";
const DUPLICATE = "DUPLICATE";

router.use(csurf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const renameItems = async (req, res, next) => {
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
