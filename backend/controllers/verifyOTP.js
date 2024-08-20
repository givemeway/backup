import { OTP_EXPIRY } from "../config/config.js";
import { prismaUser as prisma } from "../config/prismaDBConfig.js";
import { hotp } from "otplib";
// hotp.options = { step: 60 * 5 };

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
        const diff = now - parseInt(user.OTPGenTime) / 1000;
        console.log(diff);
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
          }
          resolve(isValid);
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

export const verifyOTP = async (req, res, next) => {
  try {
    const username = req.user.Username;
    const { token, mfa } = req.query;
    if (mfa === "email" || mfa === "sms") {
      const isValid = await fn_verifyOTP(username, token);
      console.log(token, isValid);
      res
        .status(200)
        .json({ success: true, msg: `OTP validity is ${isValid}`, isValid });
    }else if (mfa === "totp"){
      
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: `${err}` });
  }
};
