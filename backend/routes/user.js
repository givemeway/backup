import express from "express";
import { validateUserDetails } from "../controllers/validateUserDetails.js";
import { signup } from "../controllers/signup.js";
import { verifyToken } from "../auth/auth.js";
import { validateSession } from "../controllers/validateSession.js";
import { logout } from "../controllers/logout.js";
import { editName } from "../controllers/editName.js";
import { updateAvatar } from "../controllers/updateAvatar.js";
import { getAvatar } from "../controllers/getAvatar.js";
import { deleteAvatar } from "../controllers/deleteAvatar.js";
import { configTOTP, enableOTP, disableOTP } from "../controllers/OTP.js";

const router = express.Router();

router.post("/login", validateUserDetails);
router.get("/login/configTOTP", verifyToken, configTOTP);
router.get("/login/enableOTP", verifyToken, enableOTP);
router.get("/login/disableOTP", verifyToken, disableOTP);
router.post("/signup", signup);
router.get("/verifySession", verifyToken, validateSession);
router.get("/logout", logout);
router.put("/editName", verifyToken, editName);
router.get("/getAvatar", verifyToken, getAvatar);
router.post("/updateAvatar", verifyToken, updateAvatar);
router.delete("/deleteAvatar", verifyToken, deleteAvatar);

export { router as user };
