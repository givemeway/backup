import { totp, hotp } from "otplib";
import { prismaUser } from "../config/prismaDBConfig.js";
import { sendEmail } from "./sendEmail.js";
// hotp.options = { step: 60 * 5 };

export const fn_generateOTP = (enc, counter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = hotp.generate(enc, counter);
      console.log(token);
      resolve(token);
    } catch (error) {
      reject(error);
    }
  });
};

export const sendOTP = async (req, res, next) => {
  try {
    const username = req.user.Username;
    const user = await prismaUser.user.findUnique({
      where: {
        username,
      },
    });
    if (user) {
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
      res.status(200).json({ success: true, msg: `OTP sent to ${user.email}` });
      next();
    } else {
      res.status(404).json({ success: false, msg: `${username} not found` });
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: `${err}` });
    next();
  }
};
