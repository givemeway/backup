import { createHash } from "crypto";
import { prismaUser } from "../config/prismaDBConfig.js";
import { PrismaClientKnownRequestError } from "../DB/prisma-client/users/runtime/library.js";

export const ReactivateUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hashPassword = createHash("sha512").update(password).digest("hex");
    const user = await prismaUser.user.update({
      where: {
        username,
        password: hashPassword,
      },
      data: {
        status: true,
        cancellation_date: "NULL",
      },
      select: {
        username: true,
        cancellation_date: true,
        status: true,
      },
    });
    console.log(user);
    res.status(200).json({ success: false, msg: "successfully REACTIVATED" });
  } catch (err) {
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
