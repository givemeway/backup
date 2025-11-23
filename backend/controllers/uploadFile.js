import formidable from "formidable";
import dotenv from "dotenv";
dotenv.config();

import { Upload } from "@aws-sdk/lib-storage";
import { s3Client } from "../server.js";
import { PassThrough } from "stream";
import { v4 as uuidv4 } from "uuid";
import { imageTypes } from "../utils/utils.js";
// import { socketIO as io } from "../server.js";
import { randomFill, createHash } from "crypto";
import { encryptFile } from "../utils/encrypt.js";
import mime from "mime-types";
import mimetype from "mime-types";
import { prismaUser } from "../config/prismaDBConfig.js";
import axios from "axios";
import { insert_file_version } from "./insert_file_version.js";
import { insert_file_and_directory } from "./insert_file_directory.js";
import { initiKafkaProducer } from "../utils/kafka.js";
import { deleteS3Object } from "./delete_trash_items.js";
const headers = {
  headers: { "Content-Type": "application/json" },
};
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

const parseFile = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cipher = await encryptFile(
        req.password,
        req.salt,
        req.iv,
        "aes-256-cbc"
      );
      const data = {};
      data.id = req.headers.uuid;
      data.username = req.user.Username;
      const hash = createHash("sha256");
      let encryptedHash;
      const options = {
        maxFileSize: 2000 * 1024 * 1024,
        fileWriteStreamHandler: (file) => {
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
          upload.on("uploaded", async (details) => {
            const progress = parseInt((details.loaded / req.size) * 100);
            const payload = {
              processed: progress,
              total: req.size,
              uploaded: details.loaded,
              id: req.id,
              name: req.name,
              status: "uploadProgress",
              socket_main_id: req.socket_main_id,
            };
            // io.to(req.socket_main_id).emit("uploadProgress", { payload });
            console.log("process.env.WEBHOOK_URL IS ", process.env.WEBHOOK_URL);
            await axios.post(`${process.env.WEBHOOK_URL}`, payload, headers);
          });
          upload
            .done()
            .then(async (response) => {
              const payload = {
                done: "success",
                data: response,
                id: req.id,
                name: req.name,
                status: "finalizing",
                socket_main_id: req.socket_main_id,
              };
              // io.to(req.socket_main_id).emit("finalizing", { payload });
              await axios.post(`${process.env.WEBHOOK_URL}`, payload, headers);

              resolve(encryptedHash);
            })
            .catch(async (err) => {
              console.error(err);
              const payload = {
                done: "failure",
                data: err,
                id: req.id,
                name: req.name,
                status: "error",
                socket_main_id: req.socket_main_id,
              };
              // io.to(req.socket_main_id).emit("error", { payload });
              await axios.post(`${process.env.WEBHOOK_URL}`, payload, headers);
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
    return next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, place: "uploadfile", msg: err });
  }
};

const getFileStreamOptions = (cipher, key, cb) =>
  new Promise(async (resolve, reject) => {
    try {
      let encryptedHash;
      const hash = createHash("sha256");
      const options = {
        maxFileSize: 2000 * 1024 * 1024,
        fileWriteStreamHandler: () => {
          const read = new PassThrough();
          const write = new PassThrough();
          read.pipe(cipher).pipe(write);
          const upload = new Upload({
            client: s3Client,
            params: {
              Bucket: BUCKET,
              Key: key,
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

          upload
            .done()
            .then(() =>
              cb(encryptedHash)
            )
            .catch(async (err) => {
              console.error(err);
              reject(err)
            });
          return read;
        },
      };
      resolve(options);
    } catch (err) {
      reject(err)
    }


  })
const parseSyncFile = (req) =>
  new Promise(async (resolve, reject) => {
    try {
      const cipher = await encryptFile(
        req.password,
        req.salt,
        req.iv,
        "aes-256-cbc"
      );
      const options = await getFileStreamOptions(cipher, req.key, resolve);
      const form = formidable(options);
      await form.parse(req)
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
const sync_update_file_directory_DB = async (req, res, next) => {
  const enc_file_checksum = req.enc_hash;
  const fileStat = JSON.parse(req.headers.filestat);
  let height = 0;
  let width = 0;
  if (fileStat.type.split("/")[0] === "image") {
    height = fileStat.height;
    width = fileStat.width;
  }
  const last_modified = new Date(fileStat.mtime);
  const { username, device, filename, type, directory, checksum } = fileStat
  let version;
  let origin;
  let uuid;
  let modified = false;
  if (fileStat?.version && fileStat?.isModified) {
    version = fileStat.version;
    origin = req.uuid;
    uuid = req.uuid_new;
    modified = true;
  } else {
    version = 1;
    origin = req.uuid;
    uuid = req.uuid;
  }
  const size = BigInt(`${fileStat.size}`);
  const salt = req.salt;
  const iv = req.iv;
  req.uuid = uuid;
  req.username = username;
  let path;
  if (directory === "/" && device === "/") {
    path = "/";
  } else if (device !== "/" && directory === "/") {
    path = "/" + device;
  } else {
    path = "/" + device + "/" + directory;
  }
  req.filePath = path;

  const insertData = {
    username,
    device,
    directory,
    uuid,
    origin,
    filename,
    last_modified: last_modified.toISOString(),
    hashvalue: checksum,
    enc_hashvalue: enc_file_checksum,
    versions: version,
    size,
    salt,
    iv,
    type: type,
    height:
      fileStat.type.split("/")[0] === "image" ? parseInt(fileStat.height) : 0,
    width:
      fileStat.type.split("/")[0] === "image" ? parseInt(fileStat.width) : 0,
  };

  try {
    if (modified) {
      const updateData = {
        last_modified: last_modified.toISOString(),
        versions: version,
        size,
        salt,
        iv,
        hashvalue: checksum,
        origin,
        uuid,
        enc_hashvalue: enc_file_checksum,
        type: type,
        height:
          fileStat.type.split("/")[0] === "image" ? parseInt(fileStat.height) : 0,
        width:
          fileStat.type.split("/")[0] === "image" ? parseInt(fileStat.width) : 0,
      };
      const data = {
        username,
        filename,
        device,
        directory,
        origin,
        insertData,
        updateData,
      };
      await insert_file_version(data);
    } else {
      await insert_file_and_directory(path, insertData);
    }
    return next();
  } catch (err) {
    console.log("*********************************************************")
    console.log("Error: ", err);
    console.log("*********************************************************")
    await deleteS3Object(username, uuid);
    return res.status(500).json({ [filename]: false, msg: "Something Went Wrong. Try again later" });
  }
};
const syncUpFile = async (req, res, next) => {
  const salt = await generateRandomBytes(32);
  const iv = await generateRandomBytes(16);
  const fileStat = JSON.parse(req.headers.filestat);
  req.uuid = uuidv4();
  const size = fileStat.size;
  const name = fileStat.filename;
  const userName = fileStat.username;
  let key;
  if (fileStat.isModified === true) {
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
    req.name = name;
    //req.ext = mime.lookup(name);
    const { enc } = await prismaUser.user.findUnique({
      where: { username: userName },
      select: {
        enc: true,
      },
    });
    req.password = enc;
    req.enc_hash = await parseSyncFile(req);
    req.salt = arrayBufferToHex(salt);
    req.iv = arrayBufferToHex(iv);
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ [name]: false, msg: err });
  }
}
const sync_triggerImageProcessingMS = async (req, res) => {
  try {
    console.log("********************Entering the final function**************************")
    const mime = mimetype.lookup(req.name);
    if (typeof mime === "string") {
      const ext = mime.split("/")[1].toUpperCase();
      if (imageTypes.hasOwnProperty(ext)) {
        let data = {};
        data.id = req.uuid;
        data.username = req.username;
        data.filename = req.name;
        console.log("Image process triggered: ", data.filename);
        await initiKafkaProducer(data);
        return res.status(200).json(`file ${req.name} received`);
      }
    }
    console.log(`Files received: ${req.name}`)
    res.status(200).json({ [req.name]: true, msg: `file ${req.name} received` });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ [req.name]: false, msg: `file ${req.name} failed` });
  }
};


export { uploadFile, syncUpFile, sync_update_file_directory_DB, sync_triggerImageProcessingMS };
