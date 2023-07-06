import { fetchFilesURL, devicename, username } from "../config/config.js";
import { hashFile } from "./hashFile.js";

const getfilesCurDir = async (cwd, token) => {
  const headers = {
    Authorization: token,
    devicename: devicename,
    currentdirectory: cwd,
    username: username,
    start: 0,
    end: 100000,
  };
  const options = {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: headers,
    body: { start: 0, end: 100000 },
  };

  try {
    const res = await fetch(fetchFilesURL, options);
    const data = await res.json();
    return data;
  } catch (err) {
    return err;
  }
};

const compareFiles = async (selectedFileList, DbFileList) => {
  if (DbFileList.length === 0) {
    return selectedFileList;
  }
  let files = new Object();
  DbFileList.forEach((file) => {
    if (files.hasOwnProperty(file.directory)) {
      files[file.directory][file.filename] = {
        hash: file.hashvalue,
        lmd: file.last_modified,
      };
    } else {
      files[file.directory] = new Object();
      files[file.directory][file.filename] = {
        hash: file.hashvalue,
        lmd: file.last_modified,
      };
    }
  });
  let filesToUpload = [];
  for (const file of selectedFileList) {
    let dirName = getDirName(file.webkitRelativePath);
    if (files.hasOwnProperty(dirName)) {
      if (!files[dirName].hasOwnProperty(file.name)) {
        filesToUpload.push(file);
      } else {
        const localFileHash = await hashFile(file);
        const hashFromDB = files[dirName][file.name]["hash"];
        if (localFileHash !== hashFromDB) {
          console.log("Modified");
          filesToUpload.push(file);
        }
      }
    } else {
      filesToUpload.push(file);
    }
  }

  return filesToUpload;
};

const getDirName = (relativePath) => {
  let pathParts = relativePath.split(/\//g);
  pathParts.pop();
  const dir = pathParts.join("/");
  return dir;
};

export { getfilesCurDir, compareFiles };
