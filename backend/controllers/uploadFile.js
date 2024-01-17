import multer from "multer";
import express from "express";
import path from "path";
import formidable from "formidable";
import dotenv from "dotenv";
await dotenv.config();
const router = express.Router();
import { Upload } from "@aws-sdk/lib-storage";
import { pool, s3Client } from "../server.js";
import { PassThrough } from "stream";
import { v4 as uuidv4 } from "uuid";
import { socketIO as io } from "../server.js";
import { randomFill, createHash } from "crypto";
import { encryptFile } from "../utils/encrypt.js";

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

const multerInstance = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const device = req.headers.devicename;
      const filePath = req.headers.dir;
      // const userName = req.headers.username;
      const userName = req.user.Username;

      return cb(null, path.join(`${root}/${userName}`, "/"));

      // return cb(null, path.join(`${root}/${userName}`, device, filePath));
    },
    filename: (req, file, cb) => {
      const fileStat = JSON.parse(req.headers.filestat);
      let filename = req.headers.filename;
      if (fileStat.modified === true) {
        // filename = `${filename}$$$${fileStat.checksum}$$$NA`;
        req.headers.uuid_new = req.headers.uuid;
        req.headers.uuid = fileStat.uuid;
        return cb(null, req.headers.uuid_new);
      }
      return cb(null, req.headers.uuid);

      // return cb(null, filename);
    },
  }),
});

const parseFile = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cipher = await encryptFile(
        req.password,
        req.salt,
        req.iv,
        "aes-256-cbc"
      );
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
            console.log(error);
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
              console.log(err);
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
          console.log(err);
          reject(err);
          return;
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

const uploadFile = async (req, res, next) => {
  const salt = await generateRandomBytes(32);
  const iv = await generateRandomBytes(16);
  const fileStat = JSON.parse(req.headers.filestat);
  req.headers.uuid = uuidv4();
  const size = fileStat.size;
  const userName = req.user.Username;
  req.socket_main_id = fileStat.socket_main_id;
  const id = fileStat.id;
  const name = fileStat.name;
  let key;
  if (fileStat.modified === true) {
    req.headers.uuid_new = req.headers.uuid;
    req.headers.uuid = fileStat.uuid;
    key = `${userName}/${req.headers.uuid_new}`;
  } else {
    key = `${userName}/${req.headers.uuid}`;
  }
  try {
    req.salt = salt;
    req.iv = iv;
    req.key = key;
    req.size = size;
    req.id = id;
    req.name = name;
    const encQuery = `SELECT enc FROM customers.users WHERE username = ?`;
    const userCon = await pool["customers"].getConnection();
    const [rows, fields] = await userCon.execute(encQuery, [userName]);
    req.password = rows[0].enc;
    req.enc_hash = await parseFile(req);
    req.salt = arrayBufferToHex(salt);
    req.iv = arrayBufferToHex(iv);
    if (userCon) {
      userCon.release();
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export { uploadFile };
