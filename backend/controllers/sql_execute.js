import dotenv from "dotenv";
await dotenv.config();

const sqlExecute = async (req, res, next) => {
  try {
    const con = req.headers.connection;
    const [rows, fields] = await con.execute(req.headers.query, [
      ...req.headers.queryValues,
    ]);
    req.headers.queryStatus = rows;
    console.log(rows);
    req.headers.query_success = true;
    next();
  } catch (error) {
    if (error.errno == 1062) {
      req.headers.sql_errno = 1062;
      req.headers.error = error;
      next();
    } else {
      console.log(error);
      res.status(500).json(error.message);
      res.end();
    }
  }
};

export { sqlExecute };
