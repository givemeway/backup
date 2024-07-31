import { PassToken } from "../models/mongodb.js";
import { prismaUser as prisma } from "../config/prismaDBConfig.js";
import { EXPIRY } from "../config/config.js";
import { createHash } from "node:crypto";

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
      if (diff < EXPIRY) {
        await PassToken.deleteOne({ token });
        await prisma.user.update({
          where: {
            username: user.username,
          },
          data: {
            password: hashPass,
          },
        });
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
