import { createHash } from "crypto";
import { prismaUser } from "../config/prismaDBConfig.js";
import { PrismaClientKnownRequestError } from "../DB/prisma-client/users/runtime/library.js";

export const CancelUser = async (req, res, next) => {
  try {
    const username = req.user.Username;
    const { password } = req.body;
    const hashPass = createHash("sha512").update(password).digest("hex");
    const user = await prismaUser.user.update({
      where: {
        username,
        password: hashPass,
      },
      data: {
        status: false,
        cancellation_date: `${Date.now()}`,
      },
      select: {
        username: true,
        cancellation_date: true,
        status: true,
      },
    });
    next();
  } catch (err) {
    console.log(err);
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return res
          .status(404)
          .json({ success: false, msg: "Username or password incorrect" });
      }
    }
    return res.status(500).json({ success: false, msg: err });
  }
};
