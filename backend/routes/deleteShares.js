import express from "express";
const router = express.Router();
import { Transfer, Share } from "../models/mongodb.js";
import { verifyToken } from "../auth/auth.js";

router.delete("/", verifyToken, async (req, res) => {
  const username = req.user.Username;
  const { id } = req.query;
  try {
    const deleted = await Share.findOneAndDelete({ owner: username, _id: id });
    if (deleted === null) {
      await Transfer.findOneAndDelete({
        owner: username,
        _id: id,
      });
    }
    res.status(200).json({ success: true, msg: " deleted" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "something went wrong" });
  }
});

export { router as DeleteShare };
