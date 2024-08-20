export const enableOTP = async (req, res, next) => {
  try {
    const { isSMS, isTOTP, isEmail } = req.query;
    if (isEmail === "true") {
      req.is2FAConfig = true;
      next();
    } else if (isTOTP === "true") {
      // configure totp
      req.is2FAConfig = true;
      next();
    } else if (isSMS === "true") {
      req.is2FAConfig = true;
      next();
      // send otp via sms
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: err });
  }
};

export const disableOTP = (req, res, next) => {
  res.status(200).json({ success: true, msg: "disable otp" });
};
