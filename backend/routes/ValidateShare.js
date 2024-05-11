import express from "express";
const router = express.Router();
import cookie from "cookie";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { Transfer, FileShare, FolderShare } from "../models/mongodb.js";
import { DOMAIN } from "../config/config.js";
import { prisma } from "../config/prismaDBConfig.js";

const validateShare = async (req, res, next) => {
  const { t, k, id } = req.query;

  try {
    if (t === "fi" || t === "fo") {
      let share = null;
      if (t === "fi") {
        share = await FileShare.findById({ _id: id }).exec();
      } else if (t === "fo") {
        share = await FolderShare.findById({ _id: id }).exec();
      }
      if (!share) {
        res
          .status(404)
          .json({ success: false, msg: "Share Deleted or Doesn't Exist" });
        return;
      }
      const time_start = Date.now();
      const time_diff = share.expires_at - time_start;
      if (time_diff <= 0) {
        console.log("Expired");
        res.status(403).json({ success: false, msg: "Share link Expired" });
        return;
      }
      const payLoad = {
        t,
        k,
        id,
        Username: share.owner,
      };
      const token = jwt.sign(payLoad, process.env.JWT_SECRET, {
        expiresIn: time_diff,
      });
      const opts = {
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain: DOMAIN,
        expires: new Date(time_start + time_diff),
      };
      res.setHeader("Set-Cookie", cookie.serialize("share", token, opts));
      let name = "";
      if (t === "fo") {
        const { folder } = await prisma.directory.findFirst({
          where: {
            username: share.owner,
            uuid: share.uuid,
          },
          select: {
            folder: true,
          },
        });
        name = folder;
      } else if (t === "fi") {
        const { filename } = await prisma.file.findFirst({
          where: {
            username: share.owner,
            uuid: share.uuid,
          },
          select: {
            filename: true,
          },
        });
        name = filename;
      }
      res.status(200).json({ success: true, sharedBy: share.sharedBy, name });
    } else if (t === "t") {
      console.log("validate transfer ");
      const share = await Transfer.findById({ _id: id }).exec();
      const fileCount = Array.from(share.files).length;
      const folderCount = Array.from(share.folders).length;
      if (!share) {
        return res
          .status(404)
          .json({ success: false, msg: "Share link Doesn't exist or Deleted" });
      }
      const time_start = Date.now();
      const time_diff = share.expires_at - time_start;
      if (time_diff <= 0) {
        return res
          .status(403)
          .json({ success: false, msg: "Share Link Expired" });
      }
      const payLoad = {
        t,
        k,
        id,
        Username: share.owner,
      };
      const token = jwt.sign(payLoad, process.env.JWT_SECRET, {
        expiresIn: time_diff,
      });
      const opts = {
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain: DOMAIN,
        expires: new Date(time_start + time_diff),
      };
      res.setHeader("Set-Cookie", cookie.serialize("share", token, opts));
      res.status(200).json({
        success: true,
        sharedBy: share.sharedBy,
        name: fileCount + folderCount,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: err });
  }
};

router.get("/", validateShare);

export { router as validateShare };
