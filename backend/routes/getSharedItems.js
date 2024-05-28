import express from "express";
const router = express.Router();
import { prisma } from "../config/prismaDBConfig.js";
import { Transfer, Share, FileShare, FolderShare } from "../models/mongodb.js";
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
      item: "t",
      display: "fo",
    };
  } else {
    return {
      name: `${fi[0][1]} & ${fi.length - 1} more`,
      item: "t",
      display: "fi",
    };
  }
};

router.get("/", verifyToken, async (req, res) => {
  try {
    const username = req.user.Username;
    const { skip, limit, type } = req.query;
    console.log(skip, limit, type);
    let count = 0;
    let shares = [];
    if (type === "fi") {
      count = await FileShare.count({ owner: username });
      const fileShares = await FileShare.find({ owner: username })
        .sort({ created_at: 1 })
        .skip(skip)
        .limit(limit);
      shares = await getShareNames(fileShares);
    } else if (type === "fo") {
      count = await FolderShare.count({ owner: username });
      console.log(count);
      const folderShares = await FolderShare.find({ owner: username })
        .sort({ created_at: 1 })
        .skip(skip)
        .limit(limit);
      shares = await getShareNames(folderShares);
      console.log(shares);
    } else if (type === "t") {
      count = await Transfer.count({ owner: username });
      const transfers = await Transfer.find({ owner: username })
        .sort({ created_at: 1 })
        .skip(skip)
        .limit(limit);
      shares = [...transfers.map((t) => ({ ...t._doc, ...getNameItem(t) }))];
    }

    res.status(200).json({ items: shares, total: count });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "something went wrong" });
  }
});

export { router as getSharedLinks };
