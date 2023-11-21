import express from "express";
const router = express.Router();
import csurf from "csurf";
import { origin } from "../config/config.js";
import { pool } from "../server.js";
import { verifyToken } from "../auth/auth.js";
const SINGLEFILE = "singleFile";

router.use(csurf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

router.post("/", verifyToken, async (req, res) => {
  const { items } = req.body;
  const username = req.user.Username;
  const subFolderRegexp = "^(/[^/]+)$";
  let folderCon;
  let fileCon;
  let deletedFileCon;
  try {
    folderCon = await pool["directories"].getConnection();
    fileCon = await pool["files"].getConnection();
    deletedFileCon = await pool["deleted_files"].getConnection();
  } catch (err) {
    console.error(err);
  }

  for (const item of items) {
    if (item.item !== SINGLEFILE) {
      if (item?.items) {
        for (const el of item?.items) {
          try {
            const { path, limit } = el;
            const { begin, end } = limit;
            const dirParts = path.split("/").slice(2).join("/");
            const device = path.split("/")[1];
            let dir = dirParts === "" ? "/" : dirParts;
            dir = dir.replace(/\(/g, "\\(");
            dir = dir.replace(/\)/g, "\\)");
            const regexp = `^${dir}(/[^/]+)*$`;
            if (!el?.root) {
              const values = [username, device, regexp, begin, end];
              await folderCon.execute(
                `CALL putBackFilesFromTrash(?,?,?,?,?)`,
                values
              );
            } else {
              const values = [username, device, dir, begin, end];
              await folderCon.execute(
                `CALL putBackFilesFromTrash2(?,?,?,?,?)`,
                values
              );
            }
          } catch (err) {
            console.error(err);
          }
        }
      } else {
        try {
          const { path, begin, end } = item;
          const dirParts = path.split("/").slice(2).join("/");
          const device = path.split("/")[1];
          let dir = dirParts === "" ? "/" : dirParts;
          dir = dir.replace(/\(/g, "\\(");
          dir = dir.replace(/\)/g, "\\)");
          const regexp = `^${dir}(/[^/]+)*$`;
          if (!item?.root) {
            const values = [username, device, regexp, begin, end];
            await folderCon.execute(
              `CALL putBackFilesFromTrash(?,?,?,?,?)`,
              values
            );
          } else {
            const values = [username, device, dir, begin, end];
            await folderCon.execute(
              `CALL putBackFilesFromTrash2(?,?,?,?,?)`,
              values
            );
          }
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      const pathPart = item.path.split("/");
      const device = pathPart[1] === "" ? "/" : pathPart[1];
      const dirPart = pathPart.slice(2).join("/");
      const dir = dirPart === "" ? "/" : dirPart;
      const filename = item.name;
      const value = [username, device, dir, filename];
      await fileCon.execute(`CALL restoreFileFromTrash(?,?,?,?)`, value);
    }
  }
  try {
    const del_val = [username, subFolderRegexp];
    await folderCon.execute(`CALL DeletePaths(?,?)`, del_val);
  } catch (err) {
    console.error(err);
  }
  try {
    if (fileCon) {
      fileCon.release();
    }
    if (folderCon) {
      folderCon.release();
    }
    if (deletedFileCon) {
      deletedFileCon.release();
    }
  } catch (err) {
    console.error(err);
  }

  // Plan of action
  // 1. Check whether the item we're trying to restore is batch of multiple items, or a single item
  //    a. if single Item.
  //        i. run a query to extract files based on device, directory,username from deleted_files.files table
  //        ii. insert the files into files.files table
  //        iii. run similar query as i to retrieve files from deleted_files.file_versions table
  //        iv. insert step 3 files into versions.file_versions table.
  //    b. Multiple items.
  //        i. Iterate over every item.
  //        ii. Perform steps in a
  // 2. Check whether multiple batches have been selected, and repeat steps in 1.
  res.status(200).json("Response Received");
});

export { router as restoreTrashItems };
