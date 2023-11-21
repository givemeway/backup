import crypto from "crypto";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { domain } from "../config/config.js";

const validateUserDetails = (req, res, next) => {
  if (req.headers.queryStatus instanceof Array) {
    if (req.headers.queryStatus.length == 0) {
      res.status(401).json("Username Or Password Incorrect1");
    } else if (req.headers.queryStatus.length == 1) {
      const hashedPassword = req.headers.queryStatus[0].password;
      const hash = crypto.createHash("sha512");
      const data = hash.update(req.headers.password);
      const gen_hash = data.digest("hex");

      if (
        req.headers.queryStatus[0].username === req.headers.username &&
        hashedPassword === gen_hash
      ) {
        const token = jwt.sign(
          req.headers.jwt_payload,
          process.env.JWT_SECRET,
          { expiresIn: 86400 }
        );
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("token", token, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            domain: domain,
            expires: new Date(Date.now() + 86400000),
          })
        );
        res
          .status(200)
          .json({ user: req.headers.queryStatus[0].username, token });
        res.end();
        next();
      } else {
        res.status(401).json("Username Or Password Incorrect");
        res.end();
        next();
      }
    } else {
      const usernames = req.headers.queryStatus.map(
        (element) => element.username
      );
      res.status(200).json(usernames);
      res.end();
      next();
    }
  } else {
    res.json(req.headers.queryStatus);
    next();
  }
};

export { validateUserDetails };
