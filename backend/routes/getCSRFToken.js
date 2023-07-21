import express from "express";
const router = express.Router();
import csrf from "csurf";
router.use(csrf({ cookie: true }));
router.get("/", (req, res) => {
  res.status(200).json({ CSRFToken: req.csrfToken() });
});

export { router as csrftoken };
