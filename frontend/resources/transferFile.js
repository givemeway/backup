import { fileUploadURL, username, devicename } from "../config/config.js";
import { deriveKey, encryptMessage } from "./cryptoUtil.js";
import {
  arrayBufferToBinaryString,
  binaryStringToArrayBuffer,
  generateRandomBytes,
  arrayBufferToHex,
} from "./util.js";

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

      if (file.size === 0) {
        reject(`Empty file`);
        return;
      }

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

      const CHUNK_SIZE = 1024 * 1024 * 1;
      const MAX_RETRIES = 3;
      let retries = 0;
      let currentChunk = 0;
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      let hash_file = forge.md.sha256.create();
      let hash_enc_file = forge.md.sha256.create();
      headers["filemode"] = "w";

      const salt = generateRandomBytes(32);
      const iv_buffer = generateRandomBytes(16);
      const iv = arrayBufferToBinaryString(iv_buffer);
      const key = deriveKey("sandy86kumar", salt, 100000, 256);

      const enc_fileName = encryptMessage("AES-CBC", file.name, key, iv);

      const enc_directory = encryptMessage("AES-CBC", dir, key, iv);

      const cipher = forge.cipher.createCipher("AES-CBC", key);
      cipher.start({ iv: iv });

      fileStat.salt = arrayBufferToHex(salt);
      fileStat.iv = arrayBufferToHex(iv_buffer);
      fileStat.enc_filename = enc_fileName;
      fileStat.enc_directory = enc_directory;
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
          console.log("final chunk -- inside top");
        }

        headers.filestat = JSON.stringify(fileStat);

        axios
          .post(fileUploadURL, chunk, {
            headers: headers,
            onUploadProgress: function (event) {
              progressBar.textContent = `${file.name} - ${parseFloat(
                ((currentChunk + 1) / totalChunks) * event.progress * 100
              ).toFixed(2)}%`;
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
        cipher.update(forge.util.createBuffer(chunk));
        let encryptedChunk;
        if (currentChunk === totalChunks - 1) {
          console.log("final chunk");
          cipher.finish();
          encryptedChunk = cipher.output.getBytes();
        } else {
          encryptedChunk = cipher.output.getBytes();
        }
        hash_enc_file.update(encryptedChunk);
        let hash_enc_chunk = forge.md.sha256.create();
        hash_enc_chunk.update(encryptedChunk);
        headers.encchunkhash = hash_enc_chunk.digest().toHex();
        const arrBuffer = binaryStringToArrayBuffer(encryptedChunk);
        uploadChunk(arrBuffer);
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
