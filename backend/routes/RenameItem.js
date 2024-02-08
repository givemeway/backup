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
const DUPLICATE = "DUPLICATE";

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
  return new Promise(async (resolve, reject) => {
    const from_device = from === "/" ? "/" : from.split("/")[0];
    const from_dirParts = from.split("/").slice(1).join("/");
    const from_dir = from_dirParts === "" ? "/" : from_dirParts;
    const to_device = to.split("/")[0];
    const to_dirParts = to.split("/").slice(1).join("/");
    const to_dir_ori = to_dirParts === "" ? "/" : to_dirParts;
    const folder = to.split("/").slice(-1)[0];

    const checkDuplicate = `SELECT path FROM directories.directories 
                            WHERE username = ? AND path = ? AND device = ? AND folder = ?;`;
    let checkValues = [];
    if (to === "/") {
      checkValues = [username, to, to_device, folder];
    } else {
      checkValues = [username, "/" + to, to_device, folder];
    }
    try {
      const rows = await sqlExecute(folderCon, checkDuplicate, checkValues);
      if (rows.length > 0) {
        failed.push({
          success: false,
          msg: `Folder ${to} exists in the current directory`,
          error: "DUPLICATE",
        });
        reject({
          success: false,
          msg: `Folder ${to} exists in the current directory`,
          error: "DUPLICATE",
        });
        return;
      }
    } catch (error) {
      console.error("err", error);
      failed.push({ success: false, msg: error });
      reject({ success: false, msg: error, error });
      return;
    }

    const updateDB = async (dst_dir, src_dir) => {
      try {
        const filesInDirRootQuery = `UPDATE files.files 
                                    SET directory = ?, device = ? 
                                    WHERE directory = ? AND device = ? AND username = ?`;
        const filesInDirRootQueryVersions = `UPDATE versions.file_versions
                                    SET directory = ?, device = ? 
                                    WHERE directory = ? AND device = ? AND username = ?`;
        const values = [dst_dir, to_device, src_dir, from_device, username];
        await sqlExecute(con, filesInDirRootQuery, values);
        await sqlExecute(versionCon, filesInDirRootQueryVersions, values);

        const foldersInDirRoot = await getFolders(
          folderCon,
          src_dir,
          username,
          from_device
        );
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
          await sqlExecute(folderCon, query, val);
          await updateDB(dstPath, dir);
        }
      } catch (error) {
        failed.push({ success: false, msg: error, error });
      }
    };

    updateDB(to_dir_ori, from_dir)
      .then(async () => {
        const query = `UPDATE directories.directories 
                        SET device = ?, path = ?, folder = ?  
                        WHERE username = ? AND device = ? AND path = ?`;
        if (to === "/") {
          const pth = `/${to_device}`;
          const val = [
            to_device,
            pth,
            folder,
            username,
            from_device,
            "/" + from,
          ];
          await sqlExecute(folderCon, query, val);
        } else {
          const pth = `/${to}`;
          const val = [
            to_device,
            pth,
            folder,
            username,
            from_device,
            "/" + from,
          ];
          await sqlExecute(folderCon, query, val);
        }
        resolve();
      })
      .catch((error) => {
        console.error(error);
        failed.push({ success: false, msg: error, error });
        reject({ success: false, msg: error, error });
      });
  });
};

const renameItems = async (req, res, next) => {
  const username = req.user.Username;
  const { type, to, uuid, device } = req.body;
  console.log(type, to, uuid, device);
  let versionCon;
  let fileCon;
  let folderCon;
  let failed = [];
  let status;
  let error;
  let oldname;
  let newname;
  try {
    fileCon = req.db;
    versionCon = await pool["versions"].getConnection();
    if (type === FILE) {
      const { dir, filename } = req.body;
      oldname = filename;
      newname = to;
      const query = `UPDATE files.files SET filename = ? 
      WHERE origin = ? AND username = ? AND device = ? AND directory = ? AND filename = ?`;
      const queryVersion = `UPDATE versions.file_versions SET filename = ? 
      WHERE origin = ? AND username = ? AND device = ? AND directory = ? AND filename = ?`;

      await sqlExecute(fileCon, query, [
        to,
        uuid,
        username,
        device,
        dir,
        filename,
      ]);
      await sqlExecute(versionCon, queryVersion, [
        to,
        uuid,
        username,
        device,
        dir,
        filename,
      ]);
    } else if (type === FOLDER) {
      const { folder, oldPath } = req.body;
      oldname = folder;
      newname = to;
      const query = `SELECT device,folder,path 
                        FROM directories.directories 
                        WHERE uuid = ? AND folder = ? 
                        AND username = ? AND device = ? AND path = ?;`;
      folderCon = await pool["directories"].getConnection();
      const val = [uuid, folder, username, device, oldPath];
      const { path } = (await sqlExecute(folderCon, query, val))[0];
      const folderPath = path.split("/").slice(1).join("/");
      const dst = to === "/" ? "/" : to.split("/").slice(1).join("/");
      await organizeItemsInDB(
        fileCon,
        versionCon,
        folderCon,
        username,
        folderPath,
        dst,
        failed
      );
    }
  } catch (err) {
    console.error(err);
    console.log(failed);
    if (err?.error === DUPLICATE) {
      status = 409;
      error = err?.error;
    } else if (failed.length > 0) {
      status = 206;
    }
  } finally {
    if (failed.length === 0 && error !== DUPLICATE) {
      status = 200;
    }
    if (status === 200) {
      res
        .status(200)
        .json({ success: true, msg: `${oldname} renamed to ${newname}` });
    } else {
      if (!status) status = 209;
      res
        .status(status)
        .json({ success: true, msg: "Few Failed", failed: failed });
    }
  }
};

router.patch("/", verifyToken, renameItems);

export { router as renameItem };
