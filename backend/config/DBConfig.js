import dotenv from "dotenv";
dotenv.config();

const DBConfig = {
  files: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "files",
    port: process.env.DB_PORT,
  },
  directories: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "directories",
    port: process.env.DB_PORT,
  },
  deleted_files: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "deleted_files",
    port: process.env.DB_PORT,
  },
  deleted_directories: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "deleted_directories",
    port: process.env.DB_PORT,
  },
  versions: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "versions",
    port: process.env.DB_PORT,
  },
  customers: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "customers",
    port: process.env.DB_PORT,
  },
};

export default DBConfig;
