import express from "express";
const router = express.Router();

import { verifyToken } from "../auth/auth.js";

import { restoreItems } from "../controllers/putBackFilesFromTrash.js";

router.post("/", verifyToken, restoreItems);

export { router as restoreTrashItems };
