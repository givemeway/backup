import express from "express";
const router = express.Router();
import { v4 as uuidv4 } from "uuid";
import { pool } from "../server.js";
import { origin } from "../config/config.js";
import csrf from "csurf";
import { verifyToken } from "../auth/auth.js";

const ER_DUP_ENTRY = 1062;

const sql_execute = (con, query, values) => {
  return new Promise(async (resolve, reject) => {
    try {
      await con.beginTransaction();
      await con.query(query, values);
      await con.commit();
      await con.release();
      resolve();
    } catch (err) {
      await con.rollback();
      console.error(err);
      reject(err);
    }
  });
};

router.use(csrf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Expose-Headers", "Set-Cookie");
  next();
});

router.post("/", verifyToken, async (req, res, next) => {
  const { subpath, folder } = req.query;
  const username = req.user.Username;
  let status;
  let path;
  let device;
  let success;
  let msg;
  if (subpath === "home") {
    path = "/" + folder;
    device = folder;
  } else {
    path = subpath.split("home").slice(1).join("/") + "/" + folder;
    device = subpath.split("home")[1].split("/")[1];
  }
  const query = `INSERT INTO directories.directories 
                 VALUES(?,?,?,?,?,NOW())`;
  try {
    const con = await pool["directories"].getConnection();
    const values = [uuidv4(), username, device, folder, path];
    await sql_execute(con, query, values);
    success = true;
    status = 200;
    msg = `Folder ${folder} created!`;
  } catch (err) {
    success = false;
    if (err?.errno === ER_DUP_ENTRY) {
      msg = err.message;
      status = 409;
    } else {
      msg = err;
      status = 500;
    }
  } finally {
    res.status(status).json({ success, msg });
  }
});

export { router as createFolder };
