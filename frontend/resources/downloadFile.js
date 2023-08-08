import {
  csrftokenURL,
  downloadURL,
  filesFoldersURL,
} from "../config/config.js";
import { deriveKey } from "./cryptoUtil.js";
import {
  hexToBuffer,
  arrayBufferToBinaryString,
  streamDownloadDecryptToDisk,
  binaryStringToArrayBuffer,
} from "./util.js";

let file = document.getElementById("fileDownload");

async function saveFile(url) {
  fetch(url).then(async (response) => {
    // create a writable stream + intercept a network response
    let size = response.headers.get("content-length");
    const salt = response.headers.get("salt");
    const iv = response.headers.get("iv");
    const key = await deriveKey("sandy86kumar", hexToBuffer(salt), 100000, 256);
    const iv_buffer = hexToBuffer(iv);
    const iv_binaryString = arrayBufferToBinaryString(iv_buffer);
    const cipher = forge.cipher.createDecipher("AES-CBC", key);
    cipher.start({ iv: iv_binaryString });
    const filename = response.headers
      .get("content-disposition")
      .split(";")[1]
      .split(/\"/g)[1]
      .trim();
    const fileStream = streamSaver.createWriteStream(filename);
    let ts_dec = new TransformStream({
      async transform(chunk, controller) {
        console.log(size);
        size = size - chunk.length;
        cipher.update(forge.util.createBuffer(chunk));
        if (size === 0) {
          cipher.finish();
        }
        const decryptedChunk = cipher.output.getBytes();
        const arrBuffer = binaryStringToArrayBuffer(decryptedChunk);
        controller.enqueue(arrBuffer);
      },
    });
    const writer = fileStream.getWriter();

    // stream the response
    const reader = response.body.getReader();
    const pump = () =>
      reader.read().then(({ value, done }) => {
        console.log(size);
        size = size - value.length;
        cipher.update(forge.util.createBuffer(value));
        if (size === 0) {
          cipher.finish();
        }
        const decryptedChunk = cipher.output.getBytes();
        const arrBuffer = binaryStringToArrayBuffer(decryptedChunk);

        // Write one chunk, then get the next one
        writer.write(arrBuffer); // returns a promise

        // While the write stream can handle the watermark,
        // read more data
        return writer.ready.then(pump);
      });

    // Start the reader
    pump().then(() => console.log("Closed the stream, Done writing"));
  });
}

file.addEventListener("click", async () => {
  const url =
    "https://localhost:3001/app/downloadFiles?device=DESKTOP-10RSGE8&dir=ticket_automation&file=gui_ticket_V2.0.exe";

  console.log("download clicked");
  const response = await fetch(csrftokenURL);
  const { CSRFToken } = await response.json();
  const headers = {
    "X-CSRF-Token": CSRFToken,
    devicename: "DESKTOP-10RSGE8",
    username: "sandeep.kumar@idriveinc.com",
    currentdirectory: "Downloads",
    sortorder: "ASC",
  };
  let file = {};
  let res = await axios.post(filesFoldersURL, {}, { headers: headers });
  console.log(res);
  res.data.files.forEach((element) => {
    if (element.filename === "whereareyou.exe") {
      file.salt = element.salt;
      file.iv = element.iv;
    }
  });
  console.log(file);
  const key = deriveKey("sandy86kumar", hexToBuffer(file.salt), 100000, 256);
  const iv_buffer = hexToBuffer(file.iv);
  const iv_binaryString = arrayBufferToBinaryString(iv_buffer);
  const cipher = forge.cipher.createDecipher("AES-CBC", key);
  cipher.start({ iv: iv_binaryString });
  await streamDownloadDecryptToDisk(downloadURL, cipher);
  let result = cipher.finish();
  if (result) {
    console.log("file decrypted");
  }
});
