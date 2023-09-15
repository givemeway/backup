const mongoConn = (connection) => async (req, res, next) => {
  req.headers.mongoConnection = await connection;
  next();
};

export default mongoConn;
