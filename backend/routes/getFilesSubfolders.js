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
  const [start, end] = [0, 10000];
  const filesCountQuery = `SELECT count(*) from data.files where username = ? and device = ? and directory = ?;`;
  const filesInCurrentDirQuery = `select uuid,origin,filename,salt,iv,directory,versions,last_modified,size,device 
                                  from data.files 
                                  WHERE 
                                  username = ?
                                  AND 
                                  device = ?
                                  AND 
                                  directory = ?
                                  ORDER BY 
                                  filename ASC limit ${start},${end}`;
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
  const [start, end] = [0, 1000000];
  let regex = `^\\.?${currentDir}(/[^/]+)$`;
  if (currentDir === "/") {
    regex = `^([^/]+)$`;
  }

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
  const folderCount = `select count(*) from data.directories where username = ? and path regexp ?`;
  const foldersQuery = `SELECT 
                        uuid,folder,path,created_at 
                        FROM data.directories 
                        WHERE username = ?
                        AND
                        path REGEXP ? limit ${start},${end};`;

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
