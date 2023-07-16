import express from "express";
const router = express.Router();
import { origin } from "../config/config.js";
import path from "node:path";
import fs from "node:fs";

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Expose-Headers", "Content-Disposition");
  next();
});

router.get("/", (req, res) => {
  const filePath =
    "D:/NodeJSBackupSolution/sandeep.kumar@idriveinc.com/DESKTOP-10RSGE8/ticketing/Clustering-master/data/clusters.json";

  res.sendFile(filePath, (err) => {
    if (err) {
      res.send("Error");
    }
  });
});

export { router as downloadFiles };
