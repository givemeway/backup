import express from "express";
const router = express.Router();
import csrf from "csurf";

import { frontEndDomain, origin } from "../config/config.js";
import { verifyToken } from "../auth/auth.js";
import { Transfer, Share } from "../models/mongodb.js";
import { prismaUser } from "../config/prismaDBConfig.js";

const createShareLink = async (req, res) => {
  const type = req.query.t;
  const folders = req.body.directories;
  const files = req.body.files;
  const owner = req.user.Username;
  console.log(type, folders, files, owner);
  let mapFiles = {};
  files.forEach((file) => (mapFiles[file.id] = file.file));
  let mapFolders = {};
  folders.forEach((folder) => (mapFolders[folder.uuid] = folder.folder));
  let fullname;
  try {
    const user = await prismaUser.user.findUnique({
      where: {
        username: owner,
      },
      select: {
        first_name: true,
        last_name: true,
      },
    });
    const { first_name, last_name } = user;
    fullname = `${first_name} ${last_name}`;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, msg: err });
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
      obj.uuid = Object.keys(mapFiles)[0];
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
        success_msg.url = `${frontEndDomain}/sh/fi/${data._id.toString()}/${
          mapFiles[obj.uuid]
        }?k=${obj.uuid}&dl=0`;
        res.status(200).json(success_msg);
      } else {
        success_msg.url = `${frontEndDomain}/sh/fi/${fi._id.toString()}/${
          mapFiles[obj.uuid]
        }?k=${obj.uuid}&dl=0`;
        res.status(200).json(success_msg);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, msg: err });
    }
  } else if (type === "fo") {
    try {
      obj.uuid = Object.keys(mapFolders)[0];
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
        success_msg.url = `${frontEndDomain}/sh/fo/${data._id.toString()}/h?k=${
          obj.uuid
        }&dl=0`;
        res.status(200).json(success_msg);
      } else {
        success_msg.url = `${frontEndDomain}/sh/fo/${fo._id.toString()}/h?k=${
          obj.uuid
        }&dl=0`;
        res.status(200).json(success_msg);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, msg: err });
    }
  } else {
    try {
      obj.files = mapFiles;
      obj.folders = mapFolders;
      const data = await Transfer.create(obj);
      success_msg.url = `${frontEndDomain}/sh/t/${data._id.toString()}`;
      res.status(200).json(success_msg);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, msg: err });
    }
  }
};

router.post("/", verifyToken, createShareLink);

export { router as createShare };
