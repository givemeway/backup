import jwt from "jsonwebtoken";
import cookie from "cookie";
import { cookieOpts } from "../config/config.js";
import { JWT_SECRET } from "../config/config.js";
import { createHash } from "node:crypto";
import { prismaUser as prisma, prismaUser } from "../config/prismaDBConfig.js";
import { fn_generateOTP } from "./sendOTP.js";
import { sendEmail } from "./sendEmail.js";

const validateUserDetails = async (req, res) => {
  let encodedString = req.headers.authorization;
  let extractedUsernamePassword;
  let password;
  let receivedUsername;
  const usernametype = req.body.usernametype;
  try {
    if (typeof encodedString === "string" && typeof usernametype === "string") {
      extractedUsernamePassword = atob(encodedString.split(" ")[1]);
      receivedUsername = extractedUsernamePassword.split(":")[0];
      password = extractedUsernamePassword.split(":")[1];
      const hashPass = createHash("sha512").update(password).digest("hex");
      const returnedUser = await prisma.user.findUnique({
        where: {
          username: receivedUsername,
          password: hashPass,
        },
        select: {
          username: true,
          first_name: true,
          last_name: true,
          id: true,
          email: true,
          is2FA: true,
          isSMS: true,
          isTOTP: true,
          isEmail: true,
          enc: true,
          hotpCounter: true,
          status: true,
          cancellation_date: true,
        },
      });
      if (!returnedUser.status) {
        return res.status(401).json({
          success: false,
          msg: `User ${receivedUsername} cancelled on ${new Date(
            parseInt(returnedUser.cancellation_date)
          )}`,
        });
      }

      if (returnedUser === null) {
        return res
          .status(401)
          .json({ success: false, msg: "UserName / Password Incorrect" });
      }
      const {
        username,
        first_name,
        last_name,
        enc,
        id,
        email,
        isSMS,
        isEmail,
        isTOTP,
        hotpCounter,
        is2FA,
      } = returnedUser;

      const payload = {
        Username: username,
        first: first_name,
        last: last_name,
        userID: id,
        email,
        is2FA,
        isSMS,
        isEmail,
        isTOTP,
        _2FA_verified: false,
      };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

      if (!is2FA) {
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("token", token, cookieOpts)
        );
        res.status(200).json({ success: true, msg: "login success" });
      } else {
        if (isSMS || isEmail) {
          await prismaUser.user.update({
            where: {
              username,
            },
            data: {
              hotpCounter: parseInt(hotpCounter) + 1,
              OTPGenTime: Date.now(),
            },
          });
          const token = await fn_generateOTP(enc, parseInt(hotpCounter) + 1);
          await sendEmail(first_name, email, token);
        }
        const _2fa_payload = {
          Username: username,
          email,
          is2FA,
          isSMS,
          isTOTP,
          _2FA_verified: false,
          _2FA_verifying: true,
        };
        const dummy_token = {
          email: "",
          first: "",
          last: "",
          userID: "",
          Username: "",
          is2FA: null,
          isSMS: null,
          isEmail: null,
          isTOTP: null,
          _2FA_verified: null,
        };
        const jwt_token_2fa = jwt.sign(_2fa_payload, JWT_SECRET, {
          expiresIn: 300,
        });
        const jwt_dummy_token = jwt.sign(dummy_token, JWT_SECRET, {
          expiresIn: -100,
        });
        const cookies = [
          cookie.serialize("token", jwt_dummy_token, cookieOpts),
          cookie.serialize("_2FA", jwt_token_2fa, cookieOpts),
        ];
        res.setHeader("Set-Cookie", cookies);
        const expandedUser = {
          ...Object.fromEntries(
            Object.entries(returnedUser).map(([k, v]) => {
              if (k === "hotpCounter") {
                return [k, parseInt(v)];
              } else {
                return [k, v];
              }
            })
          ),
        };
        res.status(403).json({
          success: false,
          error: "2FA_REQUIRED",
          ...expandedUser,
          msg: "Two Factor verification is required to complete the sign in process",
        });
      }
    }
  } catch (err) {
    console.error(err);
    console.log("user not found");
    res.status(404).json({ success: false, msg: "User not found" });
  }
};

export { validateUserDetails };
