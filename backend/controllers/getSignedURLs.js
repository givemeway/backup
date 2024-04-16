import { THUMBNAIL_MS } from "../config/config.js";
import { imageTypes } from "../utils/utils.js";
import mimetype from "mime-types";
import axios from "axios";

const headers = {
  headers: { "Content-Type": "application/json" },
};

export const getSignedURls = async (files, username, width = "_32w") => {
  const images = files.filter((file) => {
    const mime = mimetype.lookup(file.filename);
    if (mime) {
      const ext = mime.split("/")[1].toUpperCase();
      return imageTypes.hasOwnProperty(ext);
    }
    return false;
  });

  const dataFiles = files.filter((file) => {
    const mime = mimetype.lookup(file.filename);

    if (mime) {
      const ext = mime.split("/")[1].toUpperCase();
      return !imageTypes.hasOwnProperty(ext);
    }
    return true;
  });

  for (let i = 0; i < images.length; i++) {
    try {
      const key = images[i].uuid + width;
      const url = `${THUMBNAIL_MS}?key=${key}&username=${username}`;
      const response = await axios.get(url, headers);
      images[i].signedURL = response.data;
    } catch (err) {
      console.error(err);
    }
  }
  let allFiles = [];
  allFiles = [...images, ...dataFiles];

  return allFiles;
};
