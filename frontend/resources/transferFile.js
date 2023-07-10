// import { fileUploadURL, username, devicename } from "../config/config.js";

// const uploadFile = (
//   file,
//   cwd,
//   progressBar,
//   hashHex,
//   token,
//   modified,
//   uploadCountElement,
//   uploadCount,
//   totalCount
// ) => {
//   return new Promise((resolve, reject) => {
//     try {
//       const fileStat = {
//         atimeMs: file.lastModified,
//         mtimeMs: file.lastModified,
//         mtime: file.lastModifiedDate,
//         checksum: hashHex,
//         modified: modified,
//         size: file.size,
//       };
//       // const filePath = cwd + file.webkitRelativePath;
//       const filePath =
//         cwd === "/"
//           ? file.webkitRelativePath
//           : cwd + "/" + file.webkitRelativePath;
//       const pathParts = filePath.split("/");
//       pathParts.pop();
//       const dir = pathParts.join("/");
//       const headers = {
//         Authorization: token,
//         filename: file.name,
//         dir: dir,
//         devicename: devicename,
//         username: username,
//         filestat: JSON.stringify(fileStat),
//       };

//       const formData = new FormData();
//       formData.append("file", file);

//       let xhr = new XMLHttpRequest();
//       xhr.upload.addEventListener("progress", function (event) {
//         if (event.lengthComputable) {
//           let percentComplete = Math.round((event.loaded / event.total) * 100);
//           progressBar.textContent = `${file.name} - ${percentComplete}%`;
//         }
//       });
//       xhr.onreadystatechange = function () {
//         if (xhr.readyState === XMLHttpRequest.DONE) {
//           switch (xhr.status) {
//             case 500:
//               reject(JSON.parse(xhr.responseText));
//               break;
//             case 401:
//               reject(JSON.parse(xhr.responseText));
//               break;
//             case 403:
//               reject(JSON.parse(xhr.responseText));
//               break;
//             default:
//               try {
//                 uploadCountElement.textContent =
//                   "Uploaded " + uploadCount + " out of " + totalCount;
//                 resolve(JSON.parse(xhr.responseText));
//               } catch (err) {
//                 uploadCountElement.textContent =
//                   "Uploaded " + uploadCount + " out of " + totalCount;
//                 reject(err);
//               }
//           }
//         }
//       };
//       xhr.open("POST", fileUploadURL);
//       Object.keys(headers).forEach(function (key) {
//         xhr.setRequestHeader(key, headers[key]);
//       });
//       xhr.send(formData);
//     } catch (err) {
//       // return err;
//       reject(err);
//     }
//   });
// };

// export { uploadFile };
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

      const formData = new FormData();
      formData.append("file", file);

      axios
        .post(fileUploadURL, formData, {
          headers: headers,
          onUploadProgress: function (event) {
            if (event.lengthComputable) {
              let percentComplete = Math.round(
                (event.loaded / event.total) * 100
              );
              progressBar.textContent = `${file.name} - ${percentComplete}%`;
            }
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
