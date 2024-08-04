import express from "express";
import { resetPassword } from "../controllers/resetPassword.js";
import { getPassLink } from "../controllers/generatePassReset.js";
import { verifyPassToken } from "../controllers/verifyPassToken.js";
import { updatePassword } from "../controllers/updatePassword.js";
import { verifyToken } from "../auth/auth.js";
const router = express.Router();

router.put("/updatePassword", resetPassword);
router.post("/passwordReset", getPassLink);
router.get("/validatePassLink", verifyPassToken);
router.put("/profile/updatePassword", verifyToken, updatePassword);

export { router as forgotPassword };
