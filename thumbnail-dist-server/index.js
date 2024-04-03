import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { getSignedURL } from "./controllers/index.js";
import { verifyToken } from "./auth/index.js";

const PORT = process.env.PORT || 3003;

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/api/v1/preview", getSignedURL);

app.listen(PORT, () => [
  console.log(`THUMBNAIL service running on PORT ${PORT}`),
]);

process.on("uncaughtException", (err) => {
  console.error(err);
  process.exit(1);
});
