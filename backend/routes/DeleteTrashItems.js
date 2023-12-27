import express from "express";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();
import csurf from "csurf";
import { origin } from "../config/config.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, pool } from "../server.js";
import { verifyToken } from "../auth/auth.js";

const BUCKET = process.env.BUCKET;
const SINGLEFILE = "singleFile";
const deleteFileInTrashQuery = `DELETE FROM deleted_files.files WHERE username = ? AND uuid = ?`;
const getFilesInTrashQuery = `SELECT uuid FROM deleted_files.files 
                              WHERE username = ? AND device = ? AND directory REGEXP ? 
                              ORDER BY directory
                              LIMIT ?,?;`;

const deleteS3Object = (username, uuid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const Key = `${username}/${uuid}`;
      const deleteCommand = new DeleteObjectCommand({
        Bucket: BUCKET,
        Key,
      });
      await s3Client.send(deleteCommand);
      resolve();
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const deleteDBItem = (con, username, uuid) => {
  return new Promise(async (resolve, reject) => {
    try {
      await con.beginTransaction();
      const values = [username, uuid];
      await con.query(deleteFileInTrashQuery, values);
      await con.commit();
      resolve();
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const getDeletedItems = (con, username, path, begin, end) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dirParts = path.split("/").slice(2).join("/");
      const device = path.split("/")[1];
      let dir = dirParts === "" ? "/" : dirParts;
      dir = dir.replace(/\(/g, "\\(");
      dir = dir.replace(/\)/g, "\\)");
      const regexp = `^${dir}(/[^/]+)*$`;
      const values = [username, device, regexp, begin, end];
      const [rows, fields] = await con.query(getFilesInTrashQuery, values);
      resolve(rows);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

router.use(csurf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

router.post("/", verifyToken, async (req, res) => {
  // const items = JSON.parse(req.body.items);
  const items = req.body.items;

  const username = req.user.Username;
  const subFolderRegexp = "^(/[^/]+)$";

  try {
    const deletedFilesCon = await pool["deleted_files"].getConnection();
    const deletedFoldersCon = await pool["deleted_directories"].getConnection();

    for (const item of items) {
      if (item.item !== SINGLEFILE) {
        if (item?.items) {
          for (const el of item?.items) {
            try {
              const { path, limit } = el;
              const { begin, end } = limit;

              const rows = await getDeletedItems(
                deletedFilesCon,
                username,
                path,
                begin,
                end
              );
              for (const row of rows) {
                try {
                  await deleteS3Object(username, row.uuid);
                  await deleteDBItem(deletedFilesCon, username, row.uuid);
                } catch (err) {
                  console.error(err);
                }
              }
            } catch (err) {
              console.error(err);
              break;
            }
          }
        } else {
          try {
            const { path, begin, end } = item;
            const rows = await getDeletedItems(
              deletedFilesCon,
              username,
              path,
              begin,
              end
            );

            for (const row of rows) {
              try {
                await deleteS3Object(username, row.uuid);
                await deleteDBItem(deletedFilesCon, username, row.uuid);
              } catch (err) {
                console.error(err);
              }
            }
          } catch (err) {
            console.error(err);
            break;
          }
        }
      } else {
        try {
          await deleteS3Object(username, item.id);
          await deleteDBItem(deletedFilesCon, username, item.id);
        } catch (err) {
          console.error(err);
          break;
        }
      }
    }

    if (deletedFilesCon) {
      deletedFilesCon.release();
    }
    const values = [username, subFolderRegexp];
    await deletedFoldersCon.execute(`CALL DeletePaths(?,?)`, values);
    if (deletedFoldersCon) {
      deletedFoldersCon.release();
    }
    res.status(200).json({ success: true, msg: "Deleted Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

export { router as deleteTrashItems };
