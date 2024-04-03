import express from "express";
const router = express.Router();
import csrf from "csurf";
import { Prisma, prisma } from "../config/prismaDBConfig.js";
import { Transfer, Share } from "../models/mongodb.js";
import { verifyToken } from "../auth/auth.js";

router.use(csrf({ cookie: true }));

router.get("/", verifyToken, async (req, res) => {
  // const data = await Share.find({}).skip(5).limit(10);
  const username = req.user.Username;
  const data = await Share.find({ owner: username });
  const transfer = await Transfer.find({ owner: username });
  const shares = [...data, ...transfer];

  res.status(200).json(shares);
});

export { router as getSharedLinks };
