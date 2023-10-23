import express from "express";
import { origin } from "../config/config.js";
import csurf from "csurf";
const router = express.Router();

router.use(csurf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

router.post("/", (req, res) => {
  res.status(200).json("Response received");
});

export { router as restoreItems };
