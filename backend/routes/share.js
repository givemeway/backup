import express from "express";
const router = express.Router();
import { Share, Transfer } from "../models/mongodb.js";
import cookie from "cookie";
import { origin, domain } from "../config/config.js";

const getFiles = (folderdata, username, nav) => {
  const { path, device } = folderdata;
  const dirPart = path.split("/").slice(2).join("/");
  let currentDir = dirPart === "" ? "/" : dirPart;
  const curNavPath = nav.split("/").slice(1).join("/");
  if (nav !== "h") {
    currentDir =
      currentDir === "/" ? curNavPath : currentDir + "/" + curNavPath;
  }
  const [start, end] = [0, 10000];
  const fileQuery = `select uuid,origin,filename,salt,iv,directory,versions,last_modified,size,device 
                                  from data.files 
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

const getFolders = (folderdata, username, nav) => {
  let { path, device } = folderdata;
  const [start, end] = [0, 1000000];
  let regex = ``;
  if (device === "/") {
    regex = `^(/[^/]+)$`;
  } else if (path === "/") {
    regex = `^/${device}(/[^/]+)$`;
  } else {
    if (nav !== "h") {
      path = path + "/" + nav.split("/").slice(1).join("/");
    }

    regex = `^${path}(/[^/]+)$`;
  }
  const folderQuery = `SELECT 
                        id,uuid,folder,path 
                        FROM data.directories 
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

const browseTransferData = async (req, res, next) => {};

const getFilesFoldersFromShareID = async (req, res, next) => {
  const { t, k, id, dl, nav } = req.query;
  console.log({ t, k, id, dl, nav });
  if (t === "fi") {
    try {
      const shareExists = await Share.findById({ _id: id }).exec();
      if (shareExists) {
        const query = `SELECT filename,uuid,directory,device,origin,versions from data.files where uuid=?`;
        const val = [k];
        const con = req.headers.connection;
        const files = await sqlExecute(con, query, val);

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
      if (shareExists) {
        const query = `SELECT folder,path,device,uuid from data.directories where uuid=?`;
        const val = [k];
        const con = req.headers.connection;
        const folderdata = await sqlExecute(con, query, val);
        const { fileQuery, fileValues } = getFiles(
          folderdata[0],
          shareExists.owner,
          nav
        );
        const files = await sqlExecute(con, fileQuery, fileValues);
        const { folderQuery, folderValues } = getFolders(
          folderdata[0],
          shareExists.owner,
          nav
        );
        const directories = await sqlExecute(con, folderQuery, folderValues);

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
      console.log(err);
      res.status(500).json({ success: false, msg: err });
    }
  } else {
    console.log("inside transfer");
    try {
      const { nav_tracking } = req.query;
      if (nav_tracking) return browseTransferData(req, res, next);
      const share = await Transfer.findById({ _id: id }).exec();
      if (share) {
        const query = `SELECT filename,uuid,directory,device,origin,versions,size from data.files where uuid=?`;

        const con = req.headers.connection;
        let files = [];
        const db_files = Object.fromEntries(share.files);
        for (const [key, value] of Object.entries(db_files)) {
          const val = [key];
          const fi = await sqlExecute(con, query, val);
          files.push(fi[0]);
        }
        const folderQuery = `SELECT folder,path,device,uuid from data.directories where uuid=?`;
        let directories = [];
        const db_folders = Object.fromEntries(share.folders);
        for (const [key, value] of Object.entries(db_folders)) {
          const val = [key];
          const fo = await sqlExecute(con, folderQuery, val);
          directories.push(fo[0]);
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
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, msg: err });
    }
  }
};

router.get("*", getFilesFoldersFromShareID);

export { router as share };
