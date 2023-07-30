import { downloadURL, csrftokenURL } from "../config/config.js";
import {
  deriveKey,
  arrayBufferToBinaryString,
  binaryStringToArrayBuffer,
} from "./transferFile.js";

let file = document.getElementById("fileDownload");
let container = document.getElementById("downloadContainer");

const token = `Bearer ${JSON.parse(localStorage.getItem("token"))["token"]}`;

function hexToBuffer(hexString) {
  let byteArray = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < byteArray.length; i++) {
    byteArray[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return byteArray;
}

const headers = {
  Authorization: token,
};
file.addEventListener("click", async () => {
  console.log("download clicked");
  const url = "https://192.168.29.34:3001/app/downloadFiles";

  const fileUrl = "https://192.168.29.34:3001/app/getFilesSubfolders";
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

  let res = await axios.post(fileUrl, {}, { headers: headers });

  res.data.files.forEach((element) => {
    if (element.filename === "sandeep_amma_divya.exe") {
      file.salt = element.salt;
      file.iv = element.iv;
    }
  });

  const key = deriveKey("sandy86kumar", hexToBuffer(file.salt), 100000, 256);

  const iv_buffer = hexToBuffer(file.iv);
  const iv_binaryString = arrayBufferToBinaryString(iv_buffer);

  const cipher = forge.cipher.createDecipher("AES-CBC", key);
  cipher.start({ iv: iv_binaryString });

  async function streamDownloadDecryptToDisk(url) {
    // create readable stream for ciphertext
    let rs_src = fetch(url).then((response) => response.body);

    // create writable stream for file
    let ws_dest = window
      .showSaveFilePicker()
      .then((handle) => handle.createWritable());

    // create transform stream for decryption
    let ts_dec = new TransformStream({
      async transform(chunk, controller) {
        cipher.update(forge.util.createBuffer(chunk));
        const decryptedChunk = cipher.output.getBytes();
        const arrBuffer = binaryStringToArrayBuffer(decryptedChunk);
        controller.enqueue(arrBuffer);
      },
    });

    // stream cleartext to file
    let rs_clear = rs_src.then((s) => s.pipeThrough(ts_dec));
    return (await rs_clear).pipeTo(await ws_dest);
  }

  await streamDownloadDecryptToDisk(url);
  let result = cipher.finish();
  if (result) {
    console.log("file decrypted");
  }
});
