import express from "express";
import { origin } from "../config/config.js";
import csurf from "csurf";
import { verifyToken } from "../auth/auth.js";
const router = express.Router();
const BATCH = 500;

const groupFoldersByParentQuery = `SELECT rel_path, rel_name, 
                                  count(folder) as folder_count 
                                  FROM data.deleted_folders 
                                  WHERE username = ? 
                                  GROUP BY rel_name,rel_path`;

const filesQuery = `SELECT filename,deletion_date
                    FROM data.deleted_files 
                    WHERE username = ? AND device = ? AND directory regexp ?
                    ORDER BY directory
                    LIMIT ?,?`;
const folderRootFilesQuery = `SELECT filename,deletion_date
                              FROM data.deleted_files 
                              WHERE username = ? 
                              AND device = ? 
                              AND directory = ?
                              ORDER BY filename
                              LIMIT ?,?;`;

const sqlExecute = (con, query, values) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows, fields] = await con.execute(query, values);
      resolve(rows);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

router.use(csurf({ cookie: true }));

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

function batchSubFolderFiles(
  con,
  req,
  total,
  subFolders,
  username,
  rel_path,
  rel_name,
  idx,
  accumulate,
  filesQuery
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
        const directory = path.split("/").slice(2).join("/");
        const regexp = `${directory}(/[^/]+)*$`;
        let begin = 0;
        while (true) {
          const val = [
            username,
            device,
            regexp,
            begin.toString(),
            BATCH.toString(),
          ];
          const files = await sqlExecute(con, filesQuery, val);
          if (
            files.length > 0 &&
            files.length < BATCH &&
            total + files.length < BATCH
          ) {
            total += files.length;

            accumulate.push({
              name: `${files[0].filename}`,
              deleted: files[0].deletion_date,
              count: files.length,
              folder,
              path,
              limit: { begin: begin, end: files.length },
            });
            break;
          } else if (
            files.length > 0 &&
            files.length < BATCH &&
            total + files.length > BATCH
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
                count: nextSliceEnd,
                folder,
                path,
                limit: { begin: nextSliceBegin, end: nextSliceEnd },
              });
            } else {
              accumulate.push({
                name: `${files[0].filename}`,
                deleted: files[0].deletion_date,
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
              req.trash["folders"].push(item);
            } else {
              item["name"] = `${files[0].filename} and ${
                total + slice - 1
              } more files`;
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
                req.trash["folders"].push(item);
                accumulate = [];
                root = true;
                parentNotCreated = false;
              } else {
                item["name"] = folder;
                item["limit"] = { begin: begin, end: files.length };
                req.trash["folders"].push(item);
              }
            } else {
              item["name"] = `${files[0].filename} and ${
                files.length - 1
              } more files`;

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
  con,
  folderRootFilesQuery,
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
        const val = [username, device, dir, begin.toString(), BATCH.toString()];
        const files = await sqlExecute(con, folderRootFilesQuery, val);
        console.log(files.length);
        // files = 450
        if (files.length < BATCH && files.length > 0) {
          total += files.length;
          // total 450
          const item = {
            name: `${files[0].filename}`,
            deleted: files[0].deletion_date,
            folder: rel_name,
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
            path: rel_path,
            limit: { begin: begin, end: files.length },
          };
          if (idx == 0) {
            item["name"] = rel_name;
            req.trash["folders"].push(item);
          } else {
            item["name"] = `${files[0].filename} and ${
              files[0].length - 1
            } more files`;
            req.trash["files"].push(item);
          }
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
  con,
  filesQuery,
  folderRootFilesQuery,
  rel_path,
  rel_name,
  subFoldersRegExp,
  req,
  device,
  dir,
  username
) {
  return new Promise(async (resolve, reject) => {
    const subFoldersQuery = `SELECT folder,path,device 
                            from data.deleted_folders 
                            where username = ? AND path regexp ?`;
    try {
      const subFolders = await sqlExecute(con, subFoldersQuery, [
        username,
        subFoldersRegExp,
      ]);

      let accumulate = [];
      let { total, idx } = await batchFolderRootFiles(
        con,
        folderRootFilesQuery,
        rel_path,
        rel_name,
        req,
        accumulate,
        username,
        device,
        dir
      );
      const { consolidate, id } = await batchSubFolderFiles(
        con,
        req,
        total,
        subFolders,
        username,
        rel_path,
        rel_name,
        idx,
        accumulate,
        filesQuery
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
          req.trash["folders"].push(item);
        } else {
          item["name"] = `${consolidate[0].name} and ${
            sumTotal - 1
          } more files`;
          req.trash["files"].push(item);
        }
      }
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

function batchTrashItems(con, query, req, device, username, group, regexp) {
  return new Promise(async (resolve, reject) => {
    let idx = 0;
    let begin = 0;
    try {
      while (true) {
        let val = [];
        if (regexp)
          val = [device, username, regexp, begin.toString(), BATCH.toString()];
        else val = [device, username, begin.toString(), BATCH.toString()];
        const files = await sqlExecute(con, query, val);
        let item = {};
        item.limit = { begin: begin, end: files.length };
        item.deleted = files[0]["deletion_date"];
        if (idx !== 0) {
          item.name = `${files[0]["filename"]} and ${
            files.length - 1
          } more files`;
          let minLength = Number.POSITIVE_INFINITY;
          let pth = "";
          files.forEach((file) => {
            const len = file.directory.split("/").length;
            if (len < minLength) {
              minLength = len;
              pth = file.directory;
            }
          });
          item.path = pth;
          req.trash["files"].push(item);
        } else {
          item.name = group.rel_name;
          item.path = group.rel_path;
          req.trash["folders"].push(item);
        }
        begin += files.length;
        if (files.length < BATCH) break;
        idx += 1;
      }
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

router.get("/", verifyToken, async (req, res) => {
  const username = req.user.Username;

  req.data = {};
  const con = req.headers.connection;

  const group_folder = await sqlExecute(con, groupFoldersByParentQuery, [
    username,
  ]);

  const deletedFilesQuery = `SELECT filename,deletion_date,device,directory 
                              FROM data.deleted_files
                              WHERE username = ?
                              AND deletion_type = ?;`;
  const val = [username, "file"];

  const deleted_files = await sqlExecute(con, deletedFilesQuery, val);

  req.trash = {};
  req.trash["files"] = [];
  req.trash["folders"] = [];
  req.trash["file"] = deleted_files;
  for (const group of group_folder) {
    const device = group.rel_path.split("/")[1];
    const dirParts = group.rel_path.split("/").slice(2).join("/");
    const dir = dirParts === "" ? "/" : dirParts;
    const subFoldersRegExp = `^${group.rel_path}(/[^/]+)$`;
    if (dir === "/") {
      await createBatchTrashItems(
        con,
        filesQuery,
        folderRootFilesQuery,
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
        con,
        filesQuery,
        folderRootFilesQuery,
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
});

export { router as getTrash };
