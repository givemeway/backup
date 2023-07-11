import express from "express";
import { verifyToken } from "../auth/auth.js";
import { createDir } from "../controllers/createFilePath.js";
import { uploadFile } from "../controllers/uploadFile.js";
import updateUtime from "../controllers/updateUtimes.js";
import { sqlExecute } from "../controllers/sql_execute.js";
const router = express.Router();

// https://www.turing.com/kb/build-secure-rest-api-in-nodejs

const createFolderIndex = async (req, res, next) => {
  const username = req.headers.username;
  const device = req.headers.devicename;
  const dir = "/" + device + "/" + req.headers.dir;
  const pathComponents = dir.split(/\//g);
  await insertPath(req, res, next, pathComponents, 0, null, username, device);
  next();
};

async function insertPath(
  req,
  res,
  next,
  pathComponents,
  index,
  parentId,
  username,
  device
) {
  if (index >= pathComponents.length) {
    return;
  }
  const path = pathComponents.slice(0, index + 1).join("/");
  const sql = `INSERT INTO directories 
              (username,device,folder,path) 
              VALUES ("${username}", "${device}", "${pathComponents[index]}", "${path}") 
              ON DUPLICATE KEY 
              UPDATE id = LAST_INSERT_ID(id)`;
  req.headers.query = sql;
  await sqlExecute(req, res, next);
  parentId = req.headers.queryStatus.insertId;
  await insertPath(
    req,
    res,
    next,
    pathComponents,
    index + 1,
    parentId,
    username,
    device
  );
}

const buildSQLQueryToUpdateFiles = async (req, res, next) => {
  const username = req.headers.username;
  let filename = req.headers.filename;
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

  if (fileStat.modified === true) {
    filename = hashed_filename;
  }
  const query = `INSERT INTO files 
                (username,device,directory,filename,hashed_filename,last_modified,hashvalue,versions,size,snapshot)
                VALUES ("${username}","${device}","${directory}","${filename}","${hashed_filename}","${isoString}","${checksum}",${versions},${size},"${snapshot}")`;

  req.headers.query = query;
  next();
};

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
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
  createFolderIndex,
  (req, res) => {
    res.status(200).json(`file ${req.file.filename} received`);
  }
);

export { router as receiveFiles };
