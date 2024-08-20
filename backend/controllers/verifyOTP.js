import { OTP_EXPIRY } from "../config/config.js";
import { prismaUser as prisma } from "../config/prismaDBConfig.js";
import { hotp, totp } from "otplib";
import { authenticator } from "@otplib/preset-default";
import base32Encode from "base32-encode";

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
    if (mfa === "email" || mfa === "sms") {
      const isValid = await fn_verifyOTP(username, token);
      if (is2FAConfig && isValid) {
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

      res
        .status(200)
        .json({ success: true, msg: `OTP validity is ${isValid}`, isValid });
    } else if (mfa === "totp") {
      const isValid = await verifyTOTP(username, token);
      if (is2FAConfig && isValid) {
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
      res
        .status(200)
        .json({ success: true, msg: `OTP validity is ${isValid}`, isValid });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: `${err}` });
  }
};
