import express from "express";
const router = express.Router();
import csrf from "csurf";
import { Transfer } from "../models/mongodb.js";
import { origin } from "../config/config.js";
import { pool } from "../server.js";
import { verifyToken } from "../auth/auth.js";

const getFiles = (folderdata, username, nav, type) => {
  const { path, device } = folderdata;
  const dirPart = path.split("/").slice(2).join("/");
  let currentDir = dirPart === "" ? "/" : dirPart;
  const curNavPath = nav.split("/").slice(1).join("/");
  if (nav !== "h" && type !== "t") {
    currentDir =
      currentDir === "/" ? curNavPath : currentDir + "/" + curNavPath;
  }
  const [start, end] = [0, 10000];
  const fileQuery = `select uuid,origin,filename,salt,iv,directory,versions,last_modified,size,device 
                                  from files.files 
                                  WHERE 
                                  username = ?
                                  AND 
                                  device = ?
                                  AND 
                                  directory = ?
                                  ORDER BY 
                                  filename ASC limit ${start},${end}`;
  const fileValues = [username, device, currentDir];
  return { fileQuery, fileValues };
};

const getFolders = (folderdata, username, nav, type) => {
  let { path, device } = folderdata;
  const [start, end] = [0, 1000000];
  let regex = ``;
  if (device === "/") {
    regex = `^(/[^/]+)$`;
  } else if (path === "/") {
    regex = `^/${device}(/[^/]+)$`;
  } else {
    if (nav !== "h" && type !== "t") {
      path = path + "/" + nav.split("/").slice(1).join("/");
    }

    regex = `^${path}(/[^/]+)$`;
  }
  const folderQuery = `SELECT 
                        uuid,folder,path,created_at 
                        FROM directories.directories 
                        WHERE username = ?
                        AND
                        path REGEXP ? limit ${start},${end};`;

  const folderValues = [username, regex];
  return { folderQuery, folderValues };
};

const sqlExecute = (con, query, val) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await con.execute(query, val);
      resolve(rows);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const browseTransferData_promise = async (
  t,
  k,
  nav,
  filesConn,
  foldersConn,
  username
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = `SELECT folder,path,device,uuid,created_at from directories.directories where uuid=? and username = ?`;
      const val = [k, username];
      const folderdata = await sqlExecute(foldersConn, query, val);
      const { fileQuery, fileValues } = getFiles(
        folderdata[0],
        username,
        nav,
        t
      );

      const files = await sqlExecute(filesConn, fileQuery, fileValues);
      const { folderQuery, folderValues } = getFolders(
        folderdata[0],
        username,
        nav,
        t
      );

      const directories = await sqlExecute(
        foldersConn,
        folderQuery,
        folderValues
      );
      let dir;
      if (directories.length > 0) {
        dir = directories[0].path.split("/").slice(0, -1).join("/");
      }
      const path = dir === ("" || undefined) ? "/" : dir;
      const home = "/";
      resolve({
        success: true,
        files_t: files,
        directories_t: directories,
        home_t: home,
        path_t: path,
      });
    } catch (err) {
      reject({ success: false, msg: err });
    }
  });
};

const getFilesFoldersFromShareID = async (req, res, next) => {
  const { t, k, id, nav, nav_tracking } = req.query;
  console.log("Request-->", nav);
  let filesConn;
  let foldersConn;
  let files = [];
  let directories = [];
  let home;
  let path;
  try {
    filesConn = await pool["files"].getConnection();
    foldersConn = await pool["directories"].getConnection();
    if (t === "fi") {
      const query = `SELECT filename,uuid,directory,device,origin,versions,size,last_modified from files.files where uuid=? and username = ?`;
      const val = [k, req.user.Username];

      files = await sqlExecute(filesConn, query, val);
    } else if (t === "fo") {
      const query = `SELECT folder,path,device,uuid,created_at from directories.directories where uuid=? and username = ? `;
      const val = [k, req.user.Username];

      const folderdata = await sqlExecute(foldersConn, query, val);
      const { fileQuery, fileValues } = getFiles(
        folderdata[0],
        req.user.Username,
        nav,
        t
      );
      files = await sqlExecute(filesConn, fileQuery, fileValues);
      console.log(files.length, nav, t);
      const { folderQuery, folderValues } = getFolders(
        folderdata[0],
        req.user.Username,
        nav,
        t
      );

      directories = await sqlExecute(foldersConn, folderQuery, folderValues);
      home = folderdata[0].folder;
      path = folderdata[0].path;
    } else {
      if (nav_tracking == 1) {
        // await browseTransferData(req, res, next);
        const { files_t, directories_t, home_t, path_t } =
          await browseTransferData_promise(
            t,
            k,
            nav,
            filesConn,
            foldersConn,
            req.user.Username
          );
        files = files_t;
        directories = directories_t;
        home = home_t;
        path = path_t;
      } else {
        const share = await Transfer.findById({ _id: id }).exec();
        const filesConn = await pool["files"].getConnection();
        const folderConn = await pool["directories"].getConnection();
        const query = `SELECT filename,uuid,directory,device,origin,versions,size,last_modified from files.files where uuid=? and username = ?`;
        const db_files = Object.fromEntries(share.files);
        for (const [key, value] of Object.entries(db_files)) {
          const val = [key, req.user.Username];
          const fi = await sqlExecute(filesConn, query, val);
          files.push(fi[0]);
        }
        const folderQuery = `SELECT folder,path,device,uuid,created_at from directories.directories where uuid=? and username = ?`;
        const db_folders = Object.fromEntries(share.folders);
        for (const [key, value] of Object.entries(db_folders)) {
          const val = [key, req.user.Username];
          const fo = await sqlExecute(folderConn, folderQuery, val);
          directories.push(fo[0]);
        }
        const dir = directories[0].path.split("/").slice(0, -1).join("/");
        home = "/";
        path = dir === "" ? "/" : dir;
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: err });
  } finally {
    filesConn.release();
    foldersConn.release();

    res.status(200).json({ success: true, home, path, files, directories });
    files = [];
    directories = [];
  }
};

router.use(csrf({ cookie: true }));

router.use("/", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

router.get("/", verifyToken, getFilesFoldersFromShareID);

export { router as share };
