import express from "express";
const router = express.Router();
import { validateUserDetails } from "../controllers/validateUserDetails.js";
import dotenv from "dotenv";
await dotenv.config();

router.post("/", validateUserDetails);

export { router as login };
