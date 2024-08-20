import { createHash } from "crypto";
import { prismaUser as prisma } from "../config/prismaDBConfig.js";

export const verifyPassword = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: req.user.Username,
      },
    });
    if (!user) {
      res
        .statu(400)
        .json({ success: false, msg: `${req.user.Username} not found` });
    } else {
      const { password } = req.query;
      const pass_hash = createHash("sha512").update(password).digest("hex");
      if (pass_hash === user.password) {
        res.status(200).json({ successs: true, msg: "Password match" });
      } else {
        res.status(401).json({ success: false, msg: "Password incorrect" });
      }
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, msg: "Something went wrong. Try again" });
  }
};
