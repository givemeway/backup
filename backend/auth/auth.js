import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const verifyToken = (request, response, next) => {
  const { share, token } = request.cookies;
  if (share) {
    jwt.verify(share, process.env.JWT_SECRET, (error, payload) => {
      if (error)
        return response.status(403).json({
          success: false,
          msg: "Invalid Share Link. Please contact the owner",
        });
      request.user = payload;
      next();
    });
  } else if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
      if (error)
        return response
          .status(403)
          .json({ success: false, msg: "Invalid Token" });
      const { is2FA, _2FA_verified } = user;
      if (!is2FA) {
        request.user = user;
        next();
      } else if (is2FA && _2FA_verified) {
        request.user = user;
        next();
      } else if (is2FA && !_2FA_verified) {
        return response.status(403).json({
          success: false,
          error: "2FA_REQUIRED",
          ...user,
          msg: "Two Factor verification is required to complete the sign in process",
        });
      }
    });
  } else {
    return response
      .status(401)
      .json({ success: false, msg: "You are not authenticated" });
  }
};

const verify_2FA_Token = (request, response, next) => {
  const { _2FA } = request.cookies;
  if (_2FA) {
    jwt.verify(_2FA, process.env.JWT_SECRET, (error, user) => {
      if (error)
        return response
          .status(403)
          .json({ success: false, msg: "Invalid Token" });
      const { is2FA, _2FA_verifying } = user;
      if (is2FA && _2FA_verifying) {
        request.user = user;
        next();
      } else if (!is2FA && _2FA_verifying) {
        request.user = user;
        next();
      } else {
        return response
          .status(401)
          .json({ success: false, msg: "You are not authenticated--->here" });
      }
    });
  } else {
    return response.status(401).json({
      success: false,
      msg: "You are not authenticated---> 2fa module",
    });
  }
};

export { verifyToken, verify_2FA_Token };
