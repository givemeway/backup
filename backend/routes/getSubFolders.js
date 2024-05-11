import express from "express";
import { verifyToken } from "../auth/auth.js";
import { getSubFolders } from "../controllers/getSubFolders.js";

const router = express.Router();

const getFolders = async (req, res, next) => {
  const path = req.query.path;
  const username = req.user.Username;
  let data = {};
  const rows = await getSubFolders(path, username);
  data["folders"] = rows;
  console.log("Expanded");
  res.json(data);
};

router.get("/", verifyToken, getFolders);

export { router as subFolders };
