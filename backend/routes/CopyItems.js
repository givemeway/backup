import express from "express";
const router = express.Router();
import dotenv from "dotenv";
await dotenv.config();
import csurf from "csurf";
import { verifyToken } from "../auth/auth.js";
import { origin } from "../config/config.js";

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

const insertFileInDB = async (con, device, username, filename, dir, to) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = `SELECT origin,versions from data.files where filename = ? AND directory = ? AND device = ? AND username =?`;
      let val = [];
      if (to === "/") {
        val = [filename, "/", "/", username];
      } else {
        const to_device = to.split("/")[0];
        const to_dirParts = to.split("/").slice(1).join("/");
        const to_dir = to_dirParts === "" ? "/" : to_dirParts;
        val = [filename, to_dir, to_device, username];
      }
      console.log(val);
      const result = await sqlExecute(con, query, val);
      if (result.length === 0) {
        // TODO insert without any changes
        const query = `INSERT INTO data.files 
                        SELECT * from data.files 
                        WHERE filename = ? AND directory = ? AND device = ? AND username = ? 
                        ON duplicate KEY 
                        UPDATE directory = ?, device = ?`;
        if (to === "/") {
          val = [filename, dir, device, username, "/", "/"];
        } else {
          const to_device = to.split("/")[0];
          const to_dirParts = to.split("/").slice(1).join("/");
          const to_dir = to_dirParts === "" ? "/" : to_dirParts;
          val = [filename, dir, device, username, to_dir, to_device];
        }
        console.log(val);
        console.log(to);
        await sqlExecute(con, query, val);
      } else {
        // TODO merge both and their version
        reject({
          success: false,
          msg: "duplicate",
          filename: filename,
          dir: dir,
          device: device,
        });
      }
      resolve();
    } catch (err) {
      reject({
        success: false,
        msg: err,
        filename: filename,
        dir: dir,
        device: device,
      });
    }
  });
};

const organizeItemsInDB = async (con, username, from, to, failed) => {
  return new Promise((resolve, reject) => {
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
        resolve();
      })
      .catch((err) => {
        console.error(err);
        failed.push(err);
        reject();
      });
  });
};

const organizeItems = async (req, res, next) => {
  const username = req.user.Username;
  const { files, folders } = req.body;
  const to = req.query.to;
  const con = req.headers.connection;
  const failed = [];
  console.log(to);
  console.log(files, folders);
  for (const file of files ? files : []) {
    try {
      const params = new URLSearchParams(file.path);
      const device = params.get("device");
      const filename = params.get("file");
      const dir = params.get("dir");
      const dst = to === "/" ? "/" : to.split("/").slice(1).join("/");
      await insertFileInDB(con, device, username, filename, dir, dst);
    } catch (err) {
      failed.push(err);
    }
  }

  //   for (const folder of folders ? folders : []) {
  //     try {
  //       const folderPath = folder.path.split("/").slice(1).join("/");
  //       const dst = to === "/" ? "/" : to.split("/").slice(1).join("/");
  //       console.log("processing....");
  //       await organizeItemsInDB(con, username, folderPath, dst, failed);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  console.log("returned the value...........");
  res.status(200).json({
    success: true,
    msg: "moved",
    copied: files?.length
      ? files.length
      : 0 + folders?.length
      ? folders.length
      : 0 + failed.length,
    failed: failed,
  });
};

router.post("*", verifyToken, organizeItems);

export { router as copyItems };
