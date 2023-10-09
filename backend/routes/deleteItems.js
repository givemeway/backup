import express from "express";
import dontenv from "dotenv";
import csurf from "csurf";
import { verifyToken } from "../auth/auth.js";
import { origin } from "../config/config.js";
import { sqlExecute } from "../controllers/sql_execute.js";
import path from "node:path";
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
      const values = Object.values(req.headers.queryStatus[0]);
      const moveToDeletedQuery = `INSERT INTO data.deleted_files 
                                  ( username,device,directory,uuid,
                                    origin,filename,last_modified,
                                    hashvalue,enc_hashvalue,versions,
                                    size,salt,iv,deletion_date
                                  ) 
                                  values(?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())`;
      req.headers.query = moveToDeletedQuery;
      console.log([...values]);
      req.headers.queryValues = [...values];
      await sqlExecute(req, res, next);
      const deleteQuery = `DELETE FROM
                          data.files
                          WHERE uuid = ?;`;
      req.headers.query = deleteQuery;
      req.headers.queryValues = [file.id];
      await sqlExecute(req, res, next);
    } catch (err) {
      failed.push({ ...file, error: err.message });
      console.log(err.message);
    }
  });
  req.failed.files = [...failed];
  console.log(req.failed.files);
  next();
};

const deleteFolders = (req, res, next) => {
  const failed = [];
  const connection = req.headers.connection;
  req.folders.forEach(async (folder) => {
    try {
      if (folder.dir === "/") {
        const insertIntoTable = `INSERT INTO data.deleted_files 
                                  SELECT  *,NOW() 
                                  FROM data.files 
                                  WHERE username = ? AND device = ?;`;
        const deleteFromSourceTable = `DELETE FROM data.files
                                      WHERE username = ? AND device = ?`;

        await connection.beginTransaction();
        connection.query(insertIntoTable, [folder.username, folder.device]);
        connection.query(deleteFromSourceTable, [
          folder.username,
          folder.device,
        ]);
        await connection.commit();
      } else {
        const regexp = `^${folder.dir}(/[^/]+)*$`;
        const insertIntoTable = `INSERT INTO data.deleted_files 
                                SELECT *,NOW() 
                                FROM data.files 
                                WHERE username = ? AND device = ? AND directory REGEXP ?`;
        const deleteFromSourceTable = `DELETE FROM data.files
                                    WHERE username = ? AND device = ? AND directory REGEXP ?`;
        await connection.beginTransaction();
        connection.query(insertIntoTable, [
          folder.username,
          folder.device,
          regexp,
        ]);
        connection.query(deleteFromSourceTable, [
          folder.username,
          folder.device,
          regexp,
        ]);
        await connection.commit();
      }
      const regex = `^${folder.path}(/[^/]+)*$`;
      const insertIntoTable = `INSERT INTO data.deleted_folders 
                                SELECT *,NOW() 
                                FROM data.directories 
                                WHERE username = ? AND device = ? AND path REGEXP ?`;
      const deleteFromSourceTable = `DELETE FROM data.directories
                                    WHERE username = ? AND device = ? AND path REGEXP ?`;
      await connection.beginTransaction();
      connection.query(insertIntoTable, [
        folder.username,
        folder.device,
        regex,
      ]);
      connection.query(deleteFromSourceTable, [
        folder.username,
        folder.device,
        regex,
      ]);
      await connection.commit();
    } catch (err) {
      console.log(err);
      failed.push({ ...folder, error: err });
      await connection.rollback();
    }
  });
  req.failed.folders = [...failed];
  next();
};

const getDeletedItemsList = (req, res, next) => {
  const username = req.user.Username;
  const folders = JSON.parse(req.body.directories);
  const files = JSON.parse(req.body.fileIds);

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
