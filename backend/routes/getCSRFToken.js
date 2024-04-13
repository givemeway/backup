import express from "express";
import cookie from "cookie";
import { domain } from "../config/config.js";
const router = express.Router();

router.get("/", (req, res) => {
  const CSRFToken = req.csrfToken();
  const expiresInTimeStamp = Date.now() + 24 * 60 * 60 * 1000;
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("_csrf", CSRFToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      path: "/",
      domain: "netlify.app",
      expires: new Date(expiresInTimeStamp),
    })
  );
  res.status(200).json({ CSRFToken });
});

export { router as csrftoken };
