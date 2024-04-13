import express from "express";
const router = express.Router();
import { verifyToken } from "../auth/auth.js";
import { getFilesInDirectory } from "../controllers/getFilesInDirectory.js";

router.post("/", verifyToken, getFilesInDirectory, (req, res) => {
  console.log(req.headers.data);
  res.status(200).json(req.headers.data);

  console.log("response sent");
});

export { router as getCurrentDirFiles };
