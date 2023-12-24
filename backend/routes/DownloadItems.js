import express from "express";
const router = express.Router();
import path from "node:path";
import csrf from "csurf";
import dotenv from "dotenv";
import { origin } from "../config/config.js";
import { verifyToken } from "../auth/auth.js";
import { Worker } from "node:worker_threads";
import { Readable } from "node:stream";
import { DownloadZip } from "../models/mongodb.js";
import releaseConnection from "../controllers/ReleaseConnection.js";
import { pool } from "../server.js";
await dotenv.config();

router.use(csrf({ cookie: true }));
const fileQuery = `SELECT filename,directory,device,salt,iv,size FROM files where uuid=?`;
const filesInSubDirectories = `SELECT uuid,filename,salt,iv,directory,size FROM files WHERE username = ? AND device = ? AND directory REGEXP ?`;
const filesInCurrentDirectory = `SELECT uuid,filename,salt,iv,directory,size FROM files WHERE  username = ? AND device = ? AND directory = ?`;
const filesInDevice = `SELECT uuid,filename,salt,iv,directory,size FROM  files where username = ? AND device = ?`;
const encQuery = `SELECT enc FROM customers.users WHERE username = ?`;

const root = process.env.VARIABLE;

const sqlExecute = async (req, res) => {
  try {
    // const con = req.headers.connection;
    const con = req.db;
    const [rows] = await con.execute(req.headers.query, [
      ...req.headers.queryValues,
    ]);
    req.headers.queryStatus = rows;
    req.headers.query_success = true;
  } catch (error) {
    console.log(error);
  }
};

const getFilesInDirectory = async (req, res) => {
  const currentdirectory = req.headers.currentdirectory;
  const username = req.headers.username;
  const devicename = req.headers.devicename;
  req.headers.data = [];
  if (currentdirectory === "/") {
    req.headers.query = filesInDevice;
    req.headers.queryValues = [username, devicename];
    await sqlExecute(req, res);
    req.headers.data.push(...req.headers.queryStatus);
  } else {
    const regex_other_files = `^${currentdirectory}(/[^/]+)+$`;
    req.headers.query = filesInSubDirectories;
    req.headers.queryValues = [username, devicename, regex_other_files];
    await sqlExecute(req, res);
    req.headers.data.push(...req.headers.queryStatus);
    req.headers.query = filesInCurrentDirectory;
    req.headers.queryValues = [username, devicename, currentdirectory];
    await sqlExecute(req, res);
    req.headers.data.push(...req.headers.queryStatus);
  }
};

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header(
    "Acess-Control-Expose-Headers",
    "Content-Disposition,Content-Length"
  );
  next();
});

const getFilesFoldersFromDownloadID = async (req, res, next) => {
  try {
    const share = await DownloadZip.findById({ _id: req.query.key }).exec();
    req.body.files = share.files.map((file) => ({
      id: file.uuid,
    }));
    req.body.directories = share.folders.map((folder) => ({
      folder: folder.folder,
      path: folder.path,
    }));
    next();
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
  }
};

const extractFilesInforFromDB = async (req, res, next) => {
  const username = req.user.Username;
  req.headers.username = username;
  const folders = req.body.directories;
  const files = req.body.files;
  console.log(folders);
  console.log(files);
  req.files = [];
  let totalSize = 0;
  for (let i = 0; i < folders.length; i++) {
    const device = folders[i].path.split("/")[1];
    req.headers.devicename = device;
    const dirParts = folders[i].path.split("/").slice(2).join("/");
    const dir = dirParts === "" ? "/" : dirParts;
    req.headers.currentdirectory = dir;
    await getFilesInDirectory(req, res);
    const dirFiles = req.headers.data;
    for (let j = 0; j < dirFiles.length; j++) {
      const { filename, salt, iv, directory, uuid, size } = dirFiles[j];
      totalSize += size;
      // const filePath = path.join(root, username, device, directory, filename);
      const filePath = path.join(root, username, uuid);
      const actualPath = path.join(device, directory);
      const fileData = {
        key: `${username}/${uuid}`,
        filename,
        salt,
        iv,
        path: filePath,
        relativePath:
          dir === "/"
            ? actualPath
            : path.join(dir, actualPath.split(dir).slice(1).join("/")),
      };
      req.files.push(fileData);
    }
  }

  for (let i = 0; i < files.length; i++) {
    const uuid = files[i].id;
    req.headers.query = fileQuery;
    req.headers.queryValues = [uuid];
    await sqlExecute(req, res);
    const { salt, iv, device, filename, directory, size } =
      req.headers.queryStatus[0];
    totalSize += size;
    // const filePath = path.join(root, username, device, directory, filename);
    const filePath = path.join(root, username, uuid);

    req.files.push({
      key: `${username}/${uuid}`,
      filename,
      salt,
      iv,
      path: filePath,
      relativePath: "",
    });
  }
  req.totalSize = totalSize;
  console.log(req.totalSize);
  next();
};

router.get(
  "/",
  verifyToken,
  getFilesFoldersFromDownloadID,
  extractFilesInforFromDB,
  releaseConnection,
  async (req, res) => {
    try {
      const username = req.user.Username;
      const userCon = await pool["customers"].getConnection();
      const [key] = await userCon.execute(encQuery, [username]);
      const worker = new Worker("../backend/controllers/DownloadWorker.js");
      const channel = new MessageChannel();
      const readable = new Readable({
        read() {},
      });
      worker.postMessage(
        { files: req.files, enc: key[0].enc, port: channel.port1 },
        [channel.port1]
      );

      channel.port2.on("message", ({ mode, chunk }) => {
        if (mode === "chunk") {
          readable.push(chunk);
        } else {
          readable.push(null);
        }
      });
      console.log("worker end");

      res.set("Content-Disposition", `attachment; filename="QDrive.zip"`);
      readable.pipe(res);
      channel.port2.on("error", (err) => {
        console.error(err);
      });
      worker.on("error", (err) => {
        console.error(err);
      });
      if (userCon) {
        userCon.release();
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }
);

export { router as downloadItems };
