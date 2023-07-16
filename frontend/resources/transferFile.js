import { fileUploadURL, username, devicename } from "../config/config.js";
import { encryptFile } from "./encryptFile.js";

const uploadFile = (
  file,
  cwd,
  progressBar,
  hashHex,
  token,
  modified,
  uploadCountElement,
  uploadCount,
  totalCount
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fileStat = {
        atimeMs: file.lastModified,
        mtimeMs: file.lastModified,
        mtime: file.lastModifiedDate,
        checksum: hashHex,
        modified: modified,
        size: file.size,
      };
      const filePath =
        cwd === "/"
          ? file.webkitRelativePath
          : cwd + "/" + file.webkitRelativePath;
      const pathParts = filePath.split("/");
      pathParts.pop();
      const dir = pathParts.join("/");
      const headers = {
        Authorization: token,
        filename: file.name,
        dir: dir,
        devicename: devicename,
        username: username,
        filestat: JSON.stringify(fileStat),
      };
      const encryptedFile = await encryptFile(file, "sandy86kumar");
      const encryptedBlob = new Blob([encryptedFile], { type: file.type });
      const formData = new FormData();
      formData.append("file", encryptedBlob, file.name);

      axios
        .post(fileUploadURL, formData, {
          headers: headers,
          onUploadProgress: function (event) {
            progressBar.textContent = `${file.name} - ${
              parseFloat(event.progress) * 100
            }%`;
            // if (event.lengthComputable) {
            //   let percentComplete = Math.round(
            //     (event.loaded / event.total) * 100
            //   );
            //   console.log(percentComplete);
            //   progressBar.textContent = `${file.name} - ${percentComplete}%`;
            //   console.log(`${file.name} - ${percentComplete}%`);
            // }
          },
        })
        .then(function (response) {
          uploadCountElement.textContent =
            "Uploaded " + uploadCount + " out of " + totalCount;
          resolve(response.data);
        })
        .catch(function (error) {
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
        });
    } catch (err) {
      reject(err);
    }
  });
};

export { uploadFile };
