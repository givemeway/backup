import express from "express";
const router = express.Router();
import csrf from "csurf";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { Share, Transfer } from "../models/mongodb.js";
import { domain, origin } from "../config/config.js";

router.use(csrf({ cookie: true }));
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Expose-Headers", "Set-Cookie");
  res.header("Access-Control-Allow-Methods", "GET");
  next();
});

const validateShare = async (req, res, next) => {
  console.log("vaidate share hit");
  const { t, k, id, dl, nav, nav_tracking } = req.query;

  try {
    if (t === "fi" || t === "fo") {
      const share = await Share.findById({ _id: id }).exec();
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
        domain: domain,
        expires: new Date(time_start + time_diff),
      };
      res.setHeader("Set-Cookie", cookie.serialize("share", token, opts));
      res.status(200).json({ success: true });
    } else if (t === "t") {
      const share = await Transfer.findById({ _id: id }).exec();
      const time_diff = share.expires_at - Date.now();
      if (share && time_diff <= 0) {
        console.log("Expired");
        res.status(403).json({ success: false, msg: "Share link Expired" });
        return;
      } else {
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: err });
  }
};

router.get("/", validateShare);

export { router as validateShare };
