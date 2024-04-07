import express from "express";
import { verifyToken } from "../auth/auth.js";
const router = express.Router();
import csrf from "csurf";
import { origin } from "../config/config.js";

router.use(csrf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,X-CSRF-Token,Authorization"
  );

  next();
});

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
