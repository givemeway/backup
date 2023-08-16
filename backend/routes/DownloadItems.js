import express from "express";
const router = express.Router();
import path from "node:path";
import fs from "node:fs";
import dotenv from "dotenv";
import { origin } from "../config/config.js";
import { verifyToken } from "../auth/auth.js";
await dotenv.config();

import AdmZip from "adm-zip";
import archiver from "archiver";

const root = process.env.VARIABLE;

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header(
    "Acess-Control-Expose-Headers",
    "Content-Disposition,Content-Length"
  );
  next();
});

const archiveDirectories = (req, res, next) => {
  const output = fs.createWriteStream("./sandeep.zip");
  const archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level.
  });
  output.on("close", function () {
    console.log(archive.pointer() + " total bytes");
    console.log(
      "archiver has been finalized and the output file descriptor has closed."
    );
    next();
  });
  output.on("end", function () {
    console.log("Data has been drained");
  });
  archive.on("warning", function (err) {
    if (err.code === "ENOENT") {
      // log warning
    } else {
      // throw error
      throw err;
    }
  });
  archive.on("error", function (err) {
    res.status(500).json(err);
    res.end();
  });
  archive.pipe(output);
  req.folders.forEach((dir) => {
    archive.directory(dir.absPath, dir.path);
  });
  req.files.forEach((file) => {
    archive.file(file.path, { name: path.basename(file.path) });
  });
  archive.finalize();
};

const zipDirectories = async (sourceDirs, sourceFiles, outputFilePath) => {
  const zip = new AdmZip();
  sourceDirs.forEach((sourceDir) => {
    zip.addLocalFolder(sourceDir);
  });
  sourceFiles.forEach((file) => {
    zip.addLocalFile(file);
  });
  await zip.writeZipPromise(outputFilePath);
};

const getItemsToDownload = (req, res, next) => {
  const username = req.user.Username;
  const folders = JSON.parse(req.body.directories);
  const files = JSON.parse(req.body.files);
  const foldersToDownload = folders.map((folder) => {
    const device = folder.path.split("/")[1];
    const dirParts = folder.path.split("/").slice(2).join("/");
    const dir = dirParts === "" ? "/" : dirParts;
    const folderPath = path.join(root, username, device, dir);
    return { absPath: folderPath, path: folder.path };
  });
  const filesToDownload = files.map((file) => {
    const params = new URLSearchParams(file.path);
    const device = params.get("device");
    const dir = params.get("dir");
    const fileName = params.get("file");
    const filePath = path.join(root, username, device, dir, fileName);
    return { id: file.id, path: filePath };
  });
  req.folders = foldersToDownload;
  req.files = filesToDownload;

  next();
};

router.post(
  "/",
  verifyToken,
  getItemsToDownload,
  archiveDirectories,
  async (req, res) => {
    res.status(200).json("Downloaded!");
  }
);

export { router as downloadItems };
