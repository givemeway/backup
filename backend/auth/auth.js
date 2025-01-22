import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { prismaUser } from "../config/prismaDBConfig.js";
import { fn_generateOTP } from "../controllers/sendOTP.js";
import { sendEmail } from "../controllers/sendEmail.js";
dotenv.config();

const _sendEmail = async (username) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userDetails = await prismaUser.user.findUnique({
        where: {
          username,
        },
      });
      await prismaUser.user.update({
        where: {
          username: userDetails.username,
        },
        data: {
          hotpCounter: parseInt(userDetails.hotpCounter) + 1,
          OTPGenTime: Date.now(),
        },
      });

      const token = await fn_generateOTP(
        userDetails.enc,
        parseInt(userDetails.hotpCounter) + 1
      );
      await sendEmail(userDetails.first_name, userDetails.email, token);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

const verifyToken = (request, response, next) => {
  const { share, token } = request.cookies;
  if (share) {
    jwt.verify(share, process.env.JWT_SECRET, (error, payload) => {
      if (error)
        return response.status(403).json({
          success: false,
          msg: "Invalid Share Link. Please contact the owner",
        });
      request.user = payload;
      next();
    });
  } else if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (error, user) => {
      if (error)
        return response
          .status(403)
          .json({ success: false, msg: "Invalid Token" });
      const { is2FA, _2FA_verified, isSSO_verified, isSSO, isEmail } = user;
      if (!is2FA && !isSSO) {
        request.user = user;
        next();
      } else if (isSSO && isSSO_verified) {
        if (!is2FA) {
          request.user = user;
          next();
        }
        if (is2FA && _2FA_verified) {
          request.user = user;
          next();
        }
        if (is2FA && !_2FA_verified) {
          if (isEmail) {
            await _sendEmail(user.Username);
          }
          return response.status(403).json({
            success: false,
            error: "2FA_REQUIRED",
            ...user,
            msg: "Two Factor verification is required to complete the sign in process",
          });
        }
      } else if (isSSO && !isSSO_verified) {
        return response
          .status(401)
          .json({ success: false, msg: "You are not authenticated" });
      } else if (is2FA && _2FA_verified) {
        request.user = user;
        next();
      } else if (is2FA && !_2FA_verified) {
        if (isEmail) {
          await _sendEmail(user.Username);
        }
        return response.status(403).json({
          success: false,
          error: "2FA_REQUIRED",
          ...user,
          msg: "Two Factor verification is required to complete the sign in process",
        });
      }
    });
  } else {
    return response
      .status(401)
      .json({ success: false, msg: "You are not authenticated" });
  }
};

const verify_2FA_Token = (request, response, next) => {
  const { _2FA } = request.cookies;
  if (_2FA) {
    jwt.verify(_2FA, process.env.JWT_SECRET, (error, user) => {
      if (error)
        return response
          .status(403)
          .json({ success: false, msg: "Invalid Token........." });
      const { is2FA, _2FA_verifying } = user;
      if (is2FA && _2FA_verifying) {
        request.user = user;
        next();
      } else if (!is2FA && _2FA_verifying) {
        request.user = user;
        next();
      } else {
        return response
          .status(401)
          .json({ success: false, msg: "You are not authenticated--->here" });
      }
    });
  } else {
    return response.status(401).json({
      success: false,
      msg: "You are not authenticated---> 2fa module",
    });
  }
};

export { verifyToken, verify_2FA_Token };
