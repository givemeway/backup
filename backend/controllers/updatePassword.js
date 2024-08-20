import { prismaUser as prisma } from "../config/prismaDBConfig.js";
import { createHash } from "node:crypto";

export const updatePassword = async (req, res, next) => {
  try {
    const username = req.user.Username;
    const { new_password, old_password } = req.query;
    const old_hashpass = createHash("sha512")
      .update(old_password)
      .digest("hex");
    const new_hashpass = createHash("sha512")
      .update(new_password)
      .digest("hex");
    console.log(username);
    const user = await prisma.user.findFirst({
      where: {
        username,
        password: old_hashpass,
      },
    });
    if (user === null) {
      res.status(404).json({ success: false, msg: "Incorrect password" });
      next();
    } else {
      const updated = await prisma.user.update({
        where: {
          username,
        },
        data: {
          password: new_hashpass,
        },
      });
      res
        .status(200)
        .json({ success: true, msg: "password updated", data: updated });
      next();
    }

    next();
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, msg: "something went wrong", data: { err } });
    next();
  }
};
