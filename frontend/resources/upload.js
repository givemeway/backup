import { hashFile, hashFileChunked } from "./hashFile.js";
import { uploadFile } from "./transferFile.js";
import { getfilesCurDir, compareFiles } from "./filesInfo.js";
import { cwd } from "../config/config.js";
const form = document.getElementById("folderupload");
const progressBar = document.getElementById("progressBar");
const uploadCountElement = document.getElementById("filesProcessed");
let progressbarUI = document.getElementsByClassName("progress-bar")[0];
let progress = document.getElementsByClassName("progress")[0];
let filesFailed = document.getElementById("filesFailed");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  event.stopPropagation();
  const files = event.target.elements.folderselected.files;
  const filesList = Array.from(files).map((file) => {
    file.modified = false;
    return file;
  });
  const token = `Bearer ${JSON.parse(localStorage.getItem("token"))["token"]}`;

  const uploadingDirPath =
    cwd === "/"
      ? filesList[0].webkitRelativePath.split(/\//g)[0]
      : cwd + "/" + filesList[0].webkitRelativePath.split(/\//g)[0];

  console.log(uploadingDirPath);
  getfilesCurDir(uploadingDirPath, token)
    .then(async (DbFiles) => {
      let files = await compareFiles(filesList, DbFiles, cwd);
      console.log(files.length);
      for (let i = 0; i < files.length; i++) {
        try {
          let hashHex = "";
          if (files[i].hasOwnProperty("hash")) {
            hashHex = files[i].hash;
          } else {
            hashHex = await hashFileChunked(files[i]);
          }

          let data = await uploadFile(
            files[i],
            cwd,
            progressBar,
            hashHex,
            token,
            files[i].modified,
            uploadCountElement,
            i + 1,
            files.length
          );
          progressbarUI.setAttribute(
            "style",
            `width: ${Math.ceil(((i + 1) / files.length) * 100)}%`
          );
          progressbarUI.textContent = `${Math.ceil(
            ((i + 1) / files.length) * 100
          )}%`;
          progress.setAttribute(
            "aria-valuenow",
            `${Math.ceil(((i + 1) / files.length) * 100)}`
          );
          console.log(data);
        } catch (err) {
          console.log(err);
          addFailedFilesToDOM(filesFailed, files[i].name, err);
        }
      }
    })
    .catch((err) => {
      console.log("inaide this error block");
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

const addFailedFilesToDOM = (parent, file, msg) => {
  let liElement = document.createElement("li");
  liElement.classList.add("list-group-item");
  liElement.innerText = `${file} ERROR: ${msg}`;
  parent.appendChild(liElement);
};
