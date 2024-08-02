import { PassToken } from "../models/mongodb.js";
import { prismaUser as prisma } from "../config/prismaDBConfig.js";
import { cookieOpts, EXPIRY, JWT_SECRET } from "../config/config.js";
import { createHash } from "node:crypto";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export const updatePassword = async (req, res, next) => {
  try {
    const { token, password } = req.query;
    const user = await PassToken.findOne({
      token: token,
    });
    if (user) {
      const now = Date.now();
      const expiry = user.expires_at;
      const diff = expiry - now;
      const hashPass = createHash("sha512").update(password).digest("hex");
      const username = user.username;
      if (diff < EXPIRY) {
        await PassToken.deleteOne({ token });
        await prisma.user.update({
          where: {
            username,
          },
          data: {
            password: hashPass,
          },
        });
        const userData = await prisma.user.findUnique({
          where: { username },
        });
        const payload = {
          Username: userData.username,
          first: userData.first_name,
          last: userData.last_name,
          userID: userData.id,
          email: userData.email,
        };
        const jwt_token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("token", jwt_token, cookieOpts)
        );
        res.status(200).json({ success: true, msg: "password updated" });
        next();
      } else {
        res.status(404).json({ success: false, msg: "Password Link Expired" });
        await PassToken.deleteOne({ token });
        next();
      }
    } else {
      res.status(404).json({ success: false, msg: "Invalid Password Link" });
      next();
    }
  } catch (err) {
    res.status(500).json({ success: false, msg: "something went wrong", err });
    next();
  }
};
