import jwt from "jsonwebtoken";
import cookie from "cookie";
import { JWT_SECRET, DOMAIN } from "../config/config.js";

export const logout = (req, res) => {
  const payload = {
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
    isSSO_verified: null,
    isSSO: null,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: -100 });
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", token, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      path: "/",
      domain: DOMAIN,
      expires: new Date(Date.now() + 864000),
    })
  );
  res.status(200).json({ success: true, msg: "logged out" });
};
