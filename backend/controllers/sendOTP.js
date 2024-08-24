import { totp, hotp } from "otplib";
import cookie from "cookie";
import { prismaUser } from "../config/prismaDBConfig.js";
import { sendEmail } from "./sendEmail.js";
import { google_authenticator } from "./googleAuthConfig.js";
import { cookieOpts, JWT_SECRET } from "../config/config.js";
import jwt from "jsonwebtoken";

// hotp.options = { step: 60 * 5 };

export const fn_generateOTP = (enc, counter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = hotp.generate(enc, counter);
      resolve(token);
    } catch (error) {
      reject(error);
    }
  });
};

export const sendOTP = async (req, res, next) => {
  try {
    const username = req.user.Username;
    const { isSMS, isTOTP, isEmail } = req.query;
    console.log({ isSMS, isTOTP, isEmail }, req?.is2FAConfig);
    const user = await prismaUser.user.findUnique({
      where: {
        username,
      },
    });
    if (!user)
      return res
        .status(404)
        .json({ success: false, msg: `${username} not found` });
    if (isEmail === "true") {
      await prismaUser.user.update({
        where: {
          username,
        },
        data: {
          hotpCounter: parseInt(user.hotpCounter) + 1,
          OTPGenTime: Date.now(),
        },
      });
      const token = await fn_generateOTP(
        user.enc,
        parseInt(user.hotpCounter) + 1
      );
      await sendEmail(user.first_name, user.email, token);

      if (req?.is2FAConfig === true) {
        const _2fa_payload = {
          Username: username,
          email: user.email,
          is2FA: user.is2FA,
          isSMS: user.isSMS,
          isTOTP: user.isTOTP,
          _2FA_verified: false,
          _2FA_verifying: true,
        };
        const jwt_token_2fa = jwt.sign(_2fa_payload, JWT_SECRET, {
          expiresIn: 300,
        });
        const cookies = [cookie.serialize("_2FA", jwt_token_2fa, cookieOpts)];
        res.setHeader("Set-Cookie", cookies);
        res.status(200).json({
          success: true,
          msg: `OTP sent to ${user.email}. Please submit OTP to enable 2FA`,
        });
      } else {
        res
          .status(200)
          .json({ success: true, msg: `OTP sent to ${user.email}` });
      }
      next();
    } else if (isSMS === "true") {
      res
        .status(200)
        .json({ success: true, msg: "SMS implenetation pending!!" });
    } else if (isTOTP === "true") {
      const _2fa_payload = {
        Username: username,
        email: user.email,
        is2FA: user.is2FA,
        isSMS: user.isSMS,
        isTOTP: user.isTOTP,
        _2FA_verified: false,
        _2FA_verifying: true,
      };
      const jwt_token_2fa = jwt.sign(_2fa_payload, JWT_SECRET, {
        expiresIn: 300,
      });
      const authURL = await google_authenticator(username, user.enc);
      const cookies = [cookie.serialize("_2FA", jwt_token_2fa, cookieOpts)];
      res.setHeader("Set-Cookie", cookies);
      res.status(200).json({
        succes: true,
        msg: "Scan Barcode to configure OTP",
        authURL,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: `${err}` });
    next();
  }
};
