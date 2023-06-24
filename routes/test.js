import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.headers);
  res.json("Response received");
});

export { router as test };
