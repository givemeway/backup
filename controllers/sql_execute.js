import dotenv from "dotenv";
await dotenv.config();

const sqlExecute = async (req, res, next) => {
  try {
    const con = req.headers.connection;
    const [rows, fields] = await con.execute(req.headers.query);
    req.headers.queryStatus = rows;
    next();
  } catch (error) {
    req.headers.queryStatus = error;
    if (error.errno === 1062) {
      res
        .status(401)
        .json(
          `Username ${req.headers.username} is taken. Please create another one.`
        );
    } else {
      res.status(401).json(error.message);
    }
  }
};

export { sqlExecute };
