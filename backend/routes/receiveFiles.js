import express from "express";
import { verifyToken } from "../auth/auth.js";
import { createDir } from "../controllers/createFilePath.js";
import { uploadFile } from "../controllers/uploadFile.js";
import updateUtime from "../controllers/updateUtimes.js";
import { sqlExecute } from "../controllers/sql_execute.js";
import { v4 as uuidv4 } from "uuid";
import { origin } from "../config/config.js";
import bodyParser from "body-parser";
import csrf from "csurf";
import releaseConnection from "../controllers/ReleaseConnection.js";
import { getConnection } from "../controllers/getConnection.js";
const router = express.Router();

// https://www.turing.com/kb/build-secure-rest-api-in-nodejs

// router.use(bodyParser.urlencoded({ extended: true }));

router.use(csrf({ cookie: true }));

const createFolderIndex = async (req, res, next) => {
  const username = req.headers.username;
  const device = req.headers.devicename;
  let dir;
  if (device !== "/") {
    dir = "/" + device + "/" + req.headers.dir;
  } else {
    dir = "/" + req.headers.dir === "/" ? "" : req.headers.dir;
  }
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
  const path =
    pathComponents.slice(0, index + 1).join("/") === ""
      ? "/"
      : pathComponents.slice(0, index + 1).join("/");
  if (path !== "/" && pathComponents[index].length > 0) {
    const sql = `INSERT IGNORE INTO directories.directories 
    (uuid,username,device,folder,path,created_at) 
    VALUES (?, ?, ?, ?, ?,NOW());`;
    req.headers.query = sql;
    req.headers.queryValues = [
      uuidv4(),
      username,
      device,
      pathComponents[index],
      path,
    ];
    await sqlExecute(req, res, next);
    parentId = req.headers.queryStatus.insertId;
  }

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
  const enc_file_checksum = req.headers.enc_file_checksum;
  const directory = req.headers.dir;
  const fileStat = JSON.parse(req.headers.filestat);
  const last_modified = new Date(fileStat.mtime);
  const isoString = last_modified
    .toISOString()
    .substring(0, 19)
    .replace("T", " ");
  const checksum = fileStat.checksum;
  let version;
  let origin;
  let uuid;
  if (fileStat?.version && fileStat.modified) {
    version = fileStat.version;
    origin = req.headers.uuid;
    uuid = req.headers.uuid_new;
    filename = `${filename}_${uuid}`;
  } else {
    version = 1;
    origin = req.headers.uuid;
    uuid = req.headers.uuid;
  }
  const size = `${fileStat.size}`;
  const salt = fileStat.salt;
  const iv = fileStat.iv;
  const insertQuery = `INSERT INTO files 
                      (username,device,directory,uuid,origin,filename,
                      last_modified,hashvalue,
                      enc_hashvalue,versions,size,salt,iv)
                      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);`;
  req.headers.query = insertQuery;
  req.headers.queryValues = [
    username,
    device,
    directory,
    uuid,
    origin,
    filename,
    isoString,
    checksum,
    enc_file_checksum,
    version,
    size,
    salt,
    iv,
  ];
  await sqlExecute(req, res, next);
  next();
};

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Disposition,Authorization,devicename,encchunkhash,enc_file_checksum,filemode,filename,dir,username,filestat,totalchunks,currentchunk"
  );
  next();
});

router.post(
  "/",
  verifyToken,
  createDir,
  uploadFile,
  buildSQLQueryToUpdateFiles,
  releaseConnection,
  getConnection("directories"),
  createFolderIndex,
  releaseConnection,
  (req, res) => {
    res.status(200).json(`file ${req.headers.filename} received`);
  }
);

export { router as receiveFiles };
