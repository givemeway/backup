import express from "express";
const router = express.Router();
import { verifyToken } from "../auth/auth.js";
import { getFilesFoldersFromShareID } from "../controllers/get_share_file_folders.js";

router.get("/", verifyToken, getFilesFoldersFromShareID);

export { router as share };
