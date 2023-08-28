import path from "node:path";
import archiver from "archiver";
import fs from "node:fs";
import dotenv from "dotenv";
import { decryptFile } from "../utils/decrypt.js";
await dotenv.config();
import { parentPort } from "node:worker_threads";
import async from "async";

const archiveDirectoriesAndFiles = (files, port) => {
  const archive = archiver("zip", {
    zlib: { level: 9 },
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
  archive.on("error", function (err) {
    console.error(err);
  });
  archive.on("data", (chunk) => {
    port.postMessage({ mode: "chunk", chunk });
  });

  try {
    for (let i = 0; i < files.length; i++) {
      const inputFile = fs.createReadStream(files[i].path);
      const fileStream = decryptFile(
        inputFile,
        files[i].salt,
        files[i].iv,
        "sandy86kumar"
      );
      inputFile.on("error", (err) => {
        console.error(err);
      });

      archive.append(fileStream, {
        name: files[i].filename,
        prefix: files[i].relativePath,
      });
    }
  } catch (err) {
    console.error(err);
  }
  archive.finalize();
};

parentPort.on("message", ({ files, port }) => {
  archiveDirectoriesAndFiles(files, port);
});
