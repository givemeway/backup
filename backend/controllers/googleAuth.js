import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prismaUser } from "../config/prismaDBConfig.js";
import passport from "passport";
import dotenv from "dotenv";
import cookie from "cookie";
import jwt from "jsonwebtoken";

import { cookieOpts, JWT_SECRET, SERVER_DOMAIN } from "../config/config.js";
import { OAuth2Client } from "google-auth-library";
import { resolve } from "path";
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

export const authGoogleOneTap = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const data = await getAuthenticatedClient(token);
    const user = await prismaUser.user.findUnique({
      where: {
        username: data.email,
      },
    });
    if (user) {
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
      return res
        .status(200)
        .json({ success: true, redirect: `${HOST}/dashboard/home` });
    } else
      return res.status(404).json({ success: true, msg: "user doesn't exist" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const getAuthenticatedClient = (token) =>
  new Promise(async (resolve, reject) => {
    try {
      const oAuth2Client = new OAuth2Client(clientID, clientSecret);
      const ticket = await oAuth2Client.verifyIdToken({
        idToken: token,
        audience: clientID,
      });
      const payload = ticket.getPayload();
      if (payload) resolve(payload);
      else reject("Invalid Token");
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });

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
