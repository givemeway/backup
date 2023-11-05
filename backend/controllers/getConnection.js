import { pool } from "../server.js";

const getConnection = (db) => async (req, res, next) => {
  try {
    const connection = await pool[db].getConnection();
    req.db = connection;
    next();
  } catch (err) {
    res.status(500).send(`DB Error ${err}`);
  }
};

export { getConnection };
