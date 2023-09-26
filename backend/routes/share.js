import express from "express";
const router = express.Router();
import csrf from "csurf";
import { Share, Transfer } from "../models/mongodb.js";
import { getFilesSubfolders } from "./getFilesSubfolders.js";

import { origin } from "../config/config.js";
import { verifyToken } from "../auth/auth.js";

const getFiles = (folderdata, username) => {
  const { path, device } = folderdata;
  const dirPart = path.split("/").slice(2).join("/");
  const currentDir = dirPart === "" ? "/" : dirPart;
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

const getFolders = (folderdata, username) => {
  const { path, device } = folderdata;
  const [start, end] = [0, 1000000];
  let regex = ``;
  if (device === "/") {
    regex = `^(/[^/]+)$`;
  } else if (path === "/") {
    regex = `^/${device}(/[^/]+)$`;
  } else {
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

const getFilesFoldersFromShareID = async (req, res, next) => {
  const { t, k, id, dl } = req.query;
  console.log({ t, k, id, dl });
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
        const query = `SELECT folder,path,device from data.directories where uuid=?`;
        const val = [k];
        const con = req.headers.connection;
        const folderdata = await sqlExecute(con, query, val);
        const { fileQuery, fileValues } = getFiles(
          folderdata[0],
          shareExists.owner
        );
        const files = await sqlExecute(con, fileQuery, fileValues);
        const { folderQuery, folderValues } = getFolders(
          folderdata[0],
          shareExists.owner
        );
        const directories = await sqlExecute(con, folderQuery, folderValues);
        res.status(200).json({ files, directories });
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
    try {
      const share = await Transfer.findById({ _id: id }).exec();
      if (share) {
        const files = share.files.map((file) => ({
          uuid: file.uuid,
        }));
        const directories = share.folders.map((folder) => ({
          uuid: folder.uuid,
        }));
        res.status(200).json({ files, directories });
      } else {
        res
          .status(404)
          .json({ sucess: false, msg: "Shared Expired or Deleted" });
      }
    } catch (err) {
      res.status(500).json({ success: false, msg: err });
    }
  }
};

router.get("*", getFilesFoldersFromShareID);

export { router as share };
