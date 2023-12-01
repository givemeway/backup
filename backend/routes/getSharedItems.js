import express from "express";
const router = express.Router();
import csrf from "csurf";

import { Transfer, Share } from "../models/mongodb.js";

router.use(csrf({ cookie: true }));

router.get("/", async (req, res) => {
  const data = await Share.find({}).skip(5).limit(10);

  res.status(200).json(data);
});

export { router as getSharedLinks };
