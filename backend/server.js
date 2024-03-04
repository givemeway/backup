import express from "express";
import fs from "node:fs";
import https from "node:https";
import http from "node:http";
import cookieParser from "cookie-parser";
import bodyparser from "body-parser";
import { login } from "./routes/login.js";
import { receiveFiles } from "./routes/receiveFiles.js";
import { signup } from "./routes/signup.js";
import { getFilesSubfolders } from "./routes/getFilesSubfolders.js";
import { subFolders } from "./routes/getSubFolders.js";
import { getCurrentDirFiles } from "./routes/getCurrentDirFiles.js";
import { downloadFile } from "./routes/downloadFile.js";
import { createDownloadURL } from "./routes/createDownloadURL.js";
import { searchFiles } from "./routes/searchItems.js";
import { csrftoken } from "./routes/getCSRFToken.js";
import { deleteItems } from "./routes/deleteItems.js";
import { downloadItems } from "./routes/DownloadItems.js";
import { moveItems } from "./routes/MoveItems.js";
import { copyItems } from "./routes/CopyItems.js";
import { createShare } from "./routes/createShareLink.js";
import { renameItem } from "./routes/RenameItem.js";
import { getTrash } from "./routes/getTrash.js";
import { getTrashBatch } from "./routes/getTrashBatch.js";
import { getTrashTotal } from "./routes/getTrashTotal.js";
import { restoreTrashItems } from "./routes/RestoreItemsFromTrash.js";
import { emptyTrash } from "./routes/EmptyTrash.js";
import { getSharedLinks } from "./routes/getSharedItems.js";
import { validateShare } from "./routes/ValidateShare.js";
import DBConfig from "./config/DBConfig.js";
import mysql from "mysql2/promise";
import { getConnection } from "./controllers/getConnection.js";
import { validateUsername } from "./routes/ValidateUserName.js";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

import { Server } from "socket.io";

import mongoose from "mongoose";
import dotenv from "dotenv";
await dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();

import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { share } from "./routes/share.js";
import { moveItemsV2 } from "./routes/MoveItemsV2.js";
import { deleteTrashItems } from "./routes/DeleteTrashItems.js";
import { origin } from "./config/config.js";
import { createFolder } from "./routes/createFolder.js";
import { getFileVersion } from "./routes/getFileVersion.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.log(err);
  }
})();

mongoose.Promise = global.Promise;

app.use(bodyparser.json({ limit: "50mb" }));
app.use(bodyparser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// import csrf from "csurf";
// router.use(csrf({ cookie: true }));

const createPoolConnection = async (config) => {
  return mysql.createPool(config);
};

const pool = {};
try {
  for (const [key, value] of Object.entries(DBConfig)) {
    pool[key] = await createPoolConnection(value);
  }
} catch (err) {
  console.error(err);
}
// https://stackoverflow.com/questions/65728325/how-to-track-upload-progress-to-s3-using-aws-sdk-v3-for-browser-javascript
let s3Client;
try {
  s3Client = new S3Client({
    region: process.env.REGION,
    credentials: {
      secretAccessKey: process.env.SECRETKEY,
      accessKeyId: process.env.ACCESSKEY,
    },
  });
} catch (err) {
  console.log(err);
}

try {
  app.use("/app/login", getConnection("customers"), login);
  app.use("/app/receiveFiles", receiveFiles);
  app.use("/app/signup", getConnection("customers"), signup);
  app.use("/app/browseFolder", getConnection("files"), getFilesSubfolders);
  app.use("/app/getSubFolders", getConnection("directories"), subFolders);
  app.use(
    "/app/getCurrentDirFiles",
    getConnection("files"),
    getCurrentDirFiles
  );
  app.use("/app/downloadFile", getConnection("files"), downloadFile);
  app.use("/app/search", getConnection("files"), searchFiles);
  app.use("/app/csrftoken", csrftoken);
  app.use("/app/delete", getConnection("files"), deleteItems);
  app.use("/app/downloadItems", getConnection("files"), downloadItems);
  app.use("/app/createShare", getConnection("customers"), createShare);
  app.use("/app/sh", getConnection("files"), share);
  app.use("/app/sh/validate", getConnection("files"), validateShare);
  app.use("/app/moveItems", getConnection("files"), moveItems);
  app.use("/app/v2/moveItems", getConnection("files"), moveItemsV2);
  app.use("/app/copyItems", getConnection("files"), copyItems);
  app.use("/app/renameItem", getConnection("files"), renameItem);
  app.use("/app/trash", getConnection("deleted_files"), getTrash);
  app.use("/app/trashBatch", getConnection("deleted_files"), getTrashBatch);
  app.use("/app/trashTotal", getConnection("deleted_files"), getTrashTotal);
  app.use("/app/restoreTrashItems", restoreTrashItems);
  app.use("/app/get_download_zip", createDownloadURL);
  app.use("/app/getSharedLinks", getSharedLinks);
  app.use("/app/validateusername", validateUsername);
  app.use("/app/emptyTrash", emptyTrash);
  app.use("/app/deleteTrashItems", deleteTrashItems);
  app.use("/app/createFolder", createFolder);
  app.use("/app/getFileVersion", getFileVersion);
} catch (err) {
  console.log(err);
}

app.use("/", express.static("../frontend"));

app.get("/login", (req, res) => {
  const loginFilePath = path.resolve(__dirname, "../frontend", "index.html");
  res.sendFile(loginFilePath);
});

app.get("/upload", (req, res) => {
  const loginFilePath = path.resolve(__dirname, "../frontend", "upload.html");
  res.sendFile(loginFilePath);
});

// app.listen(PORT, (error) => {
//   if (error) {
//     throw Error(error);
//   } else {
//     console.log(`Listening on localhost:${PORT}`);
//   }
// });

const options = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem"),
};

// const server = https.createServer(options, app);
const server = http.createServer(app);

server.listen(PORT, (err) => {
  if (err) {
    throw Error(err);
  } else {
    console.log(`Listening on localhost:${PORT} over HTTP`);
  }
});

const opts = { cors: { origin: origin } };

const socketIO = new Server(server, opts);

socketIO.on("connection", (socket) => {
  console.log("Connected to Client: ", socket.id);
  socket.emit("connected", { socketID: socket.id });
  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });
});

export { pool, s3Client, socketIO };
