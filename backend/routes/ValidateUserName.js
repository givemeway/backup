import express from "express";
import csrf from "csurf";
const router = express.Router();

import { origin } from "../config/config.js";

import { pool } from "../server.js";
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
    // const query = `SELECT * FROM users WHERE username = ?`;
    const user = await prismaUser.user.findUnique({ where: { username } });
    // const userCon = await pool["customers"].getConnection();
    // const [rows, fields] = await userCon.execute(query, [username]);
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
