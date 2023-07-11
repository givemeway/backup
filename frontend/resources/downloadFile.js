import { downloadURL } from "../config/config.js";
let file = document.getElementById("fileDownload");
let container = document.getElementById("downloadContainer");

const token = `Bearer ${JSON.parse(localStorage.getItem("token"))["token"]}`;

const headers = {
  Authorization: token,
};
file.addEventListener("click", () => {
  console.log("clicked");
  axios
    .post(downloadURL, {}, { responseType: "blob", headers: headers })
    .then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      console.log(res.headers);
      a.href = url;
      a.download = "filename.pdf";
      container.appendChild(a);
      a.click();
      a.remove();
    })
    .catch((err) => console.log(err));
});
