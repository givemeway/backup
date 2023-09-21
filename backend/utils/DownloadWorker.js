import { parentPort, workerData } from "node:worker_threads";
import { decryptFile } from "./decrypt.js";
import archiver from "archiver";
import fs from "node:fs";
import async from "async";

const appendFileToArchive = (archive, file) => {
  return new Promise((resolve, reject) => {
    const inputFile = fs.createReadStream(file.path);
    inputFile.on("error", (err) => {
      reject(err);
    });
    const fileStream = decryptFile(
      inputFile,
      file.salt,
      file.iv,
      "sandy86kumar"
    );
    inputFile.on("error", (err) => {
      reject(err);
    });

    archive.append(fileStream, {
      name: file.filename,
      prefix: file.relativePath,
    });
    archive.on("error", (err) => {
      reject(err);
    });
    archive.on("entry", () => {
      resolve();
    });
  });
};

const processFiles = async (files, archive) => {
  return new Promise(async (resolve, reject) => {
    try {
      const promises = [];
      let i = 0;
      for (const file of files) {
        console.log(i);
        promises.push(async () => {
          try {
            await appendFileToArchive(archive, file);
          } catch (err) {
            console.error(err);
          }
        });
        i++;
      }
      await async.parallelLimit(promises, 10);
      console.log("procesing complete");
      resolve("done");
    } catch (err) {
      reject(err);
    }
  });
};

const archiveDirectoriesAndFiles = (files, archive) => {
  return new Promise((resolve, reject) => {
    // console.log("inside the archive ");
    // const input = fs.createWriteStream("./QDrive.zip");
    // const archive = archiver("zip", {
    //   zlib: { level: 9 }, // Sets the compression level.
    // });
    // input.on("close", () => {
    //   console.log("zip file closed");
    // });

    archive.on("end", () => {
      console.log(archive.pointer() + " total bytes");
      console.debug("end event");
      resolve(archive.pointer() + " total bytes");
    });

    archive.on("warning", function (err) {
      if (err.code === "ENOENT") {
        // log warning
        console.error(err);
        reject(err);
      } else {
        // throw error
        console.error(err);
        reject(err);
      }
    });
    archive.on("error", function (err) {
      console.error(err);
      reject(err);
    });
    // archive.pipe(input);
    processFiles(files, archive)
      .then(() => {
        // archive.finalize();
        resolve("done");
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
};

const { files, archive } = workerData;
console.log("inside worker");
archiveDirectoriesAndFiles(files, archive)
  .then((data) => parentPort.postMessage(data))
  .catch((err) => parentPort.postMessage(err));
