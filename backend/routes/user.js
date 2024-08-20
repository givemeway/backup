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
import { verifyPassword } from "../controllers/verifyPassword.js";
import { verifyOTP } from "../controllers/verifyOTP.js";
import { sendOTP } from "../controllers/sendOTP.js";

const router = express.Router();

router.post("/login", validateUserDetails);
router.post("/login/configTOTP", verifyToken, configTOTP);
router.post("/login/enableOTP", verifyToken, enableOTP);
router.post("/login/disableOTP", verifyToken, disableOTP);
router.get("/login/verifyOTP", verifyToken, verifyOTP);
router.post("/login/sendOTP", verifyToken, sendOTP);
router.post("/signup", signup);
router.get("/verifySession", verifyToken, validateSession);
router.get("/logout", logout);
router.put("/editName", verifyToken, editName);
router.get("/getAvatar", verifyToken, getAvatar);
router.post("/updateAvatar", verifyToken, updateAvatar);
router.delete("/deleteAvatar", verifyToken, deleteAvatar);
router.get("/verifyPassword", verifyToken, verifyPassword);

export { router as user };
