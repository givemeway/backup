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
  const trashFileCount = `SELECT count(*) from data.deleted_files where username = ?`;
  const trashFolderCount = `SELECT count(*) from data.deleted_folders where username = ?`;
  req.data = {};
  const con = req.headers.connection;
  const fileCount = await sqlExecute(con, trashFileCount, [username]);
  const folderCount = await sqlExecute(con, trashFolderCount, [username]);
  req.data["fileCount"] = Object.values(fileCount[0])[0];
  req.data["folderCount"] = Object.values(folderCount[0])[0];
  res.status(200).json(req.data);
});

export { router as getTrashTotal };
