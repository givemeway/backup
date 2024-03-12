import express from "express";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();
import csurf from "csurf";
import { origin } from "../config/config.js";
import { verifyToken } from "../auth/auth.js";
import { deleteTrashItems } from "../controllers/delete_trash_items.js";

router.use(csurf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

router.post("/", verifyToken, deleteTrashItems);

export { router as deleteTrashItems };
