import express from "express";
import { origin } from "../config/config.js";
import csurf from "csurf";
import { verifyToken } from "../auth/auth.js";
import { pool } from "../server.js";
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
  try {
    const username = req.user.Username;
    const trashFileCount = `SELECT count(*) from deleted_files.files where username = ?`;
    const trashFolderCount = `SELECT count(*) from deleted_directories.directories where username = ?`;
    req.data = {};
    const con = req.db;
    const folderCon = await pool["deleted_directories"].getConnection();
    const fileCount = await sqlExecute(con, trashFileCount, [username]);
    const folderCount = await sqlExecute(folderCon, trashFolderCount, [
      username,
    ]);
    req.data["fileCount"] = Object.values(fileCount[0])[0];
    req.data["folderCount"] = Object.values(folderCount[0])[0];
    res.status(200).json(req.data);
  } catch (err) {
    res.status(500).json(err);
  }
});

export { router as getTrashTotal };
