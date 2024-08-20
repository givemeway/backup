import base32Encode from "base32-encode";
import qrcode from "qrcode";
import { authenticator } from "@otplib/preset-default";
import { prismaUser as prisma } from "../config/prismaDBConfig.js";
import { fn_generateOTP } from "./sendOTP.js";
import { sendEmail } from "./sendEmail.js";

export const enableOTP = async (req, res, next) => {
  try {
    const username = req.user.Username;
    const { isSMS, isTOTP, isEmail } = req.query;
    if (isEmail === "true") {
      req._2fa = { isEmail: true };
      next();
    } else if (isTOTP) {
      // configure totp
    } else if (isSMS) {
      // send otp via sms
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: err });
  }
};

export const disableOTP = (req, res, next) => {
  res.status(200).json({ success: true, msg: "disable otp" });
};

const google_authenticator = async (username, secret) => {
  const unsignedArrBuff = Buffer.from(secret.toUpperCase(), "hex");
  const base32_secret = base32Encode(unsignedArrBuff, "RFC4648", {
    padding: false,
  });
  const uri = authenticator.keyuri(username, "QDrive", base32_secret);
  const qrcodeImgUrl = await qrcode.toDataURL(uri);
  return qrcodeImgUrl;
};

export const configTOTP = async (req, res, next) => {
  try {
    const username = req.user.Username;
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        enc: true,
      },
    });
    if (user) {
      const imgUrl = await google_authenticator(username, user.enc);
      res.status(200).json({
        succes: true,
        msg: "Scan Barcode to configure OTP",
        imgUrl,
      });
    } else {
      res.status(404).json({ success: false, msg: `${username} not found` });
    }
  } catch (err) {
    res
      .status(500)
      .json({ sucess: false, msg: "something went wrong. Try again" });
  }
};
