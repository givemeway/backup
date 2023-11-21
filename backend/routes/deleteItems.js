import express from "express";
import dontenv from "dotenv";
import csurf from "csurf";
import { verifyToken } from "../auth/auth.js";
import { origin } from "../config/config.js";
import { pool } from "../server.js";
import path from "node:path";
import { getConnection } from "../controllers/getConnection.js";
import releaseConnection from "../controllers/ReleaseConnection.js";
const router = express.Router();
dontenv.config();

const root = process.env.VARIABLE;
const insertIntoDeletedFilesQuery = `INSERT INTO deleted_files.files  
                                      SELECT username,device,directory,uuid,
                                            origin,filename,last_modified,
                                            hashvalue,enc_hashvalue,versions,
                                            size,salt,iv,?,?
                                      FROM files.files 
                                      WHERE username = ? AND uuid = ? AND device = ? AND directory = ? AND filename = ?;`;

const insertIntoDeletedFilesVersionQuery = `INSERT INTO deleted_files.file_versions  
                                            SELECT username,device,directory,uuid,
                                                origin,filename,last_modified,
                                                hashvalue,enc_hashvalue,versions,
                                                size,salt,iv,?,?
                                            FROM versions.file_versions 
                                            WHERE username = ? AND origin = ? AND device = ? AND directory = ? AND filename = ?;`;
const fileDeleteQuery = `DELETE FROM files.files
                         WHERE username = ? AND uuid = ? AND device = ? AND directory = ? AND filename = ?;`;
const fileVersionDeleteQuery = `DELETE FROM versions.file_versions
                          WHERE username = ? AND origin = ? AND device = ? AND directory = ? AND filename = ?;`;

router.use(csurf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

const deleteFiles = async (req, res, next) => {
  const failed = [];
  const username = req.user.Username;
  let deletedFileCon;
  let fileCon;
  let fileVersionCon;
  try {
    deletedFileCon = await pool["deleted_files"].getConnection();
    fileCon = await pool["files"].getConnection();
    fileVersionCon = await pool["versions"].getConnection();
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
    res.end();
    return;
  }
  for (const file of req.files) {
    const insertValue = [
      req.deletionTime,
      "file",
      username,
      file.id,
      file.device,
      file.dir,
      file.name,
    ];
    const insertValue2 = [
      req.deletionTime,
      "file",
      username,
      file.origin,
      file.device,
      file.dir,
      file.name,
    ];

    const value = [username, file.id, file.device, file.dir, file.name];
    const value2 = [username, file.origin, file.device, file.dir, file.name];
    try {
      await deletedFileCon.beginTransaction();
      await fileCon.beginTransaction();
      await fileVersionCon.beginTransaction();
      await deletedFileCon.query(insertIntoDeletedFilesQuery, insertValue);
      await deletedFileCon.query(
        insertIntoDeletedFilesVersionQuery,
        insertValue2
      );
      await deletedFileCon.commit();
      await fileCon.execute(fileDeleteQuery, value);
      await fileVersionCon.execute(fileVersionDeleteQuery, value2);
      await fileCon.commit();
      await fileVersionCon.commit();
    } catch (err) {
      console.error(err);
      failed.push({ ...file, error: err.message });
      await deletedFileCon.rollback();
      await fileVersionCon.rollback();
      await fileCon.rollback();
    }
  }

  if (fileCon) {
    fileCon.release();
  }
  if (fileVersionCon) {
    fileVersionCon.release();
  }
  if (deletedFileCon) {
    deletedFileCon.release();
  }
  req.failed.files = [...failed];
  console.log("reached end");
  next();
};

const insertMissingPaths = (
  deletedFolderCon,
  deletionTime,
  relPath,
  relName,
  username,
  device,
  path
) => {
  return new Promise(async (resolve, reject) => {
    const rows = path.split("/");
    const query = `INSERT IGNORE INTO deleted_directories.directories 
                    SELECT *,?,?,? 
                    FROM directories.directories 
                    WHERE username = ? AND device = ? AND path = ?`;
    try {
      const paths = rows
        .map((row, idx) => rows.slice(0, idx + 1).join("/"))
        .slice(1);
      deletedFolderCon.beginTransaction();
      for (const pth of paths) {
        const values = [deletionTime, relPath, relName, username, device, pth];
        deletedFolderCon.query(query, values);
      }
      deletedFolderCon.commit();
      resolve();
    } catch (err) {
      deletedFolderCon.rollback();
      reject(err);
    }
  });
};

const deleteFolders = async (req, res, next) => {
  const failed = [];
  // const connection = req.headers.connection;
  const deleted_filesDBCon = getConnection("deleted_files");
  await deleted_filesDBCon(req, res, next);
  const delFilesConnection = req.db;
  req.folders.forEach(async (folder) => {
    try {
      if (folder.dir === "/") {
        const insertIntoTable = `INSERT INTO deleted_files.files 
                                  SELECT  *,?,? 
                                  FROM files.files 
                                  WHERE username = ? AND device = ?;`;
        const deleteFromSourceTable = `DELETE FROM files.files
                                      WHERE username = ? AND device = ?`;

        await delFilesConnection.beginTransaction();
        await delFilesConnection.query(insertIntoTable, [
          req.deletionTime,
          "folder",
          folder.username,
          folder.device,
        ]);
        await delFilesConnection.commit();
        releaseConnection(req, res, next);
        const filesDBCon = getConnection("files");
        await filesDBCon(req, res, next);
        const filesConnection = req.db;
        await filesConnection.query(deleteFromSourceTable, [
          folder.username,
          folder.device,
        ]);
        await filesConnection.commit();
        releaseConnection(req, res, next);
      } else {
        const regexp = `^${folder.dir}(/[^/]+)*$`;
        const insertIntoTable = `INSERT INTO deleted_files.files
                                SELECT *,?,? 
                                FROM files.files 
                                WHERE username = ? 
                                AND device = ? 
                                AND directory REGEXP ?`;
        const deleteFromSourceTable = `DELETE FROM files.files
                                       WHERE username = ? 
                                       AND device = ? 
                                       AND directory REGEXP ?`;
        await delFilesConnection.beginTransaction();
        await delFilesConnection.query(insertIntoTable, [
          req.deletionTime,
          "folder",
          folder.username,
          folder.device,
          regexp,
        ]);
        await delFilesConnection.commit();
        releaseConnection(req, res, next);
        const filesDBCon = getConnection("files");
        await filesDBCon(req, res, next);
        const filesConnection = req.db;
        await filesConnection.query(deleteFromSourceTable, [
          folder.username,
          folder.device,
          regexp,
        ]);
        await filesConnection.commit();
        releaseConnection(req, res, next);
      }
      const deletedDirectoriesDBCon = getConnection("deleted_directories");
      await deletedDirectoriesDBCon(req, res, next);
      const delFolderConnection = req.db;
      const regex = `^${folder.path}(/[^/]+)*$`;
      const insertIntoTable = `INSERT INTO deleted_directories.directories 
                                SELECT *,?,?,? 
                                FROM directories.directories 
                                WHERE username = ? AND device = ? AND path REGEXP ?`;
      const deleteFromSourceTable = `DELETE FROM directories.directories
                                    WHERE username = ? AND device = ? AND path REGEXP ?`;

      await delFolderConnection.beginTransaction();
      await delFolderConnection.query(insertIntoTable, [
        req.deletionTime,
        folder.path,
        folder.name,
        folder.username,
        folder.device,
        regex,
      ]);
      await delFolderConnection.commit();
      await insertMissingPaths(
        delFolderConnection,
        req.deletionTime,
        folder.path,
        folder.name,
        folder.username,
        folder.device,
        folder.path
      );
      releaseConnection(req, res, next);
      const directoriesDBCon = getConnection("directories");
      await directoriesDBCon(req, res, next);
      const folderConnection = req.db;
      await folderConnection.query(deleteFromSourceTable, [
        folder.username,
        folder.device,
        regex,
      ]);
      await folderConnection.commit();
      releaseConnection(req, res, next);
    } catch (err) {
      console.error(err);
      failed.push({ ...folder, error: err });
      await delFilesConnection.rollback();
    }
  });
  req.failed.folders = [...failed];
  next();
};

const getDeletedItemsList = (req, res, next) => {
  const username = req.user.Username;
  const folders = JSON.parse(req.body.directories);
  const files = JSON.parse(req.body.fileIds);
  const deletionTime = new Date()
    .toISOString()
    .substring(0, 19)
    .replace("T", " ");
  const filesToDelete = files.map((file) => {
    const params = new URLSearchParams(file.path);
    const device = params.get("device");
    const dir = params.get("dir");
    const fileName = params.get("file");
    const filePath = path.join(root, username, device, dir, fileName);
    return {
      id: file.id,
      path: filePath,
      name: fileName,
      dir,
      origin: file.origin,
      device,
    };
  });

  const foldersToDelete = folders.map((folder) => {
    const device = folder.path.split("/")[1];
    const dirParts = folder.path.split("/").slice(2).join("/");
    const dir = dirParts === "" ? "/" : dirParts;
    const folderPath = path.join(root, username, device, dir);
    return {
      id: folder.id,
      name: folder.folder,
      device,
      username,
      dir,
      folderPath,
      path: folder.path,
    };
  });
  req.files = filesToDelete;
  req.folders = foldersToDelete;
  req.failed = { files: [], folders: [] };
  req.deletionTime = deletionTime;

  next();
};

router.post(
  "/",
  verifyToken,
  getDeletedItemsList,
  deleteFiles,
  deleteFolders,
  (req, res) => {
    res.status(200).json(req.failed);
  }
);

export { router as deleteItems };
