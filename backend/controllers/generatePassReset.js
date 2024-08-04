import { PassToken } from "../models/mongodb.js";
import { prismaUser as prisma } from "../config/prismaDBConfig.js";
import { v4 as uuidv4 } from "uuid";
import { MailService } from "./sendEmail.js";
import { passResetTemplate } from "./passResetTemplate.js";
import { FRONTEND_DOMAIN } from "../config/config.js";

export const getPassLink = async (req, res, next) => {
  try {
    const { username } = req.query;
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (user) {
      const newToken = uuidv4();
      const passToken = await PassToken.findOne({ username });
      if (passToken === null) {
        await PassToken.create({ username, token: newToken });
      } else {
        await PassToken.findOneAndUpdate(
          { username: username },
          {
            token: newToken,
            created_at: Date.now(),
            expires_at: Date.now() + 15 * 60 * 1000,
          }
        );
      }
      const passURL = FRONTEND_DOMAIN + `/forgot_finish?token=${newToken}`;
      const msg = {
        to: user.email,
        from: "no-reply@qdrive.space",
        subject: `${user.first_name}, reset your QDrive Password`,
        html: passResetTemplate(passURL, user.first_name),
      };
      await MailService.send(msg);
      res.status(200).json({
        success: true,
        msg: `If a QDrive account exists for ${username}, an e-mail will be sent with further instructions.`,
      });
    } else {
      res.status(200).json({
        success: true,
        msg: `If a QDrive account exists for ${username}, an e-mail will be sent with further instructions.`,
        user: `user ${username} not found in our records`,
      });
    }

    next();
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, msg: "Something went wrong. Try again" });
    next();
  }
};
