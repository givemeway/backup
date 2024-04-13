import jwt from "jsonwebtoken";
import cookie from "cookie";
import express from "express";
import { JWT_SECRET, domain, origin } from "../config/config.js";
const router = express.Router();

router.get("/", (req, res) => {
  const payload = { email: "", first: "", last: "", userID: "", Username: "" };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: -100 });
  console.log(token);
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", token, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      path: "/",
      domain: domain,
      expires: new Date(Date.now() + 864000),
    })
  );
  res.status(200).json({ success: true, msg: "logged out" });
});

export { router as Logout };
