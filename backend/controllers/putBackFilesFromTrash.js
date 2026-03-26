import { prisma, Prisma } from "../config/prismaDBConfig.js";
import { getData } from "./utils.js";
const SINGLEFILE = "singleFile";

const copy_files_into_file_table = async (prisma, data) => {
  const { root, username, dir, reg, pg, bg, device } = data;

  if (root) {
    await prisma.$executeRaw(Prisma.sql`
              INSERT INTO public."File"
              SELECT username,device,directory,uuid,origin,filename,last_modified,last_updated,
              hashvalue,enc_hashvalue,versions,size,salt,iv,"dirID"
              FROM public."DeletedFile"
              WHERE username = ${username}
              AND device = ${device}
              AND directory = ${dir}
              AND deletion_type IN ( 'folder', 'file')
              ORDER BY directory
              LIMIT ${pg}
              OFFSET ${bg};`);
  } else {
    if (dir === "/") {
      await prisma.$executeRaw(Prisma.sql`
              INSERT INTO public."File"
              SELECT username,device,directory,uuid,origin,filename,last_modified,last_updated,
              hashvalue,enc_hashvalue,versions,size,salt,iv,"dirID"
              FROM public."DeletedFile"
              WHERE username = ${username}
              AND device = ${device}
              AND deletion_type IN ('folder', 'file')
              ORDER BY directory
              LIMIT ${pg}
              OFFSET ${bg};`);
    } else {
      await prisma.$executeRaw(Prisma.sql`
                INSERT INTO public."File"
                SELECT username,device,directory,uuid,origin,filename,last_modified,last_updated,
                hashvalue,enc_hashvalue,versions,size,salt,iv,"dirID"
                FROM public."DeletedFile"
                WHERE username = ${username}
                AND device = ${device}
                AND directory ~ ${reg}
                AND deletion_type IN ('folder', 'file')
                ORDER BY directory
                LIMIT ${pg}
                OFFSET ${bg};`);
    }
  }
};

const copy_ver_into_ver_table = async (prisma, data) => {
  const { root, username, dir, reg, pg, bg, device } = data;
  if (root) {
    await prisma.$executeRaw(Prisma.sql`
              INSERT INTO public."FileVersion"
              SELECT username,device,directory,uuid,origin,filename,last_modified,
              hashvalue,enc_hashvalue,versions,size,salt,iv
              FROM public."DeletedFileVersion"
              WHERE username = ${username}
              AND device = ${device}
              AND directory = ${dir}
              AND deletion_type IN ('folder','file')
              ORDER BY directory;`);
  } else {
    if (dir === "/") {
      await prisma.$executeRaw(Prisma.sql`
      INSERT INTO public."FileVersion"
      SELECT username,device,directory,uuid,origin,filename,last_modified,
      hashvalue,enc_hashvalue,versions,size,salt,iv
      FROM public."DeletedFileVersion"
      WHERE username = ${username}
      AND device = ${device}
      AND deletion_type IN ('folder','file')
      ORDER BY directory;`);
    } else {
      await prisma.$executeRaw(Prisma.sql`
                INSERT INTO public."FileVersion"
                SELECT username,device,directory,uuid,origin,filename,last_modified,
                    hashvalue,enc_hashvalue,versions,size,salt,iv
                FROM public."DeletedFileVersion"
                WHERE username = ${username}
                AND device = ${device}
                AND directory ~ ${reg}
                AND deletion_type IN ('folder','file')
                ORDER BY directory;`);
    }
  }
};

export const getDeletedFiles = async (prisma, data) => {
  const { root, username, bg, pg, dir, device } = data;

  const files = await prisma.deletedFile.findMany({
    where: {
      username,
      deletion_type: { in: ["folder", "file"] },
    },
    orderBy: {
      directory: "asc",
    },
    skip: bg,
    take: pg,
    include: {
      deletedFileVersions: true,
    },
    relationLoadStrategy: "join",
  });

  return files;
};

export const getBatchDeletedFiles = async (prisma, data) => {
  const { root, username, dir, reg, pg, bg, device } = data;
  let files = [];
  if (root) {
    files = await prisma.deletedFile.findMany({
      where: {
        username,
        device,
        directory: dir,
        deletion_type: { in: ["folder", "file"] },
      },
      orderBy: {
        directory: "asc",
      },
      skip: bg,
      take: pg,
      include: {
        deletedFileVersions: true,
      },
      relationLoadStrategy: "join",
    });
  } else {
    if (dir === "/") {
      files = await prisma.deletedFile.findMany({
        where: {
          username,
          device,
          deletion_type: { in: ["folder", "file"] },
        },
        orderBy: {
          directory: "asc",
        },
        skip: bg,
        take: pg,
        include: {
          deletedFileVersions: true,
        },
        relationLoadStrategy: "join",
      });
    } else {
      files = await prisma.$queryRaw(Prisma.sql`
          SELECT
              f.*,
              json_agg(
                  json_build_object(
                      'uuid', fv.uuid,
                      'origin', fv.origin,
                      'filename', fv.filename,
                      'last_modified', fv.last_modified,
                      'last_updated', 'last_updated',
                      'hashvalue', fv.hashvalue,
                      'enc_hashvalue', fv.enc_hashvalue,
                      'versions', fv.versions,
                      'size', fv.size,
                      'salt', fv.salt,
                      'iv', fv.iv,
                      'directory', fv.directory,
                      'device', fv.device,
                      'username', fv.username,
                      'deletion_type', fv.deletion_type,
                      'deletion_date', fv.deletion_date,
                      'height',fv.height,
                      'width',fv.width,
                      "dirID","dirID",
                      'type',f.type
                  )
              ) FILTER (WHERE fv.origin IS NOT NULL) AS "deletedFileVersions"
          FROM public."DeletedFile" f
          LEFT JOIN public."DeletedFileVersion" 
          fv ON 
          fv.origin = f.origin
          WHERE f.username = ${username}
          AND f.device = ${device}
          AND f.directory ~ ${reg}
          AND f.deletion_type IN ('folder','file')
          GROUP BY f.uuid, f.origin,f.filename,
                    f.last_modified,
                    f.last_updated,
                    f.hashvalue, f.enc_hashvalue, f.versions, 
                    f.size, f.salt, f.iv, 
                    f.directory,f.device,f.username,
                    f.deletion_type,f.deletion_date,
                    f.height,f.width,
                    f."dirID",
                    f.type

          ORDER BY f.directory ASC
          LIMIT ${pg}
          OFFSET ${bg};`);
      files = files.map(file => ({ ...file, deletedFileVersions: file.deletedFileVersions ?? [] }));

    }
  }
  return files;
};

export const create_all_possible_paths_of_a_dir = (path) => {
  const pathParts = path.split("/");
  const pathTree = pathParts
    .map((_, idx) => pathParts.slice(0, idx + 1).join("/"))
    .slice(1);
  return pathTree;
};

export const get_all_possible_paths_of_a_dir = async (
  prisma,
  pathTree,
  username
) => {
  const directories = {};

  for (const pth of pathTree) {
    if (!directories.hasOwnProperty(pth)) directories[pth] = pth;
  }
  let paths = [];
  for (const path of Object.keys(directories)) {
    const directory = await prisma.deletedDirectory.findFirst({
      where: {
        username,
        path: path,
      },
      select: {
        uuid: true,
        username: true,
        device: true,
        folder: true,
        path: true,
        created_at: true,
      },
    });
    if (directory !== null) {
      paths.push(directory);
    }
  }
  return paths;
};

const createPath = (device, directory) => {
  let path = "";
  if (device === "/" && directory === "/") {
    path = "/";
  } else if (directory === "/" && device !== "/") {
    path = "/" + device;
  } else {
    path = "/" + device + "/" + directory;
  }
  return path;
};

const mapDirectory = (path) => {
  const directories = {};

  if (!directories.hasOwnProperty(path)) {
    directories[path] = path;
  }
  const pathTree = create_all_possible_paths_of_a_dir(path);
  for (const pth of pathTree) {
    if (!directories.hasOwnProperty(pth)) {
      directories[pth] = pth;
    }
  }
  return directories;
};

export const getPathsToInsert = async (prisma, data, files) => {
  const { username, pathReg } = data;

  let directories = {};

  if (files.length === 0) {
    const dirs = await prisma.$queryRaw(Prisma.sql`
          SELECT path FROM public."DeletedDirectory"
          WHERE username = ${username} AND 
          path ~ ${pathReg};`)
    for (const dir of dirs) {
      directories = { ...directories, ...mapDirectory(dir.path) };
    }
  } else {
    files.forEach((file) => {
      const path = createPath(file.device, file.directory);
      directories = { ...directories, ...mapDirectory(path) };
    });
  }

  const pathsToInsert = [];
  for (const path of Object.keys(directories)) {
    const directory = await prisma.deletedDirectory.findFirst({
      where: {
        username,
        path,
      },
      select: {
        uuid: true,
        username: true,
        device: true,
        folder: true,
        path: true,
        created_at: true,
      },
    });

    if (directory !== null) pathsToInsert.push(directory);
  }
  return pathsToInsert;
};

const copy_dir_into_dir_table = async (prisma, data) => {
  const files = await getBatchDeletedFiles(prisma, data);
  const pathsToInsert = await getPathsToInsert(prisma, data, files);
  await prisma.directory.createMany({
    data: pathsToInsert,
    skipDuplicates: true,
  });
  return pathsToInsert;
};

export const delete_files_from_deletedFile_table = async (prisma, data) => {
  const { root, username, dir, reg, pg, bg, device } = data;
  if (root) {
    await prisma.$executeRaw(Prisma.sql`
            WITH deleted_rows AS (
              SELECT ctid
              FROM public."DeletedFile"
              WHERE username = ${username}
              AND device = ${device}
              AND directory = ${dir}
              AND deletion_type IN ('folder','file')
              ORDER BY directory
              LIMIT ${pg}
              OFFSET ${bg}
              )
          DELETE FROM public."DeletedFile"
          WHERE ctid IN (SELECT ctid FROM deleted_rows);`);
  } else {
    if (dir === "/") {
      await prisma.$executeRaw(Prisma.sql`
            WITH deleted_rows AS (
              SELECT ctid
              FROM public."DeletedFile"
              WHERE username = ${username}
              AND device = ${device}
              AND deletion_type IN ('folder','file')
              ORDER BY directory
              LIMIT ${pg}
              OFFSET ${bg}
              )
          DELETE FROM public."DeletedFile"
          WHERE ctid IN (SELECT ctid FROM deleted_rows);`);
    } else {
      await prisma.$executeRaw(Prisma.sql`
            WITH deleted_rows AS (
              SELECT ctid
              FROM public."DeletedFile"
              WHERE username = ${username}
              AND device = ${device}
              AND deletion_type IN ('folder','file')
              AND directory ~ ${reg}
              ORDER BY directory
              LIMIT ${pg}
              OFFSET ${bg}
              )
          DELETE FROM public."DeletedFile"
          WHERE ctid IN (SELECT ctid FROM deleted_rows);`);
    }
  }
};

const getVersionUuids = (files) => {
  const versionUUids = files
    .filter((file) => file.deletedFileVersions.length > 0)
    .map((file) => file.deletedFileVersions.map((file) => file.origin))
    .flat();
  const versionUUidsMap = {};
  versionUUids.forEach(a => { versionUUidsMap[a] = a; });
  return Object.values(versionUUidsMap);
};

const get_root_files_in_directory = async (prisma, data) => {
  const { username, dir, pg, bg, device } = data;

  return await prisma.deletedFile.findMany({
    where: { username, device, directory: dir, deletion_type: { in: ["folder", "file"] } },
    orderBy: { directory: 'asc' },
    skip: bg,
    take: pg,
    include: {
      deletedFileVersions: true,
    },
    relationLoadStrategy: "join",
  });
};

const get_all_files_in_directory = async (prisma, data) => {
  const { username, reg, dir, pg, bg, device } = data;
  let files = [];
  if (dir === "/") {
    if (bg && pg) {
      files = await prisma.deletedFile.findMany({
        where: {
          username,
          device,
          deletion_type: { in: ["folder", "file"] }
        },
        orderBy: { directory: 'asc' },
        skip: bg,
        take: pg,
        include: {
          deletedFileVersions: true,
        },
        relationLoadStrategy: "join",
      });
    } else {
      files = await prisma.deletedFile.findMany({
        where: {
          username,
          device,
          deletion_type: { in: ["folder", "file"] }
        },
        orderBy: { directory: 'asc' },
        include: {
          deletedFileVersions: true,
        },
        relationLoadStrategy: "join",
      });
    }
  } else {
    files = await prisma.$queryRaw(Prisma.sql`
          SELECT
              f.*,
              json_agg(
                  json_build_object(
                      'uuid', fv.uuid,
                      'origin', fv.origin,
                      'filename', fv.filename,
                      'last_modified', fv.last_modified,
                      'last_updated', 'last_updated',
                      'hashvalue', fv.hashvalue,
                      'enc_hashvalue', fv.enc_hashvalue,
                      'versions', fv.versions,
                      'size', fv.size,
                      'salt', fv.salt,
                      'iv', fv.iv,
                      'directory', fv.directory,
                      'device', fv.device,
                      'username', fv.username,
                      'deletion_type', fv.deletion_type,
                      'deletion_date', fv.deletion_date,
                      'height',fv.height,
                      'width',fv.width,
                      "dirID","dirID",
                      'type',f.type
                  )
              ) FILTER (WHERE fv.origin IS NOT NULL) AS "deletedFileVersions"
          FROM public."DeletedFile" f
          LEFT JOIN public."DeletedFileVersion" 
          fv ON 
          fv.origin = f.origin
          WHERE f.username = ${username}
          AND f.device = ${device}
          AND f.directory ~ ${reg}
          AND f.deletion_type IN ('folder', 'file')
          GROUP BY f.uuid, f.origin,f.filename,
                    f.last_modified,
                    f.last_updated,
                    f.hashvalue, f.enc_hashvalue, f.versions, 
                    f.size, f.salt, f.iv, 
                    f.directory,f.device,f.username,
                    f.deletion_type,f.deletion_date,
                    f.height,f.width,
                    f."dirID",
                    f.type

          ORDER BY f.directory ASC
          LIMIT ${pg}
          OFFSET ${bg};`);
    files = files.map(file => ({
      ...file,
      deletedFileVersions: file.deletedFileVersions ?? []
    }));
    /*
        files = await prisma.deletedFile.findMany({
    
          where: {
            username,
            device,
            directory: {
              contains: dir + "%",
            },
            deletion_type: 'folder',
          },
          orderBy: { directory: 'asc' },
          skip: bg,
          take: pg,
          include: {
            deletedFileVersions: true,
          },
          relationLoadStrategy: "join",
        });
    
        */
  }
  return files;
};

const delete_file_versions = async (prisma, uuids) => {
  await prisma.deletedFileVersion.deleteMany({
    where: {
      origin: {
        in: uuids
      }
    },
  });

};

export const delete_version_from_deletedFileVersion_table = async (
  prisma,
  data
) => {
  const { root } = data;

  if (root) {
    const allFiles = await get_root_files_in_directory(prisma, data);
    const fileVersions = getVersionUuids(allFiles);

    await delete_file_versions(prisma, fileVersions);
  } else {
    const allFiles = await get_all_files_in_directory(prisma, data);
    const fileVersions = getVersionUuids(allFiles);
    await delete_file_versions(prisma, fileVersions);
  }
};
export const delete_dir_from_deletedDir_table = async (prisma, folders) => {
  for (const folder of folders) {
    let dir = folder.path.split("/").slice(2).join("/");
    dir = dir === "" ? "/" : dir;
    const regex = `^${dir}(/[^/]+)*$`;
    if (dir === "/") {
      await prisma.$executeRaw(Prisma.sql`
        DELETE FROM public."DeletedDirectory"
        WHERE username = ${folder.username}
        AND device = ${folder.device}
        AND path = ${folder.path}
        AND folder = ${folder.folder}
        AND NOT EXISTS ( 
          SELECT 1 FROM public."DeletedFile"
          WHERE username = ${folder.username}
          AND device = ${folder.device});`);
    } else {
      await prisma.$executeRaw(Prisma.sql`
        DELETE FROM public."DeletedDirectory" dd
        WHERE username = ${folder.username}
          AND device = ${folder.device}
          AND path = ${folder.path}
          AND folder = ${folder.folder}
          AND NOT EXISTS (
            SELECT 1 FROM public."DeletedFile" df
            WHERE df.username = dd.username
              AND df.device = dd.device
              AND df.directory = ${dir}
              AND df."dirID" = dd.uuid);`);
    }
  }
};

const copy_file_dir_into_dir_table = async (prisma, data) => {
  const { path, username } = data;

  const pathTree = create_all_possible_paths_of_a_dir(path);

  const paths = await get_all_possible_paths_of_a_dir(
    prisma,
    pathTree,
    username
  );

  await prisma.directory.createMany({
    data: paths,
    skipDuplicates: true,
  });

  return paths;
};
const copy_file_into_file_table = async (prisma, data) => {
  const { username, device, dir, filename } = data;
  await prisma.$executeRaw(Prisma.sql`
          INSERT INTO public."File"
          SELECT username,device,directory,uuid,origin,filename,last_modified,
              last_updated,
              hashvalue,enc_hashvalue,versions,size,salt,iv,"dirID"
          FROM public."DeletedFile"
          WHERE username = ${username}
          AND device = ${device}
          AND directory = ${dir}
          AND deletion_type = 'file'
          AND filename = ${filename};`);
};
const copy_file_ver_into_ver_table = async (prisma, data) => {
  const { username, device, dir, filename } = data;
  await prisma.$executeRaw(Prisma.sql`
          INSERT INTO public."FileVersion"
          SELECT username,device,directory,uuid,origin,filename,last_modified,
              hashvalue,enc_hashvalue,versions,size,salt,iv
          FROM public."DeletedFileVersion"
          WHERE username = ${username}
          AND device = ${device}
          AND directory = ${dir}
          AND deletion_type = 'file'
          AND filename = ${filename};`);
};
export const delete_file_from_deletedFile_table = async (prisma, data) => {
  const { username, device, dir, filename } = data;

  await prisma.$executeRaw(Prisma.sql`
          DELETE FROM public."DeletedFile"
          WHERE username = ${username}
          AND device = ${device}
          AND directory = ${dir}
          AND filename = ${filename}
          AND deletion_type = 'file';`);
};

export const delete_file_ver_from_deletedFileVersion_table = async (
  prisma,
  data
) => {
  const { username, device, dir, filename } = data;

  await prisma.$executeRaw(Prisma.sql`
          DELETE FROM public."DeletedFileVersion"
          WHERE username = ${username}
          AND device = ${device}
          AND directory = ${dir}
          AND filename = ${filename}
          AND deletion_type = 'file';`);
};

const fileTransaction = (data) => async (prisma) => {
  const folders = await copy_file_dir_into_dir_table(prisma, data);
  await copy_file_into_file_table(prisma, data);
  await copy_file_ver_into_ver_table(prisma, data);
  await delete_file_ver_from_deletedFileVersion_table(prisma, data);
  await delete_file_from_deletedFile_table(prisma, data);
  await delete_dir_from_deletedDir_table(prisma, folders);
};

const folderTransaction = (data) => async (prisma) => {
  const folders = await copy_dir_into_dir_table(prisma, data);
  await copy_files_into_file_table(prisma, data);
  await copy_ver_into_ver_table(prisma, data);
  await delete_version_from_deletedFileVersion_table(prisma, data);
  await delete_files_from_deletedFile_table(prisma, data);
  await delete_dir_from_deletedDir_table(prisma, folders);
};

export const restore_items_from_trash = async (data) => {
  await prisma.$transaction(folderTransaction(data));
};

export const restore_file_from_trash = async (data) => {
  await prisma.$transaction(fileTransaction(data));
};

export const restoreItems = async (req, res) => {
  const items = req.body.items;
  const username = req.user.Username;

  for (const item of items) {
    if (item.item !== SINGLEFILE) {
      if (item?.items) {
        for (const el of item?.items) {
          try {
            const { path, limit } = el;
            const { begin, end } = limit;
            const data = getData(path, begin, end, el?.root, username);
            await restore_items_from_trash(data);
          } catch (err) {
            console.error(err);
          }
        }
      } else {
        try {
          const { path, begin, end } = item;
          const data = getData(path, begin, end, item?.root, username);
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
};
