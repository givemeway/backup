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
              ORDER BY directory
              LIMIT ${pg}
              OFFSET ${bg};`);
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
              ORDER BY directory
              LIMIT ${pg}
              OFFSET ${bg};`);
  }
};

const copy_dir_into_dir_table = async (prisma, data) => {
  const { root, username, dir, reg, pg, bg, device } = data;
  let files = [];
  if (root) {
    files = await prisma.$queryRaw(Prisma.sql`
                        SELECT *
                        FROM public."DeletedFile"
                        WHERE username = ${username}
                        AND device = ${device}
                        AND directory = ${dir}
                        AND deletion_type = 'folder'
                        ORDER BY directory
                        LIMIT ${pg}
                        OFFSET ${bg};`);
  } else {
    files = await prisma.$queryRaw(Prisma.sql`
                        SELECT *
                        FROM public."DeletedFile"
                        WHERE username = ${username}
                        AND device = ${device}
                        AND deletion_type = 'folder'
                        AND directory ~ ${reg}
                        ORDER BY directory
                        LIMIT ${pg}
                        OFFSET ${bg};`);
  }

  const directories = {};

  files.forEach((file) => {
    let path = "";
    if (file.device === "/" && file.directory === "/") {
      path = "/";
    } else if (file.directory === "/" && file.device !== "/") {
      path = "/" + device;
    } else {
      path = "/" + file.device + "/" + file.directory;
    }
    if (!directories.hasOwnProperty(path)) {
      directories[path] = path;
    }
    const pathParts = path.split("/");
    const pathTree = pathParts
      .map((_, idx) => pathParts.slice(0, idx + 1).join("/"))
      .slice(1);
    for (const pth of pathTree) {
      if (!directories.hasOwnProperty(pth)) {
        directories[pth] = pth;
      }
    }
  });

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

  await prisma.directory.createMany({
    data: pathsToInsert,
    skipDuplicates: true,
  });
  return pathsToInsert;
};

const delete_files_from_deletedFile_table = async (prisma, data) => {
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
const delete_version_from_deletedFileVersion_table = async (prisma, data) => {
  const { root, username, dir, reg, pg, bg, device } = data;
  if (root) {
    await prisma.$executeRaw(Prisma.sql`
                WITH deleted_rows AS (
                  SELECT ctid
                  FROM public."DeletedFileVersion"
                  WHERE username = ${username}
                  AND device = ${device}
                  AND deletion_type = 'folder'
                  AND directory = ${dir}
                  ORDER BY directory
                  LIMIT ${pg}
                  OFFSET ${bg}
                  )
              DELETE FROM public."DeletedFileVersion"
              WHERE ctid IN (SELECT ctid FROM deleted_rows);`);
  } else {
    await prisma.$executeRaw(Prisma.sql`
              WITH deleted_rows AS (
                SELECT ctid
                FROM public."DeletedFileVersion"
                WHERE username = ${username}
                AND device = ${device}
                AND directory ~ ${reg}
                AND deletion_type = 'folder'
                ORDER BY directory
                LIMIT ${pg}
                OFFSET ${bg}
                )
            DELETE FROM public."DeletedFileVersion"
            WHERE ctid IN (SELECT ctid FROM deleted_rows);`);
  }
};
const delete_dir_from_deletedDir_table = async (prisma, folders) => {
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

export const restore_items_from_trash = async (data) => {
  await prisma.$transaction(transaction(data));
};

export const restore_file_from_trash = async (data) => {
  await prisma.$transaction(fileTransaction(data));
};

const transaction = (data) => async (prisma) => {
  const folders = await copy_dir_into_dir_table(prisma, data);
  await copy_files_into_file_table(prisma, data);
  await copy_ver_into_ver_table(prisma, data);
  await delete_version_from_deletedFileVersion_table(prisma, data);
  await delete_files_from_deletedFile_table(prisma, data);
  await delete_dir_from_deletedDir_table(prisma, folders);
};

const copy_file_dir_into_dir_table = async (prisma, data) => {
  const { username, path } = data;

  const pathParts = path.split("/");
  const pathTree = pathParts
    .map((_, idx) => pathParts.slice(0, idx + 1).join("/"))
    .slice(1);

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
    if (directories !== null) {
      paths.push(directory);
    }
  }

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
const delete_file_from_deletedFile_table = async (prisma, data) => {
  const { username, device, dir, filename } = data;

  await prisma.$executeRaw(Prisma.sql`
          DELETE FROM public."DeletedFile"
          WHERE username = ${username}
          AND device = ${device}
          AND directory = ${dir}
          AND filename = ${filename}
          AND deletion_type = 'file';`);
};

const delete_file_ver_from_deletedFileVersion_table = async (prisma, data) => {
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
