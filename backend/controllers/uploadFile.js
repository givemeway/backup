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
      return cb(null, path.join(`${root}/${userName}`, "/"));

      // return cb(null, path.join(`${root}/${userName}`, device, filePath));
    },
    filename: (req, file, cb) => {
      const fileStat = JSON.parse(req.headers.filestat);
      let filename = req.headers.filename;
      if (fileStat.modified === true) {
        // filename = `${filename}$$$${fileStat.checksum}$$$NA`;
        req.headers.uuid_new = req.headers.uuid;
        req.headers.uuid = fileStat.uuid;
        return cb(null, req.headers.uuid_new);
      }
      return cb(null, req.headers.uuid);

      // return cb(null, filename);
    },
  }),
});

const uploadFile = (req, res, next) => {
  const upload = multerInstance.single("file");

  upload(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      console.log(error, "Multer error");
      res.status(500).json(error);
      res.end();
    } else if (error) {
      console.error(error);
      res.status(500).json(error);
      res.end();
    } else {
      next();
    }
    // console.log(req.file);
  });
};

// const uploadFile = (req, res, next) => {
//   const device = req.headers.devicename;
//   const fileMode = req.headers.filemode;
//   const totalChunks = req.headers.totalchunks;
//   const currentChunk = req.headers.currentchunk;
//   const filePath = req.headers.dir;
//   const userName = req.headers.username;
//   const abspath = path.join(`${root}/${userName}`, device, filePath);
//   const fileStat = JSON.parse(req.headers.filestat);
//   let fileName = req.headers.filename;
//   if (fileStat.modified === true) {
//     fileName = `${fileName}$$$${fileStat.checksum}$$$NA`;
//   }
//   const createWriteStream = () => {
//     const fileStream = fs.createWriteStream(`${abspath}/${fileName}`, {
//       flags: "a",
//     });
//     req.pipe(fileStream);

//     fileStream.on("finish", () => {
//       if (totalChunks === currentChunk) {
//         next();
//       } else {
//         res.status(200).send({
//           success: true,
//           desc: `chunk ${currentChunk} received`,
//           msg: "success",
//         });
//       }
//     });

//     fileStream.on("error", (err) => {
//       res.status(500).json({
//         success: false,
//         desc: `chunk ${currentChunk} failed`,
//         msg: err,
//       });
//       res.end();
//     });
//   };

//   if (fileMode === "w") {
//     fs.access(`${abspath}/${fileName}`, (err) => {
//       if (err) {
//         createWriteStream();
//       } else {
//         res
//           .status(500)
//           .json("A file name with the same directory name already exists");
//         res.end();
//       }
//     });
//   } else {
//     createWriteStream();
//   }
// };

export { uploadFile };
