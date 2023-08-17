import express from "express";
const router = express.Router();
import path from "node:path";
import fs from "node:fs";
import dotenv from "dotenv";
import { origin } from "../config/config.js";
import { verifyToken } from "../auth/auth.js";
await dotenv.config();
import { sqlExecute } from "../controllers/sql_execute.js";
import { getFilesInDirectory } from "../controllers/getFilesInDirectory.js";

// import AdmZip from "adm-zip";
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

const listAllFiles = async (dir) => {
  let allFiles = [];
  try {
    const files = await fs.promises.readdir(dir);

    for (let file of files) {
      try {
        const fullPath = path.join(dir, file);
        const stat = await fs.promises.stat(fullPath);
        if (stat.isDirectory()) {
          const subFiles = await listAllFiles(fullPath);
          allFiles = allFiles.concat(subFiles);
        } else {
          allFiles.push(fullPath);
        }
      } catch (err) {
        console.log(err);
      }
    }
  } catch (error) {
    console.log(error);
  }
  return allFiles;
};

const getSaltIVForFiles = async (req, res, next) => {
  const fileQuery = `SELECT salt,iv FROM data.files where id=?`;
  req.download = { files: [] };
  const files = req.files;
  const folders = req.folders;
  try {
    for (let i = 0; i < files.length; i++) {
      req.headers.query = fileQuery;
      console.log(files[i]);
      req.headers.queryValues = [files[i].id];
      try {
        const con = req.headers.connection;
        const [rows] = await con.execute(req.headers.query, [
          ...req.headers.queryValues,
        ]);
        req.headers.queryStatus = rows;
        req.headers.query_success = true;
      } catch (error) {
        console.log(error);
      }
      req.download.files.push({ ...req.headers.queryStatus[0], ...files[i] });
    }
  } catch (err) {
    console.log(err);
  }

  next();
};

const archiveDirectories = (req, res, next) => {
  const archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level.
  });
  archive.on("close", () => {
    console.log(archive.pointer() + " total bytes");
    console.log("close event");
    next();
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
  archive.pipe(res);
  req.folders.forEach((dir) => {
    archive.directory(dir.absPath, dir.path);
  });
  req.files.forEach((file) => {
    archive.file(file.path, { name: path.basename(file.path) });
  });
  archive.finalize();
};

const getItemsToDownload = (req, res, next) => {
  const username = req.user.Username;
  req.headers.username = username;
  const folders = req.body.directories;
  const files = req.body.files;
  const foldersToDownload = folders.map((folder) => {
    const device = folder.path.split("/")[1];
    req.headers.devicename = device;
    const dirParts = folder.path.split("/").slice(2).join("/");
    const dir = dirParts === "" ? "/" : dirParts;
    req.headers.currentdirectory = dir;
    const folderPath = path.join(root, username, device, dir);
    return { absPath: folderPath, path: folder.path, device, dir, username };
  });
  const filesToDownload = files.map((file) => {
    const params = new URLSearchParams(file.path);
    const device = params.get("device");
    req.headers.devicename = device;
    const dir = params.get("dir");
    req.headers.currentdirectory = dir;
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
  getSaltIVForFiles,
  (req, res) => {
    console.log("req.download.files");
    res.status(200).json("Downloaded!");
  }
);

export { router as downloadItems };
