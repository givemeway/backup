import express from "express";
import csrf from "csurf";
import { verifyToken } from "../auth/auth.js";
import { origin } from "../config/config.js";
import { getSubFolders } from "../controllers/getSubFolders.js";

const router = express.Router();
router.use(csrf({ cookie: true }));

const getFolders = async (req, res, next) => {
  let path = req.headers.path;
  const username = req.user.Username;
  let data = {};
  const rows = await getSubFolders(path, username);
  data["folders"] = rows;
  console.log("Expanded");
  res.json(data);
};

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, currentdirectory,sortorder,username,devicename"
  );
  next();
});

router.post("/", verifyToken, getFolders);

export { router as subFolders };
