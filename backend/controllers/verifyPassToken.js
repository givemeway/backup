import { EXPIRY } from "../config/config.js";
import { PassToken } from "../models/mongodb.js";
export const verifyPassToken = async (req, res, next) => {
  try {
    const { token } = req.query;
    const user = await PassToken.findOne({ token });
    if (user) {
      const now = Date.now();
      const expiry = user.expires_at;
      const diff = expiry - now;
      if (diff < EXPIRY) {
        res.status(200).json({ success: true, msg: "Password Link Valid" });
        next();
      } else {
        await PassToken.deleteOne({ token });
        res.status(404).json({ success: false, msg: "Password Link Expired" });
      }
    } else {
      res.status(404).json({ success: false, msg: "Invalid Password link" });
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "Something went wrong" });
    next();
  }
};
