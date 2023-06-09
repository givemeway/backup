import express from "express";
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

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

try {
  const dataDBConnection = createConnection("data");
  const usersDBConnection = createConnection("customers");

  app.use("/app/login", sqlConn(usersDBConnection), login);
  app.use("/app/receiveFiles", sqlConn(dataDBConnection), receiveFiles);
  app.use("/app/test", test);
  app.use("/app/signup", sqlConn(usersDBConnection), signup);
  app.use("/app/sendFileInfo", sqlConn(dataDBConnection), fetchFilesInfo);
  app.use(
    "/app/getFilesSubfolders",
    sqlConn(dataDBConnection),
    getFilesSubfolders
  );
  app.use(
    "/app/getCurrentDirFiles",
    sqlConn(dataDBConnection),
    getCurrentDirFiles
  );
  app.use("/app/downloadFiles", sqlConn(dataDBConnection), downloadFiles);
} catch (err) {
  console.log(err);
}

app.listen(PORT, (error) => {
  if (error) {
    throw Error(error);
  } else {
    console.log(`Listening on localhost:${PORT}`);
  }
});
