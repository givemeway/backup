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
  res.header("Access-Control-Expose-Headers", "Content-Disposition");
  next();
});

router.get("/", (req, res) => {
  const filePath =
    "F:/NodeJSBackupSolution/sandeep.kumar@idriveinc.com/DESKTOP-10RSGE8/Downloads/sandeep_amma_divya.exe";
  const readStream = fs.createReadStream(filePath, {
    highWaterMark: 1024 * 1024 * 1,
  });
  res.set(
    "Content-Disposition",
    `attachment; filename="sandeep_amma_divya.exe"`
  );
  readStream.pipe(res);
});

export { router as downloadFiles };
