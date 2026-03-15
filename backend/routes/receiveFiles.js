import express from "express";
import { verifyToken } from "../auth/auth.js";
import { uploadFile } from "../controllers/uploadFile.js";
import axios from "axios";
// import { socketIO as io } from "../server.js";
import { initiKafkaProducer } from "../utils/kafka.js";
import mimetype from "mime-types";
import { imageTypes } from "../utils/utils.js";
import { insert_file_and_directory } from "../controllers/insert_file_directory.js";
import { insert_file_version } from "../controllers/insert_file_version.js";
import { deleteS3Object } from "../controllers/delete_trash_items.js";
const router = express.Router();

const headers = {
  headers: { "Content-Type": "application/json" },
};

const update_file_directory_DB = async (req, res, next) => {
  const username = req.user.Username;
  let filename = req.headers.filename;
  const device = req.headers.devicename;
  const enc_file_checksum = req.enc_hash;
  const directory = req.headers.dir;
  const fileStat = JSON.parse(req.headers.filestat);
  let height = 0;
  let width = 0;
  if (fileStat.type.split("/")[0] === "image") {
    height = fileStat?.height ? parseInt(fileStat.height) : 0;
    width = fileStat?.width ? parseInt(fileStat.width) : 0;
  }
  const last_modified = new Date(fileStat.mtime);
  const checksum = fileStat.checksum;
  let version;
  let origin;
  let uuid;
  let modified = false;
  if (fileStat?.version && fileStat.modified) {
    version = fileStat.version;
    origin = req.uuid;
    uuid = req.uuid_new;
    modified = true;
  } else {
    version = 1;
    origin = req.uuid;
    uuid = req.uuid;
  }
  console.log({ version, origin, uuid, modified });
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
    last_updated: new Date().toISOString(),
    hashvalue: checksum,
    enc_hashvalue: enc_file_checksum,
    versions: version,
    size,
    salt,
    iv,
    type: fileStat.type,
    height: height,
    width: width
  };

  try {
    if (modified) {
      const updateData = {
        last_modified: last_modified.toISOString(),
        last_updated: new Date().toISOString(),
        versions: version,
        size,
        salt,
        iv,
        hashvalue: checksum,
        origin,
        uuid,
        enc_hashvalue: enc_file_checksum,
        type: fileStat.type,
        height: height,
        width: width
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
    console.log({ err });
    await deleteS3Object(username, uuid);
    return res.status(500).json("Something Went Wrong. Try again later");
  }
};

const triggerImageProcessingMS = async (req, res) => {
  try {
    const payload = {
      name: req.name,
      id: req.id,
      path: req.filePath,
      status: "done",
      socket_main_id: req.socket_main_id,
    };
    await axios.post(`${process.env.WEBHOOK_URL}`, payload, headers);
    // io.to(req.socket_main_id).emit("done", { payload });
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
        return res.status(200).json(`file ${req.headers.filename} received`);
      }
    }
    res.status(200).json(`file ${req.headers.filename} received`);
  } catch (err) {
    console.log(err);
    return res.status(500).json(`file ${req.headers.filename} received`);
  }
};

router.post(
  "/",
  verifyToken,
  uploadFile,
  update_file_directory_DB,
  triggerImageProcessingMS
);

export { router as receiveFiles };
