import mysql from "mysql2/promise";
import dotenv from "dotenv";
await dotenv.config();

const createConnection = async (db) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: db,
      port: process.env.DB_PORT,
    });
    return connection;
  } catch (err) {
    console.log("error : ", err);
    return err;
  }
};

export { createConnection };
