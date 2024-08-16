import { createHash } from "crypto";
import { getSignedURL } from "./createSignedURL.js";
import { Avatar } from "../models/mongodb.js";

export const getAvatar = async (req, res, next) => {
  try {
    const username = req.user.Username;
    const avatar = await Avatar.findOne({ username });
    const id = createHash("sha1").update(username).digest("hex");
    let urls = [];
    if (avatar && avatar.has_avatar) {
      urls = await getSignedURL(id, username, true, ["32w", "640w"]);
    } else if (avatar && !avatar.has_avatar) {
      urls = await getSignedURL(id, username, true, ["32w", "640w"]);
      await Avatar.findOneAndUpdate(
        { username },
        {
          has_avatar: true,
          avatar_url: [...Object.entries(urls).map(([k, v]) => [k, v])],
        }
      );
    }
    res.status(200).json({ success: true, data: { ...urls, ...avatar._doc } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: err });
  }
  next();
};
