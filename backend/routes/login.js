import express from "express";
const router = express.Router();
import { validateUserDetails } from "../controllers/validateUserDetails.js";
import { origin } from "../config/config.js";
import dotenv from "dotenv";
await dotenv.config();
import csrf from "csurf";

router.use(csrf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,X-CSRF-Token,Authorization,Set-Cookie"
  );
  res.header("Access-Control-Expose-Headers", "Set-Cookie");

  next();
});

router.post("/", validateUserDetails);

export { router as login };
