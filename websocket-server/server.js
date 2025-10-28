import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "node:http";
import { corsOpts } from "./config.js";
import { Server } from "socket.io";
const app = express();
const PORT = 3005;

app.use(cors(corsOpts));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

const server = http.createServer(app);

server.listen(PORT, (err) => {
  if (err) {
    throw Error(err);
  } else {
    console.log(`Listening on localhost:${PORT} over HTTP`);
  }
});

const socketIO = new Server(server, { cors: corsOpts });

socketIO.on("connection", (socket) => {
  console.log("Connected to Client: ", socket.id);
  socket.emit("connected", { socketID: socket.id });
  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });
});
