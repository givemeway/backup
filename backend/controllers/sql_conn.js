import mysql from "mysql2/promise";

const sqlConn = (connection) => async (req, res, next) => {
  if (connection instanceof Error) {
    res.status(500).json(`DB Error - ${connection}`);
    res.end();
  } else {
    req.headers.connection = await connection;
    next();
  }
};

export { sqlConn };
