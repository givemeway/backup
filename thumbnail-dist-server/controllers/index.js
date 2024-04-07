import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const s3client = new S3Client({
  // region: process.env.REGION,
  endpoint: process.env.ENDPOINT_E2,
  credentials: {
    accessKeyId: process.env.ACCESSKEY_E2,
    secretAccessKey: process.env.SECRETKEY_E2,
  },
});

export const getSignedURL = async (req, res) => {
  try {
    const { key, username } = req.query;
    const Key = `${username}/${key}`;
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET,
      Key,
    });
    const signedURL = await getSignedUrl(s3client, command, {
      expiresIn: 3600,
    });
    res.status(200).json(signedURL);
  } catch (err) {
    console.log(err);
    res.status(404).json("Key Not found");
  }
};
