import { createHash } from "crypto";
import { Avatar } from "../models/mongodb.js";
import { getSignedURL } from "./createSignedURL.js";

export const validateSession = async (req, res) => {
  try {
    const user = await Avatar.findOne({ username: req.user.Username });
    const username = req.user.Username;
    const id = createHash("sha1").update(username).digest("hex");
    const url = await getSignedURL(id, username, true, ["32w"]);
    res.status(200).json({
      success: true,
      userID: req.user.userID,
      email: req.user.email,
      username: user.username,
      first: user.firstName,
      last: user.lastName,
      initials: user.initial,
      avatar_url: url["32w"],
      hasAvatar: user.has_avatar,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: err });
  }
};
