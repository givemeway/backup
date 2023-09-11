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

const sqlExecute = (con, query, values) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows, fields] = await con.execute(query, values);
      resolve(rows);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
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

const organizeFileInDB = async (con, device, username, filename, dir, to) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const con = req.headers.connection;
      // const device = req.query.device;
      // const username = req.user.Username;
      // const filename = req.query.filename;
      // const dir = req.query.dir;
      // const to = req.query.to;

      if (to === "/") {
        const query = `UPDATE data.files SET directory = ?, device = ? WHERE directory = ? AND device = ? AND filename = ? AND username= ?`;
        const val = ["/", "/", dir, device, filename, username];
        await sqlExecute(con, query, val);
        resolve();
      } else {
        const query = `UPDATE data.files SET directory = ?, device = ? WHERE directory = ? AND device = ? AND filename = ? AND username= ?`;
        const to_device = to.split("/")[0];
        const to_dirParts = to.split("/").slice(1).join("/");
        const to_dir = to_dirParts === "" ? "/" : to_dirParts;
        const val = [to_dir, to_device, dir, device, filename, username];
        await sqlExecute(con, query, val);
        resolve();
      }
    } catch (err) {
      reject(err);
    }
  });
};

const organizeItemsInDB = async (con, username, from, to, failed) => {
  // 1. Get the files in the Root ( directory chosen to be moved)
  // 2. Update the path of the files
  // 3. Get the folders in the root ( directory chosen to be moved)
  // 4. repeat steps from 1 to 3 in every folder.

  // from = /backup-frontend
  // to = /New folder
  // result = /New folder/backup-frontend

  // const con = req.headers.connection;
  // const username = req.user.Username;
  // const from = req.query.from;
  // const to = req.query.to;
  const srcFolder =
    from.split("/").length > 1
      ? from.split("/").slice(-1)[0]
      : from.split("/")[0];
  let dst = to + "/" + srcFolder;
  if (to === "/") {
    dst = srcFolder;
  }

  const from_device = from === "/" ? "/" : from.split("/")[0];
  const from_dirParts = from.split("/").slice(1).join("/");
  const from_dir = from_dirParts === "" ? "/" : from_dirParts;

  const to_device = dst.split("/")[0];
  const to_dirParts = dst.split("/").slice(1).join("/");
  const to_dir_ori = to_dirParts === "" ? "/" : to_dirParts;

  const updateDB = async (dst_dir, src_dir) => {
    try {
      const filesInDirRootQuery = `UPDATE data.files SET directory = ?, device = ? WHERE directory = ? AND device = ? AND username= ?`;
      const values = [dst_dir, to_device, src_dir, from_device, username];
      await sqlExecute(con, filesInDirRootQuery, values);
      const foldersInDirRoot = await getFolders(
        con,
        src_dir,
        username,
        from_device
      );
      if (foldersInDirRoot.length === 0) {
        return;
      }

      for (const folder of foldersInDirRoot) {
        console.log(folder.path);
        const dirParts = folder.path.split("/").slice(2).join("/");
        const dir = dirParts === "" ? "/" : dirParts;
        let dstPath;
        if (to_dir_ori === "/") {
          dstPath = folder.path.split(from)[1].split("/").slice(1).join("/");
        } else {
          dstPath = to_dir_ori + folder.path.split(from)[1];
        }
        const query = `UPDATE data.directories SET device =?, path = ?  WHERE username = ? AND device = ? AND path = ? `;
        const pth = `/${to_device}/${dstPath}`;
        const val = [to_device, pth, username, from_device, folder.path];
        await sqlExecute(con, query, val);
        await updateDB(dstPath, dir);
      }
    } catch (err) {
      failed.push(src_dir);
    }
  };

  updateDB(to_dir_ori, from_dir)
    .then(async () => {
      const query = `UPDATE data.directories SET device =?, path = ?  WHERE username = ? AND device = ? AND path = ?`;
      if (to === "/") {
        const pth = `/${to_device}`;
        const val = [to_device, pth, username, from_device, "/" + from];
        await sqlExecute(con, query, val);
      } else {
        const pth = `/${to}/${srcFolder}`;
        const val = [to_device, pth, username, from_device, "/" + from];
        await sqlExecute(con, query, val);
      }
      // next();
    })
    .catch((err) => {
      // res.status(500).json(err);
      console.error(err);
      failed.push(err);
    });
};

const organizeItems = async (req, res, next) => {
  const username = req.user.Username;
  const files = req.body.files;
  const folders = req.body.folders;
  const to = req.query.to;
  const from = req.query.from;
  const con = req.headers.connection;
  const failed = [];
  for (const file of files) {
    try {
      const params = new URLSearchParams(file.path);
      const device = params.get("device");
      const filename = params.get("file");
      const dir = params.get("dir");
      await organizeFileInDB(con, device, username, filename, dir, to);
    } catch (err) {
      failed.push(file);
    }
  }

  for (const folder of folders) {
    try {
      await organizeItemsInDB(con, username, folder.path, to, failed);
    } catch (err) {
      console.error(err);
    }
  }
};

router.post("/", verifyToken, organizeItems, async (req, res) => {
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
