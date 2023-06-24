import express from "express";
import bodyparser from "body-parser";
import { login } from "./routes/login.js";
import { fileIO } from "./routes/fileIO.js";
import { test } from "./routes/test.js";
import { signup } from "./routes/signup.js";
import { sqlConn } from "./controllers/sql_conn.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use("/app/login", login);
app.use("/app/fileIO", fileIO);
app.use("/app/test", test);
app.use("/app/signup", signup);

app.listen(PORT, (error) => {
  if (error) {
    throw Error(error);
  } else {
    console.log(`Listening on localhost:${PORT}`);
  }
});
