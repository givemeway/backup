import path from "node:path";
import archiver from "archiver";
import fs from "node:fs";
import dotenv from "dotenv";
import { decryptFile } from "../utils/decrypt.js";
await dotenv.config();
import { parentPort } from "node:worker_threads";
import async from "async";

const addFilesToArchive = (file, archive) => {
  return new Promise((resolve, reject) => {
    const inputFile = fs.createReadStream(file.path);
    const fileStream = decryptFile(
      inputFile,
      file.salt,
      file.iv,
      "sandy86kumar"
    );
    inputFile.on("error", (err) => {
      console.error(err);
      reject(err);
    });
    fileStream.on("end", () => {
      inputFile.destroy();
      resolve();
    });

    archive.append(fileStream, {
      name: file.filename,
      prefix: file.relativePath,
    });
  });
};

const archiveDirectoriesAndFiles = async (files, port) => {
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
        await addFilesToArchive(file, archive);
      } catch (err) {
        console.error(`Error Adding file ${file.filename}`);
      }
    });
  } catch (err) {
    console.error(err);
  }
  archive.finalize();
};

parentPort.on("message", ({ files, port }) => {
  archiveDirectoriesAndFiles(files, port);
});
