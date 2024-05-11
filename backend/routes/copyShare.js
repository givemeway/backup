import express from "express";
const router = express.Router();
import { Transfer, Share, FileShare, FolderShare } from "../models/mongodb.js";
import { verifyToken } from "../auth/auth.js";
import { prisma } from "../config/prismaDBConfig.js";
import { FRONTEND_DOMAIN } from "../config/config.js";

router.get("/", verifyToken, async (req, res) => {
  const username = req.user.Username;
  const { id, type } = req.query;
  console.log(id, type);
  let url = "";
  try {
    if (type === "fi") {
      const fileShare = await FileShare.findById(id);
      if (fileShare !== null) {
        const uuid = fileShare.uuid;
        const file = await prisma.file.findFirst({
          where: {
            username,
            uuid,
          },
          select: {
            filename: true,
          },
        });
        url = `${FRONTEND_DOMAIN}/sh/fi/${id}/${file.filename}?k=${uuid}&dl=0`;
      } else {
        return res.status(404).json({ success: false, msg: "share not found" });
      }
    } else if (type === "fo") {
      const folderShare = await FolderShare.findById(id);
      if (folderShare !== null) {
        const uuid = folderShare.uuid;
        url = `${FRONTEND_DOMAIN}/sh/fo/${id}/h?k=${uuid}&dl=0`;
      } else {
        return res.status(404).json({ success: false, msg: "share not found" });
      }
    } else if (type === "t") {
      const transferShare = await Transfer.findById(id);
      if (transferShare !== null) {
        url = `${FRONTEND_DOMAIN}/sh/t/${transferShare._id.toString()}`;
      } else {
        return res.status(404).json({ success: false, msg: "share not found" });
      }
    }
    res.status(200).json({ success: true, msg: "share copied!", url: url });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "something went wrong" });
  }
});

export { router as copyShare };
