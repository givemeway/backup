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

const listAllFiles = async (dir) => {
  let allFiles = [];
  try {
    const files = await fs.promises.readdir(dir);

    for (let file of files) {
      const fullPath = path.join(dir, file);
      const stat = await fs.promises.stat(fullPath);
      if (stat.isDirectory()) {
        const subFiles = await listAllFiles(fullPath);
        allFiles = allFiles.concat(subFiles);
      } else {
        allFiles.push(fullPath);
      }
    }
  } catch (error) {
    console.log(error);
  }

  return allFiles;
};

router.post("/", verifyToken, async (req, res) => {
  const username = req.user.Username;
  const from = req.query.from;
  const to = req.query.to;

  const srcFolder =
    from.split("/").length > 1 ? from.split("/")[1] : from.split("/")[0];
  const sourceAbsPath = path.join(root, username, from);
  const destinationAbspath = path.join(root, username, to, srcFolder);

  console.log(sourceAbsPath, destinationAbspath);

  moveDirectory(sourceAbsPath, destinationAbspath);
  try {
    rimraf(sourceAbsPath, { preserveRoot: false }, function (err) {
      if (err) console.log(err);
      else console.log("Directory removed successfully");
    });
  } catch (err) {
    console.log(err);
  }

  res.status(200).json("success");
});

export { router as moveItems };
