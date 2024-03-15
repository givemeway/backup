import express from "express";
const router = express.Router();
import csurf from "csurf";
import { origin } from "../config/config.js";
import { verifyToken } from "../auth/auth.js";
import {
  restore_file_from_trash,
  restore_items_from_trash,
} from "../controllers/putBackFilesFromTrash.js";
const SINGLEFILE = "singleFile";

router.use(csurf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

router.post("/", verifyToken, async (req, res) => {
  const items = req.body.items;
  const username = req.user.Username;

  for (const item of items) {
    if (item.item !== SINGLEFILE) {
      if (item?.items) {
        for (const el of item?.items) {
          try {
            const { path, limit } = el;
            const { begin, end } = limit;
            const dirParts = path.split("/").slice(2).join("/");
            const device = path.split("/")[1];
            let dir = dirParts === "" ? "/" : dirParts;
            dir = dir.replace(/\(/g, "\\(");
            dir = dir.replace(/\)/g, "\\)");
            const regexp = `^${dir}(/[^/]+)*$`;
            let data = {};
            data.root = el?.root;
            data.dir = dir;
            data.device = device;
            data.username = username;
            data.reg = regexp;
            data.pg = end;
            data.bg = begin;

            await restore_items_from_trash(data);
          } catch (err) {
            console.error(err);
          }
        }
      } else {
        try {
          const { path, begin, end } = item;
          const dirParts = path.split("/").slice(2).join("/");
          const device = path.split("/")[1];
          let dir = dirParts === "" ? "/" : dirParts;
          dir = dir.replace(/\(/g, "\\(");
          dir = dir.replace(/\)/g, "\\)");
          const regexp = `^${dir}(/[^/]+)*$`;
          let data = {};
          data.root = item?.root;
          data.dir = dir;
          data.device = device;
          data.username = username;
          data.reg = regexp;
          data.pg = end;
          data.bg = begin;
          await restore_items_from_trash(data);
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      const pathPart = item.path.split("/");
      const device = pathPart[1] === "" ? "/" : pathPart[1];
      const dirPart = pathPart.slice(2).join("/");
      const dir = dirPart === "" ? "/" : dirPart;
      const filename = item.name;
      let data = {};
      data.dir = dir;
      data.device = device;
      data.username = username;
      data.filename = filename;
      data.path = item.path;
      try {
        await restore_file_from_trash(data);
      } catch (err) {
        console.error(err);
      }
    }
  }

  res.status(200).json("Response Received");
});

export { router as restoreTrashItems };
