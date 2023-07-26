import { fileUploadURL, username, devicename } from "../config/config.js";
import { encryptFile } from "./encryptFile.js";

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

      const { encryptedFile, salt, iv, enc_fileName, enc_directory } =
        await encryptFile(file, "sandy86kumar", dir);

      const fileStat = {
        atimeMs: file.lastModified,
        mtimeMs: file.lastModified,
        mtime: file.lastModifiedDate,
        checksum: hashHex,
        modified: modified,
        size: file.size,
        salt: btoa(salt),
        iv: btoa(iv),
        enc_filename: arrayBufferToBase64(enc_fileName),
        enc_directory: arrayBufferToBase64(enc_directory),
      };

      let headers = {
        // Authorization: token,
        filename: file.name,
        dir: dir,
        devicename: devicename,
        username: username,
        filestat: JSON.stringify(fileStat),
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${file.name}"`,
        "X-CSRF-Token": CSRFToken,
      };
      // const encryptedBlob = new Blob([encryptedFile], { type: file.type });
      // const formData = new FormData();
      // formData.append("file", encryptedBlob, file.name);
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
      headers["filemode"] = "w";
      if (totalChunks === 1) {
        headers["totalchunks"] = 1;
        loadNextChunk();
      } else {
        headers["totalchunks"] = totalChunks;
        loadNextChunk();
      }

      const uploadChunk = (chunk) => {
        headers["currentchunk"] = currentChunk + 1;
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

      reader.onload = (event) => {
        const chunk = event.target.result;
        uploadChunk(chunk);
      };

      reader.onerror = (event) => {
        console.log(error);
      };
      // axios
      //   .post(fileUploadURL, formData, {
      //     headers: headers,
      //     onUploadProgress: function (event) {
      //       progressBar.textContent = `${file.name} - ${
      //         parseFloat(event.progress) * 100
      //       }%`;
      //     },
      //   })
      //   .then(function (response) {
      //     uploadCountElement.textContent =
      //       "Uploaded " + uploadCount + " out of " + totalCount;
      //     resolve(response.data);
      //   })
      //   .catch(function (error) {
      //     uploadCountElement.textContent =
      //       "Uploaded " + uploadCount + " out of " + totalCount;

      //     if (error.response) {
      //       switch (error.response.status) {
      //         case 500:
      //           reject(error.response.data);
      //           break;
      //         case 401:
      //           reject(error.response.data);
      //           break;
      //         case 403:
      //           reject(error.response.data);
      //           break;
      //         default:
      //           reject(error);
      //       }
      //     } else {
      //       reject(error);
      //     }
      //   });
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
