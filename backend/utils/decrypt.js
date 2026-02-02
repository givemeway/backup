import { hexToBuffer } from "./utils.js";
import { createDecipheriv, scrypt } from "node:crypto";
const decryptFile = (input, salt, iv, password) => {
  return new Promise(async (resolve, reject) => {
    const saltBuffer = hexToBuffer(salt);
    const ivBuffer = hexToBuffer(iv);
    const algorithm = "aes-256-cbc";
    try {
      scrypt(password, saltBuffer, 32, (err, key) => {
        if (err) return reject(err);
        const decipher = createDecipheriv(algorithm, key, ivBuffer);
        decipher.on("error", err => {
          console.log("[cipher] ", err);
          input.destroy();
        });
        input.on("error", err => {
          decipher.destroy();
          reject(err);
        });
        resolve(input.pipe(decipher));
      });
    } catch (err) {
      reject(err);
    }
  });
};

export { decryptFile };
