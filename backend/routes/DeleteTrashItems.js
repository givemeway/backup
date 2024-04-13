import express from "express";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();
import { verifyToken } from "../auth/auth.js";
import { deleteTrashItems } from "../controllers/delete_trash_items.js";

router.post("/", verifyToken, deleteTrashItems);

export { router as deleteTrashItems };
