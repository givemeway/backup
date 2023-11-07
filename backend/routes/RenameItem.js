import express from "express";
const router = express.Router();
import dotenv from "dotenv";
await dotenv.config();
import csurf from "csurf";
import { verifyToken } from "../auth/auth.js";
import { origin } from "../config/config.js";
import { pool } from "../server.js";

const root = process.env.VARIABLE;
const FILE = "fi";
const FOLDER = "fo";

router.use(csurf({ cookie: true }));

const sqlExecute = (con, query, values) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows, fields] = await con.execute(query, values);
      resolve(rows);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const getFolders = async (con, currentDir, username, devicename) => {
  const [start, end] = [0, 1000000];
  let regex_2 = ``;
  let path = ``;
  if (devicename === "/") {
    regex_2 = `^\\.?(/[^/]+)$`;
  } else if (currentDir === "/") {
    regex_2 = `^\\.?/${devicename}(/[^/]+)$`;
  } else {
    path = `/${devicename}/${currentDir}`;
    regex_2 = `^\\.?${path}(/[^/]+)$`;
  }
  const foldersQuery = `SELECT 
                        uuid,folder,path,device 
                        FROM directories.directories 
                        WHERE username = ?
                        AND
                        path REGEXP ? limit ${start},${end};`;
  const rows = await sqlExecute(con, foldersQuery, [username, regex_2]);
  return rows;
};

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const organizeItemsInDB = async (
  con,
  versionCon,
  folderCon,
  username,
  from,
  to,
  failed
) => {
  return new Promise((resolve, reject) => {
    const srcFolder =
      from.split("/").length > 1
        ? from.split("/").slice(-1)[0]
        : from.split("/")[0];
    let dst = to + "/" + srcFolder;
    if (to === "/") {
      dst = srcFolder;
    }
    const from_device = from === "/" ? "/" : from.split("/")[0];
    const from_dirParts = from.split("/").slice(1).join("/");
    const from_dir = from_dirParts === "" ? "/" : from_dirParts;
    const to_device = to.split("/")[0];
    const to_dirParts = to.split("/").slice(1).join("/");
    const to_dir_ori = to_dirParts === "" ? "/" : to_dirParts;

    const updateDB = async (dst_dir, src_dir) => {
      try {
        const filesInDirRootQuery = `UPDATE files.files 
                                    SET directory = ?, device = ? 
                                    WHERE directory = ? AND device = ? AND username = ?`;
        const filesInDirRootQueryVersions = `UPDATE versions.file_versions
                                    SET directory = ?, device = ? 
                                    WHERE directory = ? AND device = ? AND username = ?`;
        const values = [dst_dir, to_device, src_dir, from_device, username];
        console.log("values=>", values);
        await sqlExecute(con, filesInDirRootQuery, values);
        await sqlExecute(versionCon, filesInDirRootQueryVersions, values);

        const foldersInDirRoot = await getFolders(
          folderCon,
          src_dir,
          username,
          from_device
        );
        console.log("Folders in root=>", foldersInDirRoot);
        if (foldersInDirRoot.length === 0) {
          return;
        }
        for (const folder of foldersInDirRoot) {
          const dirParts = folder.path.split("/").slice(2).join("/");
          const dir = dirParts === "" ? "/" : dirParts;
          let dstPath;
          if (to_dir_ori === "/") {
            dstPath = folder.path.split(from)[1].split("/").slice(1).join("/");
          } else {
            dstPath = to_dir_ori + folder.path.split(from)[1];
          }
          const query = `UPDATE directories.directories 
                          SET device = ?, path = ?  
                          WHERE username = ? AND device = ? AND path = ? `;
          const pth = `/${to_device}/${dstPath}`;
          const val = [to_device, pth, username, from_device, folder.path];
          console.log("sub-folders=>", val);
          console.log(
            "dstPath=>",
            dstPath,
            "dir=>",
            dir,
            "to_dir_ori=>",
            to_dir_ori
          );
          await sqlExecute(folderCon, query, val);
          await updateDB(dstPath, dir);
        }
      } catch (err) {
        failed.push(src_dir);
      }
    };

    updateDB(to_dir_ori, from_dir)
      .then(async () => {
        const query = `UPDATE directories.directories 
                        SET device = ?, path = ?  
                        WHERE username = ? AND device = ? AND path = ?`;
        if (to === "/") {
          const pth = `/${to_device}`;
          const val = [to_device, pth, username, from_device, "/" + from];
          await sqlExecute(folderCon, query, val);
        } else {
          const pth = `/${to}/${srcFolder}`;
          const val = [to_device, pth, username, from_device, "/" + from];
          await sqlExecute(folderCon, query, val);
        }
        resolve();
      })
      .catch((err) => {
        console.error(err);
        failed.push(err);
        reject();
      });
  });
};

const renameItems = async (req, res, next) => {
  const username = req.user.Username;
  const { type, to, uuid, device } = req.body;
  console.log(type, to, uuid, device);
  try {
    let failed = [];
    const con = req.db;
    const versionCon = await pool["versions"].getConnection();
    if (type === FILE) {
      const { dir, filename } = req.body;

      const query = `UPDATE files.files SET filename = ? 
      WHERE origin = ? AND username = ? AND device = ? AND directory = ? AND filename = ?`;
      const queryVersion = `UPDATE versions.file_versions SET filename = ? 
      WHERE origin = ? AND username = ? AND device = ? AND directory = ? AND filename = ?`;

      await sqlExecute(con, query, [to, uuid, username, device, dir, filename]);
      await sqlExecute(versionCon, queryVersion, [
        to,
        uuid,
        username,
        device,
        dir,
        filename,
      ]);

      if (con) {
        con.release();
      }
      if (versionCon) {
        versionCon.release();
      }
    } else if (type === FOLDER) {
      try {
        const { folder, oldPath } = req.body;
        const query = `SELECT device,folder,path 
                        FROM directories.directories 
                        WHERE uuid = ? AND folder = ? 
                        AND username = ? AND device = ? AND path = ?;`;
        const folderCon = await pool["directories"].getConnection();
        const val = [uuid, folder, username, device, oldPath];
        console.log(val);
        const { path } = (await sqlExecute(folderCon, query, val))[0];
        const folderPath = path.split("/").slice(1).join("/");
        const dst = to === "/" ? "/" : to.split("/").slice(1).join("/");
        console.log(
          "path->",
          path,
          "folderPath->",
          folderPath,
          "dst->",
          dst,
          "to->",
          to
        );

        await organizeItemsInDB(
          con,
          versionCon,
          folderCon,
          username,
          folderPath,
          dst,
          failed
        );
        const query2 = `UPDATE directories.directories 
                        SET folder = ?,device = ?, path = ? 
                        WHERE uuid = ? AND folder = ? 
                        AND device = ? AND path = ? 
                        AND username = ?`;
        const to_folder = to.split("/").pop();
        const to_device = to.split("/")[1];
        console.log("folder=>", folder, "device=>", to_device);
        const values = [
          to_folder,
          to_device,
          to,
          uuid,
          folder,
          device,
          oldPath,
          username,
        ];
        console.log("****final values==>", values);
        await sqlExecute(folderCon, query2, values);
        if (con) {
          con.release();
        }
        if (folderCon) {
          folderCon.release();
        }
        if (versionCon) {
          versionCon.release();
        }
      } catch (err) {
        console.error(err);
      }
    }
    res.status(200).json({
      success: true,
      msg: "renamed",
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

router.post("*", verifyToken, renameItems);

export { router as renameItem };
