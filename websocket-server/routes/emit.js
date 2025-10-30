import express from "express";
import { io } from "../server.js";
const router = express.Router();
import dotenv from "dotenv";
await dotenv.config();

const headers = {
  headers: { "Content-Type": "application/json" },
};

router.post("/emit", async (req, res) => {
  try {
    const payload = req.body;
    io.to(payload.socket_main_id).emit(payload.status, { payload });
    res.status(200).send({ message: "Emit route is working" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

export { router as emit };
