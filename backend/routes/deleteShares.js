import express from "express";
const router = express.Router();
import { Transfer, FolderShare, FileShare } from "../models/mongodb.js";
import { verifyToken } from "../auth/auth.js";

router.delete("/", verifyToken, async (req, res) => {
  const username = req.user.Username;
  const { id, type } = req.query;
  try {
    if (type === "fo") {
      const deleted = await FolderShare.findOneAndDelete({
        owner: username,
        _id: id,
      });
      if (deleted === null) {
        return res.status(404).json({ success: false, msg: "Share not found" });
      } else {
        return res.status(200).json({ success: true, msg: "share deleted" });
      }
    } else if (type === "fi") {
      const deleted = await FileShare.findOneAndDelete({
        owner: username,
        _id: id,
      });
      if (deleted === null) {
        return res.status(404).json({ success: false, msg: "Share not found" });
      } else {
        return res.status(200).json({ success: true, msg: "share deleted" });
      }
    } else if (type === "t") {
      const deleted = await Transfer.findOneAndDelete({
        owner: username,
        _id: id,
      });
      if (deleted === null) {
        return res.status(404).json({ success: false, msg: "Share not found" });
      } else {
        return res.status(200).json({ success: true, msg: "share deleted" });
      }
    }
  } catch (err) {
    res.status(500).json({ success: false, msg: "something went wrong" });
  }
});

export { router as DeleteShare };
