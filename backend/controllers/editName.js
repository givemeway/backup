import { prismaUser } from "../config/prismaDBConfig.js";

export const editName = async (req, res, next) => {
  const username = req.user.Username;
  const { first_name, last_name } = req.body;
  try {
    const updated = await prismaUser.user.update({
      where: {
        username,
      },
      data: {
        first_name,
        last_name,
      },
    });
    return res.status(200).json({
      success: true,
      msg: `Name updated to ${updated.first_name} ${updated.last_name}`,
    });
  } catch (err) {
    console.log(err.code);
    if (err?.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, msg: `${username} not found` });
    } else {
      return res
        .status(500)
        .json({ success: false, msg: "something went wrong" });
    }
  }

  next();
};
