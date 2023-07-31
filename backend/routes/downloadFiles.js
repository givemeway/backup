import express from "express";
const router = express.Router();
import { origin } from "../config/config.js";
import path from "node:path";
import fs from "node:fs";
import { verifyToken } from "../auth/auth.js";
import csrf from "csurf";

// router.use(csrf({ cookie: true }));

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

router.get("/", (req, res) => {
  const filePath =
    "F:/NodeJSBackupSolution/sandeep.kumar@idriveinc.com/DESKTOP-10RSGE8/Downloads/whereareyou.exe";
  const fileStat = fs.statSync(filePath);
  const readStream = fs.createReadStream(filePath, {
    highWaterMark: 1024 * 1024 * 1,
  });
  // res.set("Content-Length", fileStat.size);
  res.set("Content-Length", fileStat.size);
  res.set("Content-Disposition", `attachment; filename="whereareyou.exe"`);
  readStream.pipe(res);
});

export { router as downloadFiles };
