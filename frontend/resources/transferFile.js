import { fileUploadURL } from "../config/config.js";

const uploadFile = (file, progressBar, hashHex) => {
  return new Promise((resolve, reject) => {
    try {
      const fileStat = {
        atimeMs: file.lastModified,
        mtimeMs: file.lastModified,
        mtime: file.lastModifiedDate,
        checksum: hashHex,
      };
      const token = `Bearer ${
        JSON.parse(localStorage.getItem("token"))["token"]
      }`;
      const filePath = file.webkitRelativePath;
      const pathParts = filePath.split("/");
      pathParts.pop();
      const dir = pathParts.join("/");

      const headers = {
        Authorization: token,
        filename: file.name,
        dir: dir,
        devicename: "DESKTOP",
        username: "sandeep.kumar@idriveinc.com",
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
          resolve(JSON.parse(xhr.responseText));
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
