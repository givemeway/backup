import express from "express";
import { get_sync_items } from "../controllers/get_sync_items.js";
import { createFolder } from "../controllers/createFolder.js";
import { sync_deleteFolder } from "../controllers/deleteItems.js";
import { getDeletedFileList } from "../controllers/get_to_be_deleted_items.js";
import { syncDeleteItems } from "../controllers/deleteItems.js";
import { downloadSyncFile } from "../controllers/syncDownloadFile.js";
import { renameFile, renameFolder, renameItems } from "./RenameItem.js";
import {
  syncUpFile,
  sync_triggerImageProcessingMS,
  sync_update_file_directory_DB,
} from "../controllers/uploadFile.js";
const router = express.Router();

router.get("/getSyncItems", get_sync_items);
router.post(
  "/syncUpFile",
  syncUpFile,
  sync_update_file_directory_DB,
  sync_triggerImageProcessingMS
);
router.get("/syncDownFile", downloadSyncFile);
router.delete("/deleteFiles", getDeletedFileList, syncDeleteItems);
router.post("/renameFile", renameFile);
router.post("/renameFolder", renameFolder);
router.delete("/deleteFolder", sync_deleteFolder);
router.post("/createFolder", createFolder);
export { router as sync };
