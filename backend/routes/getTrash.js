import express from "express";
import { origin } from "../config/config.js";
import csurf from "csurf";
import { verifyToken } from "../auth/auth.js";
const router = express.Router();
const BATCH = 500;

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

router.get("/", verifyToken, async (req, res) => {
  const username = req.user.Username;
  const { begin, page } = req.query;
  console.log(begin, page);
  const groupFoldersByParentQuery = `SELECT rel_path, rel_name, 
                                          count(folder) as folder_count 
                                     from data.deleted_folders 
                                     where username = ? 
                                     group by rel_name,rel_path`;
  req.data = {};
  const con = req.headers.connection;

  const group_folder = await sqlExecute(con, groupFoldersByParentQuery, [
    username,
  ]);

  // pth = /Ticketing Search/PyQt5
  // device = pth.split("/")[1]
  req.trash = {};
  req.trash["files"] = [];
  req.trash["folders"] = [];
  for (const group of group_folder) {
    const device = group.rel_path.split("/")[1];
    const dirParts = group.rel_path.split("/").slice(2).join("/");
    const dir = dirParts === "" ? "/" : dirParts;
    const regexp = `${dir}(/[^/]+)*$`;

    if (dir === "/") {
      let idx = 0;
      let begin = 0;
      while (true) {
        const val = [device, username];
        const fileCountQuery = `SELECT filename,device,directory,deletion_date 
                                FROM data.deleted_files WHERE
                                 device = ? and username = ? 
                                 ORDER BY directory
                                  LIMIT ${begin}, ${BATCH}`;
        const files = await sqlExecute(con, fileCountQuery, val);
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
    } else {
      let begin = 0;
      let idx = 0;
      while (true) {
        const val = [username, device, regexp];
        const fileCountQuery = `SELECT filename,device,directory,deletion_date 
                                FROM data.deleted_files 
                                WHERE username = ? 
                                  AND device = ? 
                                  AND directory regexp ? 
                                  ORDER BY directory
                                  LIMIT ${begin},${BATCH}`;
        const files = await sqlExecute(con, fileCountQuery, val);
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
    }
  }

  res.status(200).json(req.trash);
});

export { router as getTrash };

// let total = 0;
// const regexp = `^${group.rel_path}(/[^/]+)$`;
// const subFoldersQuery = `SELECT folder,path,device from data.deleted_folders where username = ? AND path regexp ?`;
// const subFolders = await sqlExecute(con, subFoldersQuery, [
//   username,
//   regexp,
// ]);
// const folderRootFilesQuery = `SELECT count(*) as folderRootFileCount FROM data.deleted_files WHERE username = ? AND device = ? AND directory ?`;
// const { folderRootFileCount } = (
//   await sqlExecute(con, folderRootFilesQuery, [username, device, "/"])
// )[0];
// if (folderRootFileCount <= 500) {
//   const item = {
//     name: group.rel_name,
//     device,
//     dir: "/",
//     path: group.rel_path,
//     limit: { begin: 0, size: folderRootFileCount },
//   };
//   req.trash["folders"].push(item);
// } else {
//   let begin = 0;
//   let idx = 0;
//   for (let i = BATCH; i <= count; i += BATCH) {
//     const folderRootFilesQuery = `SELECT count(*) as folderRootFileCount FROM data.deleted_files WHERE username = ? AND device = ? AND directory ? limit ?,?`;
//     const { folderRootFileCount } = (
//       await sqlExecute(con, folderRootFilesQuery, [
//         username,
//         device,
//         "/",
//         begin,
//         BATCH,
//       ])
//     )[0];
//     const item = {
//       name: group.rel_name,
//       device,
//       dir: "/",
//       path: group.rel_path,
//       limit: { begin: begin, size: folderRootFileCount },
//     };
//     if (idx === 0) {
//       req.trash["folders"].push(item);
//     } else {
//       req.trash["files"].push(item);
//     }
//     begin += i;
//     idx += 1;
//   }
// }

// for (const { path, folder, device } of subFolders) {
//   const directory = path.split("/").slice(2).join("/");
//   const regexp2 = `${directory}(/[^/]+)*$`;
//   const filesQuery = `SELECT count(*) as filesInFolderCount FROM data.deleted_files WHERE username = ? AND device = ? AND directory regexp ?`;
//   const { filesInFolderCount } = (
//     await sqlExecute(con, filesQuery, [username, device, regexp2])
//   )[0];
// }
