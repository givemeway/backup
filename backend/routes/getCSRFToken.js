import express from "express";
import cookie from "cookie";
import { domain } from "../config/config";
const router = express.Router();

router.get("/", (req, res) => {
  const CSRFToken = req.csrfToken();
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("_csrf", CSRFToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      path: "/",
      domain: domain,
      expires: new Date(Date.now() + 86400),
    })
  );
  res.status(200).json({ CSRFToken });
});

export { router as csrftoken };
