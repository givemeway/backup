import express from "express";
import csrf from "csurf";
import { verifyToken } from "../auth/auth.js";
import { origin } from "../config/config.js";
import mimetype from "mime-types";
import { imageTypes } from "../utils/utils.js";
import { thumbnailMicroservice } from "../config/config.js";
import axios from "axios";
import { pool } from "../server.js";
import { prisma, Prisma } from "../config/prismaDBConfig.js";

const headers = {
  headers: { "Content-Type": "application/json" },
};

const router = express.Router();
router.use(csrf({ cookie: true }));

const getSignedURls = async (files, username) => {
  const images = files.filter((file) => {
    const mime = mimetype.lookup(file.filename);
    if (mime) {
      const ext = mime.split("/")[1].toUpperCase();
      return imageTypes.hasOwnProperty(ext);
    }
    return false;
  });

  const dataFiles = files.filter((file) => {
    const mime = mimetype.lookup(file.filename);

    if (mime) {
      const ext = mime.split("/")[1].toUpperCase();
      return !imageTypes.hasOwnProperty(ext);
    }
    return true;
  });

  for (let i = 0; i < images.length; i++) {
    try {
      const url =
        thumbnailMicroservice +
        images[i].uuid +
        "_32w" +
        `&username=${username}`;

      const response = await axios.get(url, headers);
      images[i].signedURL = response.data.url_thumb;
    } catch (err) {
      console.error(err);
    }
  }
  let allFiles = [];
  allFiles = [...images, ...dataFiles];

  return allFiles;
};

const getFiles = async (req, res, next) => {
  let con;
  try {
    const { d, dir, sort, start, page } = req.query;
    console.log("files-->", start, page);
    const order = sort;
    const currentDir = dir;
    const username = req.user.Username;
    const devicename = d;
    const rows = await prisma.file.findMany({
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
    });

    req.data = {};
    const updatedFiles = await getSignedURls(rows, username);
    req.data["files"] = updatedFiles;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: err });
  }
};

const getFolders = async (req, res) => {
  let con;
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

    let rows = await prisma.$queryRaw(Prisma.sql`SELECT 
                        uuid,folder,path,created_at,device 
                        FROM public."Directory" 
                        WHERE username = ${username}
                        AND
                        path ~ ${regex} 
                        ORDER BY folder ASC
                        LIMIT ${parseInt(page)} OFFSET ${parseInt(start)}`);
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
