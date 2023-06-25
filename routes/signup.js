import express from "express";
const router = express.Router();
import { sqlExecute } from "../controllers/sql_execute.js";
import { sqlConn } from "../controllers/sql_conn.js";
import mysql from "mysql2/promise";
import { createConnection } from "../controllers/createConnection.js";

const buildSignupQuery = (req, res, next) => {
  const username = req.headers.username;
  const firstname = req.headers.firstname;
  const lastname = req.headers.lastname;
  const email = req.headers.email;
  const password = req.headers.password;
  const phone = req.headers.phone;
  const query = `INSERT INTO users (username,email,password,first_name,last_name,phone)
    VALUES ("${username}","${email}", SHA2('${password}',512),"${firstname}",
    "${lastname}","${phone}"
    );`;
  req.headers.query = query;
  next();
};
const connection = createConnection("customers");
router.use(sqlConn(connection));

router.post("/", buildSignupQuery, sqlExecute, (req, res) => {
  res.status(200).json(req.headers.queryStatus);
});

export { router as signup };
