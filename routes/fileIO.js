import express from "express";
import { verifyToken } from "../auth/auth.js";
import { createDir } from "../controllers/createFilePath.js";
import { uploadFile } from "../controllers/fileDownload.js";
import updateUtime from "../controllers/updateUtimes.js";
import { sqlExecute } from "../controllers/sql_execute.js";
import { sqlConn } from "../controllers/sql_conn.js";
import mysql from "mysql2/promise";

const router = express.Router();

// https://www.turing.com/kb/build-secure-rest-api-in-nodejs

router.post("/sendFileInfo", verifyToken, createDir, (req, res, next) => {
  res.json("file info received");
});

const buildSQLQueryToUpdateFiles = (req, res, next) => {
  const username = req.headers.username;
  const filename = req.headers.filename;
  const device = req.headers.devicename;
  const directory = req.headers.dir;
  const fileStat = JSON.parse(req.headers.filestat);
  const last_modified = new Date(fileStat.mtime);
  const isoString = last_modified
    .toISOString()
    .substring(0, 19)
    .replace("T", " ");
  const hashvalue = "34343434";
  const versions = 1;
  const snapshot = "newsnapshot";

  const query = `INSERT INTO files (username,device,directory,filename,
    last_modified,hashvalue,versions,snapshot)
    VALUES ("${username}","${device}","${directory}","${filename}","${isoString}",${hashvalue},${versions},"${snapshot}")`;
  req.headers.query = query;
  next();
};

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "data",
  port: process.env.DB_PORT,
});

router.use(sqlConn(connection));

router.post(
  "/receiveFile",
  verifyToken,
  createDir,
  uploadFile,
  updateUtime,
  buildSQLQueryToUpdateFiles,
  sqlExecute,
  (req, res) => {
    res.json(`file ${req.file.filename} received`);
  }
);

export { router as fileIO };
