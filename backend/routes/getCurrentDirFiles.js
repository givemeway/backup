import express from "express";
const router = express.Router();
import { verifyToken } from "../auth/auth.js";
import { sqlExecute } from "../controllers/sql_execute.js";

const getFilesInDirectory = async (req, res, next) => {
  const currentdirectory = req.headers.currentdirectory;
  const username = req.headers.username;
  const devicename = req.headers.devicename;
  const start = parseInt(req.headers.start);
  const end = parseInt(req.headers.end);
  req.headers.data = [];
  if (currentdirectory === "/") {
    const filesInOtherDirectories = `SELECT 
                                  directory,filename,hashvalue,last_modified
                                  FROM  
                                  data.files 
                                  where 
                                  username = '${username}'
                                  AND
                                  device = '${devicename}'
                                  limit ${start},${end};`;
    req.headers.query = filesInOtherDirectories;
    await sqlExecute(req, res, next);
    req.headers.data.push(...req.headers.queryStatus);
  } else {
    const regex_other_files = `^${currentdirectory}(/[^/]+)+$`;
    const filesInOtherDirectories = `SELECT 
                                  directory,filename,hashvalue,last_modified
                                  FROM  
                                  data.files 
                                  where 
                                  username = '${username}'
                                  AND
                                  device = '${devicename}'
                                  AND
                                  directory REGEXP '${regex_other_files}'
                                  limit ${start},${end};`;

    req.headers.query = filesInOtherDirectories;
    await sqlExecute(req, res, next);
    req.headers.data.push(...req.headers.queryStatus);
    const filesInCurrentDirectory = `SELECT
                                  directory,filename,hashvalue,last_modified
                                  FROM 
                                  data.files 
                                  WHERE 
                                  username = '${username}'
                                  AND 
                                  device = '${devicename}'
                                  AND 
                                  directory = '${currentdirectory}'
                                  limit ${start},${end};`;

    req.headers.query = filesInCurrentDirectory;
    await sqlExecute(req, res, next);
    req.headers.data.push(...req.headers.queryStatus);
  }

  res.status(200).json(req.headers.data);
};

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization,devicename,username,currentdirectory,start,end"
  );
  next();
});

router.post("/", verifyToken, getFilesInDirectory, (req, res) => {
  console.log("response sent");
});

export { router as getCurrentDirFiles };
