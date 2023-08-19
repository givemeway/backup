import express from "express";
const router = express.Router();
import path from "node:path";
import fs from "node:fs";
import dotenv from "dotenv";
import { origin } from "../config/config.js";
import { verifyToken } from "../auth/auth.js";
import { decryptFile } from "../utils/decrypt.js";
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
      const actualPath = path.join(device, directory);
      const fileData = {
        filename,
        salt,
        iv,
        path: filePath,
        relativePath:
          dir === "/"
            ? actualPath
            : path.join(dir, actualPath.split(dir).slice(1).join("/")),
      };
      req.files.push(fileData);
    }
  }

  for (let i = 0; i < files.length; i++) {
    req.headers.query = fileQuery;
    req.headers.queryValues = [parseInt(files[i].id)];
    await sqlExecute(req, res);
    const { salt, iv, device, filename, directory } =
      req.headers.queryStatus[0];
    const filePath = path.join(root, username, device, directory, filename);
    req.files.push({
      filename,
      salt,
      iv,
      path: filePath,
      relativePath: "",
    });
  }
  next();
};

const archiveDirectoriesAndFiles = (req, res, next) => {
  const archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level.
  });
  archive.on("end", () => {
    console.log(archive.pointer() + " total bytes");
    console.debug("end event");
    next();
  });
  archive.on("warning", function (err) {
    if (err.code === "ENOENT") {
      // log warning
      console.error(err);
    } else {
      // throw error
      console.error(err);
    }
  });
  archive.on("error", function (err) {
    console.error(err);
    res.status(500).send(err);
    res.end();
  });
  archive.pipe(res);
  const files = req.files;
  try {
    for (let i = 0; i < files.length; i++) {
      const inputFile = fs.createReadStream(files[i].path);
      const fileStream = decryptFile(
        inputFile,
        files[i].salt,
        files[i].iv,
        "sandy86kumar"
      );
      inputFile.on("error", (err) => {
        res.send(err);
        res.end();
      });

      archive.append(fileStream, {
        name: files[i].filename,
        prefix: files[i].relativePath,
      });
    }
  } catch (err) {
    res.send(err);
    res.end();
  }
  archive.finalize();
};

router.post(
  "/",
  verifyToken,
  extractFilesInforFromDB,
  archiveDirectoriesAndFiles
);

export { router as downloadItems };
