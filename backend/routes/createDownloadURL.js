import express from "express";
const router = express.Router();
import csrf from "csurf";

import { origin } from "../config/config.js";
import { verifyToken } from "../auth/auth.js";
import { DownloadZip } from "../models/mongodb.js";

router.use(csrf({ cookie: true }));

router.use("/", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const get_download_url = async (req, res) => {
  const folders = req.body.directories;
  const files = req.body.files;
  const owner = req.user.Username;
  const mapFiles = files.map((file) => ({ file: file.file, uuid: file.id }));
  const mapFolders = folders.map((folder) => ({
    folder: folder.folder,
    path: folder.path,
  }));

  const obj = {
    owner,
    files: mapFiles,
    folders: mapFolders,
  };
  try {
    const data = await DownloadZip.create(obj);
    res
      .status(200)
      .json({ key: data._id.toString(), success: true, msg: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: err });
  }
};

router.post("/", verifyToken, get_download_url);

export { router as createDownloadURL };
