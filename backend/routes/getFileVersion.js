import express from "express";
import { verifyToken } from "../auth/auth.js";
import { prisma } from "../config/prismaDBConfig.js";
const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  let versions = [];
  let status = 200;
  let error = undefined;
  let msg = "";
  try {
    const username = req.user.Username;
    const { origin } = req.query;
    const rows = await prisma.fileVersion.findMany({
      where: {
        username,
        origin,
      },
    });

    versions = JSON.parse(
      JSON.stringify(rows, (key, value) =>
        typeof value === "bigint" ? parseInt(value) : value
      )
    );
    status = 200;
    msg = "success";
  } catch (err) {
    error = err;
    status = 500;
    msg = err;
  } finally {
    if (status === 200) {
      res.status(200).json({ success: true, msg, files: versions });
    } else if (status === 500) {
      res.status(500).json({ success: false, msg, error });
    }
  }
});

export { router as getFileVersion };
