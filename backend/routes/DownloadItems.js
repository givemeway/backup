import express from "express";
const router = express.Router();
import path from "node:path";
import csrf from "csurf";
import dotenv from "dotenv";
import { verifyToken } from "../auth/auth.js";
import { Worker } from "node:worker_threads";
import { Readable } from "node:stream";
import { DownloadZip } from "../models/mongodb.js";
import { Prisma, prisma, prismaUser } from "../config/prismaDBConfig.js";
dotenv.config();

const getFilesInDirectory_promise = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const currentdirectory = req.headers.currentdirectory;
      const username = req.headers.username;
      const devicename = req.headers.devicename;
      req.headers.data = [];
      if (currentdirectory === "/") {
        const rows = await prisma.file.findMany({
          where: {
            username,
            device: devicename,
          },
        });

        resolve(rows);
      } else {
        const regex_other_files = `^${currentdirectory}(/[^/]+)*$`;

        const rows = await prisma.$queryRaw(Prisma.sql`
          SELECT uuid,filename,salt,iv,directory,size
          FROM public."File" 
          WHERE username = ${username}
          AND device = ${devicename}
          AND directory ~ ${regex_other_files};`);
        resolve(rows);
      }
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const getFilesFoldersFromDownloadID = async (req, res, next) => {
  try {
    const share = await DownloadZip.findById({ _id: req.query.key }).exec();
    if (!share)
      return res
        .status(404)
        .json({ success: false, msg: "Download URL Doesn't exist" });
    const time_now = Date.now();
    const time_diff = share.expires_at - time_now;
    if (time_diff <= 0)
      return res
        .status(403)
        .json({ success: false, msg: "Download URL Expired" });
    req.body.files = share.files.map((file) => ({
      id: file.uuid,
      path: file.path,
    }));
    req.body.directories = share.folders.map((folder) => ({
      folder: folder.folder,
      path: folder.path,
    }));
    next();
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
  }
};

const extractFilesInforFromDB = async (req, res, next) => {
  const username = req.user.Username;
  req.headers.username = username;
  const folders = req.body.directories;
  const files = req.body.files;
  req.files = [];
  let totalSize = 0;
  for (let i = 0; i < folders.length; i++) {
    const device = folders[i].path.split("/")[1];
    req.headers.devicename = device;
    const dirParts = folders[i].path.split("/").slice(2).join("/");
    const dir = dirParts === "" ? "/" : dirParts;
    req.headers.currentdirectory = dir;
    const dirFiles = await getFilesInDirectory_promise(req, res);
    for (let j = 0; j < dirFiles.length; j++) {
      const { filename, salt, iv, directory, uuid, size } = dirFiles[j];
      totalSize += parseInt(size);
      const actualPath = path.join(device, directory);
      const fileData = {
        key: `${username}/${uuid}`,
        filename,
        salt,
        iv,
        relativePath:
          dir === "/"
            ? actualPath
            : path.join(dir, actualPath.split(dir).slice(1).join("/")),
      };
      req.files.push(fileData);
    }
  }

  for (let i = 0; i < files.length; i++) {
    const uuid = files[i].id;
    const urlParam = new URLSearchParams(files[i].path);
    const directory = urlParam.get("dir");
    const filename = urlParam.get("file");
    const device = urlParam.get("device");
    const fileData = await prisma.file.findUnique({
      where: {
        username_device_directory_filename: {
          username,
          device,
          directory,
          filename,
        },
      },
    });

    const { salt, iv, size } = fileData;

    totalSize += parseInt(size);

    req.files.push({
      key: `${username}/${uuid}`,
      filename,
      salt,
      iv,
      relativePath: "",
    });
  }
  req.totalSize = totalSize;
  console.log(req.totalSize);
  next();
};

router.get(
  "/",
  verifyToken,
  getFilesFoldersFromDownloadID,
  extractFilesInforFromDB,
  async (req, res) => {
    try {
      const username = req.user.Username;
      const { enc } = await prismaUser.user.findUnique({
        where: { username },
        select: { enc: true },
      });
      const worker = new Worker("../backend/controllers/DownloadWorker.js");
      const channel = new MessageChannel();
      const readable = new Readable({
        read() {},
      });
      worker.postMessage({ files: req.files, enc: enc, port: channel.port1 }, [
        channel.port1,
      ]);

      channel.port2.on("message", ({ mode, chunk }) => {
        if (mode === "chunk") {
          readable.push(chunk);
        } else {
          readable.push(null);
        }
      });
      console.log("worker end");

      res.set("Content-Disposition", `attachment; filename="QDrive.zip"`);
      readable.pipe(res);
      channel.port2.on("error", (err) => {
        console.error(err);
      });
      worker.on("error", (err) => {
        console.error(err);
      });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }
);

export { router as downloadItems };
