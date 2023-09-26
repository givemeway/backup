import express from "express";
const router = express.Router();
import { sqlExecute } from "../controllers/sql_execute.js";
import {
  scrypt,
  createCipheriv,
  randomFill,
  createDecipheriv,
  randomBytes,
  randomFillSync,
} from "node:crypto";
import fs from "node:fs";

const generateRandomBytes = (len) => {
  try {
    let buffer = Buffer.alloc(len);
    randomFillSync(buffer);
    return buffer;
  } catch (err) {
    console.log(err);
  }
};

function hexToBuffer(hexString) {
  let byteArray = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < byteArray.length; i++) {
    byteArray[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return byteArray;
}

const encryptFileMiddleWare = async (req, res, next) => {
  const salt = generateRandomBytes(32);
  const iv = generateRandomBytes(16);
  console.log("iv: ", iv);
  console.log("salt: ", salt);
  const query = `INSERT INTO cryptoKeys 
                 (filename,salt,iv)
                 VALUES 
                 (?,?,?);`;
  req.headers.query = query;
  const con = req.headers.connection;
  con.query(
    query,
    ["divya.exe", Buffer.from(salt), Buffer.from(iv)],
    (err, results, fields) => {
      if (err) throw err;
      console.log(results);
      console.log(fields);
    }
  );
  req.headers.salt = salt;
  req.headers.iv = iv;
  encrypt("./divya.exe", "sandy86kumar", req.headers.salt, req.headers.iv);
  console.log("file encrypted");
  next();
};

const decryptFileMiddleWare = async (req, res, next) => {
  const query = `SELECT filename,salt,iv FROM
                 data.files
                 where
                 filename = "300kb.txt";
                 `;
  const conn = req.headers.connection;
  try {
    const [results, fields] = await conn.execute(query);
    console.log(results);
    const { filename, salt, iv } = results[0];
    console.log(filename, salt, iv);
    decrypt(
      filename,
      "sandy86kumar",
      Buffer.from(hexToBuffer(salt)),
      Buffer.from(hexToBuffer(iv))
    );
    console.log("file decrypted");
  } catch (err) {
    console.log(err);
  }
  next();
};

router.get("*", (req, res) => {
  res.status(200).json({ query: req.query, path: req.path });
  // res.status(200).json("fileEncrypted");
});

const encrypt = async (filePath, password, salt, iv) => {
  const input = fs.createReadStream(filePath);
  const output = fs.createWriteStream(filePath + ".enc");
  const algorithm = "aes-256-cbc";
  scrypt(password, salt, 32, (err, key) => {
    if (err) throw err;
    const cipher = createCipheriv(algorithm, key, iv);
    input.pipe(cipher).pipe(output);
  });
};

const decrypt = async (filePath, password, salt, iv) => {
  try {
    console.log(filePath);
    const input = fs.createReadStream(filePath);
    const output = fs.createWriteStream(
      "dec_" + filePath.replace(/\.enc/g, "")
    );
    const algorithm = "aes-256-cbc";
    scrypt(password, salt, 32, (err, key) => {
      if (err) {
        console.log(err);
      } else if (key) {
        console.log(key);
      }
      const dicpher = createDecipheriv(algorithm, key, iv);
      input.pipe(dicpher).pipe(output);
    });
  } catch (err) {
    console.log(err);
  }
};

export { router as test };
