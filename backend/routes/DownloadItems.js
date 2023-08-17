import express from "express";
const router = express.Router();
import path from "node:path";
import fs from "node:fs";
import dotenv from "dotenv";
import { origin } from "../config/config.js";
import { verifyToken } from "../auth/auth.js";
await dotenv.config();

import archiver from "archiver";

const fileQuery = `SELECT filename,directory,device,salt,iv FROM data.files where id=?`;
const filesInSubDirectories = `SELECT filename,salt,iv,directory FROM files WHERE username = ? AND device = ? AND directory REGEXP ?`;
const filesInCurrentDirectory = `SELECT filename,salt,iv,directory FROM files WHERE  username = ? AND device = ? AND directory = ?`;
const filesInDevice = `SELECT filename,salt,iv,directory FROM  data.files where username = ? AND device = ?`;
const root = process.env.VARIABLE;

const sqlExecute = async (req, res) => {
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
};

const getFilesInDirectory = async (req, res) => {
  const currentdirectory = req.headers.currentdirectory;
  const username = req.headers.username;
  const devicename = req.headers.devicename;
  req.headers.data = [];
  if (currentdirectory === "/") {
    req.headers.query = filesInDevice;
    req.headers.queryValues = [username, devicename];
    await sqlExecute(req, res);
    req.headers.data.push(...req.headers.queryStatus);
  } else {
    const regex_other_files = `^${currentdirectory}(/[^/]+)+$`;
    req.headers.query = filesInSubDirectories;
    req.headers.queryValues = [username, devicename, regex_other_files];
    await sqlExecute(req, res);
    req.headers.data.push(...req.headers.queryStatus);
    req.headers.query = filesInCurrentDirectory;
    req.headers.queryValues = [username, devicename, currentdirectory];
    await sqlExecute(req, res);
    req.headers.data.push(...req.headers.queryStatus);
  }
};

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

const extractFilesInforFromDB = async (req, res, next) => {
  const username = req.user.Username;
  req.headers.username = username;
  const folders = req.body.directories;
  const files = req.body.files;
  req.files = [];

  for (let i = 0; i < folders.length; i++) {
    const device = folders[i].path.split("/")[1];
    req.headers.devicename = device;
    const dirParts = folders[i].path.split("/").slice(2).join("/");
    const dir = dirParts === "" ? "/" : dirParts;
    req.headers.currentdirectory = dir;
    await getFilesInDirectory(req, res);
    const dirFiles = req.headers.data;
    for (let j = 0; j < dirFiles.length; j++) {
      const { filename, salt, iv, directory } = dirFiles[j];
      const filePath = path.join(root, username, device, directory, filename);
      const fileData = {
        filename,
        salt,
        iv,
        path: filePath,
        relativePath: dir === "/" ? path.dirname(dir) : directory,
      };
      req.files.push(fileData);
    }
  }

  // for (let i = 0; i < files.length; i++) {
  //   req.headers.query = fileQuery;
  //   req.headers.queryValues = [parseInt(files[i].id)];
  //   await sqlExecute(req, res);
  //   const { salt, iv, device, filename, directory } =
  //     req.headers.queryValues[0];
  //   console.log(salt, iv, device, filename, directory);
  //   const filePath = path.join(root, username, device, directory, filename);
  //   req.files.push({
  //     filename,
  //     salt,
  //     iv,
  //     path: filePath,
  //     relativePath: "",
  //   });
  // }

  // files.forEach(async (file) => {
  //   req.headers.query = fileQuery;
  //   req.headers.queryValues = [file.id];
  //   await sqlExecute(req, res);
  //   const { salt, iv, device, filename, directory } =
  //     req.headers.queryValues[0];
  //   const filePath = path.join(root, username, device, directory, filename);
  //   req.files.push({
  //     filename,
  //     salt,
  //     iv,
  //     path: filePath,
  //     relativePath: "",
  //   });
  // });
  console.log(req.files.length);
  next();
};

const getSaltIVForFiles = async (req, res, next) => {
  const fileQuery = `SELECT salt,iv,filename FROM data.files where id=?`;

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

const archiveDirectoriesAndFiles = (req, res, next) => {
  console.log(req.files.length);
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
      console.log(err);
    } else {
      // throw error
      console.log(err);
    }
  });
  archive.on("error", function (err) {
    console.log(err);
    res.status(500).json(err);
    res.end();
  });
  archive.pipe(res);
  req.files.forEach((file) => {
    archive.file(file.path, {
      name: file.filename,
      prefix: file.relativePath,
    });
  });
  console.log("here");
  archive.finalize();
};

const archiveDirectories = (req, res, next) => {
  console.log(req.files);
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
      console.log(err);
    } else {
      // throw error
      console.log(err);
    }
  });
  archive.on("error", function (err) {
    console.log(err, "inside error");
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
  req.download = { files: [], folders: [] };
  next();
};

router.post(
  "/",
  verifyToken,
  extractFilesInforFromDB,
  archiveDirectoriesAndFiles,
  (req, res) => {
    res.status(200).json("Downloaded");
  }
);

export { router as downloadItems };
