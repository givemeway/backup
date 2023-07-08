import { fileUploadURL, username, devicename } from "../config/config.js";

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
  return new Promise((resolve, reject) => {
    try {
      const fileStat = {
        atimeMs: file.lastModified,
        mtimeMs: file.lastModified,
        mtime: file.lastModifiedDate,
        checksum: hashHex,
        modified: modified,
        size: file.size,
      };
      // const filePath = cwd + file.webkitRelativePath;
      const filePath =
        cwd === "/"
          ? file.webkitRelativePath
          : cwd + "/" + file.webkitRelativePath;
      const pathParts = filePath.split("/");
      pathParts.pop();
      const dir = pathParts.join("/");
      console.log(dir);
      const headers = {
        Authorization: token,
        filename: file.name,
        dir: dir,
        devicename: devicename,
        username: username,
        filestat: JSON.stringify(fileStat),
      };

      const formData = new FormData();
      formData.append("file", file);

      let xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", function (event) {
        if (event.lengthComputable) {
          let percentComplete = Math.round((event.loaded / event.total) * 100);
          progressBar.textContent = `${file.name} - ${percentComplete}%`;
        }
      });
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          try {
            uploadCountElement.textContent =
              "Uploaded " + uploadCount + " out of " + totalCount;
            resolve(JSON.parse(xhr.responseText));
          } catch (err) {
            uploadCountElement.textContent =
              "Uploaded " + uploadCount + " out of " + totalCount;
            reject(err);
          }
        }
      };
      xhr.open("POST", fileUploadURL);
      Object.keys(headers).forEach(function (key) {
        xhr.setRequestHeader(key, headers[key]);
      });
      xhr.send(formData);
    } catch (err) {
      // return err;
      reject(err);
    }
  });
};

export { uploadFile };
