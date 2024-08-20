import { totp, hotp } from "otplib";
import { prismaUser } from "../config/prismaDBConfig.js";
import { sendEmail } from "./sendEmail.js";
import { google_authenticator } from "./googleAuthConfig.js";
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
      if (req?.is2FAConfig) {
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
      const authURL = await google_authenticator(username, user.enc);
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
