import express from "express";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();
import { verifyToken } from "../auth/auth.js";
import { moveFolder } from "../controllers/moveFolder.js";
import { moveFile } from "../controllers/moveFile.js";
import { moveFolderV2 } from "./RenameItem.js";

const moveItems = async (req, res, next) => {
  try {
    const username = req.user.Username;
    const { files, folders } = req.body;
    const to = req.query.to;
    const failed = [];
    for (const file of files ? files : []) {
      try {
        const params = new URLSearchParams(file.path);
        const device = params.get("device");
        const filename = params.get("file");
        const dir = params.get("dir");
        const dst = to === "/" ? "/" : to.split("/").slice(1).join("/");
        await moveFile(device, username, filename, dir, dst);
      } catch (err) {
        console.log(err);
        failed.push(file);
      }
    }
    for (const folder of folders ? folders : []) {
      try {
        const from = folder.path.split("/").slice(1).join("/");
        await moveFolderV2(from == "/" ? "/" : "/" + from, to, username);
        //        await moveFolder(from, to, username);
      } catch (err) {
        console.error(err);
      }
    }

    console.log("returned the value v2");

    res.status(200).json({
      success: true,
      msg: "moved",
      moved: files?.length
        ? files.length
        : 0 + folders?.length
          ? folders.length
          : 0 + failed.length,
      failed: failed,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

router.post("*", verifyToken, moveItems);

export { router as moveItemsV2 };
