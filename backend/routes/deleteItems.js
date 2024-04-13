import express from "express";
import { verifyToken } from "../auth/auth.js";
import { getDeletedItemsList } from "../controllers/get_to_be_deleted_items.js";
import { deleteItems } from "../controllers/deleteItems.js";

const router = express.Router();

router.delete("/", verifyToken, getDeletedItemsList, deleteItems);

export { router as deleteItems };
