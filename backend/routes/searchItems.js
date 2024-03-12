import express from "express";
import { origin } from "../config/config.js";
import csrf from "csurf";
import { prisma } from "../config/prismaDBConfig.js";
import { verifyToken } from "../auth/auth.js";
const router = express.Router();
router.use(csrf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization,searchparam"
  );
  next();
});
router.get("/", verifyToken, async (req, res) => {
  try {
    const param = req.query.search;
    const username = req.user.Username;
    const files = await prisma.file.findMany({
      where: {
        username,
        filename: {
          search: param,
        },
      },
    });

    const folders = await prisma.directory.findMany({
      where: {
        username,
        folder: {
          search: param,
        },
      },
    });
    let data = {};
    data["folders"] = folders;
    data["files"] = files;
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    req.status(500).json({ success: false, msg: err });
  }
});

export { router as searchFiles };
