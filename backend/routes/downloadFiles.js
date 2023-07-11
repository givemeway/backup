import express from "express";
const router = express.Router();
import fs from "node:fs";

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization,Content-Disposition"
  );
  next();
});

router.post("/", (req, res) => {
  const filePath =
    "F:\\NodeJSBackupSolution\\sandeep.kumar@idriveinc.com\\DESKTOP-10RSGE8\\Desktop\\Sandeep Kumar. GR-(315-ST 411)-DBYPS2459K_2023-24.pdf";

  res.writeHead(200, {
    "Content-Disposition": "attachment; filename=DBYPS2459K_2023-24.pdf",
    "Content-Type": "application/octet-stream",
  });
  fs.createReadStream(filePath).pipe(res);
});

export { router as downloadFiles };
