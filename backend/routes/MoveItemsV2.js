import express from "express";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();
import csurf from "csurf";
import { verifyToken } from "../auth/auth.js";
import { origin } from "../config/config.js";
import { moveFolder } from "../controllers/moveFolder.js";
import { moveFile } from "../controllers/moveFile.js";
router.use(csurf({ cookie: true }));
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

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
        console.log("processing v2....");
        const from = folder.path.split("/").slice(1).join("/");
        console.log(from);
        console.log(to);
        await moveFolder(from, to, username);
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
