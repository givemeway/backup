import { Strategy as SAMLStrategy, SAML } from "@node-saml/passport-saml";
import passport from "passport";
import { prismaUser } from "../config/prismaDBConfig.js";
import { PrismaClientKnownRequestError } from "../DB/prisma-client/users/runtime/library.js";
import { SSOToken } from "../models/mongodb.js";
import { randomUUID } from "crypto";
import cookie from "cookie";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import { cookieOpts, JWT_SECRET } from "../config/config.js";
dotenv.config();

export const HOST =
  process.env.ENV === "prod" ? "https://qdrive.space" : "http://localhost:3000";

export const SERVER =
  process.env.ENV === "prod"
    ? "https://api.qdrive.space"
    : "http://localhost:3001";

const getSAMLConfig = async (opts, login = false) => {
  const { callbackUrl, idpIssuer, idpCert, entryPoint, issuer } = opts;
  if (login) {
    const saml = await new SAML(
      {
        callbackUrl,
        idpIssuer,
        issuer,
        idpCert,
        entryPoint,
      },
      (profile, done) => done(null, profile)
    );

    return saml;
  } else {
    const saml = await new SAMLStrategy(
      {
        callbackUrl,
        idpIssuer,
        issuer,
        idpCert,
        entryPoint,
      },
      (profile, done) => done(null, profile)
    );

    return saml;
  }
};

export const ProcessSAMLResponse = async (req, res, next) => {
  try {
    const { RelayState } = req.body;
    const userToken = await SSOToken.findOne({ token: RelayState });
    const user = await prismaUser.user.findUnique({
      where: { username: userToken.username },
    });

    if (user) {
      const opts = await getSAMLOpts(user.username);
      const saml = await getSAMLConfig(opts);
      passport.use("saml", saml);
      passport.authenticate(
        "saml",
        { failureRedirect: `${HOST}/login` },
        (err, profile) => {
          if (err) return res.status(404).json({ msg: "invalid response" });
          if (userToken.username === profile.nameID) {
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
              _2FA_verifying: user.is2FA ? true : false,
              isSSO: user.isSSO,
              isSSO_verified: true,
            };
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
            const cookies = [cookie.serialize("token", token, cookieOpts)];
            if (user.is2FA) {
              const _2fa_token = jwt.sign(payload, JWT_SECRET, {
                expiresIn: 300,
              });
              cookies.push(cookie.serialize("_2FA", _2fa_token, cookieOpts));
            }
            res.setHeader("Set-Cookie", cookies);
            return res.status(200).redirect(`${HOST}/dashboard/home`);
          } else {
            return res.status(200).redirect(`${HOST}/login`);
          }
        }
      )(req, res, next);
    } else {
      return res.status(404).redirect(`${HOST}/login`);
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, msg: "something went wrong" });
  }
};

export const getSAMLOpts = async (username) => {
  const user = await prismaUser.user.findUnique({
    where: {
      username,
    },
  });
  const opts = {
    callbackUrl: `${SERVER}/app/user/sso/process`,
    idpIssuer: user.issuer_URL,
    issuer: `${SERVER}/app/user/sso/login`,
    idpCert: user.cert,
    entryPoint: user.SSO_EndPoint,
  };
  return opts;
};

export const SSOConfig = async (req, res, next) => {
  try {
    const username = req.user.Username;
    const { idpIssuer, idpCert, entryPoint } = req.body;

    await prismaUser.user.update({
      where: {
        username,
      },
      data: {
        isSSO: true,
        issuer_URL: idpIssuer,
        cert: idpCert,
        SSO_EndPoint: entryPoint,
      },
    });
    return res.status(200).json({ success: true, msg: "SSO configured" });
  } catch (err) {
    console.log(err);
    if (err instanceof PrismaClientKnownRequestError) {
      return res.status(401).json({ succes: false, msg: "incorrect details" });
    } else {
      return res
        .status(500)
        .json({ success: false, msg: "something went wrong" });
    }
  }
};

export const ProcessSAMLLogin = async (req, res, next) => {
  try {
    const { username } = req.query;
    const user = await prismaUser.user.findUnique({
      where: {
        username,
      },
    });
    if (user && user.isSSO) {
      const opts = await getSAMLOpts(username);
      const saml = await getSAMLConfig(opts, true);
      let userToken = await SSOToken.findOne({ username });
      if (userToken) {
        await SSOToken.deleteOne({ username });
        userToken = await SSOToken.create({ username, token: randomUUID() });
      } else {
        userToken = await SSOToken.create({ username, token: randomUUID() });
      }
      const ssoLoginURL = await saml.getAuthorizeUrlAsync(
        userToken.token,
        "www.qdrive.space",
        {
          samlFallback: "login-request",
        }
      );
      return res.status(200).json({ success: true, url: ssoLoginURL });
    }
    if (user && !user.isSSO) {
      return res.status(401).json({ success: false, msg: "SSO Not enabled" });
    }
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "something went wrong" });
  }
};
