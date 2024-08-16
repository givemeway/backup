import { createHash } from "crypto";
import { Avatar } from "../models/mongodb.js";
import { s3Client } from "../server.js";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();
const Bucket = process.env.BUCKET;

export const deleteAvatar = async (req, res) => {
  try {
    const username = req.user.Username;
    const id = createHash("sha1").update(username).digest("hex");
    const user = await Avatar.findOneAndUpdate(
      { username: username },
      { has_avatar: false, avatar_url: [] }
    );
    const Objects = [
      { Key: `avatar/${username}/${id}` },
      { Key: `avatar/${username}/${id}_32w` },
      { Key: `avatar/${username}/${id}_640w` },
    ];
    const command = new DeleteObjectsCommand({ Bucket, Delete: { Objects } });
    await s3Client.send(command);
    res.status(200).json({ success: true, msg: "Avatar Photo Deleted!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: err });
  }
};
