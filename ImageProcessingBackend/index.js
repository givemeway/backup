import express from "express";
import http from "node:http";
import cors from "cors";

import dotenv from "dotenv";
import { initiKafkaConsunmer } from "./utils.js";
import { qdriveDBConnection, userDBConnection } from "./database/index.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 8080;

const server = http.createServer(app);
let prismaQdrive, prismaUser;

try {
  prismaQdrive = await qdriveDBConnection();
  prismaUser = await userDBConnection();

  initiKafkaConsunmer().catch((error) => {
    console.log(error);
  });
} catch (err) {
  console.error(err);
}

server.listen(PORT, () => {
  console.log(`Image Processing SERVER running on PORT ${PORT}`);
});

process.on("uncaughtException", (error) => {
  console.error(error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error(error);
  process.exit(1);
});

export { prismaQdrive, prismaUser };
