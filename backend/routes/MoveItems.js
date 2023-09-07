import express from "express";
const router = express.Router();
import dotenv from "dotenv";
await dotenv.config();
import csurf from "csurf";
import { verifyToken } from "../auth/auth.js";
import { origin } from "../config/config.js";
import fs from "node:fs";
import path from "node:path";
import { rimraf } from "rimraf";

const root = process.env.VARIABLE;

router.use(csurf({ cookie: true }));

const sqlExecute = async (con, query, values) => {
  try {
    const [rows, fields] = await con.execute(query, values);
    return rows;
  } catch (error) {
    console.log(error);
    return;
  }
};

const getFolders = async (con, currentDir, username, devicename) => {
  const [start, end] = [0, 1000000];
  let regex_2 = ``;
  let path = ``;
  if (devicename === "/") {
    regex_2 = `^\\.?(/[^/]+)$`;
  } else if (currentDir === "/") {
    regex_2 = `^\\.?/${devicename}(/[^/]+)$`;
  } else {
    path = `/${devicename}/${currentDir}`;
    regex_2 = `^\\.?${path}(/[^/]+)$`;
  }
  console.log(regex_2);
  const foldersQuery = `SELECT 
                        id,folder,path,device 
                        FROM data.directories 
                        WHERE username = ?
                        AND
                        path REGEXP ? limit ${start},${end};`;
  const rows = await sqlExecute(con, foldersQuery, [username, regex_2]);
  return rows;
};

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const createDir = (dir) => {
  return new Promise((resolve, reject) => {
    fs.access(dir, (err) => {
      if (err) {
        fs.mkdir(dir, { recursive: true }, (err) => {
          if (err) reject(err);
          else resolve();
        });
      } else {
        return resolve();
      }
    });
  });
};

function moveDirectory(sourceDir, destinationDir) {
  // ensure destination directory exists
  try {
    fs.mkdirSync(destinationDir, { recursive: true });

    // get list of items in the source directory
    let items = fs.readdirSync(sourceDir);

    for (let item of items) {
      let sourcePath = path.join(sourceDir, item);
      let destinationPath = path.join(destinationDir, item);

      // check if item is a file or directory
      if (fs.lstatSync(sourcePath).isDirectory()) {
        // recursively move directory
        moveDirectory(sourcePath, destinationPath);
      } else {
        // move file
        fs.renameSync(sourcePath, destinationPath);
      }
    }

    // remove source directory
    // rimraf(sourceDir, { preserveRoot: false }, function (err) {
    //   if (err) console.log(err);
    //   else console.log("Directory removed successfully");
    // });
  } catch (err) {
    console.log(err);
  }
}

const moveFiles = async (username, from, to, sourceAbsPath) => {
  const files = await listAllFiles(sourceAbsPath);

  files.forEach((file) => {
    const srcFolder =
      from.split("/").length > 1 ? from.split("/")[1] : from.split("/")[0];
    const fileRelativeSrcPath = file.split(srcFolder)[1];
    const fileRelativeDstPath = path.join(
      root,
      username,
      to,
      srcFolder,
      fileRelativeSrcPath
    );
    createDir(path.dirname(fileRelativeDstPath)).then(() => {
      try {
        fs.copyFileSync(file, fileRelativeDstPath, fs.constants.COPYFILE_EXCL);
        fs.unlinkSync(file);
      } catch (err) {
        console.log(err);
      }
    });
  });
};

const organizeFoldersInDB = async (req, res, next) => {
  // from = New folder/canned
  // to = New folder/new
  // path = New folder/new/canned
  // UPDATE files.directories SET device =?, path = ?  WHERE username = ? AND path regexp `^\.?/${}/${}(/[^/]+)$`
};

const organizeFilesInDB = async (req, res, next) => {
  // 1. Get the files in the Root ( directory chosen to be moved)
  // 2. Update the path of the files
  // 3. Get the folders in the root ( directory chosen to be moved)
  // 4. repeat steps from 1 to 3 in every folder.

  // from = /backup-frontend
  // to = /New folder
  // result = /New folder/backup-frontend

  const con = req.headers.connection;
  const username = req.user.Username;
  const from = req.query.from;
  const to = req.query.to;

  const srcFolder =
    from.split("/").length > 1
      ? from.split("/").slice(-1)[0]
      : from.split("/")[0];
  let dst = to + "/" + srcFolder;
  console.log(srcFolder, dst);
  if (to === "/") {
    dst = srcFolder;
  }

  const from_device = from === "/" ? "/" : from.split("/")[0];
  const from_dirParts = from.split("/").slice(1).join("/");
  const from_dir = from_dirParts === "" ? "/" : from_dirParts;
  console.log(from_device);

  const to_device = dst.split("/")[0];
  const to_dirParts = dst.split("/").slice(1).join("/");
  const to_dir_ori = to_dirParts === "" ? "/" : to_dirParts;

  const updateDB = async (dst_dir, src_dir) => {
    const filesInDirRoot = `UPDATE data.files SET directory = ?, device = ? WHERE directory = ? AND device = ? AND username= ?`;
    console.log(dst_dir, "|", to_device, "|", src_dir, "|", from_device);
    const values = [dst_dir, to_device, src_dir, from_device, username];
    await sqlExecute(con, filesInDirRoot, values);
    const foldersInDirRoot = await getFolders(
      con,
      src_dir,
      username,
      from_device
    );
    console.log(foldersInDirRoot);
    if (foldersInDirRoot.length === 0) {
      console.log("no folder in current dir");
      return;
    }

    for (const folder of foldersInDirRoot) {
      console.log(folder.path);

      const dirParts = folder.path.split("/").slice(2).join("/");
      const dir = dirParts === "" ? "/" : dirParts;
      console.log(
        "|",
        to_dir_ori,
        "|",
        to_dir_ori + folder.path.split(from)[1],
        "|",
        dir
      );
      let dstPath;
      if (to_dir_ori === "/") {
        dstPath = folder.path.split(from)[1].split("/")[1];
      } else {
        dstPath = to_dir_ori + folder.path.split(from)[1];
      }
      const query = `UPDATE data.directories SET device =?, path = ?  WHERE username = ? AND device = ? AND path = ?`;
      const pth = `/${to_device}/${dstPath}`;
      const val = [to_device, pth, username, from_device, folder.path];
      await sqlExecute(con, query, val);
      await updateDB(dstPath, dir);
    }
    const query = `INSERT INTO data.directories (username,device,folder,path) VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`;
    if (to === "/") {
    } else {
      const pth = `/${to_device}/${srcFolder}`;
      const val = [username, to_device, srcFolder, pth];
      await sqlExecute(con, query, val);
    }

    console.log("exited");
  };

  console.log(to_dir_ori, to_device, from_dir, from_device);
  updateDB(to_dir_ori, from_dir);
};

router.post("/", verifyToken, organizeFilesInDB, async (req, res) => {
  const username = req.user.Username;
  const from = req.query.from;
  const to = req.query.to;

  const srcFolder =
    from.split("/").length > 1 ? from.split("/")[1] : from.split("/")[0];
  const sourceAbsPath = path.join(root, username, from);
  const destinationAbspath = path.join(root, username, to, srcFolder);

  console.log(sourceAbsPath);
  console.log(destinationAbspath);

  // moveDirectory(sourceAbsPath, destinationAbspath);
  // try {
  //   rimraf(sourceAbsPath, { preserveRoot: false }, function (err) {
  //     if (err) console.log(err);
  //     else console.log("Directory removed successfully");
  //   });
  // } catch (err) {
  //   console.log(err);
  // }

  res.status(200).json("success");
});

export { router as moveItems };
