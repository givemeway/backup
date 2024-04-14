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
import { copyItems } from "./routes/CopyItems.js";
import { createShare } from "./routes/createShareLink.js";
import { renameItem } from "./routes/RenameItem.js";
import { getTrash } from "./routes/getTrash.js";
import { getTrashBatch } from "./routes/getTrashBatch.js";
import { restoreTrashItems } from "./routes/RestoreItemsFromTrash.js";
import { getSharedLinks } from "./routes/getSharedItems.js";
import { getPhotos } from "./routes/getPhotos.js";
import { validateShare } from "./routes/ValidateShare.js";
import { validateUsername } from "./routes/ValidateUserName.js";
import { S3Client } from "@aws-sdk/client-s3";
import { cookieOpts } from "./config/config.js";
import cors from "cors";

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
import { corsOpts, origin } from "./config/config.js";
import { createFolder } from "./routes/createFolder.js";
import { getFileVersion } from "./routes/getFileVersion.js";
import { PhotoPreviewURL } from "./routes/getPhotoPreviewURL.js";
import { verifySession } from "./routes/verifySession.js";
import { Logout } from "./routes/logout.js";
import { DeleteShare } from "./routes/deleteShares.js";

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
app.use(cors(corsOpts));

// https://stackoverflow.com/questions/65728325/how-to-track-upload-progress-to-s3-using-aws-sdk-v3-for-browser-javascript
let s3Client;
try {
  const params = {
    endpoint: process.env.ENDPOINT_E2,
    region: "in-bn",
    credentials: {
      secretAccessKey: process.env.SECRETKEY_E2,
      accessKeyId: process.env.ACCESSKEY_E2,
    },
  };
  s3Client = new S3Client(params);
  console.log("*************** params *********************");
  console.log(params);
  console.log("*************** params *********************");
  console.log(s3Client);
} catch (err) {
  console.error(err);
}

try {
  app.use("/app/user/login", login);
  app.use("/app/receiveFiles", receiveFiles);
  app.use("/app/user/signup", signup);
  app.use("/app/browseFolder", getFilesSubfolders);
  app.use("/app/getSubFolders", subFolders);
  app.use("/app/getCurrentDirFiles", getCurrentDirFiles);
  app.use("/app/downloadFile", downloadFile);
  app.use("/app/search", searchFiles);
  app.use("/app/csrftoken", csrftoken);
  app.use("/app/delete", deleteItems);
  app.use("/app/downloadItems", downloadItems);
  app.use("/app/createShare", createShare);
  app.use("/app/sh", share);
  app.use("/app/sh/validate", validateShare);
  app.use("/app/v2/moveItems", moveItemsV2);
  app.use("/app/copyItems", copyItems);
  app.use("/app/renameItem", renameItem);
  app.use("/app/trash", getTrash);
  app.use("/app/trashBatch", getTrashBatch);
  app.use("/app/restoreTrashItems", restoreTrashItems);
  app.use("/app/get_download_zip", createDownloadURL);
  app.use("/app/sh/getSharedLinks", getSharedLinks);
  app.use("/app/sh/deleteShare", DeleteShare);
  app.use("/app/user/validateusername", validateUsername);
  app.use("/app/deleteTrashItems", deleteTrashItems);
  app.use("/app/createFolder", createFolder);
  app.use("/app/getFileVersion", getFileVersion);
  app.use("/app/getPhotos", getPhotos);
  app.use("/app/photopreview", PhotoPreviewURL);
  app.use("/app/user/verifySession", verifySession);
  app.use("/app/user/logout", Logout);
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

export { s3Client, socketIO };
