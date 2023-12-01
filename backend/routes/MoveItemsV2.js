import express from "express";
const router = express.Router();
import dotenv from "dotenv";
await dotenv.config();
import csurf from "csurf";
import { verifyToken } from "../auth/auth.js";
import { origin } from "../config/config.js";
import { pool } from "../server.js";

const root = process.env.VARIABLE;

const insertRootFilesInDirQuery = `INSERT IGNORE INTO files.files 
                                    SELECT username,?,?,uuid,origin,filename,last_modified,
                                    hashvalue,enc_hashvalue,versions,size,salt,iv 
                                    FROM files.files 
                                    WHERE directory = ? AND device = ? AND username = ?;`;
const insertRootFileInDirQuery = `INSERT INTO files.files 
                                    SELECT username,?,?,uuid,origin,filename,last_modified,
                                    hashvalue,enc_hashvalue,versions,size,salt,iv 
                                    FROM files.files 
                                    WHERE directory = ? AND device = ? AND username = ? AND filename = ?;`;
const filesInRootQuery = `SELECT * 
                          FROM files.files 
                          WHERE directory = ? 
                          AND device = ? 
                          AND username = ?; `;
const insertRootFilesInDirQueryVersion = `INSERT IGNORE INTO versions.file_versions 
                                            SELECT username,?,?,uuid,origin,filename,last_modified,
                                            hashvalue,enc_hashvalue,versions,size,salt,iv 
                                            FROM versions.file_versions 
                                            WHERE directory = ? AND device = ? AND username = ?;`;
const insertRootFileInDirQueryVersion = `INSERT  INTO versions.file_versions 
                                            SELECT username,?,?,uuid,origin,filename,last_modified,
                                            hashvalue,enc_hashvalue,versions,size,salt,iv 
                                            FROM versions.file_versions 
                                            WHERE directory = ? AND device = ? AND username = ? AND filename = ?;`;
const filesInRootQueryVersion = `SELECT *
                                  FROM versions.file_versions 
                                  WHERE directory = ? 
                                  AND device = ? 
                                  AND username = ?; `;
const deleteFilesInRootDir = `DELETE FROM files.files WHERE directory = ? AND device = ? AND username = ?`;
const deleteFilesInRootDirVersion = `DELETE FROM versions.file_versions WHERE directory = ? AND device = ? AND username = ?`;

const deleteFileInRootDir = `DELETE FROM files.files WHERE directory = ? AND device = ? AND username = ? AND filename = ?`;
const deleteFileInRootDirVersion = `DELETE FROM versions.file_versions WHERE directory = ? AND device = ? AND username = ? AND filename = ?`;

const fileQuery = `INSERT  INTO files.files 
                    SELECT username,?,?,uuid,origin,filename,last_modified,
                    hashvalue,enc_hashvalue,versions,size,salt,iv 
                    FROM files.files 
                    WHERE directory = ?
                    AND device = ?
                    AND filename = ?
                    AND username = ?;`;

const fileQueryVersion = `INSERT  INTO versions.file_versions 
                            SELECT username,?,?,uuid,origin,filename,last_modified,
                            hashvalue,enc_hashvalue,versions,size,salt,iv 
                            FROM files.files 
                            WHERE directory = ?
                            AND device = ?
                            AND filename = ?
                            AND username = ?;`;
const fileDeleteQueryVersion = `DELETE FROM versions.file_versions WHERE username = ? AND directory = ? AND device = ? AND filename = ?`;
const fileDeleteQuery = `DELETE FROM files.files WHERE username = ? AND directory = ? AND device = ? AND filename = ?`;

const folderInsertQuery = `INSERT  INTO directories.directories
                    SELECT  uuid,username,?,folder,?,created_at
                    FROM directories.directories
                    WHERE username = ?
                    AND device = ?
                    AND path = ?;`;
const folderDeleteQuery = `DELETE from directories.directories 
                            WHERE username = ? 
                            AND device = ? 
                            AND path = ?`;

router.use(csurf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const sqlExecute = (con, query, values) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows, fields] = await con.execute(query, values);
      resolve(rows);
    } catch (error) {
      console.error(error.code);
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
                            path REGEXP ? 
                            LIMIT ${start},${end};`;
      const rows = await sqlExecute(con, foldersQuery, [username, regex_2]);
      resolve(rows);
    } catch (err) {
      reject(err);
    }
  });
};

const organizeFileInDB = async (
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
      if (to === "/") {
        const val = ["/", "/", dir, device, filename, username];
        const val2 = [username, dir, device, filename];
        try {
          await fileCon.beginTransaction();
          await versionCon.beginTransaction();
          await fileCon.query(fileQuery, val);
          await versionCon.query(fileQueryVersion, val);
          await fileCon.query(fileDeleteQuery, val2);
          await versionCon.query(fileDeleteQueryVersion, val2);
          fileCon.commit();
          versionCon.commit();
          resolve();
        } catch (err) {
          fileCon.rollback();
          versionCon.rollback();
          reject();
        }
      } else {
        const to_device = to.split("/")[0];
        const to_dirParts = to.split("/").slice(1).join("/");
        const to_dir = to_dirParts === "" ? "/" : to_dirParts;
        const val = [to_device, to_dir, dir, device, filename, username];
        const val2 = [username, dir, device, filename];
        try {
          await fileCon.beginTransaction();
          await versionCon.beginTransaction();
          await fileCon.query(fileQuery, val);
          await versionCon.query(fileQueryVersion, val);
          await fileCon.query(fileDeleteQuery, val2);
          await versionCon.query(fileDeleteQueryVersion, val2);
          fileCon.commit();
          versionCon.commit();
          resolve();
        } catch (err) {
          fileCon.rollback();
          versionCon.rollback();
          reject();
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

const organizeItemsInDB = async (
  fileCon,
  folderCon,
  versionCon,
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
        const filesValue = [src_dir, from_device, username];
        const [rows, fields] = await fileCon.execute(
          filesInRootQuery,
          filesValue
        );

        for (const row of rows) {
          try {
            const insertVal = [
              to_device,
              dst_dir,
              src_dir,
              from_device,
              username,
              row.filename,
            ];
            const delVal = [src_dir, from_device, username, row.filename];

            await fileCon.beginTransaction();
            await fileCon.query(insertRootFileInDirQuery, insertVal);
            await versionCon.query(insertRootFileInDirQueryVersion, insertVal);
            fileCon.query(deleteFileInRootDir, delVal);
            versionCon.query(deleteFileInRootDirVersion, delVal);
            fileCon.commit();
            versionCon.commit();
          } catch (err) {
            console.error(err.code);
            fileCon.rollback();
            versionCon.rollback();
          }
        }
      } catch (err) {
        console.error(err.code);
        return;
      }
      try {
        foldersInDirRoot = await getFolders(
          folderCon,
          src_dir,
          username,
          from_device
        );
      } catch (err) {
        console.error(err.code);
        failed.push(err);
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
        const pth = `/${to_device}/${dstPath}`;
        const val = [to_device, pth, username, from_device, folder.path];
        const val2 = [username, from_device, folder.path];
        try {
          await folderCon.beginTransaction();
          await folderCon.query(folderInsertQuery, val);
          await folderCon.query(folderDeleteQuery, val2);
          folderCon.commit();
          await updateDB(dstPath, dir);
        } catch (err) {
          console.error(err.code, "<=>", folder.path);
          folderCon.rollback();
          failed.push(err.message);
        }
      }
    };

    updateDB(to_dir_ori, from_dir)
      .then(async () => {
        const val2 = [username, from_device, "/" + from];
        if (to === "/") {
          const pth = `/${to_device}`;
          const val = [to_device, pth, username, from_device, "/" + from];
          try {
            await folderCon.beginTransaction();
            await folderCon.query(folderInsertQuery, val);
            await folderCon.query(folderDeleteQuery, val2);
            folderCon.commit();
          } catch (err) {
            console.error(err.code);
            folderCon.rollback();
            failed.push(err.message);
          }
        } else {
          const pth = `/${to}/${srcFolder}`;
          const val = [to_device, pth, username, from_device, "/" + from];
          try {
            await folderCon.beginTransaction();
            await folderCon.query(folderInsertQuery, val);
            await folderCon.query(folderDeleteQuery, val2);
            folderCon.commit();
          } catch (err) {
            console.error(err.code);
            folderCon.rollback();
            failed.push(err.message);
          }
        }
        resolve();
      })
      .catch((err) => {
        console.error(err.code);
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
    for (const file of files ? files : []) {
      try {
        const params = new URLSearchParams(file.path);
        const device = params.get("device");
        const filename = params.get("file");
        const dir = params.get("dir");
        const dst = to === "/" ? "/" : to.split("/").slice(1).join("/");
        await organizeFileInDB(
          con,
          versionCon,
          device,
          username,
          filename,
          dir,
          dst
        );
      } catch (err) {
        failed.push(file);
      }
    }
    const folderCon = await pool["directories"].getConnection();
    for (const folder of folders ? folders : []) {
      try {
        const folderPath = folder.path.split("/").slice(1).join("/");
        const dst = to === "/" ? "/" : to.split("/").slice(1).join("/");
        console.log("processing v2....");
        await organizeItemsInDB(
          con,
          folderCon,
          versionCon,
          username,
          folderPath,
          dst,
          failed
        );
      } catch (err) {
        console.error(err);
      }
    }
    console.log("returned the value v2");
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
      moved: files?.length
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

export { router as moveItemsV2 };
