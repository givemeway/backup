import express from "express";
import { createConnection } from "../controllers/createConnection.js";
import { sqlConn } from "../controllers/sql_conn.js";
import { verifyToken } from "../auth/auth.js";
import { fetchFilesData } from "../controllers/fetchFiles.js";
const router = express.Router();

const connection = createConnection("data");

router.use(sqlConn(connection));

router.post("/", verifyToken, fetchFilesData, (req, res) => {
  res.json(req.headers.queryStatus);
  res.end();
});

export { router as fetchFilesInfo };
