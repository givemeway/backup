import express from "express";
const router = express.Router();
import { origin } from "../config/config.js";
import { verifyToken } from "../auth/auth.js";
import { decryptFile } from "../utils/decrypt.js";
import dotenv from "dotenv";
await dotenv.config();
import csrf from "csurf";
import releaseConnection from "../controllers/ReleaseConnection.js";
import { pool } from "../server.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../server.js";

const root = process.env.VARIABLE;
const BUCKET = process.env.BUCKET;

const encQuery = `SELECT enc FROM customers.users WHERE username = ?`;

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
      const userCon = await pool["customers"].getConnection();

      let query;
      let con;
      const values = [uuid];
      console.log(uuid);
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
      const Key = `${username}/${uuid}`;
      const command = new GetObjectCommand({
        Bucket: BUCKET,
        Key,
      });
      if (rows.length > 0) {
        const data = await s3Client.send(command);
        const [key] = await userCon.execute(encQuery, [username]);
        const decryptStream = await decryptFile(
          data.Body,
          rows[0]["salt"],
          rows[0]["iv"],
          key[0].enc
        );
        res.set("Content-Length", rows[0]["size"]);
        res.set("salt", rows[0]["salt"]);
        res.set("iv", rows[0]["iv"]);
        res.set("Content-Disposition", `attachment; filename="${file}"`);
        decryptStream.pipe(res);
      } else {
        res.status(404).json({ success: false, msg: "File not Found" });
      }
      if (userCon) {
        userCon.release();
      }
    } catch (err) {
      res.status(500).json({ success: false, msg: err });
    }
  },
  releaseConnection
);

export { router as downloadFile };
