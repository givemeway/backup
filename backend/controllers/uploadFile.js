import multer from "multer";
import express from "express";
import path from "path";
import formidable from "formidable";
import dotenv from "dotenv";
await dotenv.config();
const router = express.Router();
import { Upload } from "@aws-sdk/lib-storage";
import { s3Client } from "../server.js";
import { PassThrough } from "stream";
import { v4 as uuidv4 } from "uuid";
import { socketIO as io } from "../server.js";
import { randomFill, createHash } from "crypto";
import { encryptFile } from "../utils/encrypt.js";
import mime from "mime-types";
import { prismaUser } from "../config/prismaDBConfig.js";

const root = process.env.VARIABLE;
const BUCKET = process.env.BUCKET;

const SIZES = [32, 64, 128, 256, 480, 640, 900];

const arrayBufferToHex = (buffer) => {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const generateRandomBytes = (len) => {
  return new Promise((resolve, reject) => {
    try {
      let buffer = Buffer.alloc(len);
      randomFill(buffer, (err, buf) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(buf);
      });
      return buffer;
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const parseFile = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cipher = await encryptFile(
        req.password,
        req.salt,
        req.iv,
        "aes-256-cbc"
      );
      console.log(req.ext);
      const data = {};
      data.id = req.headers.uuid;
      data.username = req.user.Username;
      const hash = createHash("sha256");
      let encryptedHash;
      const options = {
        maxFileSize: 2000 * 1024 * 1024,
        fileWriteStreamHandler: (file) => {
          console.log("called!");
          const read = new PassThrough();
          const write = new PassThrough();
          read.pipe(cipher).pipe(write);
          const upload = new Upload({
            client: s3Client,
            params: {
              Bucket: BUCKET,
              Key: req.key,
              Body: write,
            },
            partSize: 5 * 1024 * 1024,
            queueSize: 10,
          });

          write.on("data", (data) => hash.update(data));
          write.on("end", () => {
            encryptedHash = hash.digest("hex");
          });

          upload.on("error", (error) => {
            console.error(error);
            reject(error);
          });
          upload.on("uploaded", (details) => {
            const progress = parseInt((details.loaded / req.size) * 100);
            const payload = {
              processed: progress,
              total: req.size,
              uploaded: details.loaded,
              id: req.id,
              name: req.name,
            };
            io.to(req.socket_main_id).emit("uploadProgress", { payload });
          });
          upload
            .done()
            .then((response) => {
              const payload = {
                done: "success",
                data: response,
                id: req.id,
                name: req.name,
              };
              io.to(req.socket_main_id).emit("finalizing", { payload });
              resolve(encryptedHash);
            })
            .catch((err) => {
              console.error(err);
              const payload = {
                done: "failure",
                data: err,
                id: req.id,
                name: req.name,
              };
              io.to(req.socket_main_id).emit("error", { payload });
            });
          return read;
        },
      };

      const form = formidable(options);
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }
      });
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const uploadFile = async (req, res, next) => {
  const salt = await generateRandomBytes(32);
  const iv = await generateRandomBytes(16);
  const fileStat = JSON.parse(req.headers.filestat);
  req.uuid = uuidv4();
  const size = fileStat.size;
  const userName = req.user.Username;
  req.socket_main_id = fileStat.socket_main_id;
  const id = fileStat.id;
  const name = fileStat.name;
  let key;
  if (fileStat.modified === true) {
    req.uuid_new = req.uuid;
    req.uuid = fileStat.uuid;
    key = `${userName}/${req.uuid_new}`;
  } else {
    key = `${userName}/${req.uuid}`;
  }
  try {
    req.salt = salt;
    req.iv = iv;
    req.key = key;
    req.size = size;
    req.id = id;
    req.name = name;
    req.ext = mime.lookup(name);
    const { enc } = await prismaUser.user.findUnique({
      where: { username: userName },
      select: {
        enc: true,
      },
    });
    req.password = enc;
    req.enc_hash = await parseFile(req);
    req.salt = arrayBufferToHex(salt);
    req.iv = arrayBufferToHex(iv);

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: err });
  }
};

export { uploadFile };
