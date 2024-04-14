import express from "express";
import csrf from "csurf";
import { cookieOpts } from "../config/config.js";
const router = express.Router();

import { validateUserDetails } from "../controllers/validateUserDetails.js";

// router.use(csrf({ cookie: cookieOpts }));
router.post("/", validateUserDetails);

export { router as login };
