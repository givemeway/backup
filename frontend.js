import fs from "node:fs";
import fetch from "node-fetch";
// import { FormData } from "formdata-node";
// import { fileFromPath } from "formdata-node/file-from-path";
import FormData from "form-data";
import path from "path";
import os from "node:os";

// const os = require("node:os");
// const fs = require("node:fs");
// const fetch = require("node-fetch");
// const path = require("path");
// const FormData = require("form-data");

const postUrl = "http://192.168.29.179:3000/app/fileIO/receiveFile";

const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InNhbmRlZXAua3VtYXJAaWRyaXZlLmNvbSIsImlhdCI6MTY4NzU5NDc1MSwiZXhwIjoxNjg3NjgxMTUxfQ.58uv0HRSPqSCdkGHx_uFh2FyrKRggua-bw1LHGb3hQk";

const sendFile = async (filePath) => {
  try {
    const fileStat = fs.statSync(filePath);
    const fileStream = fs.createReadStream(filePath);
    const headers = {
      Authorization: token,
      filename: path.basename(filePath),
      dir: convertWindowsPathToUnix(path.dirname(filePath)),
      devicename: os.hostname(),
      username: "aneesh_evs_ent",
      filestat: JSON.stringify(fileStat),
    };
    const formData = new FormData();
    formData.append("file", fileStream);
    const options = {
      method: "POST",
      headers: headers,
      body: formData,
    };
    let res = await fetch(postUrl, options);
    let data = await res.json();
    fileStream.close();
    return data;
  } catch (err) {
    return err;
  }
};

function convertWindowsPathToUnix(path) {
  // Replace all backslashes with forward slashes.
  let splitPath = path.split(":");
  let linuxPath = splitPath[0] + splitPath[1].replace(/\\/g, "/");

  return linuxPath;
}

const listAllFiles = async (dir) => {
  let allFiles = [];
  try {
    const files = await fs.promises.readdir(dir);

    for (let file of files) {
      const fullPath = path.join(dir, file);
      const stat = await fs.promises.stat(fullPath);
      if (stat.isDirectory()) {
        const subFiles = await listAllFiles(fullPath);
        allFiles = allFiles.concat(subFiles);
      } else {
        allFiles.push(fullPath);
      }
    }
  } catch (error) {
    console.log(error);
  }

  return allFiles;
};

const dir = "C:\\Users\\sandk\\Desktop\\ticket_automation";
listAllFiles(dir).then((files) => {
  console.log(files.length);
  files.forEach(async (file) => {
    let data = await sendFile(file);
    console.log(data);
  });
});
