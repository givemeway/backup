import express from "express";
import { verifyToken } from "../auth/auth.js";
import { prisma, Prisma } from "../config/prismaDBConfig.js";
import { getSignedURls } from "../controllers/getSignedURLs.js";

const router = express.Router();

const getFilesFolders = async (req, res, next) => {
  try {
    const { d, dir, sort, start, page } = req.query;

    console.log("items->", start, page);
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

    const [results, count] = await prisma.$transaction([
      prisma.$queryRaw(Prisma.sql`
        SELECT uuid, filename as name, device, directory, origin, versions,'file' as type,
        last_modified as modified,size
        FROM public."File"
        WHERE username = ${username}
        AND device = ${devicename}
        AND directory = ${currentDir}
        UNION ALL
        SELECT uuid, folder as name, device,path as directory,'--' as origin, 0 as versions,
        'folder' as type, created_at as modified, 0 as size
        FROM public."Directory"
        WHERE username = ${username}
        AND path ~ ${regex}
        ORDER BY name ASC
        LIMIT ${parseInt(page)} OFFSET ${parseInt(start)};
      `),
      prisma.$queryRaw(Prisma.sql`
        SELECT COUNT(*)
        FROM public."File"
        WHERE username = ${username}
        AND device = ${devicename}
        AND directory = ${currentDir}
        UNION ALL
        SELECT COUNT(*)
        FROM public."Directory"
        WHERE username = ${username}
        AND path ~ ${regex};
      `),
    ]);
    const files = results
      .filter((item) => item.type === "file")
      .map((item) => ({
        ...item,
        filename: item.name,
        last_modified: item.modified,
        size: parseInt(item.size),
      }));
    const folders = results
      .filter((item) => item.type === "folder")
      .map((item) => ({
        ...item,
        path: item.directory,
        folder: item.name,
        created_at: item.modified,
        size: parseInt(item.size),
      }));
    const fileCount = parseInt(count[0].count);
    const folderCount = parseInt(count[1].count);
    const total = fileCount + folderCount;
    let data = {};
    data["files"] = await getSignedURls(files, username);
    data["folders"] = folders;
    data["total"] = total;
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.json(500).json({ success: false, msg: err });
  }
  next();
};

router.get("/", verifyToken, getFilesFolders);

export { router as getFilesSubfolders };
