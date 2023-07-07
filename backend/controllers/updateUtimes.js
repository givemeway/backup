import fs from "node:fs/promises";

const updateUtime = async (req, res, next) => {
  try {
    const fileStat = JSON.parse(req.headers.filestat);
    let filePath = req.headers.fileAbsPath;
    if (fileStat.modified === true) {
      filePath = filePath + `$$$${fileStat.checksum}$$$NA`;
    }
    await fs.utimes(filePath, fileStat.atimeMs / 1000, fileStat.mtimeMs / 1000);
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json(`File utime error ${err}`);
    res.end();
  }
};

export default updateUtime;
