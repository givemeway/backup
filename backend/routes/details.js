import express from "express";
import { getFolderDetails } from "../controllers/getFolderDetails.js";
import { verifyToken } from "../auth/auth.js";
const router = express.Router();

router.get("/folderDetails", verifyToken, getFolderDetails);

export { router as Details };
