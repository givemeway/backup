import { downloadURL } from "../config/config.js";
let file = document.getElementById("fileDownload");
let container = document.getElementById("downloadContainer");

const token = `Bearer ${JSON.parse(localStorage.getItem("token"))["token"]}`;

const headers = {
  Authorization: token,
};
file.addEventListener("click", async () => {
  console.log("download clicked");
  // axios
  //   .get(downloadURL, {}, { responseType: "blob", headers: headers })
  //   .then(async (res) => {
  //     const url = window.URL.createObjectURL(new Blob([res.data]));
  //     const stream = new ReadableStream({
  //       start(controller) {
  //         let data = res.data;
  //         controller.enqueue(data);
  //       },
  //     });
  //     stream.getReader();
  //     const a = document.createElement("a");
  //     console.log(res.headers["content-disposition"], url);
  //     let fileName = res.headers
  //       .get("content-disposition")
  //       .split(";")[1]
  //       .trim()
  //       .split("filename=")[1]
  //       .trim()
  //       .split(/\"/g)[1]
  //       .trim();
  //     console.log(fileName);
  //     a.href = url;
  //     a.target = "_blank";
  //     a.download = fileName;
  //     a.textContent = fileName;
  //     container.appendChild(a);
  //     a.click();
  //     a.remove();
  //   })
  //   .catch((err) => console.log(err));
  // const response = await fetch(downloadURL);
  // const reader = response.body.getReader();
  // const contentLength = response.headers.get("Content-Length");
  // let receivedLength = 0;
  // let chunks = [];
  // while (true) {
  //   const { done, value } = await reader.read();
  //   if (done) {
  //     break;
  //   }
  //   chunks.push(value);
  //   receivedLength += value.length;
  //   console.log(`Received ${receivedLength} of ${contentLength}`);
  // }
  // let chunksAll = new Uint8Array(receivedLength);
  // let position = 0;
  // for (let chunk of chunks) {
  //   chunksAll.set(chunk, position);
  //   position += chunk.length;
  // }
  // const blob = new Blob([chunksAll]);
  // const link = document.createElement("a");
  // link.href = URL.createObjectURL(blob);
  // link.download = "GPT.img";
  // link.click();
});
