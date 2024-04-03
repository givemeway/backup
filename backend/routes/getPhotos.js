import express from "express";
import { origin } from "../config/config.js";
import { Prisma, prisma } from "../config/prismaDBConfig.js";
import { verifyToken } from "../auth/auth.js";
import { getSignedURls } from "../controllers/getSignedURLs.js";
const router = express.Router();

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

router.get("/", verifyToken, async (req, res) => {
  const username = req.user.Username;
  const photos = await prisma.file.findMany({
    where: {
      username,
      OR: [
        { filename: { endsWith: ".png" } },
        { filename: { endsWith: ".jpg" } },
        { filename: { endsWith: ".jpeg" } },
        { filename: { endsWith: ".tiff" } },
      ],
    },
    select: {
      filename: true,
      last_modified: true,
      uuid: true,
    },
  });

  const photos_256w = await getSignedURls(photos, username, "_900w");

  const allPhotos = [...photos_256w];
  res.status(200).json(allPhotos);
});
export { router as getPhotos };
