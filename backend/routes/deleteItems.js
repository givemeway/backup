import express from "express";
import dontenv from "dotenv";
import csurf from "csurf";
import { verifyToken } from "../auth/auth.js";
import { origin } from "../config/config.js";
import { getDeletedItemsList } from "../controllers/get_to_be_deleted_items.js";
import { deleteItems } from "../controllers/deleteItems.js";

const router = express.Router();
dontenv.config();

router.use(csurf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Methods", "DELETE");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

router.delete("/", verifyToken, getDeletedItemsList, deleteItems);

export { router as deleteItems };
