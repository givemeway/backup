import express from "express";
import { prisma } from "../config/prismaDBConfig.js";
import { verifyToken } from "../auth/auth.js";
import { getSignedURls } from "../controllers/getSignedURLs.js";
const router = express.Router();

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
      directory: true,
      device: true,
    },
  });

  const photos_256w = await getSignedURls(photos, username, "_900w");
  const allPhotos = [...photos_256w];
  res.status(200).json(allPhotos);
});
export { router as getPhotos };
