import path from "node:path";
import fs from "node:fs";
import dotenv from "dotenv";
await dotenv.config();
import { v4 as uuidv4 } from "uuid";

const root = process.env.VARIABLE;

const createDir = async (req, res, next) => {
  // TODO
  // 1. read params.
  //      a) Authorize the token or API key - done
  // 2. extract the machine name, file metaData[ filePath, fileHash, size]
  // 3. Create the path directory in the Machine Name
  // 4. Send the Signal Ready
  const dir = req.headers.dir;
  const fileName = req.headers.filename;
  const deviceName = req.headers.devicename;
  // const userName = req.headers.username;
  const userName = req.user.Username;

  req.headers.uuid = uuidv4();
  const fileAbsPath = path.join(
    `${root}/${userName}`,
    req.headers.uuid
    // deviceName,
    // dir,
    // fileName
  );
  fs.access(path.dirname(fileAbsPath), (err) => {
    if (err) {
      fs.mkdir(path.dirname(fileAbsPath), { recursive: true }, (error) => {
        if (error) {
          console.log(error);
          console.log(fileAbsPath);
          res.status(500).json("unable to create Dir try again");
          res.end();
        } else {
          req.headers.fileAbsPath = fileAbsPath;
          next();
        }
      });
    } else {
      req.headers.fileAbsPath = fileAbsPath;
      next();
    }
  });
};

export { createDir };
