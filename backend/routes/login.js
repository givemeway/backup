import express from "express";
const router = express.Router();

import { sqlExecute } from "../controllers/sql_execute.js";
import { validateUserDetails } from "../controllers/validateUserDetails.js";
import { origin } from "../config/config.js";
import releaseConnection from "../controllers/ReleaseConnection.js";
import dotenv from "dotenv";
await dotenv.config();
import csrf from "csurf";

router.use(csrf({ cookie: true }));

const buildLoginQuery = (req, res, next) => {
  console.log("inside the login build logic");
  const encodedString = req.headers.authorization;
  const usernametype = req.headers.usernametype;
  const extractedUsernamePassword = atob(encodedString.split(" ")[1]);
  const username = extractedUsernamePassword.split(":")[0];
  const password = extractedUsernamePassword.split(":")[1];
  const payload = { Username: username };
  console.log(payload);
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
  const query2 = `SELECT username, password,first_name,last_name,enc FROM users WHERE username = ? AND password  = SHA2(?,512)`;
  req.headers.query = query2;
  req.headers.queryValues = [username, password];
  req.headers.username = username;
  req.headers.password = password;
  req.headers.jwt_payload = payload;
  next();
};

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,X-CSRF-Token,Authorization,Set-Cookie"
  );
  res.header("Access-Control-Expose-Headers", "Set-Cookie");

  next();
});

router.post(
  "/",
  buildLoginQuery,
  sqlExecute,
  validateUserDetails,
  releaseConnection
);

export { router as login };
