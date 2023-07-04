import { fetchFilesURL, devicename, username } from "../config/config.js";

const getfilesCurDir = async (cwd, token) => {
  const headers = {
    Authorization: token,
    devicename: devicename,
    currentdirectory: cwd,
    username: username,
  };
  const options = {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: headers,
  };
  fetch(fetchFilesURL, options)
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
};

export { getfilesCurDir };
