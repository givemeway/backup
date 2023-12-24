import { hexToBuffer } from "./utils.js";
import { createDecipheriv, scrypt } from "node:crypto";
const decryptFile = (input, salt, iv, password) => {
  return new Promise(async (resolve, reject) => {
    const saltBuffer = hexToBuffer(salt);
    const ivBuffer = hexToBuffer(iv);
    const algorithm = "aes-256-cbc";
    try {
      const key = await new Promise((resolve, reject) => {
        scrypt(password, saltBuffer, 32, (err, key) => {
          if (err) reject(err);
          else {
            resolve(key);
          }
        });
      });
      const dicpher = createDecipheriv(algorithm, key, ivBuffer);
      resolve(input.pipe(dicpher));
    } catch (err) {
      reject(err);
    }
  });
};

export { decryptFile };
