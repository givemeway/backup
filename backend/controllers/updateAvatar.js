import { Upload } from "@aws-sdk/lib-storage";
import formidable from "formidable";
import { PassThrough } from "stream";
import { s3Client as client } from "../server.js";
import { Avatar } from "../models/mongodb.js";
import { createHash } from "crypto";
import dotenv from "dotenv";
import { initiKafkaProducer } from "../utils/kafka.js";
dotenv.config();
const Bucket = process.env.BUCKET;

export const updateAvatar = (req, res) => {
  try {
    const { Username, first, last } = req.user;
    const hash = createHash("sha1").update(Username).digest("hex");
    let imgData = {};
    imgData.id = hash;
    imgData.username = Username;
    imgData.filename = hash;
    imgData.avatar = true;
    const options = {
      maxFileSize: 200 * 1024 * 1024,
      fileWriteStreamHandler: (file) => {
        const Key = `avatar/${Username}/${hash}`;
        const Body = new PassThrough();
        const params = { Bucket, Key, Body };
        const upload = new Upload({ client, params });

        upload.on("error", (error) => {
          console.error(error);
          res.status(500).json({ msg: error, success: false });
        });
        upload.on("uploaded", (details) => {
          console.log(details);
        });
        upload
          .done()
          .then(async (response) => {
            console.log(response);
            const user = await Avatar.findOne({ username: Username });
            if (user) {
              await Avatar.findOneAndUpdate(
                { username: Username },
                { avatar_url: response.Location, has_avatar: true }
              );
            } else {
              await Avatar.create({
                username: Username,
                firstName: first,
                lastName: last,
                has_avatar: true,
                avatar_url: response.Location,
                initial: `${first}${last}`,
              });
            }
            await initiKafkaProducer(imgData);
            res.status(200).json({ msg: response, success: true });
          })
          .catch((err) => {
            // res.status(500).json({ msg: err, success: false });
          });

        return Body;
      },
    };
    const form = formidable(options);
    form.parse(req, (err, fields, files) => {
      if (err) res.send(500).json({ success: false, msg: err });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
  }
};
