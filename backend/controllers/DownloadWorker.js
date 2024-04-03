import path from "node:path";
import archiver from "archiver";
import fs from "node:fs";
import dotenv from "dotenv";
import { decryptFile } from "../utils/decrypt.js";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
await dotenv.config();
import { parentPort } from "node:worker_threads";
import async from "async";

const BUCKET = process.env.BUCKET;

let s3Client;
try {
  s3Client = new S3Client({
    // region: process.env.REGION,
    endpoint: process.env.ENDPOINT_E2,
    credentials: {
      secretAccessKey: process.env.SECRETKEY_E2,
      accessKeyId: process.env.ACCESSKEY_E2,
    },
  });
} catch (err) {
  console.log(err);
}

const addFilesToArchive = (file, enc, archive) => {
  return new Promise(async (resolve, reject) => {
    try {
      const command = new GetObjectCommand({
        Bucket: BUCKET,
        Key: file.key,
      });
      const data = await s3Client.send(command);
      // const inputFile = fs.createReadStream(file.path);

      const fileStream = await decryptFile(data.Body, file.salt, file.iv, enc);
      // inputFile.on("error", (err) => {
      //   console.error(err);
      //   reject(err);
      // });
      fileStream.on("end", () => {
        // inputFile.destroy();
        resolve();
      });

      fileStream.on("error", (err) => {
        reject(err);
      });

      archive.append(fileStream, {
        name: file.filename,
        prefix: file.relativePath,
      });
    } catch (err) {
      reject(err);
    }
  });
};

const archiveDirectoriesAndFiles = async (files, enc, port) => {
  const archive = archiver("zip", {
    zlib: { level: 9 },
    statConcurrency: 8,
  });
  archive.on("end", () => {
    console.log(archive.pointer() + " total bytes");
    port.postMessage({ mode: "complete", chunk: [] });
  });
  archive.on("warning", function (err) {
    if (err.code === "ENOENT") {
      // log warning
      console.error(err);
    } else {
      // throw error
      console.error(err);
    }
  });
  archive.on("entry", (entry) => {
    console.log(entry.name);
  });
  archive.on("error", function (err) {
    console.error(err);
  });
  archive.on("data", (chunk) => {
    port.postMessage({ mode: "chunk", chunk });
  });

  try {
    await async.eachLimit(files, 10, async (file) => {
      try {
        await addFilesToArchive(file, enc, archive);
      } catch (err) {
        console.error(`Error Adding file ${file.filename}`);
      }
    });
  } catch (err) {
    console.error(err);
  }
  archive.finalize();
};

parentPort.on("message", ({ files, enc, port }) => {
  archiveDirectoriesAndFiles(files, enc, port);
});
