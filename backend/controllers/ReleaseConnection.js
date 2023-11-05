const releaseConnection = (req, res, next) => {
  if (req.db) {
    req.db.release();
  }
  next();
};

export default releaseConnection;
