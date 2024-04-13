import express from "express";
const router = express.Router();
import dotenv from "dotenv";
await dotenv.config();
import { verifyToken } from "../auth/auth.js";
import { copyFile } from "../controllers/copyFile.js";
import { copyFolder } from "../controllers/copyFolder.js";

const organizeItems = async (req, res, next) => {
  try {
    const username = req.user.Username;
    const { files, folders } = req.body;
    const to = req.query.to;
    const failed = [];
    console.log(to);
    for (const file of files ? files : []) {
      try {
        const params = new URLSearchParams(file.path);
        const device = params.get("device");
        const filename = params.get("file");
        const dir = params.get("dir");
        const dst = to === "/" ? "/" : to.split("/").slice(1).join("/");

        await copyFile(device, username, filename, dir, dst);
      } catch (err) {
        failed.push(err);
      }
    }
    for (const folder of folders ? folders : []) {
      const from = folder.path.split("/").slice(1).join("/");
      await copyFolder(from, to, username);
    }

    console.log("returned the value...........");

    res.status(200).json({
      success: true,
      msg: "copied",
      copied: files?.length
        ? files.length
        : 0 + folders?.length
        ? folders.length
        : 0 + failed.length,
      failed: failed,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

router.post("/", verifyToken, organizeItems);

export { router as copyItems };
