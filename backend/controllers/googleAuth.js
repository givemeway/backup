import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prismaUser } from "../config/prismaDBConfig.js";
import passport from "passport";
import dotenv from "dotenv";
import cookie from "cookie";
import jwt from "jsonwebtoken";

import { cookieOpts, JWT_SECRET, SERVER_DOMAIN } from "../config/config.js";
dotenv.config();
export const HOST =
  process.env.ENV === "prod" ? "https://qdrive.space" : "http://localhost:3000";

const clientID = process.env.CLIENTID;
const clientSecret = process.env.CLIENTSECRET;
const callbackURL = `${SERVER_DOMAIN}/app/user/auth/google/callback`;

export const getGoogleStrategy = async (opts) => {
  const google = new GoogleStrategy(
    { clientID, clientSecret, callbackURL },
    (accessToken, refreshToken, profile, done) => done(null, profile)
  );
  return google;
};

export const authGoogleRequest = async (req, res, next) => {
  try {
    passport.authenticate("google", async (err, profile) => {
      console.log(profile);
      if (err)
        return res
          .status(400)
          .redirect(`${HOST}/login?error=something went wrong`);
      const user = await prismaUser.user.findUnique({
        where: {
          username: profile._json.email,
        },
      });
      if (!user)
        return res
          .status(404)
          .redirect(`${HOST}/login?error=user doesn't exist`);
      const payload = {
        Username: user.username,
        first: user.first_name,
        last: user.last_name,
        userID: user.id,
        email: user.email,
        is2FA: user.is2FA,
        isSMS: user.isSMS,
        isEmail: user.isEmail,
        isTOTP: user.isTOTP,
        _2FA_verified: false,
        isSSO: user.isSSO,
        isSSO_verified: true,
      };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
      res.setHeader("Set-Cookie", cookie.serialize("token", token, cookieOpts));
      return res.status(200).redirect(`${HOST}/dashboard/home`);
    })(req, res, next);
  } catch (err) {}
};
