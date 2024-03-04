import express from "express";
const router = express.Router();
import { origin } from "../config/config.js";
import { verifyToken } from "../auth/auth.js";
import { decryptFile } from "../utils/decrypt.js";
import dotenv from "dotenv";
dotenv.config();
import csrf from "csurf";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../server.js";
import { prisma, prismaUser } from "../config/prismaDBConfig.js";

const root = process.env.VARIABLE;
const BUCKET = process.env.BUCKET;

const file_format = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  csv: "text/csv",
  svg: "image/svg+xml",
  txt: "text/plain",
  log: "text/plain",
  zip: "application/zip",
  tar: "application/x-tar",
  "7z": "application/x-7z-compressed",
  rar: "application/vnd.rar",
  js: "text/javascript",
  mjs: "text/javascript",
  py: "application/octet-stream",
  cpp: "application/octet-stream",
  java: "application/octet-stream",
  html: "text/html",
  htm: "text/html",
  c: "application/octet-stream",
  css: "application/octet-stream",
  json: "application/octet-stream",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  tiff: "image/tiff",
  tif: "image/tiff",
  gif: "image/gif",
};

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
    const { file, uuid, db, dir, device } = req.query;
    console.log(file, uuid, db, dir, device);
    const Key = `${username}/${uuid}`;
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key,
    });

    const userFound = await prismaUser.user.findUnique({
      where: { username },
      select: {
        enc: true,
      },
    });

    if (userFound === null) {
      return res.status(404).json({ success: false, msg: "User not Found" });
    }

    let fileFound = null;
    if (db === "versions") {
      fileFound = await prisma.fileVersion.findUnique({
        where: {
          username_device_directory_filename_uuid: {
            username,
            directory: dir,
            device,
            uuid,
            filename: file,
          },
        },
        select: {
          salt: true,
          iv: true,
          size: true,
        },
      });
    } else {
      fileFound = await prisma.file.findUnique({
        where: {
          username_device_directory_filename: {
            username,
            device,
            directory: dir,
            filename: file,
          },
        },
        select: {
          salt: true,
          iv: true,
          size: true,
        },
      });
    }

    if (fileFound !== null) {
      const data = await s3Client.send(command);
      const decryptStream = await decryptFile(
        data.Body,
        fileFound.salt,
        fileFound.iv,
        userFound.enc
      );
      res.set("Content-Length", fileFound.size);
      res.set("Content-Disposition", `attachment; filename="${file}"`);
      res.set("Cache-Control", "private, max-age=31536000, no-transform");
      const mimetype = file.split(".")[1];
      if (file_format.hasOwnProperty(mimetype)) {
        res.set("Content-Type", file_format[mimetype]);
      }
      decryptStream.pipe(res);
      decryptStream.on("end", () => {
        res.end();
      });
    } else {
      return res.status(404).json({ success: false, msg: "File not Found" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, msg: err });
  }
});

export { router as downloadFile };
