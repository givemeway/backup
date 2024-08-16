import { THUMBNAIL_MS } from "../config/config.js";
import axios from "axios";
import { prisma } from "../config/prismaDBConfig.js";

export const getSignedURL = async (uuid, username, avatar, widths = ["32w"]) =>
  new Promise(async (resolve, reject) => {
    try {
      let URLs = [];
      widths.forEach((width) => {
        const key = width !== "original" ? uuid + "_" + width : uuid;
        const url = `${THUMBNAIL_MS}?key=${key}&username=${username}&avatar=${avatar}`;
        URLs.push([url, width]);
      });
      const headers = {
        headers: { "Content-Type": "application/json" },
      };
      let signedURLs = {};
      for (const url of URLs) {
        const response = await axios.get(url[0], headers);
        const signedURL = response.data;
        signedURLs[url[1]] = signedURL;
      }
      resolve(signedURLs);
    } catch (err) {
      reject(err);
    }
  });

export const createSignedURL = async (req, res) => {
  try {
    const { path, filename } = req.query;
    const username = req.user.Username;
    const dir = await prisma.directory.findFirst({
      where: {
        username,
        path,
      },
      relationLoadStrategy: "join",
      include: {
        files: {
          where: {
            filename: filename,
          },
          select: {
            filename: true,
            uuid: true,
          },
        },
      },
    });
    let uuid;
    if (dir !== null) {
      uuid = dir.files[0]?.uuid;
    } else {
      console.log("image not found");
      return res.status(404).json("Image not found");
    }
    const widths = ["640w", "900w", "1280w", "2048w"];
    if (uuid) {
      const URLs = await getSignedURL(uuid, username, false, widths);
      res.status(200).json(URLs);
    } else {
      return res.status(404).json("Image not found");
    }
  } catch (err) {
    res.json(500).json({ err });
  }
};
