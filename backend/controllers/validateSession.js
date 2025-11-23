import { createHash } from "crypto";
import { Avatar } from "../models/mongodb.js";
import { getSignedURL } from "./createSignedURL.js";
import { prismaUser } from "../config/prismaDBConfig.js";

export const validateSession = async (req, res) => {
  try {
    const user = await Avatar.findOne({ username: req.user.Username });

    const user_main = await prismaUser.user.findUnique({
      where: {
        username: req.user.Username,
      },
    });
    if (!user_main) {
      return res.status(404).json({ success: false, msg: "User not found" })
    }
    const username = req.user.Username;
    const id = createHash("sha1").update(username).digest("hex");
    const url = await getSignedURL(id, username, true);
    res.status(200).json({
      success: true,
      userID: req.user.userID,
      email: req.user.email,
      username: user_main.username,
      firstName: user_main.first_name,
      lastName: user_main.last_name,
      fullName: user_main.first_name + " " + user_main.last_name,
      initials: user?.initial,
      avatar_url: url["32w"],
      has_avatar: user?.has_avatar,
      is2FA: user_main.is2FA,
      isSMS: user_main.isSMS,
      isEmail: user_main.isEmail,
      isTOTP: user_main.isTOTP,
      isSSO: user_main.isSSO,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: err });
  }
};
