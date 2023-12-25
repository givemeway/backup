import express from "express";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();
import csurf from "csurf";
import { origin } from "../config/config";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../server";

const BUCKET = process.env.BUCKET;

const deleteQuery = `DELETE FROM deleted_files.files 
                    
                    `;

router.use(csurf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

router.post("/", async (req, res) => {
  const items = JSON.parse(req.body.items);
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
              const dirParts = path.split("/").slice(2).join("/");
              const device = path.split("/")[1];
              let dir = dirParts === "" ? "/" : dirParts;
              dir = dir.replace(/\(/g, "\\(");
              dir = dir.replace(/\)/g, "\\)");
              const regexp = `^${dir}(/[^/]+)*$`;
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
          } catch (err) {
            console.error(err);
          }
        }
      } else {
        const Key = `${username}/${item.id}`;
        const deleteCommand = new DeleteObjectCommand({ Bucket: BUCKET, Key });
        try {
          await s3Client.send(deleteCommand);
          await deletedFilesCon.excute(
            `DELETE FROM deleted_files.files WHERE uuid = ?`,
            [item.id]
          );
        } catch (err) {}
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

export { router as DeleteTrashItems };
