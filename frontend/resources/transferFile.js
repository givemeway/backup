import { fileUploadURL, username, devicename } from "../config/config.js";
import {
  encryptFile,
  encryptData,
  generateIVSaltDerivedKey,
  getPasswordkey,
} from "./encryptFile.js";

import { hashChunk } from "./hashFile.js";

const arrayBufferToHex = (buffer) => {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const arrayBufferToBase64 = (buffer) => {
  let binary = "";
  let bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const arrayBufferToBinaryString = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binaryString = "";
  for (let i = 0; i < bytes.length; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  return binaryString;
};

const binaryStringToArrayBuffer = (binaryString) => {
  let buffer = new ArrayBuffer(binaryString.length);
  let view = new Uint8Array(buffer);
  for (let i = 0; i < binaryString.length; i++) {
    view[i] = binaryString.charCodeAt(i);
  }
  return buffer;
};

const uploadFile = (
  file,
  cwd,
  progressBar,
  hashHex,
  token,
  CSRFToken,
  modified,
  uploadCountElement,
  uploadCount,
  totalCount
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const filePath =
        cwd === "/"
          ? file.webkitRelativePath
          : cwd + "/" + file.webkitRelativePath;
      const pathParts = filePath.split("/");
      pathParts.pop();
      const dir = pathParts.join("/");

      let fileStat = {
        atimeMs: file.lastModified,
        mtimeMs: file.lastModified,
        mtime: file.lastModifiedDate,
        modified: modified,
        size: file.size,
      };

      let headers = {
        filename: file.name,
        dir: dir,
        devicename: devicename,
        username: username,
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${file.name}"`,
        "X-CSRF-Token": CSRFToken,
      };

      const reader = new FileReader();

      const loadNextChunk = () => {
        let start = currentChunk * CHUNK_SIZE;
        let end = Math.min(start + CHUNK_SIZE, file.size);
        reader.readAsArrayBuffer(file.slice(start, end));
      };

      const CHUNK_SIZE = 1024 * 1024 * 10;
      const MAX_RETRIES = 3;
      let retries = 0;
      let currentChunk = 0;
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      let hash_file = forge.md.sha256.create();
      let hash_enc_file = forge.md.sha256.create();
      headers["filemode"] = "w";

      const { salt, iv, derivedKey } = await generateIVSaltDerivedKey(
        getPasswordkey,
        "sandy86kumar"
      );
      const enc = new TextEncoder();
      const enc_fileName = await encryptData(
        enc.encode(file.name),
        derivedKey,
        iv
      );
      const enc_directory = await encryptData(enc.encode(dir), derivedKey, iv);

      fileStat.salt = btoa(salt);
      fileStat.iv = btoa(iv);
      fileStat.enc_filename = arrayBufferToBase64(enc_fileName);
      fileStat.enc_directory = arrayBufferToBase64(enc_directory);

      if (totalChunks === 1) {
        headers["totalchunks"] = 1;
        loadNextChunk();
      } else {
        headers["totalchunks"] = totalChunks;
        loadNextChunk();
      }

      const uploadChunk = (chunk) => {
        headers["currentchunk"] = currentChunk + 1;
        if (headers["currentchunk"] === totalChunks) {
          fileStat.checksum = hash_file.digest().toHex();
          headers.enc_file_checksum = hash_enc_file.digest().toHex();
        }
        headers.filestat = JSON.stringify(fileStat);
        axios
          .post(fileUploadURL, chunk, {
            headers: headers,
            onUploadProgress: function (event) {
              progressBar.textContent = `${file.name} - ${
                parseFloat(event.progress) * 100
              }%`;
            },
          })
          .then(function (response) {
            console.log(response.data);
            uploadCountElement.textContent =
              "Uploaded " + uploadCount + " out of " + totalCount;
            currentChunk++;
            if (currentChunk < file.size / CHUNK_SIZE) {
              headers["filemode"] = "a";
              loadNextChunk();
            } else {
              resolve(response.data);
            }
          })
          .catch(function (error) {
            console.log(error);
            if (retries < MAX_RETRIES) {
              retries++;
              uploadChunk(chunk);
            } else {
              uploadCountElement.textContent =
                "Uploaded " + uploadCount + " out of " + totalCount;

              if (error.response) {
                switch (error.response.status) {
                  case 500:
                    reject(error.response.data);
                    break;
                  case 401:
                    reject(error.response.data);
                    break;
                  case 403:
                    reject(error.response.data);
                    break;
                  default:
                    reject(error);
                }
              } else {
                reject(error);
              }
            }
          });
      };

      reader.onload = async (event) => {
        const chunk = event.target.result;
        hash_file.update(arrayBufferToBinaryString(chunk));
        const encryptedChunk = await encryptData(chunk, derivedKey, iv);
        hash_enc_file.update(arrayBufferToBinaryString(encryptedChunk));
        let hash_enc_chunk = forge.md.sha256.create();
        hash_enc_chunk.update(arrayBufferToBinaryString(encryptedChunk));
        headers.encchunkhash = hash_enc_chunk.digest().toHex();
        uploadChunk(encryptedChunk);
      };

      reader.onerror = (event) => {
        console.log(event);
      };
    } catch (err) {
      reject(err);
    }
  });
};

export { uploadFile };

// if (event.lengthComputable) {
//   let percentComplete = Math.round(
//     (event.loaded / event.total) * 100
//   );
//   console.log(percentComplete);
//   progressBar.textContent = `${file.name} - ${percentComplete}%`;
//   console.log(`${file.name} - ${percentComplete}%`);
// }
