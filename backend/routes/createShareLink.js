import express from "express";
const router = express.Router();
import csrf from "csurf";

import { origin } from "../config/config.js";
import { verifyToken } from "../auth/auth.js";

router.use(csrf({ cookie: true }));

const sqlExecute = async (req, res, next) => {
  try {
    const con = req.headers.connection;
    const [rows] = await con.execute(req.headers.query, [
      ...req.headers.queryValues,
    ]);
    req.headers.queryStatus = rows;
    req.headers.query_success = true;
  } catch (error) {
    res.status(500).json(error.message);
    res.end();
  }
};

router.use("/", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const getShareLink = async (req, res, next) => {
  const folderQuery = `SELECT folder,path,device from data.directories WHERE uuid = ?;`;
  const fileQuery = `SELECT directory,device,filename from data.files WHERE origin = ?;`;
  const shareType = req.query.type;
  const uuid = req.query.k;
  if (shareType === "fi") {
    await sqlExecute(req, res, next);
    const data = req.headers.queryStatus;
    res
      .status(200)
      .json({ url: `https://localhost:3001/app/sh/sh?k=${uuid}&dl=0` });
  } else if (shareType === "fo") {
    res
      .status(200)
      .json({ url: `https://localhost:3001/app/sh/sh?k=${uuid}&dl=0` });
  }
};

router.post("/", verifyToken, getShareLink);

export { router as createDownloadURL };
