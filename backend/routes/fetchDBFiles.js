import express from "express";
import { sqlConn } from "../controllers/sql_conn.js";
import { sqlExecute } from "../controllers/sql_execute.js";
import { verifyToken } from "../auth/auth.js";
import { createConnection } from "../controllers/createConnection.js";
const router = express.Router();

const connection = createConnection("data");

const getFiles = async (req, res, next) => {
  const currentDir = req.headers.currentdirectory;
  const order = req.headers.sortorder;
  const username = req.headers.username;
  const devicename = req.headers.devicename;

  const filesInCurrentDirQuery = `select filename from files 
                                  WHERE 
                                  username = '${username}' 
                                  AND 
                                  device = '${devicename}' 
                                  AND 
                                  directory = '${currentDir}' 
                                  ORDER BY 
                                  filename ${order};`;
  req.headers.query = filesInCurrentDirQuery;
  await sqlExecute(req, res, next);
  req.headers.data = {};
  req.headers.data["files"] = JSON.parse(
    JSON.stringify(req.headers.queryStatus)
  );
  next();
};

const getFolders = async (req, res, next) => {
  const currentDir = req.headers.currentdirectory;
  const order = req.headers.sortorder;
  const username = req.headers.username;
  const devicename = req.headers.devicename;
  let regex = `^\\.?${currentDir}(/[^/]+)$`;
  if (currentDir === "/") {
    regex = `^([^/]+)$`;
  }
  const foldersinCurrentDirQuery = `select DISTINCT directory from files 
                                    WHERE 
                                    username = '${username}' 
                                    AND 
                                    device = '${devicename}' 
                                    AND 
                                    directory REGEXP '${regex}'
                                    ORDER BY 
                                    directory ${order};`;
  req.headers.query = foldersinCurrentDirQuery;
  await sqlExecute(req, res, next);
  // if (req.headers.queryStatus.length == 0) {
  //   regex = `^\\.?${currentDir}(/[^/]+){${i}}$`;
  // }
  req.headers.data["folders"] = JSON.parse(
    JSON.stringify(req.headers.queryStatus)
  );
  res.json(req.headers.data);
};

router.use(sqlConn(connection));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, currentdirectory,sortorder,username,devicename"
  );
  next();
});

router.post("/", verifyToken, getFiles, getFolders, (req, res) => {
  console.log("done");
});

export { router as fetchDBFiles };
