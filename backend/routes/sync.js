import express from "express";
import { get_sync_items } from "../controllers/get_sync_items.js";
const router = express.Router();

router.get("/getSyncItems", get_sync_items);

export { router as sync }; 
