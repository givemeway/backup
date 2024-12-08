import { prismaUser } from "../config/prismaDBConfig.js";

export const getSSOConfig = async (req, res, next) => {
  try {
    const username = req.user.Username;
    const user = await prismaUser.user.findUnique({
      where: {
        username,
      },
      select: {
        isSSO: true,
        SSO_EndPoint: true,
        cert: true,
        issuer_URL: true,
      },
    });
    if (user && user.isSSO) {
      return res.status(200).json({
        success: true,
        msg: "SSO Fetch Successful",
        ...user,
      });
    } else {
      return res.status(404).json({
        success: false,
        msg: "user not found",
      });
    }
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};

export const disableSSO = async (req, res, next) => {
  try {
    const username = req.user.Username;
    const user = await prismaUser.user.update({
      where: { username },
      data: {
        isSSO: false,
      },
    });
    if (user && !user.isSSO) {
      return res.status(200).json({
        success: true,
        msg: "SSO Disabled",
      });
    } else {
      return res.status(404).json({
        success: false,
        msg: "user not found",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};
