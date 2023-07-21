import express from "express";
const router = express.Router();
import { origin } from "../config/config.js";
import path from "node:path";
import fs from "node:fs";
import { verifyToken } from "../auth/auth.js";
import csrf from "csurf";

router.use(csrf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Expose-Headers", "Content-Disposition");
  next();
});

router.get("/", verifyToken, (req, res) => {
  console.log(req);
  const filePath = "F:/IDDriveImage/LAPTOP-F5NFL085/C/DiskImage[C].img";
  const readStream = fs.createReadStream(filePath);
  res.set("Content-Disposition", `attachment; filename="GPT.img"`);
  readStream.pipe(res);
  // res.sendFile(filePath, (err) => {
  //   if (err) {
  //     res.send("Error");
  //   }
  // });
});

export { router as downloadFiles };
