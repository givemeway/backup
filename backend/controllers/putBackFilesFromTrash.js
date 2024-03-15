import { prisma, Prisma } from "../config/prismaDBConfig.js";

const copy_files_into_file_table = async (prisma, data) => {
  const { root, username, dir, reg, pg, bg, device } = data;
  if (root) {
    await prisma.$executeRaw(Prisma.sql`
              INSERT INTO public."File"
              SELECT username,device,directory,uuid,origin,filename,last_modified,
                  hashvalue,enc_hashvalue,versions,size,salt,iv,"dirID"
              FROM public."DeletedFile"
              WHERE username = ${username}
              AND device = ${device}
              AND directory = ${dir}
              AND deletion_type = 'folder'
              ORDER BY directory
              LIMIT ${pg}
              OFFSET ${bg};`);
  } else {
    await prisma.$executeRaw(Prisma.sql`
              INSERT INTO public."File"
              SELECT username,device,directory,uuid,origin,filename,last_modified,
                  hashvalue,enc_hashvalue,versions,size,salt,iv,"dirID"
              FROM public."DeletedFile"
              WHERE username = ${username}
              AND device = ${device}
              AND directory ~ ${reg}
              AND deletion_type = 'folder'
              ORDER BY directory
              LIMIT ${pg}
              OFFSET ${bg};`);
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
              AND deletion_type = 'folder'
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
              AND deletion_type = 'folder'
              ORDER BY directory;`);
  }
};

export const getDeletedFiles = async (prisma, data) => {
  const { root, username, dir, device } = data;

  const files = await prisma.deletedFile.findMany({
    where: {
      username,
      deletion_type: "folder",
    },
    orderBy: {
      directory: "asc",
    },
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
        deletion_type: "folder",
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
    files = await prisma.deletedFile.findMany({
      where: {
        username,
        device,
        directory: {
          contains: dir + "%",
        },
        deletion_type: "folder",
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
  const { username } = data;

  let directories = {};

  if (files.length === 0) {
    const path = createPath(data.device, data.dir);
    directories = mapDirectory(path);
  } else {
    files.forEach((file) => {
      const path = createPath(file.device, file.directory);
      directories = mapDirectory(path);
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
              AND deletion_type = 'folder'
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
              AND deletion_type = 'folder'
              AND directory ~ ${reg}
              ORDER BY directory
              LIMIT ${pg}
              OFFSET ${bg}
              )
          DELETE FROM public."DeletedFile"
          WHERE ctid IN (SELECT ctid FROM deleted_rows);`);
  }
};

const getVersionUuids = (files) => {
  return files
    .filter((file) => file.deletedFileVersions.length > 0)
    .map((file) => file.deletedFileVersions.map((file) => file.origin))
    .flat();
};

const get_root_files_in_directory = async (prisma, data) => {
  const { username, dir, pg, bg, device } = data;

  return await prisma.deletedFile.findMany({
    where: { username, device, directory: dir },
    skip: bg,
    take: pg,
    include: {
      deletedFileVersions: true,
    },
    relationLoadStrategy: "join",
  });
};

const get_all_files_in_directory = async (prisma, data) => {
  const { username, dir, pg, bg, device } = data;

  return await prisma.deletedFile.findMany({
    where: {
      username,
      device,
      directory: {
        contains: dir + "%",
      },
    },
    skip: bg,
    take: pg,
    include: {
      deletedFileVersions: true,
    },
    relationLoadStrategy: "join",
  });
};

const delete_file_versions = async (prisma, files) => {
  await prisma.deletedFileVersion.deleteMany({
    where: {
      origin: {
        in: files,
      },
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
    await prisma.$executeRaw(Prisma.sql`
      DELETE FROM public."DeletedDirectory"
      WHERE username = ${folder.username}
      AND device = ${folder.device}
      AND path = ${folder.path}
      AND folder = ${folder.folder}
      AND NOT EXISTS ( 
        SELECT 1 FROM public."DeletedFile"
        WHERE username = ${folder.username}
        AND device = ${folder.device}
        AND directory ~ ${regex});`);
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
