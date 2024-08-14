export const validateSession = (req, res) => {
  res.status(200).json({
    success: true,
    userID: req.user.userID,
    email: req.user.email,
    username: req.user.Username,
    first: req.user.first,
    last: req.user.last,
  });
};
