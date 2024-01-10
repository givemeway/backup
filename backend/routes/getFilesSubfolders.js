import express from "express";
import csrf from "csurf";
import { sqlExecute } from "../controllers/sql_execute.js";
import { verifyToken } from "../auth/auth.js";
import { origin } from "../config/config.js";
import releaseConnection from "../controllers/ReleaseConnection.js";
import { getConnection } from "../controllers/getConnection.js";
const router = express.Router();
router.use(csrf({ cookie: true }));

const getFiles = async (req, res, next) => {
  const currentDir = req.headers.currentdirectory;
  const order = req.headers.sortorder;
  // const username = req.headers.username;
  const username = req.user.Username;
  const devicename = req.headers.devicename;
  const [start, end] = [0, 10000];
  const filesInCurrentDirQuery = `SELECT * FROM (
                                    SELECT uuid,origin,filename,salt,iv,directory,
                                            versions,last_modified,size,device 
                                    FROM files
                                    WHERE username = ? AND  device = ? AND directory = ?
                                    ORDER BY directory ASC limit ?,?
                                  ) AS t
                                  UNION ALL
                                  SELECT uuid,origin,filename,salt,iv,directory,versions,
                                          last_modified,size,device 
                                  FROM versions.file_versions
                                  WHERE username = ? AND  device = ? AND directory = ?;`;
  req.headers.query = filesInCurrentDirQuery;
  req.headers.queryValues = [
    username,
    devicename,
    currentDir,
    start.toString(),
    end.toString(),
    username,
    devicename,
    currentDir,
  ];
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
  // const username = req.headers.username;
  const username = req.user.Username;

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
    let device = devicename;
    device = device.replace(/\(/g, "\\(");
    device = device.replace(/\)/g, "\\)");
    regex_2 = `^\\.?/${device}(/[^/]+)$`;
  } else {
    path = `/${devicename}/${currentDir}`;
    path = path.replace(/\(/g, "\\(");
    path = path.replace(/\)/g, "\\)");
    regex_2 = `^\\.?${path}(/[^/]+)$`;
  }
  const foldersQuery = `SELECT 
                        uuid,folder,path,created_at,device 
                        FROM directories.directories 
                        WHERE username = ?
                        AND
                        path REGEXP ? 
                        ORDER BY folder ASC
                        limit ?,?;`;

  req.headers.query = foldersQuery;
  req.headers.queryValues = [
    username,
    regex_2,
    start.toString(),
    end.toString(),
  ];
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

router.post(
  "/",
  verifyToken,
  getFiles,
  releaseConnection,
  getConnection("directories"),
  getFolders,
  releaseConnection,
  (req, res) => {
    console.log("done");
  }
);

export { router as getFilesSubfolders };
