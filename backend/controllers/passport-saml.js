import { Strategy as SAMLStrategy, SAML } from "@node-saml/passport-saml";
import passport from "passport";
import { prismaUser } from "../config/prismaDBConfig.js";
import { PrismaClientKnownRequestError } from "../DB/prisma-client/users/runtime/library.js";
import { SSOToken } from "../models/mongodb.js";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
dotenv.config();

const HOST =
  process.env.ENV === "prod" ? "https://qdrive.space" : "http://localhost:3000";

const SERVER =
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
    console.log("here this strategy");
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
    if (userToken) {
      const opts = await getSAMLOpts(userToken.username);
      const saml = await getSAMLConfig(opts);
      passport.use("saml", saml);
      passport.authenticate(
        "saml",
        { failureRedirect: `${HOST}/login` },
        (err, user) => {
          if (err) return res.status(404).json({ msg: "invalid response" });
          if (userToken.username === user.nameID) {
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
    console.log(user);
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
      res.redirect(ssoLoginURL);
    }
    if (user && !user.isSSO) {
      return res.redirect(`${HOST}/login`);
    }
    if (!user) {
      return res.status(404).redirect(`${HOST}/login`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "something went wrong" });
  }
};
