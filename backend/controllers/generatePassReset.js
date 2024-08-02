import { PassToken } from "../models/mongodb.js";
import { prismaUser as prisma } from "../config/prismaDBConfig.js";
import { v4 as uuidv4 } from "uuid";

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
        console.log(newToken);
      }
      // TODO: add a module to send an email with the URL
      res.status(200).json({
        success: true,
        msg: `If a QDrive account exists for ${username}, an e-mail will be sent with further instructions.`,
        token: newToken,
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
