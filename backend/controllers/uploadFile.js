import multer from "multer";
import express from "express";
import path from "path";
import formidable from "formidable";
import dotenv from "dotenv";
await dotenv.config();
const router = express.Router();
import Busboy from "busboy";
import fs from "node:fs";
import { Upload } from "@aws-sdk/lib-storage";
import { pool, s3Client } from "../server.js";
import { PassThrough, Readable, Transform } from "stream";
import { v4 as uuidv4 } from "uuid";
import { io } from "../server.js";
import { randomFill } from "crypto";
import { encryptFile } from "../utils/encrypt.js";
import { hexToBuffer } from "../utils/utils.js";
const root = process.env.VARIABLE;
const BUCKET = process.env.BUCKET;

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

const fileWriteStreamHandler = async (file) => {
  const [Key, password, salt, iv] = file.newFilename.split(";");
  const cipher = await encryptFile(
    password,
    hexToBuffer(salt),
    hexToBuffer(iv),
    "aes-256-cbc"
  );
  const read = new PassThrough();
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: BUCKET,
      Key,
      Body: read.pipe(cipher),
    },
    partSize: 5 * 1024 * 1024,
    queueSize: 10,
  });

  upload.on("httpUploadProgress", (progress) => {
    console.log("progress==>", progress);
  });
  upload.on("error", (error) => {
    console.log(error);
    reject(error);
  });
  upload.on("uploaded", (details) => {
    const progress = parseInt((details.loaded / size) * 100);
    io.emit("uploadProgress", {
      processed: progress,
      total: size,
      uploaded: details.loaded,
    });
  });
  upload
    .done()
    .then((response) => {
      io.emit("done", { done: "success", data: response });
    })
    .catch((err) => {
      console.log(err);
      io.emit("error", { done: "failure", data: err });
    });
  return read;
};

// https://www.freecodecamp.org/news/how-to-upload-files-to-aws-s3-with-node/

const parseFile = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cipher = await encryptFile(
        req.password,
        req.salt,
        req.iv,
        "aes-256-cbc"
      );
      const options = {
        maxFileSize: 2000 * 1024 * 1024,
        fileWriteStreamHandler: (file) => {
          console.log("called!");
          const read = new PassThrough();
          const upload = new Upload({
            client: s3Client,
            params: {
              Bucket: BUCKET,
              Key: req.key,
              Body: read.pipe(cipher),
            },
            partSize: 5 * 1024 * 1024,
            queueSize: 10,
          });

          upload.on("httpUploadProgress", (progress) => {
            console.log("progress==>", progress);
          });
          upload.on("error", (error) => {
            console.log(error);
            reject(error);
          });
          upload.on("uploaded", (details) => {
            const progress = parseInt((details.loaded / details.total) * 100);
            io.emit("uploadProgress", {
              processed: progress,
              total: details.total,
              uploaded: details.loaded,
            });
          });
          upload
            .done()
            .then((response) => {
              io.emit("done", { done: "success", data: response });
            })
            .catch((err) => {
              console.log(err);
              io.emit("error", { done: "failure", data: err });
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
        } else {
          resolve();
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
  console.time("upload");
  io.emit("uploadStart", { start: "begin" });
  const fileStat = JSON.parse(req.headers.filestat);
  req.headers.uuid = uuidv4();
  const size = fileStat.size;
  const userName = req.user.Username;
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
    const encQuery = `SELECT enc FROM customers.users WHERE username = ?`;
    const userCon = await pool["customers"].getConnection();
    const [rows, fields] = await userCon.execute(encQuery, [userName]);
    req.password = rows[0].enc;
    await parseFile(req);
    req.salt = arrayBufferToHex(salt);
    req.iv = arrayBufferToHex(iv);
    console.timeEnd("upload");
    if (userCon) {
      userCon.release();
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

// const uploadFile = (req, res, next) => {
//   const upload = multerInstance.single("file");

//   upload(req, res, (error) => {
//     if (error instanceof multer.MulterError) {
//       console.log(error, "Multer error");
//       res.status(500).json(error);
//       res.end();
//     } else if (error) {
//       console.error(error);
//       res.status(500).json(error);
//       res.end();
//     } else {
//       next();
//     }
//     // console.log(req.file);
//   });
// };

// const uploadFile = (req, res, next) => {
//   const device = req.headers.devicename;
//   const fileMode = req.headers.filemode;
//   const totalChunks = req.headers.totalchunks;
//   const currentChunk = req.headers.currentchunk;
//   const filePath = req.headers.dir;
//   const userName = req.headers.username;
//   const abspath = path.join(`${root}/${userName}`, device, filePath);
//   const fileStat = JSON.parse(req.headers.filestat);
//   let fileName = req.headers.filename;
//   if (fileStat.modified === true) {
//     fileName = `${fileName}$$$${fileStat.checksum}$$$NA`;
//   }
//   const createWriteStream = () => {
//     const fileStream = fs.createWriteStream(`${abspath}/${fileName}`, {
//       flags: "a",
//     });
//     req.pipe(fileStream);

//     fileStream.on("finish", () => {
//       if (totalChunks === currentChunk) {
//         next();
//       } else {
//         res.status(200).send({
//           success: true,
//           desc: `chunk ${currentChunk} received`,
//           msg: "success",
//         });
//       }
//     });

//     fileStream.on("error", (err) => {
//       res.status(500).json({
//         success: false,
//         desc: `chunk ${currentChunk} failed`,
//         msg: err,
//       });
//       res.end();
//     });
//   };

//   if (fileMode === "w") {
//     fs.access(`${abspath}/${fileName}`, (err) => {
//       if (err) {
//         createWriteStream();
//       } else {
//         res
//           .status(500)
//           .json("A file name with the same directory name already exists");
//         res.end();
//       }
//     });
//   } else {
//     createWriteStream();
//   }
// };

export { uploadFile };
