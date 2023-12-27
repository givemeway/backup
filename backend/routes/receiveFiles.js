import express from "express";
import { verifyToken } from "../auth/auth.js";
import { createDir } from "../controllers/createFilePath.js";
import { uploadFile } from "../controllers/uploadFile.js";
import { sqlExecute } from "../controllers/sql_execute.js";
import { v4 as uuidv4 } from "uuid";
import { origin } from "../config/config.js";
import csrf from "csurf";
import releaseConnection from "../controllers/ReleaseConnection.js";
import { getConnection } from "../controllers/getConnection.js";
import { pool } from "../server.js";
const router = express.Router();

// https://www.turing.com/kb/build-secure-rest-api-in-nodejs

// router.use(bodyParser.urlencoded({ extended: true }));

router.use(csrf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Disposition,Authorization,devicename,encchunkhash,enc_file_checksum,filemode,filename,dir,username,filestat,totalchunks,currentchunk"
  );
  next();
});

const insertQuery = `INSERT INTO files 
                      (username,device,directory,uuid,origin,filename,
                      last_modified,hashvalue,
                      enc_hashvalue,versions,size,salt,iv)
                      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
                      ON DUPLICATE KEY
                      UPDATE uuid = ? ,  origin = ?, filename = ?,
                      last_modified = ?, hashvalue = ?,
                      enc_hashvalue = ?, versions = ?,
                      size = ?,salt = ?, iv = ?;`;

const insertVersionsQuery = `INSERT INTO versions.file_versions
                              (username,device,directory,uuid,origin,filename,
                                last_modified,hashvalue,
                                enc_hashvalue,versions,size,salt,iv)
                                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);`;

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

const insertPaths = async (req, res, next) => {
  let folderCon;
  try {
    // const username = req.headers.username;
    const username = req.user.Username;

    const device = req.headers.devicename;
    const dir = req.headers.dir;

    if (device === "/") {
      return;
    }
    let path;
    if (dir !== "/") {
      path = "/" + device + "/" + dir;
    } else {
      path = "/" + device;
    }
    const pathParts = path.split("/");
    const paths = pathParts
      .map((part, idx) => [part, pathParts.slice(0, idx + 1).join("/")])
      .slice(1);
    const sql = `INSERT IGNORE INTO directories.directories 
    (uuid,username,device,folder,path,created_at) 
    VALUES (?, ?, ?, ?, ?,NOW());`;
    folderCon = await pool["directories"].getConnection();
    folderCon.beginTransaction();
    for (const pth of paths) {
      const val = [uuidv4(), username, device, pth[0], pth[1]];
      await folderCon.query(sql, val);
    }
    folderCon.commit();
    if (folderCon) {
      folderCon.release();
    }
    next();
  } catch (err) {
    console.error(err);
    await folderCon.rollback();
    res.status(500).json(err);
  }
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
  // const username = req.headers.username;
  const username = req.user.Username;

  let filename = req.headers.filename;
  const device = req.headers.devicename;
  const enc_file_checksum = req.enc_hash;

  // const enc_file_checksum = req.headers.enc_file_checksum;
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
  let modified = false;
  if (fileStat?.version && fileStat.modified) {
    version = fileStat.version;
    origin = req.headers.uuid;
    uuid = req.headers.uuid_new;
    // filename = `${filename}_${uuid}`;
    modified = true;
  } else {
    version = 1;
    origin = req.headers.uuid;
    uuid = req.headers.uuid;
  }
  const size = `${fileStat.size}`;
  const salt = req.salt;
  const iv = req.iv;
  // const salt = fileStat.salt;
  // const iv = fileStat.iv;
  let fileValue = [
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
  let fileValue2 = [
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

  let versionsCon;
  let fileCon;
  try {
    let data;
    fileCon = req.db;
    if (modified) {
      versionsCon = await pool["versions"].getConnection();
      const query = `SELECT * FROM files.files WHERE origin = ?`;

      const [rows] = await fileCon.execute(query, [origin]);
      data = rows[0];
      let versionValue = [];
      for (const [key, value] of Object.entries(data)) {
        versionValue.push(value);
      }
      await versionsCon.beginTransaction();
      await versionsCon.query(insertVersionsQuery, versionValue);
      await versionsCon.commit();
    }

    if (data === undefined) {
      await fileCon.beginTransaction();
      await fileCon.query(insertQuery, fileValue);
      await fileCon.commit();
    } else {
      const {
        uuid,
        origin,
        filename,
        last_modified,
        hashvalue,
        enc_hashvalue,
        versions,
        size,
        salt,
        iv,
      } = data;
      fileValue2 = [
        ...fileValue2.slice(0, 3),
        uuid,
        origin,
        filename,
        last_modified,
        hashvalue,
        enc_hashvalue,
        versions,
        size,
        salt,
        iv,
        ...fileValue2.slice(3),
      ];
      await fileCon.beginTransaction();
      await fileCon.query(insertQuery, fileValue2);
      await fileCon.commit();
    }

    if (fileCon) {
      fileCon.release();
    }
    if (modified && versionsCon) {
      versionsCon.release();
    }
    next();
  } catch (err) {
    console.error(err);
    await fileCon.rollback();
    if (modified) await versionsCon.rollback();
    res.status(500).json(err);
  }
};

router.post(
  "/",
  verifyToken,
  // createDir,
  uploadFile,
  buildSQLQueryToUpdateFiles,
  // getConnection("directories"),
  insertPaths,
  // createFolderIndex,
  // releaseConnection,
  (req, res) => {
    res.status(200).json(`file ${req.headers.filename} received`);
  }
);

export { router as receiveFiles };
