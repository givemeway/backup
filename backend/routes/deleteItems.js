import express from "express";
import dontenv from "dotenv";
import csurf from "csurf";
import { verifyToken } from "../auth/auth.js";
import { origin } from "../config/config.js";
import { sqlExecute } from "../controllers/sql_execute.js";
import path from "node:path";
import { getConnection } from "../controllers/getConnection.js";
import releaseConnection from "../controllers/ReleaseConnection.js";
const router = express.Router();
dontenv.config();

const root = process.env.VARIABLE;

router.use(csurf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

const deleteFiles = (req, res, next) => {
  const failed = [];
  req.files.forEach(async (file) => {
    try {
      // await fs.unlinkSync(file.path);
      const selectQuery = `SELECT * from data.files where uuid = ?`;
      req.headers.query = selectQuery;
      req.headers.queryValues = [file.id];
      await sqlExecute(req, res, next);
      releaseConnection(req, res, next);
      const deletedFilesDBCon = getConnection("deleted_files");
      await deletedFilesDBCon(req, res, next);
      const values = Object.values(req.headers.queryStatus[0]);
      const moveToDeletedQuery = `INSERT INTO deleted_files.files 
                                  ( username,device,directory,uuid,
                                    origin,filename,last_modified,
                                    hashvalue,enc_hashvalue,versions,
                                    size,salt,iv,deletion_date,deletion_type
                                  ) 
                                  values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      req.headers.query = moveToDeletedQuery;
      req.headers.queryValues = [...values, req.deletionTime, "file"];
      await sqlExecute(req, res, next);
      releaseConnection(req, res, next);
      const filesDBCon = getConnection("files");
      await filesDBCon(req, res, next);
      const deleteQuery = `DELETE FROM
                          files.files
                          WHERE uuid = ?;`;
      req.headers.query = deleteQuery;
      req.headers.queryValues = [file.id];
      await sqlExecute(req, res, next);
      releaseConnection(req, res, next);
    } catch (err) {
      failed.push({ ...file, error: err.message });
      console.log(err.message);
    }
  });
  req.failed.files = [...failed];
  next();
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
    return { id: file.id, path: filePath };
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
  console.log(filesToDelete);
  next();
};

router.post(
  "/",
  verifyToken,
  getDeletedItemsList,
  deleteFiles,
  deleteFolders,
  (req, res) => {
    console.log(req.failed);
    res.status(200).json(req.failed);
  }
);

export { router as deleteItems };
