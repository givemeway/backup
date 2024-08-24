import { prismaUser } from "../config/prismaDBConfig.js";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { JWT_SECRET } from "../config/config.js";
import { cookieOpts } from "../config/config.js";

export const disableOTP = async (req, res, next) => {
  try {
    const username = req.user.Username;
    const user = await prismaUser.user.findUnique({ where: { username } });
    const { is2FA } = user;
    if (is2FA) {
      await prismaUser.user.update({
        where: {
          username,
        },
        data: {
          is2FA: false,
          isEmail: false,
          isSMS: false,
          isTOTP: false,
        },
      });
      const payload = {
        Username: username,
        first: user.first_name,
        last: user.last_name,
        userID: user.id,
        email: user.email,
        is2FA: false,
        isEmail: false,
        isSMS: false,
        isTOTP: false,
        _2FA_verified: null,
      };
      const dummy_token = {
        email: "",
        first: "",
        last: "",
        userID: "",
        Username: "",
        is2FA: null,
        isSMS: null,
        isEmail: null,
        isTOTP: null,
        _2FA_verified: null,
      };
      const jwt_token_2fa = jwt.sign(dummy_token, JWT_SECRET, {
        expiresIn: -100,
      });
      const jwt_token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "1d",
      });
      const cookies = [
        cookie.serialize("token", jwt_token, cookieOpts),
        cookie.serialize("_2FA", jwt_token_2fa, cookieOpts),
      ];
      res.setHeader("Set-Cookie", cookies);
      res.status(200).json({ success: true, msg: "disable success" });
      next();
    } else {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, msg: `${err}` });
  }
};
