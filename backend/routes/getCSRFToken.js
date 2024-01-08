import express from "express";
import { origin } from "../config/config.js";
const router = express.Router();
import csrf from "csurf";
router.use(csrf({ cookie: true }));
router.use((req, res, next) => {
  console.log(req.method);
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Expose-Headers", "Set-Cookie");
  next();
});

router.get("/", (req, res) => {
  res.status(200).json({ CSRFToken: req.csrfToken() });
});

export { router as csrftoken };
