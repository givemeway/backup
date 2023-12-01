import express from "express";
import csrf from "csurf";
const router = express.Router();
import { sqlExecute } from "../controllers/sql_execute.js";
import { origin } from "../config/config.js";
import releaseConnection from "../controllers/ReleaseConnection.js";
import { randomFill } from "node:crypto";
import { Buffer } from "node:buffer";

const query = `INSERT INTO users 
                  (username,email,password,first_name,last_name,phone,enc)
                  VALUES (?,?, SHA2(?,512),?,?,?,?);`;

const generateEncKey = () => {
  return new Promise((resolve, reject) => {
    const buffer = Buffer.alloc(32);
    randomFill(buffer, (err, buf) => {
      if (err) reject(err);
      resolve(buf.toString("hex"));
    });
  });
};

router.use(csrf({ cookie: true }));

const buildSignupQuery = async (req, res, next) => {
  // const username = req.headers.username;
  // const firstname = req.headers.firstname;
  // const lastname = req.headers.lastname;
  // const email = req.headers.email;
  // const password = req.headers.password;
  // const phone = req.headers.phone;
  try {
    const { username, firstname, lastname, email, password, phone } = req.body;
    req.username = username;
    const enc = await generateEncKey();
    req.headers.query = query;
    req.headers.queryValues = [
      username,
      email,
      password,
      firstname,
      lastname,
      phone,
      enc,
    ];
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
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

router.post(
  "/",
  buildSignupQuery,
  sqlExecute,
  releaseConnection,
  (req, res) => {
    if (req.headers.hasOwnProperty("sql_errno")) {
      if (req.headers.sql_errno === 1062) {
        res
          .status(409)
          .json({ success: false, msg: `Username ${req.username} exists!` });
      } else {
        res.status(500).json({ success: false, msg: req.headers.error });
      }
    } else {
      res.status(200).json({
        success: true,
        msg: `Username ${req.username} created!`,
      });
    }
  }
);

export { router as signup };
