import express from "express";
import dontenv from "dotenv";
import csurf from "csurf";
import { verifyToken } from "../auth/auth.js";
import { origin } from "../config/config.js";
import { sqlExecute } from "../controllers/sql_execute.js";
import fs from "node:fs";
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
      const moveToDeletedQuery = `INSERT INTO data.deleted 
      (   username,device,directory,uuid,
        origin,filename,last_modified,
        hashvalue,enc_hashvalue,versions,
        size,salt,iv,deletion_date
        ) 
        values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      req.headers.query = moveToDeletedQuery;
      const deletion_date = new Date();
      const isoString = deletion_date
        .toISOString()
        .substring(0, 19)
        .replace("T", " ");
      console.log([...values, isoString]);
      req.headers.queryValues = [...values, isoString];
      await sqlExecute(req, res, next);
      const deleteQuery = `DELETE FROM
      data.files
      WHERE uuid = ?;`;
      req.headers.query = deleteQuery;
      req.headers.queryValues = [file.id];
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
  req.folders.forEach(async (folder) => {
    try {
      await fs.rmSync(folder.folderPath, { recursive: true });
      if (folder.dir === "/") {
        const filesInOtherDirectories = `DELETE 
                                        FROM  
                                        data.files 
                                        where 
                                        username = ?
                                        AND
                                        device = ?`;
        req.headers.query = filesInOtherDirectories;
        req.headers.queryValues = [folder.username, folder.device];
        await sqlExecute(req, res, next);
      } else {
        const deleteSubFolderQuery = `DELETE FROM
                                    data.files
                                    WHERE username = ?
                                    AND device = ?
                                    AND directory 
                                    REGEXP ?`;
        const regexp = `^${folder.dir}(/[^/]+)*$`;
        req.headers.query = deleteSubFolderQuery;
        req.headers.queryValues = [folder.username, folder.device, regexp];
      }

      let regex;
      regex = `^${folder.path}(/[^/]+)*$`;
      const foldersQuery = `DELETE
                            FROM data.directories 
                            WHERE 
                            username = ?
                            AND
                            device = ?
                            AND
                            path REGEXP ?`;
      req.headers.query = foldersQuery;
      req.headers.queryValues = [folder.username, folder.device, regex];
      await sqlExecute(req, res, next);
    } catch (err) {
      console.log(err);
      failed.push({ ...folder, error: err });
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
