import express from "express";
const router = express.Router();
import { Share, Transfer } from "../models/mongodb.js";
import cookie from "cookie";
import { origin, domain } from "../config/config.js";
import releaseConnection from "../controllers/ReleaseConnection.js";
import { getConnection } from "../controllers/getConnection.js";
import { pool } from "../server.js";

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
      console.log("inside the error");
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

const browseTransferData = async (req, res, next) => {
  try {
    const { t, k, id, dl, nav } = req.query;
    const data = await Transfer.findById({ _id: id }).exec();
    let con;
    if (data === null) {
      res.status(404).json({ sucess: false, msg: "Shared Expired or deleted" });
    } else {
      const query = `SELECT folder,path,device,uuid,created_at from directories.directories where uuid=?`;
      const val = [k];
      con = await pool["directories"].getConnection();
      const folderdata = await sqlExecute(con, query, val);
      const { fileQuery, fileValues } = getFiles(
        folderdata[0],
        data.owner,
        nav,
        t
      );
      if (con) {
        con.release();
      }
      con = await pool["files"].getConnection();
      const files = await sqlExecute(con, fileQuery, fileValues);
      const { folderQuery, folderValues } = getFolders(
        folderdata[0],
        data.owner,
        nav,
        t
      );
      if (con) {
        con.release();
      }
      con = await pool["directories"].getConnection();
      const directories = await sqlExecute(con, folderQuery, folderValues);
      let dir;
      if (directories.length > 0) {
        dir = directories[0].path.split("/").slice(0, -1).join("/");
      }
      if (con) {
        con.release();
      }
      res.status(200).json({
        files,
        directories,
        home: "/",
        path: dir === ("" || undefined) ? "/" : dir,
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
  }
};

const getFilesFoldersFromShareID = async (req, res, next) => {
  const { t, k, id, dl, nav, nav_tracking } = req.query;
  if (t === "fi") {
    try {
      const shareExists = await Share.findById({ _id: id }).exec();
      let con;
      if (shareExists) {
        const query = `SELECT filename,uuid,directory,device,origin,versions,size,last_modified from files.files where uuid=?`;
        const val = [k];
        // const con = req.headers.connection;
        con = await pool["files"].getConnection();
        const files = await sqlExecute(con, query, val);
        if (con) {
          con.release();
        }
        res.status(200).json({ files, directories: [] });
      } else {
        res.status(404).json({ sucess: false, msg: "Shared Expired" });
      }
    } catch (err) {
      res.status(500).json({ success: false, msg: err });
    }
  } else if (t === "fo") {
    try {
      const shareExists = await Share.findById({ _id: id }).exec();
      let con;
      if (shareExists) {
        const query = `SELECT folder,path,device,uuid,created_at from directories.directories where uuid=?`;
        const val = [k];
        // const con = req.headers.connection;
        con = await pool["directories"].getConnection();
        const folderdata = await sqlExecute(con, query, val);
        const { fileQuery, fileValues } = getFiles(
          folderdata[0],
          shareExists.owner,
          nav,
          t
        );
        if (con) {
          con.release();
        }
        con = await pool["files"].getConnection();
        const files = await sqlExecute(con, fileQuery, fileValues);
        const { folderQuery, folderValues } = getFolders(
          folderdata[0],
          shareExists.owner,
          nav,
          t
        );
        if (con) {
          con.release();
        }
        con = await pool["directories"].getConnection();
        const directories = await sqlExecute(con, folderQuery, folderValues);
        if (con) {
          con.release();
        }
        res.status(200).json({
          files,
          directories,
          home: folderdata[0].folder,
          path: folderdata[0].path,
        });
      } else {
        res
          .status(404)
          .json({ sucess: false, msg: "Shared Expired or Deleted" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, msg: err });
    }
  } else {
    try {
      if (nav_tracking == 1) {
        await browseTransferData(req, res, next);
      } else {
        const share = await Transfer.findById({ _id: id }).exec();
        let con;
        if (share) {
          const query = `SELECT filename,uuid,directory,device,origin,versions,size from files.files where uuid=?`;
          con = await pool["files"].getConnection();
          // const con = req.headers.connection;
          let files = [];
          const db_files = Object.fromEntries(share.files);
          for (const [key, value] of Object.entries(db_files)) {
            const val = [key];
            const fi = await sqlExecute(con, query, val);
            files.push(fi[0]);
          }
          if (con) {
            con.release();
          }
          con = await pool["directories"].getConnection();
          const folderQuery = `SELECT folder,path,device,uuid,created_at from directories.directories where uuid=?`;
          let directories = [];
          const db_folders = Object.fromEntries(share.folders);
          for (const [key, value] of Object.entries(db_folders)) {
            const val = [key];
            const fo = await sqlExecute(con, folderQuery, val);
            directories.push(fo[0]);
          }
          if (con) {
            con.release();
          }
          const dir = directories[0].path.split("/").slice(0, -1).join("/");
          res.status(200).json({
            files,
            directories,
            home: "/",
            path: dir === "" ? "/" : dir,
          });
        } else {
          res
            .status(404)
            .json({ sucess: false, msg: "Shared Expired or Deleted" });
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, msg: err });
    }
  }
};

router.get("*", getFilesFoldersFromShareID);

export { router as share };
