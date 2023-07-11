import { downloadURL } from "../config/config.js";
let file = document.getElementById("fileDownload");
let container = document.getElementById("downloadContainer");

const token = `Bearer ${JSON.parse(localStorage.getItem("token"))["token"]}`;

const headers = {
  Authorization: token,
};
file.addEventListener("click", () => {
  axios
    .get(downloadURL, {}, { responseType: "blob", headers: headers })
    .then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      console.log(res.headers);
      let fileName = res.headers
        .get("content-disposition")
        .split(";")[1]
        .trim()
        .split("filename=")[1]
        .trim()
        .split(/\"/g)[1]
        .trim();

      a.href = url;
      a.target = "_blank";
      a.download = fileName;
      a.textContent = fileName;
      container.appendChild(a);
      // a.click();
      // a.remove();
    })
    .catch((err) => console.log(err));
});
