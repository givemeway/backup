import express from "express";
const router = express.Router();
import dotenv from "dotenv";
await dotenv.config();
import csurf from "csurf";
import { verifyToken } from "../auth/auth.js";
import { origin } from "../config/config.js";
import { pool } from "../server.js";

const root = process.env.VARIABLE;

router.use(csurf({ cookie: true }));

const sqlExecute = (con, query, values) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows, fields] = await con.execute(query, values);
      resolve(rows);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

const getFolders = async (con, currentDir, username, devicename) => {
  return new Promise(async (resolve, reject) => {
    try {
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
                            folder,path,device 
                            FROM directories.directories 
                            WHERE username = ?
                            AND
                            path REGEXP ? limit ${start},${end};`;
      const rows = await sqlExecute(con, foldersQuery, [username, regex_2]);
      resolve(rows);
    } catch (err) {
      reject(err);
    }
  });
};

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const insertFileInDB = async (
  con,
  versionCon,
  device,
  username,
  filename,
  dir,
  to
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = `INSERT INTO files.files 
                        SELECT username,?,?,uuid,origin,filename,last_modified,
                        hashvalue,enc_hashvalue,versions,size,salt,iv 
                        FROM files.files 
                        WHERE filename = ? AND directory = ? AND device = ? AND username = ?;`;
      const queryVersion = `INSERT INTO versions.file_versions
                        SELECT username,?,?,uuid,origin,filename,last_modified,
                        hashvalue,enc_hashvalue,versions,size,salt,iv 
                        FROM versions.file_versions
                        WHERE filename = ? AND directory = ? AND device = ? AND username = ?;`;
      let val = [];
      if (to === "/") {
        val = ["/", "/", filename, dir, device, username];
      } else {
        const to_device = to.split("/")[0];
        const to_dirParts = to.split("/").slice(1).join("/");
        const to_dir = to_dirParts === "" ? "/" : to_dirParts;
        val = [to_device, to_dir, filename, dir, device, username];
      }

      await sqlExecute(con, query, val);
      await sqlExecute(versionCon, queryVersion, val);

      resolve();
    } catch (err) {
      reject({
        success: false,
        msg: err.sqlMessage,
        filename: filename,
        dir: dir,
        device: device,
      });
    }
  });
};

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
    const to_device = dst.split("/")[0];
    const to_dirParts = dst.split("/").slice(1).join("/");
    const to_dir_ori = to_dirParts === "" ? "/" : to_dirParts;

    const updateDB = async (dst_dir, src_dir) => {
      let foldersInDirRoot = [];
      try {
        const filesInDirRootQuery = `INSERT IGNORE INTO files.files 
                                      SELECT username,?,?,uuid,origin,filename,last_modified,
                                      hashvalue,enc_hashvalue,versions,size,salt,iv 
                                      FROM files.files 
                                      WHERE directory = ? AND device = ? AND username = ?;`;
        const filesInDirRootQueryVersion = `INSERT IGNORE INTO versions.file_versions 
                                      SELECT username,?,?,uuid,origin,filename,last_modified,
                                      hashvalue,enc_hashvalue,versions,size,salt,iv 
                                      FROM versions.file_versions 
                                      WHERE directory = ? AND device = ? AND username = ?;`;
        const values = [to_device, dst_dir, src_dir, from_device, username];
        await sqlExecute(con, filesInDirRootQuery, values);
        await sqlExecute(versionCon, filesInDirRootQueryVersion, values);
      } catch (err) {
        failed.push(err.message);
      }
      try {
        foldersInDirRoot = await getFolders(
          folderCon,
          src_dir,
          username,
          from_device
        );
      } catch (err) {
        failed.push(err.message);
        return;
      }
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

        const query = `INSERT IGNORE INTO directories.directories 
                        SELECT uuid,username,?,folder,?,NOW() 
                        FROM directories.directories 
                        WHERE username = ? AND device = ? AND path = ?;`;
        const pth = `/${to_device}/${dstPath}`;
        const val = [to_device, pth, username, from_device, folder.path];
        try {
          await sqlExecute(folderCon, query, val);
          await updateDB(dstPath, dir);
        } catch (err) {
          failed.push(err.message);
        }
      }
    };

    updateDB(to_dir_ori, from_dir)
      .then(async () => {
        const query = `INSERT IGNORE INTO directories.directories 
                        SELECT uuid,username,?,folder,?,NOW() 
                        FROM directories.directories 
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
        failed.push(err.message);
        reject(err.message);
      });
  });
};

const organizeItems = async (req, res, next) => {
  try {
    const username = req.user.Username;
    const { files, folders } = req.body;
    const to = req.query.to;
    const con = req.db;
    const versionCon = await pool["versions"].getConnection();
    const failed = [];
    console.log(to);
    console.log(files, folders);
    for (const file of files ? files : []) {
      try {
        const params = new URLSearchParams(file.path);
        const device = params.get("device");
        const filename = params.get("file");
        const dir = params.get("dir");
        const dst = to === "/" ? "/" : to.split("/").slice(1).join("/");
        await insertFileInDB(
          con,
          versionCon,
          device,
          username,
          filename,
          dir,
          dst
        );
      } catch (err) {
        failed.push(err);
      }
    }
    const folderCon = await pool["directories"].getConnection();
    for (const folder of folders ? folders : []) {
      try {
        const folderPath = folder.path.split("/").slice(1).join("/");
        const dst = to === "/" ? "/" : to.split("/").slice(1).join("/");
        console.log("processing....");
        await organizeItemsInDB(
          con,
          versionCon,
          folderCon,
          username,
          folderPath,
          dst,
          failed
        );
      } catch (err) {
        console.error(err);
      }
    }
    console.log("returned the value...........");
    if (con) {
      con.release();
    }
    if (folderCon) {
      folderCon.release();
    }
    if (versionCon) {
      versionCon.release();
    }
    res.status(200).json({
      success: true,
      msg: "moved",
      copied: files?.length
        ? files.length
        : 0 + folders?.length
        ? folders.length
        : 0 + failed.length,
      failed: failed,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

router.post("*", verifyToken, organizeItems);

export { router as copyItems };
