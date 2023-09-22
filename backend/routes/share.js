import express from "express";
const router = express.Router();
import csrf from "csurf";
import Share from "../models/mongodb.js";

import { origin } from "../config/config.js";
import { verifyToken } from "../auth/auth.js";

const sqlExecute = (con, query, val) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await con.execute(query, val);
      resolve(rows);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

// router.use(csrf({ cookie: true }));

router.use("/", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const getFilesFoldersFromDownloadID = async (req, res, next) => {
  const type = req.query.t;
  const dl = req.query.dl;
  const k = req.query.k;

  if (type === "fi") {
    try {
      const query = `SELECT filename,uuid,directory,device,origin from data.files where uuid=?`;
      const val = [k];
      const con = req.headers.connection;
      const files = await sqlExecute(con, query, val);
      res.status(200).json({ files, directories: [] });
    } catch (err) {
      res.status(500).json({ success: false, msg: err });
    }
  } else if (type === "fo") {
    try {
      const query = `SELECT folder,path,uuid,id,device from data.directories where uuid=?`;
      const val = [k];
      const con = req.headers.connection;
      const directories = await sqlExecute(con, query, val);
      res.status(200).json({ files: [], directories });
    } catch (err) {
      res.status(500).json({ success: false, msg: err });
    }
  } else {
    try {
      const share = await Share.findById({ _id: k }).exec();
      const files = share.files.map((file) => ({
        id: file.uuid,
        file: file.file,
      }));
      const directories = share.folders.map((folder) => ({
        folder: folder.folder,
        path: folder.path,
        uuid: folder.uuid,
      }));
      res.status(200).json({ files, directories });
    } catch (err) {
      res.status(500).json({ success: false, msg: err });
    }
  }
};

router.get("*", getFilesFoldersFromDownloadID);

export { router as share };
