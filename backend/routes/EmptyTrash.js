import express from "express";
const router = express.Router();
import dotenv from "dotenv";
import { s3Client } from "../server.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { pool } from "../server.js";
import { verifyToken } from "../auth/auth.js";
dotenv.config();
const BUCKET = process.env.BUCKET;

router.get("/", verifyToken, async (req, res) => {
  try {
    const username = req.user.Username;
    const trashItemsQuery = `SELECT uuid FROM deleted_files.files WHERE username = ?`;
    const deleteItemsQuery = `DELETE FROM deleted_files.files WHERE username = ? AND uuid = ?`;
    const deleteDirsQuery = `DELETE FROM deleted_directories.directories WHERE username = ?`;
    const deletedFilesCon = await pool["deleted_files"].getConnection();
    const deletedFolderCon = await pool["deleted_directories"].getConnection();
    const val = [username];
    const [rows, fields] = await deletedFilesCon.execute(trashItemsQuery, val);
    for (const row of rows) {
      const Key = `${username}/${row.uuid}`;
      const command = new DeleteObjectCommand({ Bucket: BUCKET, Key });
      await s3Client.send(command);
      const delVal = [username, row.uuid];
      const [rows, fields] = await deletedFilesCon.execute(
        deleteItemsQuery,
        delVal
      );
    }
    await deletedFolderCon.execute(deleteDirsQuery, [username]);
    if (deletedFilesCon) {
      deletedFilesCon.release();
    }
    if (deletedFolderCon) {
      deletedFolderCon.release();
    }
    res.status(200).json({ success: true, msg: "success" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err });
  }
});

export { router as emptyTrash };
