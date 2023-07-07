import { hashFile } from "./hashFile.js";
import { uploadFile } from "./transferFile.js";
import { getfilesCurDir, compareFiles } from "./filesInfo.js";
import { cwd } from "../config/config.js";
const form = document.getElementById("folderupload");
const progressBar = document.getElementById("progressBar");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  event.stopPropagation();
  const files = event.target.elements.folderselected.files;
  const filesList = Array.from(files).map((file) => {
    file.modified = false;
    return file;
  });
  console.log(filesList[0]);
  const token = `Bearer ${JSON.parse(localStorage.getItem("token"))["token"]}`;
  // const uploadingDirPath =
  //   cwd + filesList[0].webkitRelativePath.split(/\//g)[0];

  const uploadingDirPath =
    cwd === "/"
      ? filesList[0].webkitRelativePath.split(/\//g)[0]
      : cwd + filesList[0].webkitRelativePath.split(/\//g)[0];

  console.log(uploadingDirPath);
  getfilesCurDir(uploadingDirPath, token)
    .then(async (DbFiles) => {
      let files = await compareFiles(filesList, DbFiles);
      console.log(files.length);
      for (let i = 0; i < files.length; i++) {
        try {
          let hashHex = "";
          if (files[i].hasOwnProperty("hash")) {
            hashHex = files[i].hash;
          } else {
            hashHex = await hashFile(files[i]);
          }

          let data = await uploadFile(
            files[i],
            cwd,
            progressBar,
            hashHex,
            token,
            files[i].modified
          );
          console.log(data);
        } catch (err) {
          console.log(err);
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
  // filesList.forEach(async (file) => {
  //   try {
  //     const hashHex = await hashFile(file);
  //     uploadFile(file, cwd, progressBar, hashHex, token)
  //       .then((data) => console.log(data))
  //       .catch((err) => console.log(err));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // });
});
