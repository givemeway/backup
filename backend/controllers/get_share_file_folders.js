import { Prisma, prisma } from "../config/prismaDBConfig.js";
import { Transfer } from "../models/mongodb.js";
import { getSignedURls } from "./getSignedURLs.js";

const getFiles = async (params) => {
  const { folderPathData, username, nav, skip, take, t } = params;
  const { path, device } = folderPathData;
  const dirPart = path.split("/").slice(2).join("/");
  const currentDir = dirPart === "" ? "/" : dirPart;
  // const curNavPath = nav.split("/").slice(1).join("/");
  // if (nav !== "h" && t !== "t") {
  //   currentDir =
  //     currentDir === "/" ? curNavPath : currentDir + "/" + curNavPath;
  // }

  const filesQuery = prisma.file.findMany({
    where: {
      username,
      device,
      directory: currentDir,
    },
    orderBy: {
      filename: "asc",
    },
    take: parseInt(take),
    skip: parseInt(skip),
  });

  const totalQuery = prisma.file.count({
    where: {
      username,
      device,
      directory: currentDir,
    },
  });
  return await prisma.$transaction([totalQuery, filesQuery]);
};

const getFolders = async (params) => {
  const { folderPathData, username, nav, skip, take, t } = params;
  let { path, device } = folderPathData;
  let regex = ``;
  if (device === "/") {
    regex = `^(/[^/]+)$`;
  } else if (path === "/") {
    regex = `^/${device}(/[^/]+)$`;
  } else {
    // if (nav !== "h" && t !== "t") {
    //   path = path + "/" + nav.split("/").slice(1).join("/");
    // }

    regex = `^${path}(/[^/]+)$`;
  }
  const foldersQuery = prisma.$queryRaw(Prisma.sql`
                    SELECT uuid,folder,path,created_at
                    FROM public."Directory"
                    WHERE username = ${username}
                    AND path ~ ${regex}
                    ORDER BY path
                    LIMIT ${parseInt(take)}
                    OFFSET ${parseInt(skip)};`);
  const totalQuery = prisma.$queryRaw(Prisma.sql`
                    SELECT COUNT(*) FROM  public."Directory" 
                    WHERE username = ${username}
                    AND path ~ ${regex};`);
  return await prisma.$transaction([totalQuery, foldersQuery]);
};

const browseTransferData_promise = async (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { k, username, skip, take } = params;

      const folderPathData = await prisma.directory.findFirst({
        where: {
          username,
          uuid: k,
        },
      });
      if (folderPathData === null) {
        console.log("block 1");
        reject({ success: false, msg: "path not found" });
        return;
      }
      const data = { ...params, folderPathData };
      const [fileTotal, files] = await getFiles(data);
      const files_with_thumbs_urls = await getSignedURls(files, username);
      const [directoryTotal, directories] = await getFolders(data);
      console.log(directories);

      let dir;
      if (directories.length > 0) {
        dir = directories[0].path.split("/").slice(0, -1).join("/");
      }
      const path = dir === ("" || undefined) ? "/" : dir;
      const home = "/";
      resolve({
        success: true,
        files_t: files_with_thumbs_urls,
        directories_t: directories,
        home_t: home,
        path_t: path,
        total_t: fileTotal + parseInt(directoryTotal[0].count),
      });
    } catch (err) {
      reject({ success: false, msg: err });
      return;
    }
  });
};

export const getFilesFoldersFromShareID = async (req, res, next) => {
  const { t, k, id, nav, nav_tracking, skip, take } = req.query;
  const username = req.user.Username;

  let files = [];
  let directories = [];
  let home;
  let path;
  let total = 0;
  try {
    if (t === "fi") {
      const file = await prisma.file.findFirst({
        where: {
          username: req.user.Username,
          uuid: k,
        },
      });
      files = await getSignedURls([file], username);
    } else if (t === "fo") {
      const username = req.user.Username;
      const folderPathData = await prisma.directory.findFirst({
        where: {
          uuid: k,
          username,
        },
      });
      if (folderPathData !== null) {
        const params = { folderPathData, username, nav, t, skip, take };

        const [filetotal, page_files] = await getFiles(params);
        files = await getSignedURls(page_files, username);
        total += filetotal;
        const [directoryTotal, page_directories] = await getFolders(params);
        directories = page_directories;
        total += parseInt(directoryTotal[0].count);
        home = folderPathData.folder;
        path = folderPathData.path;
      } else {
        home = "";
        path = "";
      }
    } else {
      if (nav_tracking == 1 && k !== "null") {
        const params = { t, k, nav, username, skip, take };
        const { files_t, directories_t, home_t, path_t, total_t } =
          await browseTransferData_promise(params);

        files = files_t;
        directories = directories_t;
        home = home_t;
        path = path_t;
        total = total_t;
      } else {
        const share = await Transfer.findById({ _id: id }).exec();
        const db_files = Object.fromEntries(share.files);
        for (const [key, value] of Object.entries(db_files)) {
          const file = await prisma.file.findFirst({
            where: { username, uuid: key },
          });
          if (file !== null) {
            const updatedFile = await getSignedURls([file], username);
            files.push(updatedFile[0]);
          }
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
        const dir = directories[0]?.path.split("/").slice(0, -1).join("/");
        home = "/";
        path = dir === "" ? "/" : dir;
        total = files.length + directories.length;
      }
    }
    files = JSON.parse(
      JSON.stringify(files, (value, key) =>
        typeof key === "bigint" ? parseInt(key) : key
      )
    );

    return res
      .status(200)
      .json({ success: true, home, path, files, directories, total });
  } catch (err) {
    console.log("error block");
    console.error(err);
    return res.status(500).json({ success: false, msg: err });
  }
};
