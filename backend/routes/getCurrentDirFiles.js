import express from "express";
import csrf from "csurf";
const router = express.Router();
import { verifyToken } from "../auth/auth.js";
import { sqlExecute } from "../controllers/sql_execute.js";
import { origin } from "../config/config.js";
import { getFilesInDirectory } from "../controllers/getFilesInDirectory.js";

router.use(csrf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization,devicename,username,currentdirectory,start,end"
  );
  next();
});

router.post("/", verifyToken, getFilesInDirectory, (req, res) => {
  res.status(200).json(req.headers.data);
  console.log("response sent");
});

export { router as getCurrentDirFiles };
