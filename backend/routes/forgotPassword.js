import express from "express";
import { updatePassword } from "../controllers/resetPassword.js";
import { getPassLink } from "../controllers/generatePassReset.js";
import { verifyPassToken } from "../controllers/verifyPassToken.js";
const router = express.Router();

router.put("/updatePassword", updatePassword);
router.get("/passwordReset", getPassLink);
router.get("/validatePassLink", verifyPassToken);

export { router as forgotPassword };
