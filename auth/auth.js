// const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
await dotenv.config();
// require("dotenv").config();

const verifyToken = (request, response, next) => {
  const authHeader = request.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
      if (error) {
        response.status(403).json("Token Invalid");
        response.end();
      } else {
        request.user = user;
        next();
      }
    });
  } else {
    return response.status(401).json("You are not authenticated");
  }
};

export { verifyToken };
