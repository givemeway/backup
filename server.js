const express = require("express");
const bodyparser = require("body-parser");
const login = require('./routes/login');
const fileIO = require('./routes/fileIO');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use("/app/login",login);
app.use("/app/fileIO",fileIO);

app.listen(PORT, (error) => {
  if (error) {
    throw Error(error);
  } else {
    console.log(`Listening on localhost:${PORT}`);
  }
});