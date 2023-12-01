import express from "express";
const router = express.Router();
import csurf from "csurf";
import { origin } from "../config/config.js";
import { verifyToken } from "../auth/auth.js";

const singleFile = "singleFile";
const bulk = "bulk";

const sqlExecute = (con, query, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows, fields] = await con.execute(query, value);
      resolve(rows);
    } catch (err) {
      reject(err);
    }
  });
};

router.use(csurf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

router.post("*", verifyToken, async (req, res) => {
  try {
    const username = req.user.Username;
    const { path, folder, count, begin, end, item, id } = req.query;
    const con = req.db;
    let value = [];
    let query = "";
    if (item === bulk) {
      const dirParts = path.split("/").slice(2).join("/");
      const device = path.split("/")[1];
      let dir = dirParts === "" ? "/" : dirParts;
      dir = dir.replace(/\)/g, "\\)");
      dir = dir.replace(/\(/g, "\\(");
      const regexp = `^${dir}(/[^/]+)*$`;
      query = `SELECT filename,deletion_date,device,directory,uuid
                    FROM deleted_files.files
                    WHERE username = ?
                    AND device = ?
                    AND directory REGEXP ?
                    ORDER BY directory
                    LIMIT ?,?`;

      value = [username, device, regexp, begin.toString(), end.toString()];
    } else if (item === singleFile) {
      query = `SELECT filename,deletion_date,device,directory,uuid
                FROM deleted_files.files
                WHERE username = ?
                AND uuid = ?;`;
      value = [username, id];
    }
    const rows = await sqlExecute(con, query, value);
    if (con) {
      con.release();
    }
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

export { router as getTrashBatch };
