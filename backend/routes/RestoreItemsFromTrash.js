import express from "express";
const router = express.Router();
import csurf from "csurf";
import { origin } from "../config/config.js";

router.use(csurf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

router.post("/", (req, res) => {
  const query = `INSERT INTO data.files
                 SELECT username,device,
                        directory,uuid,origin,filename,
                        last_modified,hashvalue,
                        enc_hashvalue,versions,size,salt,iv
                 FROM data.deleted_files
                 WHERE username = ?
                 AND device = ?
                 AND directory REGEXP ?
                 ORDER BY directory
                 LIMIT ?,?;`;
  res.status(200).json("Response Received");
});

export { router as restoreTrashItems };
