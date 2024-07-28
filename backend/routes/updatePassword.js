import express from "express";
import { updatePassword } from "../controllers/updatePassword.js";
import { verifyToken } from "../auth/auth.js";
const router = express.Router();

router.put("/", verifyToken, updatePassword);

export { router as updatePassword };
