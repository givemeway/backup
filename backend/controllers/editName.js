import { prismaUser } from "../config/prismaDBConfig.js";

export const editName = async (req, res, next) => {
  const username = req.user.Username;
  const { first_name, last_name } = req.query;
  console.log(first_name, last_name);
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
    console.log(updated);
    return res.status(200).json({
      success: true,
      msg: `Name updated to ${updated.first_name} ${updated.last_name}`,
      updated: {
        first_name: updated.first_name,
        last_name: updated.last_name,
        username: updated.username,
        email: updated.email,
      },
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
