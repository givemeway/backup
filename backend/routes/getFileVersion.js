import express from "express";
import { origin } from "../config/config.js";
import csurf from "csurf";
import { verifyToken } from "../auth/auth.js";
import { pool } from "../server.js";
const router = express.Router();

router.use(csurf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  next();
});

router.get("/", verifyToken, async (req, res) => {
  const fileVersionQuery = `SELECT uuid,origin,filename,versions,last_modified,size,device,directory 
                    FROM versions.file_versions
                    WHERE username = ? AND origin = ?;`;
  let con;
  let versions = [];
  let status = 200;
  let error = undefined;
  let msg = "";
  try {
    const username = req.user.Username;
    const { origin } = req.query;
    con = await pool["versions"].getConnection();
    const value = [username, origin];
    const [rows, fields] = await con.query(fileVersionQuery, value);
    versions = rows;
    status = 200;
    msg = "success";
  } catch (err) {
    error = err;
    status = 500;
    msg = err;
  } finally {
    con.release();
    if (status === 200) {
      res.status(200).json({ success: true, msg, files: versions });
    } else if (status === 500) {
      res.status(500).json({ success: false, msg, error });
    }
  }
});

export { router as getFileVersion };
