import express from "express";
const router = express.Router();
import { origin } from "../config/config.js";
import { verifyToken } from "../auth/auth.js";
import { decryptFile } from "../utils/decrypt.js";
import dotenv from "dotenv";
await dotenv.config();
import path from "node:path";
import fs from "node:fs";
import csrf from "csurf";
import releaseConnection from "../controllers/ReleaseConnection.js";
import { pool } from "../server.js";

const root = process.env.VARIABLE;

router.use(csrf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header(
    "Access-Control-Expose-Headers",
    "Content-Disposition,Content-Length"
  );
  next();
});

router.get(
  "/",
  verifyToken,
  async (req, res) => {
    try {
      const username = req.user.Username;
      const { file, uuid, db, dir, device } = req.query;
      const filePath = path.join(root, username, uuid);
      let query;
      let con;
      const values = [uuid];
      if (db === "versions") {
        con = await pool["versions"].getConnection();
        query = `SELECT salt,iv,size from versions.file_versions where uuid = ?`;
      } else {
        con = req.db;
        query = `SELECT salt,iv,size from files.files where uuid = ?`;
      }
      const [rows, fields] = await con.execute(query, values);
      if (db === "versions") {
        con.release();
      }
      const readStream = fs.createReadStream(filePath, {
        highWaterMark: 1024 * 1024 * 1,
      });
      const decryptStream = decryptFile(
        readStream,
        rows[0]["salt"],
        rows[0]["iv"],
        "sandy86kumar"
      );
      // res.set("Content-Length", fileStat.size);
      res.set("Content-Length", rows[0]["size"]);
      res.set("salt", rows[0]["salt"]);
      res.set("iv", rows[0]["iv"]);
      res.set("Content-Disposition", `attachment; filename="${file}"`);
      decryptStream.pipe(res);
      // readStream.pipe(res);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  releaseConnection
);

export { router as downloadFile };
