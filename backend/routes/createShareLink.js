import express from "express";
const router = express.Router();
import csrf from "csurf";

import { origin, serverDomain } from "../config/config.js";
import { verifyToken } from "../auth/auth.js";
import { Transfer, Share } from "../models/mongodb.js";
import { createConnection } from "../controllers/createConnection.js";

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

const createShareLink = async (req, res) => {
  const type = req.query.t;
  const folders = req.body.directories;
  const files = req.body.files;
  const owner = req.user.Username;
  const mapFiles = files.map((file) => ({ uuid: file.id }));
  const mapFolders = folders.map((folder) => ({ uuid: folder.uuid }));
  const userDBCon = await createConnection("customers");
  let fullname;
  try {
    const query = `SELECT first_name, last_name from customers.users where username=?;`;
    const val = [owner];
    const [rows] = await userDBCon.execute(query, val);
    const { first_name, last_name } = rows[0];
    fullname = `${first_name} ${last_name}`;
    await userDBCon.end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: err });
  }

  let obj = {
    owner,
    sharedBy: fullname,
  };

  let success_msg = {
    success: true,
    msg: "success",
  };

  if (type === "fi") {
    try {
      obj.uuid = mapFiles[0].uuid;
      obj.item = "fi";
      const fi = await Share.findOneAndUpdate(
        { uuid: obj.uuid },
        {
          created_at: Date.now(),
          expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000,
        }
      );
      if (fi === null) {
        const data = await Share.create(obj);
        success_msg.url = `${serverDomain}/sh/fi/${data._id.toString()}/${
          mapFiles[0].name
        }?k=${obj.uuid}&dl=0`;
        res.status(200).json(success_msg);
      } else {
        success_msg.url = `${serverDomain}/sh/fi/${fi._id.toString()}/${
          mapFiles[0].name
        }?k=${obj.uuid}&dl=0`;
        res.status(200).json(success_msg);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, msg: err });
    }
  } else if (type === "fo") {
    try {
      obj.uuid = mapFolders[0].uuid;
      obj.item = "fo";
      const fo = await Share.findOneAndUpdate(
        { uuid: obj.uuid },
        {
          created_at: Date.now(),
          expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000,
        }
      );
      if (fo === null) {
        const data = await Share.create(obj);
        success_msg.url = `${serverDomain}/sh/fo/${data._id.toString()}/h?k=${
          obj.uuid
        }&dl=0`;
        res.status(200).json(success_msg);
      } else {
        success_msg.url = `${serverDomain}/sh/fo/${fo._id.toString()}/h?k=${
          obj.uuid
        }&dl=0`;
        res.status(200).json(success_msg);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, msg: err });
    }
  } else {
    try {
      obj.files = mapFiles;
      obj.folders = mapFolders;
      const data = await Transfer.create(obj);
      success_msg.url = `${serverDomain}/sh/t/${data._id.toString()}`;
      res.status(200).json(success_msg);
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, msg: err });
    }
  }
};

router.post("/", verifyToken, createShareLink);

export { router as createShare };
