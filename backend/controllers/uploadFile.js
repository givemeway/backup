import multer from "multer";
import express from "express";
import path from "path";
import dotenv from "dotenv";
await dotenv.config();
const router = express.Router();
import Busboy from "busboy";
import fs from "node:fs";

const root = process.env.VARIABLE;

const multerInstance = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const device = req.headers.devicename;
      const filePath = req.headers.dir;
      const userName = req.headers.username;
      return cb(null, path.join(`${root}/${userName}`, device, filePath));
    },
    filename: (req, file, cb) => {
      const fileStat = JSON.parse(req.headers.filestat);
      let filename = req.headers.filename;
      if (fileStat.modified === true) {
        filename = `${filename}$$$${fileStat.checksum}$$$NA`;
      }
      return cb(null, filename);
    },
  }),
});

// const uploadFile = (req, res, next) => {
//   const upload = multerInstance.single("file");

//   upload(req, res, (error) => {
//     if (error instanceof multer.MulterError) {
//       console.log(error, "Multer error");
//       res.status(500).json(error);
//       res.end();
//     } else if (error) {
//       console.log(error);
//       res.status(500).json(error);
//       res.end();
//     } else {
//       next();
//     }
//     // console.log(req.file);
//   });
// };

const uploadFile = (req, res, next) => {
  const busboy = Busboy({ headers: req.headers });

  busboy.on("file", (fieldname, file, filename) => {
    // Handle the incoming file stream here
    // For example, you can pipe the file stream to a writable stream
    const device = req.headers.devicename;
    const filePath = req.headers.dir;
    const userName = req.headers.username;
    const abspath = path.join(`${root}/${userName}`, device, filePath);
    const fileStat = JSON.parse(req.headers.filestat);
    let fileName = req.headers.filename;
    const writableStream = fs.createWriteStream(`${abspath}/${fileName}`);
    file.pipe(writableStream);
  });

  busboy.on("finish", () => {
    next();
  });
  req.pipe(busboy);
  // const boundary = req.headers["content-type"].split(";")[1].split("=")[1];
  // console.log(boundary);
  // console.log(req.headers["content-type"]);
  // console.log(req.headers["content-disposition"]);
  // console.log(req.file);
  // const data = [];
  // req.on("data", (chunk) => {
  //   const parts = chunk.toString().split(boundary);
  //   for (const part of parts) {
  //     const [name, value] = part.split("; filename=");
  //     const filename = name.split("=")[1];
  //     console.log(value);
  //     // const fileData = value.split("filename=")[1];

  //     // data.push({
  //     //   name: name.split("=")[0],
  //     //   filename: filename,
  //     //   fileData: fs.readFileSync(Buffer.from(fileData)),
  //     // });
  //   }
  // });
  // console.log(data);
};

export { uploadFile };
