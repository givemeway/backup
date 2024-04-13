import express from "express";
const router = express.Router();
import { validateUserDetails } from "../controllers/validateUserDetails.js";

router.post("/", validateUserDetails);

export { router as login };
