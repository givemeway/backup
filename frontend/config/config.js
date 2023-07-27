const host = "https://172.23.16.1:3001";
const fileUploadURL = `${host}/app/receiveFiles`;
const loginURL = `${host}/app/login`;
const fetchFilesURL = `${host}/app/getCurrentDirFiles`;
const downloadURL = `${host}/app/downloadFiles`;
const csrftokenURL = `${host}/app/csrftoken`;
const devicename = "DESKTOP-10RSGE8";
const username = "sandeep.kumar@idriveinc.com";
const cwd = "/";

export {
  fileUploadURL,
  loginURL,
  fetchFilesURL,
  devicename,
  username,
  cwd,
  downloadURL,
  csrftokenURL,
};
