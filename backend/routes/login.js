import express from "express";
const router = express.Router();

import { sqlExecute } from "../controllers/sql_execute.js";
import { validateUserDetails } from "../controllers/validateUserDetails.js";
import dotenv from "dotenv";
await dotenv.config();

const buildLoginQuery = (req, res, next) => {
  const encodedString = req.headers.authorization;
  const usernametype = req.headers.usernametype;
  const extractedUsernamePassword = atob(encodedString.split(" ")[1]);
  const username = extractedUsernamePassword.split(":")[0];
  const password = extractedUsernamePassword.split(":")[1];
  const payload = { Username: username };
  let values = null;
  let columns = null;
  if (usernametype === "email") {
    values = `email = '${username}'`;
    columns = `username, password`;
  } else {
    values = `username = '${username}' AND password  = SHA2('${password}',512)`;
    columns = `username, password`;
  }
  const query = `SELECT ${columns} FROM users WHERE ${values}`;
  req.headers.query = query;
  req.headers.username = username;
  req.headers.password = password;
  req.headers.jwt_payload = payload;
  next();
};

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

router.post("/", buildLoginQuery, sqlExecute, validateUserDetails);

export { router as login };
