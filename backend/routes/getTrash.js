import express from "express";
import { origin } from "../config/config.js";
import csurf from "csurf";
import { verifyToken } from "../auth/auth.js";
const router = express.Router();

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

router.use(csurf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

router.get("/", verifyToken, async (req, res) => {
  const username = req.user.Username;
  const trashFilesQuery = `SELECT filename,directory,device,uuid,deletion_date from data.deleted_files WHERE username = ?`;
  const trashFoldersQuery = `SELECT device,path,folder,uuid from data.deleted_folders WHERE username = ?`;
  req.data = {};
  const con = req.headers.connection;
  const files = await sqlExecute(con, trashFilesQuery, [username]);
  const folders = await sqlExecute(con, trashFoldersQuery, [username]);
  req.data["files"] = files;
  req.data["folders"] = folders;
  res.status(200).json(req.data);
});

export { router as getTrash };
