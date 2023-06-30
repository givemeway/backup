import multer from "multer";
import express from "express";
import path from "path";
import dotenv from "dotenv";
await dotenv.config();
const router = express.Router();

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
      return cb(null, req.headers.filename);
    },
  }),
});

const uploadFile = (req, res, next) => {
  const upload = multerInstance.single("file");

  upload(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      res.json("Error Occured");
      res.end();
    } else if (error) {
      res.json("Unknow Error");
      res.end();
    }
    // console.log(req.file);
    next();
  });
};

export { uploadFile };
