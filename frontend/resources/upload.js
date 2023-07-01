const form = document.getElementById("folderupload");
const progressBar = document.getElementById("progressBar");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  event.stopPropagation();
  const files = event.target.elements.folderselected.files;
  const filesList = Array.from(files).map((file) => file);

  filesList.forEach((file) => {
    uploadFile(file)
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  });
});

const postUrl = "http://192.168.29.179:3000/app/receiveFile";

const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const fileStat = {
        atimeMs: file.lastModified,
        mtimeMs: file.lastModified,
        mtime: file.lastModifiedDate,
      };
      const token = `Bearer ${
        JSON.parse(localStorage.getItem("token"))["token"]
      }`;
      const filePath = file.webkitRelativePath;
      const pathParts = filePath.split("/");
      pathParts.pop();
      const dir = pathParts.join("/");

      const headers = {
        Authorization: token,
        filename: file.name,
        dir: dir,
        devicename: "DESKTOP",
        username: "sandeep.kumar@idriveinc.com",
        filestat: JSON.stringify(fileStat),
      };

      const formData = new FormData();
      formData.append("file", file);

      // const options = {
      //   method: "POST",
      //   credentials: "include",
      //   mode: "cors",
      //   headers: headers,
      //   body: formData,
      // };
      // let res = await fetch(postUrl, options);
      // let data = await res.json();
      // return data;
      let xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", function (event) {
        if (event.lengthComputable) {
          let percentComplete = Math.round((event.loaded / event.total) * 100);
          // update progress bar
          progressBar.textContent = `${file.name} - ${percentComplete}%`;
        }
      });
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          resolve(JSON.parse(xhr.responseText));
        }
      };
      xhr.open("POST", postUrl);
      Object.keys(headers).forEach(function (key) {
        xhr.setRequestHeader(key, headers[key]);
      });
      xhr.send(formData);
    } catch (err) {
      // return err;
      reject(err);
    }
  });
};
