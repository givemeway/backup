import express from "express";
import { validateUserDetails } from "../controllers/validateUserDetails.js";
import { signup } from "../controllers/signup.js";
import { verifyToken } from "../auth/auth.js";
import { validateSession } from "../controllers/validateSession.js";
import { logout } from "../controllers/logout.js";
import { editName } from "../controllers/editName.js";
import { updateAvatar } from "../controllers/updateAvatar.js";
const router = express.Router();

router.post("/login", validateUserDetails);
router.post("/signup", signup);
router.get("/verifySession", verifyToken, validateSession);
router.get("/logout", logout);
router.put("/editName", verifyToken, editName);
router.post("/updateAvatar", verifyToken, updateAvatar);

export { router as user };
