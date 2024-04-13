import express from "express";
import { verifyToken } from "../auth/auth.js";
const router = express.Router();

router.get("/", verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    userID: req.user.userID,
    email: req.user.email,
    username: req.user.Username,
    first: req.user.first,
    last: req.user.last,
  });
});

export { router as verifySession };
