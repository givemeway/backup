import express from "express";
import { editName } from "../controllers/editName.js";
import { verifyToken } from "../auth/auth.js";
const router = express.Router();

router.put("/", verifyToken, editName);

export { router as editName };
