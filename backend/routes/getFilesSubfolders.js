import express from "express";
import csrf from "csurf";
import { sqlExecute } from "../controllers/sql_execute.js";
import { verifyToken } from "../auth/auth.js";
import { origin } from "../config/config.js";
const router = express.Router();
router.use(csrf({ cookie: true }));

const getFiles = async (req, res, next) => {
  const currentDir = req.headers.currentdirectory;
  const order = req.headers.sortorder;
  const username = req.headers.username;
  const devicename = req.headers.devicename;

  const filesInCurrentDirQuery = `select filename from files 
                                  WHERE 
                                  username = ?
                                  AND 
                                  device = ?
                                  AND 
                                  directory = ?
                                  ORDER BY 
                                  filename ASC`;
  req.headers.query = filesInCurrentDirQuery;
  req.headers.queryValues = [username, devicename, currentDir];
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
  let regex_2 = ``;
  let path = ``;
  if (devicename === "/") {
    regex_2 = `^\\.?(/[^/]+)$`;
  } else if (currentDir === "/") {
    regex_2 = `^\\.?/${devicename}(/[^/]+)$`;
  } else {
    path = `/${devicename}/${currentDir}`;
    regex_2 = `^\\.?${path}(/[^/]+)$`;
  }

  const foldersQuery = `SELECT 
                        folder,path 
                        FROM data.directories 
                        WHERE username = ?
                        AND
                        path REGEXP ?;`;

  req.headers.query = foldersQuery;
  req.headers.queryValues = [username, regex_2];
  await sqlExecute(req, res, next);

  req.headers.data["folders"] = JSON.parse(
    JSON.stringify(req.headers.queryStatus)
  );
  res.json(req.headers.data);
};

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
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

export { router as getFilesSubfolders };
