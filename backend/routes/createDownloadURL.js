import express from "express";
const router = express.Router();
import csrf from "csurf";

import { verifyToken } from "../auth/auth.js";
import { DownloadZip } from "../models/mongodb.js";

const get_download_url = async (req, res) => {
  const folders = req.body.directories;
  const files = req.body.files;
  const owner = req.user.Username;
  const mapFiles = files.map((file) => ({
    file: file.file,
    uuid: file.id,
    path: file.path,
  }));
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
