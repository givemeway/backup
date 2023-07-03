import { hashFile } from "./hashFile.js";
import { uploadFile } from "./transferFile.js";

const form = document.getElementById("folderupload");
const progressBar = document.getElementById("progressBar");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  event.stopPropagation();
  const files = event.target.elements.folderselected.files;
  const filesList = Array.from(files).map((file) => file);

  filesList.forEach(async (file) => {
    try {
      const hashHex = await hashFile(file);
      uploadFile(file, progressBar, hashHex)
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  });
});
