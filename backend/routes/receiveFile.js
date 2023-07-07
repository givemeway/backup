import express from "express";
import { verifyToken } from "../auth/auth.js";
import { createDir } from "../controllers/createFilePath.js";
import { uploadFile } from "../controllers/fileDownload.js";
import updateUtime from "../controllers/updateUtimes.js";
import { sqlExecute } from "../controllers/sql_execute.js";
import { sqlConn } from "../controllers/sql_conn.js";
import { createConnection } from "../controllers/createConnection.js";

const router = express.Router();

// https://www.turing.com/kb/build-secure-rest-api-in-nodejs

const buildSQLQueryToUpdateFiles = async (req, res, next) => {
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
  const checksum = fileStat.checksum;
  const versions = 1;
  const snapshot = "newsnapshot";
  const hashed_filename = `${filename}$$$${checksum}$$$NA`;
  const size = `${fileStat.size}`;

  const query = `INSERT INTO files 
                (username,device,directory,filename,hashed_filename,last_modified,hashvalue,versions,size,snapshot)
                VALUES ("${username}","${device}","${directory}","${filename}","${hashed_filename}","${isoString}","${checksum}",${versions},${size},"${snapshot}")`;
  req.headers.query = query;
  next();
};

const connection = createConnection("data");

router.use(sqlConn(connection));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization,devicename,filename,dir,username,filestat"
  );
  next();
});

router.post(
  "/",
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

export { router as receiveFile };
