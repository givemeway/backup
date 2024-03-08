import express from "express";
const router = express.Router();
import csurf from "csurf";
import { origin } from "../config/config.js";
import { verifyToken } from "../auth/auth.js";
import { Prisma, prisma } from "../config/prismaDBConfig.js";

const singleFile = "singleFile";
const bulk = "bulk";

router.use(csurf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

router.post("*", verifyToken, async (req, res) => {
  try {
    const username = req.user.Username;
    const { path, begin, end, item, id } = req.query;
    const dirParts = path?.split("/").slice(2).join("/");
    const device = path?.split("/")[1] === "" ? "/" : path?.split("/")[1];
    let dir = dirParts === "" ? "/" : dirParts;
    dir = dir.replace(/\)/g, "\\)");
    dir = dir.replace(/\(/g, "\\(");
    let rows = [];
    if (item === bulk) {
      const regexp = `^${dir}(/[^/]+)*$`;

      rows = await prisma.$queryRaw(Prisma.sql`
                            SELECT filename,deletion_date,device,directory,uuid
                            FROM public."DeletedFile"
                            WHERE username = ${username}
                            AND device = ${device}
                            AND directory ~ ${regexp}
                            ORDER BY directory
                            LIMIT ${parseInt(end)}
                            OFFSET ${parseInt(begin)};`);
    } else if (item === singleFile) {
      rows = await prisma.$queryRaw(Prisma.sql`
                            SELECT filename,deletion_date,device,directory,uuid
                            FROM public."DeletedFile"
                            WHERE username = ${username}
                            AND device = ${device}
                            AND directory = ${dir}
                            AND uuid = ${id};`);
    }
    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export { router as getTrashBatch };
