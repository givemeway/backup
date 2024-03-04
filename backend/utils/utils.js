function hexToBuffer(hexString) {
  let byteArray = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < byteArray.length; i++) {
    byteArray[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return byteArray;
}

const imageTypes = { PNG: "png", JPG: "jpg", JPEG: "jpeg", TIFF: "tiff" };

export { hexToBuffer, imageTypes };
