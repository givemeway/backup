import express from "express";
import { origin } from "../config/config.js";
import { sqlExecute } from "../controllers/sql_execute.js";
import csrf from "csurf";
const router = express.Router();
router.use(csrf({ cookie: true }));

const findFiles = async (req, res, next) => {
  const param = req.query.search;
  req.headers.data = {};
  const fileSearchQuery = `SELECT id,filename,directory,size,versions,last_modified,iv,salt,device 
                    FROM data.files
                    WHERE 
                    MATCH(filename)
                    AGAINST(?)
                    `;
  req.headers.query = fileSearchQuery;
  req.headers.queryValues = [param];
  next();
};

const findFolders = async (req, res, next) => {
  const param = req.query.search;
  req.headers.data.files = [...req.headers.queryStatus];
  const folderSearchQuery = `SELECT folder,path
                            FROM data.directories
                            WHERE
                            MATCH(folder)
                            AGAINST(?)
                            `;
  req.headers.query = folderSearchQuery;
  req.headers.queryValues = [param];
  next();
};

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization,searchparam"
  );
  next();
});
router.get("/", findFiles, sqlExecute, findFolders, sqlExecute, (req, res) => {
  req.headers.data.folders = [...req.headers.queryStatus];
  res.status(200).json(req.headers.data);
  console.log("search response sent");
});

export { router as searchFiles };
