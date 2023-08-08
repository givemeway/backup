import express from "express";
import fs from "node:fs";
import https from "node:https";
import cookieParser from "cookie-parser";
import bodyparser from "body-parser";
import { login } from "./routes/login.js";
import { receiveFiles } from "./routes/receiveFiles.js";
import { test } from "./routes/test.js";
import { signup } from "./routes/signup.js";
import { fetchFilesInfo } from "./routes/fetchFilesInfo.js";
import { getFilesSubfolders } from "./routes/getFilesSubfolders.js";
import { getCurrentDirFiles } from "./routes/getCurrentDirFiles.js";
import { downloadFiles } from "./routes/downloadFiles.js";
import { createConnection } from "./controllers/createConnection.js";
import { sqlConn } from "./controllers/sql_conn.js";
import { searchFiles } from "./routes/searchItems.js";
import { csrftoken } from "./routes/getCSRFToken.js";

const PORT = process.env.PORT || 3001;
const app = express();

import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());

// import csrf from "csurf";
// router.use(csrf({ cookie: true }));

try {
  const dataDBConnection = createConnection("data");
  const usersDBConnection = createConnection("customers");
  const cryptoDBConnection = createConnection("cryptoKeys");

  app.use("/app/login", sqlConn(usersDBConnection), login);
  app.use("/app/receiveFiles", sqlConn(dataDBConnection), receiveFiles);
  app.use("/app/test", sqlConn(dataDBConnection), test);
  app.use("/app/signup", sqlConn(usersDBConnection), signup);
  app.use("/app/sendFileInfo", sqlConn(dataDBConnection), fetchFilesInfo);
  app.use("/app/browseFolder", sqlConn(dataDBConnection), getFilesSubfolders);
  app.use(
    "/app/getCurrentDirFiles",
    sqlConn(dataDBConnection),
    getCurrentDirFiles
  );
  app.use("/app/downloadFiles", sqlConn(dataDBConnection), downloadFiles);
  app.use("/app/search", sqlConn(dataDBConnection), searchFiles);
  app.use("/app/csrftoken", csrftoken);
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

https.createServer(options, app).listen(PORT, (err) => {
  if (err) {
    throw Error(err);
  } else {
    console.log(`Listening on localhost:${PORT} over HTTPS`);
  }
});
