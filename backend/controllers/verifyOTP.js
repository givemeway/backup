import { JWT_SECRET, OTP_EXPIRY } from "../config/config.js";
import { prismaUser as prisma } from "../config/prismaDBConfig.js";
import { hotp } from "otplib";
import { authenticator } from "@otplib/preset-default";
import base32Encode from "base32-encode";
import cookie from "cookie";
import { cookieOpts } from "../config/config.js";
import jwt from "jsonwebtoken";

export const fn_verifyOTP = (username, token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });
      if (user) {
        const now = Date.now();
        const diff = (now - parseInt(user.OTPGenTime)) / 1000;
        if (diff < OTP_EXPIRY) {
          const isValid = hotp.verify({
            token: token,
            secret: user.enc,
            counter: user.hotpCounter,
          });
          if (isValid) {
            await prisma.user.update({
              where: {
                username,
              },
              data: {
                hotpCounter: parseInt(user.hotpCounter) + 1,
                OTPGenTime: Date.now(),
              },
            });
            resolve(isValid);
          } else {
            reject("Invalid Code!");
          }
        } else {
          reject(`Code Expired!`);
        }
      } else {
        reject(`${username} not found`);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const verifyTOTP = (username, token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });
      if (user) {
        const unsignedArrBuff = Buffer.from(user.enc.toUpperCase(), "hex");
        const base32_secret = base32Encode(unsignedArrBuff, "RFC4648", {
          padding: false,
        });
        const isValid = authenticator.check(token, base32_secret);
        if (isValid) resolve(isValid);
        else reject("Invalid Code!");
      } else {
        reject(`${username} not found`);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const verifyOTP = async (req, res, next) => {
  try {
    const username = req.user.Username;
    const { token, mfa, is2FAConfig } = req.query;
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (user === null) {
      return res.status(404).json({ success: false, msg: `User not found` });
    }
    const { first_name, last_name, id, email, is2FA, isSMS, isEmail, isTOTP } =
      user;
    let payload = {
      Username: username,
      first: first_name,
      last: last_name,
      userID: id,
      email,
      is2FA,
      isSMS,
      isEmail,
      isTOTP,
      _2FA_verified: null,
    };

    const _2fa_payload = {
      Username: "",
      email: "",
      is2FA: null,
      isSMS: null,
      isTOTP: null,
      _2FA_verified: null,
      _2FA_verifying: null,
    };

    if (mfa === "email" || mfa === "sms") {
      const isValid = await fn_verifyOTP(username, token);
      if (is2FAConfig === "true" && isValid) {
        await prisma.user.update({
          where: {
            username,
          },
          data: {
            is2FA: true,
            isEmail: true,
            isTOTP: false,
            isSMS: false,
          },
        });
      }
      if (is2FAConfig === "false" && isValid) {
        payload._2FA_verified = true;
        const jwt_token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
        const jwt_2fa_token = jwt.sign(_2fa_payload, JWT_SECRET, {
          expiresIn: -100,
        });
        const cookies = [
          cookie.serialize("token", jwt_token, cookieOpts),
          cookie.serialize("_2FA", jwt_2fa_token, cookieOpts),
        ];
        res.setHeader("Set-Cookie", cookies);
      }

      res
        .status(200)
        .json({ success: true, msg: `OTP validity is ${isValid}`, isValid });
    } else if (mfa === "totp") {
      const isValid = await verifyTOTP(username, token);
      if (is2FAConfig === "true" && isValid) {
        await prisma.user.update({
          where: {
            username,
          },
          data: {
            is2FA: true,
            isEmail: false,
            isTOTP: true,
            isSMS: false,
          },
        });
      }
      if (is2FAConfig === "false" && isValid) {
        payload._2FA_verified = true;
        const jwt_token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("token", jwt_token, cookieOpts)
        );
      }
      res
        .status(200)
        .json({ success: true, msg: `OTP validity is ${isValid}`, isValid });
    } else {
      res.status(400).json({ success: true, msg: "Invalid input" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: `${err}` });
  }
};
