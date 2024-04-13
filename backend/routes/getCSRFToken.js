import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  const CSRFToken = req.csrfToken();
  res.status(200).json({ CSRFToken });
});

export { router as csrftoken };
