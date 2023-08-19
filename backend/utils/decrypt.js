import fs from "node:fs";
import { hexToBuffer } from "./utils.js";
import { pbkdf2Sync, createDecipheriv } from "node:crypto";
const decryptFile = (input, salt, iv, password) => {
  const saltBuffer = hexToBuffer(salt);
  const ivBuffer = hexToBuffer(iv);
  const algorithm = "aes-256-cbc";
  const key = pbkdf2Sync(password, saltBuffer, 100000, 32, "sha256");
  const dicpher = createDecipheriv(algorithm, key, ivBuffer);
  return input.pipe(dicpher);
};

export { decryptFile };
