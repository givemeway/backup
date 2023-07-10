import express from "express";
const router = express.Router();
import { sqlExecute } from "../controllers/sql_execute.js";

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
