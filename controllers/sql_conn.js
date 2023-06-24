import dotenv from "dotenv";
await dotenv.config();

const sqlConn = (connection) => async (req, res, next) => {
  try {
    // const connection = mysql.createConnection({
    //   host: process.env.DB_HOST,
    //   user: process.env.DB_USER,
    //   password: process.env.DB_PASSWORD,
    //   database: dbName,
    //   port: process.env.DB_PORT,
    // });
    req.headers.connection = connection;
    next();
  } catch (error) {
    res.status(500).json(`DB Error ${error}`);
    res.end();
  }
};

export { sqlConn };
