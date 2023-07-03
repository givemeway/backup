import { sqlExecute } from "./sql_execute.js";

const fetchFilesData = async (req, res, next) => {
  const username = req.headers.username;
  const device = req.headers.devicename;
  const query = `SELECT * FROM files WHERE username = '${username}' AND device = '${device}'`;
  req.headers.query = query;
  await sqlExecute(req, res, next);
  next();
};

export { fetchFilesData };
