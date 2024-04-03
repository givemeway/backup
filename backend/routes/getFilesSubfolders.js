import express from "express";
import csrf from "csurf";
import { verifyToken } from "../auth/auth.js";
import { origin } from "../config/config.js";
import { prisma, Prisma } from "../config/prismaDBConfig.js";
import { getSignedURls } from "../controllers/getSignedURLs.js";

const router = express.Router();
router.use(csrf({ cookie: true }));

const getFiles = async (req, res, next) => {
  try {
    const { d, dir, sort, start, page } = req.query;
    console.log("files-->", start, page);
    const order = sort;
    const currentDir = dir;
    const username = req.user.Username;
    const devicename = d;

    const [count, rows] = await prisma.$transaction([
      prisma.file.count({
        where: {
          username,
          device: devicename,
          directory: currentDir,
        },
      }),
      prisma.file.findMany({
        where: {
          username,
          device: devicename,
          directory: currentDir,
        },
        skip: parseInt(start),
        take: parseInt(page),
        orderBy: {
          directory: "asc",
        },
      }),
    ]);

    console.log(count);
    req.data = {};
    req.data["total"] = parseInt(count);
    const updatedFiles = await getSignedURls(rows, username);
    req.data["files"] = updatedFiles;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: err });
  }
};

const getFolders = async (req, res) => {
  try {
    const { d, dir, sort, start, page } = req.query;
    console.log("folder->", start, page);
    const currentDir = dir;

    const order = req.headers.sortorder;
    const username = req.user.Username;
    const devicename = d;
    console.log(username, devicename);
    let regex = ``;
    let path = ``;
    if (devicename === "/") {
      regex = `^(/[^/]+)$`;
    } else if (currentDir === "/") {
      let device = devicename;
      device = device.replace(/\(/g, "\\(");
      device = device.replace(/\)/g, "\\)");
      regex = `^/${device}(/[^/]+)$`;
    } else {
      path = `/${devicename}/${currentDir}`;
      path = path.replace(/\(/g, "\\(");
      path = path.replace(/\)/g, "\\)");
      regex = `^${path}(/[^/]+)$`;
    }

    const [rows, count] = await prisma.$transaction([
      prisma.$queryRaw(Prisma.sql`SELECT 
                        uuid,folder,path,created_at,device 
                        FROM public."Directory" 
                        WHERE username = ${username}
                        AND
                        path ~ ${regex} 
                        ORDER BY folder ASC
                        LIMIT ${parseInt(page)} OFFSET ${parseInt(start)}`),
      prisma.$queryRaw(Prisma.sql`SELECT 
                    COUNT(*)
                    FROM public."Directory" 
                    WHERE username = ${username}
                    AND
                    path ~ ${regex};`),
    ]);

    req.data.total += parseInt(count[0].count);
    req.data["folders"] = rows;

    const data = JSON.stringify(req.data, (key, value) =>
      typeof value === "bigint" ? parseInt(value) : value
    );
    res.json(JSON.parse(data));
  } catch (err) {
    console.log(err);
    res.json(500).json({ success: false, msg: err });
  }
};

router.use((req, res, next) => {
  console.log("pre-flight");
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, currentdirectory,sortorder,username,devicename"
  );
  next();
});

router.get("/", verifyToken, getFiles, getFolders);

export { router as getFilesSubfolders };
