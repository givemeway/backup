import express from "express";
import { verifyToken } from "../auth/auth.js";
import { createSignedURL } from "../controllers/createSignedURL.js";

const router = express.Router();

router.get("/", verifyToken, createSignedURL);

export { router as PhotoPreviewURL };
