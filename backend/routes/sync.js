import express from "express";
import { get_sync_items } from "../controllers/get_sync_items.js";
import { syncUpFile, sync_triggerImageProcessingMS, sync_update_file_directory_DB } from "../controllers/uploadFile.js";
const router = express.Router();

router.get("/getSyncItems", get_sync_items);
router.post("/syncUpFile", syncUpFile, sync_update_file_directory_DB, sync_triggerImageProcessingMS)
router.post("/syncDownFile", (req, res) => { });
router.delete("/deleteFile", (req, res) => { })
router.post("/renameFile", (req, res) => { })
router.post("/renameFolder", (req, res) => { })
router.delete("/deleteFolder", (req, res) => { })

export { router as sync }; 
