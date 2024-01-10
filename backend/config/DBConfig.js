import dotenv from "dotenv";
dotenv.config();

const DBConfig = {
  files: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "files",
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10000,
    maxIdle: 10000, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 100,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  },
  directories: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "directories",
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10000,
    maxIdle: 10000, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 100,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  },
  deleted_files: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "deleted_files",
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10000,
    maxIdle: 10000, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 100,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  },
  deleted_directories: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "deleted_directories",
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10000,
    maxIdle: 10000, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 100,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  },
  versions: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "versions",
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10000,
    maxIdle: 10000, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 100,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  },
  customers: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "customers",
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10000,
    maxIdle: 10000, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 100,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  },
};

export default DBConfig;
