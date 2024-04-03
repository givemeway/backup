import express from "express";
const router = express.Router();
import { v4 as uuidv4 } from "uuid";
import { origin } from "../config/config.js";
import csrf from "csurf";
import { verifyToken } from "../auth/auth.js";
import { prisma } from "../config/prismaDBConfig.js";

router.use(csrf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Expose-Headers", "Set-Cookie");
  next();
});

router.post("/", verifyToken, async (req, res, next) => {
  const { subpath, folder } = req.query;
  const username = req.user.Username;
  let status;
  let path;
  let device;
  let success;
  let msg;
  if (subpath === "home") {
    path = "/" + folder;
    device = folder;
  } else {
    path = subpath.split("home").slice(1).join("/") + "/" + folder;
    device = subpath.split("home")[1].split("/")[1];
  }

  try {
    await prisma.directory.create({
      data: {
        uuid: uuidv4(),
        username,
        device,
        folder,
        path,
        created_at: new Date().toISOString(),
      },
    });
    success = true;
    status = 200;
    msg = `Folder ${folder} created!`;
  } catch (err) {
    console.log(err);
    success = false;
    if (err?.code === "P2002") {
      msg = err.message;
      status = 409;
    } else {
      msg = err;
      status = 500;
    }
  } finally {
    res.status(status).json({ success, msg });
  }
});

export { router as createFolder };
