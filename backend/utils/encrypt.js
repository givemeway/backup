import { createCipheriv, scrypt } from "node:crypto";

const encryptFile = (password, salt, iv, algorithm) => {
  return new Promise(async (resolve, reject) => {
    try {
      const key = await new Promise((resolve, reject) => {
        scrypt(password, salt, 32, (err, key) => {
          if (err) reject(err);
          else resolve(key);
        });
      });
      const cipher = createCipheriv(algorithm, key, iv);
      resolve(cipher);
    } catch (err) {
      reject(err);
    }
  });
};

export { encryptFile };
