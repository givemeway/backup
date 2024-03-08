import express from "express";
import { origin } from "../config/config.js";
import csurf from "csurf";
import { verifyToken } from "../auth/auth.js";
import { v4 as uuidv4 } from "uuid";
import { Prisma, prisma } from "../config/prismaDBConfig.js";

const router = express.Router();
const BATCH = 500;

const func = (total, item) => {
  const { count } = item;
  return total + count;
};

router.use(csurf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

function batchSubFolderFiles(
  req,
  total,
  subFolders,
  username,
  rel_path,
  rel_name,
  idx,
  accumulate
) {
  return new Promise(async (resolve, reject) => {
    try {
      let nextSliceBegin = 0;
      let nextSliceEnd = 0;
      let parentNotCreated = false;
      let root = false;
      if (total < BATCH && accumulate.length > 0) {
        parentNotCreated = true;
      }
      for (const { path, folder, device } of subFolders) {
        let directory = path.split("/").slice(2).join("/");
        directory = directory.replace(/\(/g, "\\(");
        directory = directory.replace(/\)/g, "\\)");
        const regexp = `^${directory}(/[^/]+)*$`;
        let begin = 0;
        while (true) {
          const files = await prisma.$queryRaw(Prisma.sql`
                        SELECT filename,deletion_date,uuid
                        FROM public."DeletedFile"
                        WHERE username = ${username} 
                        AND device = ${device} 
                        AND directory ~ ${regexp}
                        ORDER BY directory
                        LIMIT ${BATCH}
                        OFFSET ${begin};`);

          if (files.length === 0) break;
          if (
            files.length > 0 &&
            files.length < BATCH &&
            total + files.length < BATCH
          ) {
            total += files.length;

            accumulate.push({
              name: `${files[0].filename}`,
              deleted: files[0].deletion_date,
              id: uuidv4(),
              count: files.length,
              folder,
              path,
              limit: { begin: begin, end: files.length },
            });
            break;
          } else if (
            files.length > 0 &&
            files.length < BATCH &&
            total + files.length >= BATCH
          ) {
            const slice = BATCH - total;
            let item = {
              deleted: files[0].deletion_date,
              path: rel_path,
            };
            if (slice < files.length) {
              const filesLeft = files.length - slice;
              nextSliceBegin = slice;
              nextSliceEnd = filesLeft;
              accumulate.push({
                name: `${files[0].filename}`,
                deleted: files[0].deletion_date,
                id: uuidv4(),
                count: slice,
                folder,
                path,
                limit: { begin: begin, end: slice },
              });
              item["items"] = accumulate;
              accumulate = [];
              total = filesLeft;
              accumulate.push({
                name: `${files[0].filename}`,
                deleted: files[0].deletion_date,
                id: uuidv4(),
                count: nextSliceEnd,
                folder,
                path,
                limit: { begin: nextSliceBegin, end: nextSliceEnd },
              });
            } else {
              accumulate.push({
                name: `${files[0].filename}`,
                deleted: files[0].deletion_date,
                id: uuidv4(),
                count: slice,
                folder,
                path,
                limit: { begin: begin, end: slice },
              });
              item["items"] = accumulate;
              accumulate = [];
            }
            if (idx === 0) {
              item["name"] = rel_name;
              item["id"] = uuidv4();
              req.trash["folders"].push(item);
            } else {
              const sumTotal = item["items"].reduce(func, 0);
              item["name"] = `${files[0].filename} and ${
                sumTotal - 1
              } more files`;
              item["count"] = sumTotal;
              item["id"] = uuidv4();
              req.trash["files"].push(item);
            }
            break;
          } else if (files.length > 0 && files.length >= BATCH) {
            let item = {
              deleted: files[0].deletion_date,
              path,
              folder,
            };
            if (idx === 0) {
              if (parentNotCreated) {
                const chunk = {
                  name: files[0].filename,
                  deleted: files[0].deletion_date,
                  id: uuidv4(),
                  count: files.length - total,
                  path,
                  folder,
                  limit: { begin: begin, end: files.length - total },
                };
                accumulate.push(chunk);
                item.path = rel_path;
                item.name = rel_name;
                item.folder = rel_name;
                item.items = accumulate;
                item.id = uuidv4();
                req.trash["folders"].push(item);
                accumulate = [];
                root = true;
                parentNotCreated = false;
              } else {
                item["name"] = folder;
                item["limit"] = { begin: begin, end: files.length };
                item["id"] = uuidv4();
                req.trash["folders"].push(item);
              }
            } else {
              item["name"] = `${files[0].filename} and ${
                files.length - 1
              } more files`;
              item["limit"] = { begin: begin, end: files.length };
              item["count"] = files.length;
              item["id"] = uuidv4();
              req.trash["files"].push(item);
            }
          }
          if (root) {
            begin += files.length - total;
            total = 0;
            root = false;
          } else begin += files.length;
          idx += 1;
        }
      }
      resolve({ consolidate: accumulate, id: idx });
    } catch (err) {
      reject(err);
    }
  });
}

function batchFolderRootFiles(
  rel_path,
  rel_name,
  req,
  accumulate,
  username,
  device,
  dir
) {
  return new Promise(async (resolve, reject) => {
    try {
      let begin = 0;
      let idx = 0;
      let total = 0;
      while (true) {
        const files = await prisma.deletedFile.findMany({
          where: { username, device, directory: dir },
          skip: begin,
          take: BATCH,
          orderBy: {
            filename: "asc",
          },
        });

        // files = 450
        if (files.length < BATCH && files.length > 0) {
          total += files.length;
          // total 450
          const item = {
            name: `${files[0].filename}`,
            deleted: files[0].deletion_date,
            folder: rel_name,
            root: true,
            id: uuidv4(),
            count: files.length,
            path: rel_path,
            limit: { begin: begin, end: files.length },
          };
          accumulate.push(item);
          break;
        } else if (files.length > 0) {
          let item = {
            deleted: files[0].deletion_date,
            folder: rel_name,
            root: true,
            path: rel_path,
            count: files.length,
            limit: { begin: begin, end: files.length },
          };
          if (idx == 0) {
            item["name"] = rel_name;
            item["root"] = true;
            item.id = uuidv4();
            req.trash["folders"].push(item);
          } else {
            item["name"] = `${files[0].filename} and ${
              files.length - 1
            } more files`;
            item.id = uuidv4();
            req.trash["files"].push(item);
          }
        } else if (files.length === 0) {
          break;
        }

        begin += files.length;
        idx += 1;
      }
      resolve({ total, idx });
    } catch (err) {
      reject(err);
    }
  });
}

function createBatchTrashItems(
  rel_path,
  rel_name,
  subFoldersRegExp,
  req,
  device,
  dir,
  username
) {
  return new Promise(async (resolve, reject) => {
    try {
      const subFolders = await prisma.$queryRaw(Prisma.sql`
                              SELECT folder,path,device,uuid 
                              FROM public."DeletedDirectory" 
                              WHERE username = ${username} 
                              AND path ~ ${subFoldersRegExp};`);
      let accumulate = [];
      let { total, idx } = await batchFolderRootFiles(
        rel_path,
        rel_name,
        req,
        accumulate,
        username,
        device,
        dir
      );
      const { consolidate, id } = await batchSubFolderFiles(
        req,
        total,
        subFolders,
        username,
        rel_path,
        rel_name,
        idx,
        accumulate
      );
      if (consolidate.length > 0) {
        const func = (total, item) => {
          const { count } = item;
          return total + count;
        };
        const sumTotal = consolidate.reduce(func, 0);
        let item = {
          deleted: consolidate[0].deleted,
          folder: consolidate[0].folder,
          path: rel_path,
          items: consolidate,
        };
        if (id == 0) {
          item["name"] = rel_name;
          item["id"] = uuidv4();
          req.trash["folders"].push(item);
        } else {
          item["name"] = `${consolidate[0].name} and ${
            sumTotal - 1
          } more files`;
          item["id"] = uuidv4();
          req.trash["files"].push(item);
        }
      }
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

router.get("/", verifyToken, async (req, res) => {
  try {
    const username = req.user.Username;
    req.data = {};

    const group_folder_ = await prisma.$queryRaw(Prisma.sql`
                          SELECT rel_path,rel_name, count(folder) AS folder_count
                          FROM public."DeletedDirectory"
                          WHERE username = ${username}
                          GROUP BY
                          rel_name,rel_path;`);

    const group_folder = group_folder_.map((folder) => ({
      ...folder,
      folder_count: parseInt(folder.folder_count),
    }));
    console.log(group_folder);

    const deleted_files = await prisma.deletedFile.findMany({
      where: { username, deletion_type: "file" },
      select: {
        filename: true,
        deletion_date: true,
        device: true,
        directory: true,
        uuid: true,
      },
    });

    req.trash = {};
    req.trash["files"] = [];
    req.trash["folders"] = [];
    req.trash["file"] = deleted_files;

    for (const group of group_folder) {
      const device = group.rel_path.split("/")[1];
      const dirParts = group.rel_path.split("/").slice(2).join("/");
      const dir = dirParts === "" ? "/" : dirParts;
      let rel_path = group.rel_path.replace(/\(/g, "\\(");
      rel_path = rel_path.replace(/\)/g, "\\)");
      const subFoldersRegExp = `^${rel_path}(/[^/]+)$`;

      if (dir === "/") {
        await createBatchTrashItems(
          group.rel_path,
          group.rel_name,
          subFoldersRegExp,
          req,
          device,
          dir,
          username
        );
      } else {
        await createBatchTrashItems(
          group.rel_path,
          group.rel_name,
          subFoldersRegExp,
          req,
          device,
          dir,
          username
        );
      }
    }

    res.status(200).json(req.trash);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

export { router as getTrash };
