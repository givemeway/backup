import { Prisma, prisma } from "../config/prismaDBConfig.js";
import { Transfer } from "../models/mongodb.js";

const getFiles = async (folderdata, username, nav, type) => {
  const { path, device } = folderdata;
  const dirPart = path.split("/").slice(2).join("/");
  let currentDir = dirPart === "" ? "/" : dirPart;
  const curNavPath = nav.split("/").slice(1).join("/");
  if (nav !== "h" && type !== "t") {
    currentDir =
      currentDir === "/" ? curNavPath : currentDir + "/" + curNavPath;
  }
  const [start, end] = [0, 10000];
  const files = await prisma.file.findMany({
    where: {
      username,
      device,
      directory: currentDir,
    },
    orderBy: {
      filename: "asc",
    },
    take: end,
    skip: start,
  });
  return files;
};

const getFolders = async (folderdata, username, nav, type) => {
  let { path, device } = folderdata;
  const [start, end] = [0, 1000000];
  let regex = ``;
  if (device === "/") {
    regex = `^(/[^/]+)$`;
  } else if (path === "/") {
    regex = `^/${device}(/[^/]+)$`;
  } else {
    if (nav !== "h" && type !== "t") {
      path = path + "/" + nav.split("/").slice(1).join("/");
    }

    regex = `^${path}(/[^/]+)$`;
  }
  const folders = await prisma.$queryRaw(Prisma.sql`
                    SELECT uuid,folder,path,created_at
                    FROM public."Directory"
                    WHERE username = ${username}
                    AND path ~ ${regex}
                    ORDER BY path
                    LIMIT ${end}
                    OFFSET ${start};`);
  return folders;
};

const sqlExecute = (con, query, val) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows] = await con.execute(query, val);
      resolve(rows);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const browseTransferData_promise = async (t, k, nav, username) => {
  return new Promise(async (resolve, reject) => {
    try {
      const folderPathData = await prisma.directory.findFirst({
        where: {
          username,
          uuid: k,
        },
      });
      const files = await getFiles(folderPathData, username, nav, t);
      const directories = await getFolders(folderPathData, username, nav, t);
      let dir;
      if (directories.length > 0) {
        dir = directories[0].path.split("/").slice(0, -1).join("/");
      }
      const path = dir === ("" || undefined) ? "/" : dir;
      const home = "/";
      resolve({
        success: true,
        files_t: files,
        directories_t: directories,
        home_t: home,
        path_t: path,
      });
    } catch (err) {
      reject({ success: false, msg: err });
    }
  });
};

export const getFilesFoldersFromShareID = async (req, res, next) => {
  const { t, k, id, nav, nav_tracking } = req.query;
  console.log("Request-->", nav);
  let files = [];
  let directories = [];
  let home;
  let path;
  try {
    if (t === "fi") {
      files = await prisma.file.findMany({
        where: {
          username: req.user.Username,
          uuid: k,
        },
      });
    } else if (t === "fo") {
      const username = req.user.Username;
      const folderPathData = await prisma.directory.findFirst({
        where: {
          uuid: k,
          username,
        },
      });
      if (folderPathData !== null) {
        files = await getFiles(folderPathData, username, nav, t);
        directories = await getFolders(folderPathData, username, nav, t);
        home = folderPathData.folder;
        path = folderPathData.path;
      } else {
        home = "";
        path = "";
      }
    } else {
      if (nav_tracking == 1) {
        // await browseTransferData(req, res, next);
        const username = req.user.Username;
        const { files_t, directories_t, home_t, path_t } =
          await browseTransferData_promise(t, k, nav, username);
        files = files_t;
        directories = directories_t;
        home = home_t;
        path = path_t;
      } else {
        const share = await Transfer.findById({ _id: id }).exec();
        const db_files = Object.fromEntries(share.files);
        for (const [key, value] of Object.entries(db_files)) {
          const file = await prisma.file.findMany({
            where: { username: req.user.Username, uuid: key },
          });
          files.push(file[0]);
        }
        const db_folders = Object.fromEntries(share.folders);
        for (const [key, value] of Object.entries(db_folders)) {
          const folder = await prisma.directory.findFirst({
            where: {
              username: req.user.Username,
              uuid: key,
            },
          });
          directories.push(folder);
        }
        const dir = directories[0].path.split("/").slice(0, -1).join("/");
        home = "/";
        path = dir === "" ? "/" : dir;
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: err });
  } finally {
    files = JSON.parse(
      JSON.stringify(files, (value, key) =>
        typeof key === "bigint" ? parseInt(key) : key
      )
    );

    res.status(200).json({ success: true, home, path, files, directories });
    files = [];
    directories = [];
  }
};
