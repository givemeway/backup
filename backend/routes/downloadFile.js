import express from "express";
const router = express.Router();
import { origin } from "../config/config.js";
import { verifyToken } from "../auth/auth.js";
import dotenv from "dotenv";
await dotenv.config();
import path from "node:path";
import fs from "node:fs";
import csrf from "csurf";

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

router.get("/", verifyToken, async (req, res) => {
  try {
    const username = req.user.Username;
    const device = req.query.device;
    const dir = req.query.dir;
    const filename = req.query.file;
    const uuid = req.query.uuid;

    // const filePath = path.join(root, username, device, dir, filename);
    const filePath = path.join(root, username, uuid);
    // const query = `SELECT salt,iv from data.files where USERNAME = ? AND device = ? AND directory = ? AND filename = ?`;
    const query = `SELECT salt,iv,size from data.files where uuid = ?`;

    const con = req.headers.connection;
    // const values = [username, device, dir, filename];
    const values = [uuid];
    const [rows, fields] = await con.execute(query, values);
    // const fileStat = fs.statSync(filePath);
    const readStream = fs.createReadStream(filePath, {
      highWaterMark: 1024 * 1024 * 1,
    });
    // res.set("Content-Length", fileStat.size);
    res.set("Content-Length", rows[0]["size"]);
    res.set("salt", rows[0]["salt"]);
    res.set("iv", rows[0]["iv"]);
    res.set("Content-Disposition", `attachment; filename="${filename}"`);
    readStream.pipe(res);
  } catch (err) {
    res.status(500).json(err);
  }
});

export { router as downloadFile };
