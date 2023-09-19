import express from "express";
const router = express.Router();
import csrf from "csurf";

import { origin } from "../config/config.js";
import { verifyToken } from "../auth/auth.js";

router.use(csrf({ cookie: true }));

router.use("/", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

router.post("/", verifyToken);

export { router as share };
