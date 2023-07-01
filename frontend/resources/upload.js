let formfolder = document.getElementById("folderupload");
formfolder.addEventListener("submit", (event) => {
  event.preventDefault();
  event.stopPropagation();
  const files = event.target.elements.folderselected.files;
  const filesList = Array.from(files).map((file) => file);

  filesList.forEach(async (file) => {
    let data = await sendFile(file);
    console.log(data);
  });
});

const postUrl = "http://192.168.29.179:3000/app/receiveFile";

const sendFile = async (file) => {
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
    const options = {
      method: "POST",
      credentials: "include",
      mode: "cors",
      headers: headers,
      body: formData,
    };
    let res = await fetch(postUrl, options);
    let data = await res.json();
    return data;
  } catch (err) {
    return err;
  }
};
