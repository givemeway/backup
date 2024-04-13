import express from "express";
const router = express.Router();
import { prisma } from "../config/prismaDBConfig.js";
import { Transfer, Share } from "../models/mongodb.js";
import { verifyToken } from "../auth/auth.js";

const getShareNames = async (shares) => {
  const items = [];
  for (let share of shares) {
    const { item, uuid } = share;
    let Item = { ...share._doc };

    if (item === "fi") {
      const sharedItem = await prisma.file.findFirst({
        where: { uuid },
        select: {
          device: true,
          directory: true,
          filename: true,
        },
      });
      if (sharedItem !== null) {
        const { filename, directory, device } = sharedItem;
        let path = "";
        if (device === "/") {
          path = "/";
        } else if (directory === "/" && device !== "/") {
          path = `/${device}`;
        } else {
          path = `/${device}/${directory}`;
        }
        Item["name"] = filename;
        Item["path"] = path;
      }
    } else if (item === "fo") {
      const sharedItem = await prisma.directory.findFirst({
        where: {
          uuid,
        },
        select: {
          folder: true,
          path: true,
        },
      });
      if (sharedItem !== null) {
        const { folder, path } = sharedItem;
        Item["name"] = folder;
        Item["path"] = path;
      }
    }
    items.push(Item);
  }
  return items;
};

const getNameItem = (t) => {
  const fi = Array.from(t.files);
  const fo = Array.from(t.folders);
  if (fo.length > 0) {
    return {
      name: `${fo[0][1]} & ${fo.length - 1 + fi.length} more`,
      item: "fo",
    };
  } else {
    return { name: `${fi[0][1]} & ${fi.length - 1} more`, item: "fi" };
  }
};

router.get("/", verifyToken, async (req, res) => {
  try {
    const username = req.user.Username;
    const shares = await Share.find({ owner: username });
    const shareNames = await getShareNames(shares);
    const transfer = await Transfer.find({ owner: username });
    const allSharedItems = [
      ...shareNames,
      ...transfer.map((t) => ({
        ...t._doc,
        ...getNameItem(t),
      })),
    ];
    res.status(200).json(allSharedItems);
  } catch (err) {
    res.status(500).json({ success: false, msg: "something went wrong" });
  }
});

export { router as getSharedLinks };
