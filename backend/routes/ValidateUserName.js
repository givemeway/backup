import express from "express";
import csrf from "csurf";
const router = express.Router();

import { origin } from "../config/config.js";

import { prismaUser } from "../config/prismaDBConfig.js";

router.use(csrf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization,username,firstname,lastname,email,password,phone"
  );
  next();
});

router.get("/", async (req, res) => {
  try {
    const { username } = req.query;
    const user = await prismaUser.user.findUnique({ where: { username } });

    if (user !== null) {
      res.status(200).json({ exist: true, username });
    } else {
      res.status(200).json({ exist: false, username });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ exist: undefined, err });
  }
});

export { router as validateUsername };
