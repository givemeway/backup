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
    ["image_3.png", Buffer.from(salt), Buffer.from(iv)],
    (err, results, fields) => {
      if (err) throw err;
      console.log(results);
      console.log(fields);
    }
  );
  req.headers.salt = salt;
  req.headers.iv = iv;
  encrypt("./image_3.png", "sandy86kumar", req.headers.salt, req.headers.iv);
  console.log("file encrypted");
  next();
};

const decryptFileMiddleWare = async (req, res, next) => {
  const query = `SELECT * FROM
                 cryptoKeys
                 where
                 filename = "image_3.png";
                 `;
  const conn = req.headers.connection;
  try {
    const [results, fields] = await conn.execute(query);
    console.log(results);
    const { filename, salt, iv } = results[0];
    console.log(filename, salt, iv);
    decrypt(
      filename + ".enc",
      "sandy86kumar",
      Buffer.from(salt),
      Buffer.from(iv)
    );
    console.log("file decrypted");
  } catch (err) {
    console.log(err);
  }
  next();
};

router.get("/", decryptFileMiddleWare, (req, res) => {
  res.status(200).json("file encrypted");
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
  const input = fs.createReadStream(filePath);
  const output = fs.createWriteStream("dec_" + filePath.replace(/\.enc/g, ""));
  const algorithm = "aes-256-cbc";
  scrypt(password, salt, 32, (err, key) => {
    if (err) throw err;
    const dicpher = createDecipheriv(algorithm, key, iv);
    input.pipe(dicpher).pipe(output);
  });
};

export { router as test };
