import express from "express";
import csrf from "csurf";
import { cookieOpts } from "../config/config.js";
const router = express.Router();

router.use(csrf({ cookie: cookieOpts }));

router.get("/", (req, res) => {
  const CSRFToken = req.csrfToken();
  res.status(200).json({ CSRFToken });
});

export { router as csrftoken };
