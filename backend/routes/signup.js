import express from "express";
const router = express.Router();
import { sqlExecute } from "../controllers/sql_execute.js";
import { origin } from "../config/config.js";

const buildSignupQuery = (req, res, next) => {
  const username = req.headers.username;
  const firstname = req.headers.firstname;
  const lastname = req.headers.lastname;
  const email = req.headers.email;
  const password = req.headers.password;
  const phone = req.headers.phone;
  const query = `INSERT INTO users 
                (username,email,password,first_name,last_name,phone,enc)
                VALUES (?,?, SHA2(?,512),?,?,?,NULL);`;
  req.headers.query = query;
  req.headers.queryValues = [
    username,
    email,
    password,
    firstname,
    lastname,
    phone,
  ];
  next();
};

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization,username,firstname,lastname,email,password,phone"
  );
  next();
});

router.post("/", buildSignupQuery, sqlExecute, (req, res) => {
  if (req.headers.hasOwnProperty("sql_errno")) {
    if (req.headers.sql_errno === 1062) {
      res.status(500).json(req.headers.error.message);
    } else {
      res.status(500).json(req.headers.error);
    }
  } else {
    res.status(200).json(`Username ${req.headers.username} created!`);
  }
});

export { router as signup };
