import express from "express";
import csrf from "csurf";
import { sqlExecute } from "../controllers/sql_execute.js";
import { verifyToken } from "../auth/auth.js";
import { origin } from "../config/config.js";
const router = express.Router();
router.use(csrf({ cookie: true }));

const getFolders = async (req, res, next) => {
  const path = req.headers.path;
  const order = req.headers.sortorder;
  const username = req.headers.username;
  const [start, end] = [0, 1000000];

  let regex = ``;
  req.headers.data = {};
  console.log(path);
  if (path === "/") {
    regex = `^(/[^/]+)$`;
  } else {
    regex = `^${path}(/[^/]+)$`;
  }
  const foldersQuery = `SELECT 
                        uuid,folder,path,created_at 
                        FROM data.directories 
                        WHERE username = ?
                        AND
                        path REGEXP ? limit ${start},${end};`;

  req.headers.query = foldersQuery;
  req.headers.queryValues = [username, regex];
  await sqlExecute(req, res, next);

  req.headers.data["folders"] = JSON.parse(
    JSON.stringify(req.headers.queryStatus)
  );
  console.log("done1");
  console.log(req.headers.data);
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

router.post("/", verifyToken, getFolders);

export { router as subFolders };
