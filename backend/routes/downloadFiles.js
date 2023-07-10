import express from "express";
const router = express.Router();
import { createConnection } from "../controllers/createConnection.js";
import { sqlConn } from "../controllers/sql_conn.js";
import { verifyToken } from "../auth/auth.js";
import { fetchFilesData } from "../controllers/fetchFiles.js";

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization,devicename,filename,dir,username,filestat"
  );
  next();
});

router.post("/", (req, res) => {
  console.log("testing");
});

const downloadFiles = () => {};

export { router as downloadFiles };
