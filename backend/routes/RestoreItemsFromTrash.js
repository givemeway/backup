import express from "express";
const router = express.Router();
import csurf from "csurf";
import { origin } from "../config/config.js";
import { verifyToken } from "../auth/auth.js";
import {
  restore_file_from_trash,
  restore_items_from_trash,
} from "../controllers/putBackFilesFromTrash.js";
import { restoreItems } from "../controllers/putBackFilesFromTrash.js";
const SINGLEFILE = "singleFile";

router.use(csurf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

router.post("/", verifyToken, restoreItems);

export { router as restoreTrashItems };
