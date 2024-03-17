import { Prisma } from "../config/prismaDBConfig.js";

const delete_files_their_versions_from_directories = async (prisma, data) => {
  const { username, dir, device, regex_dir } = data;

  if (dir !== "/") {
    await prisma.$executeRaw(Prisma.sql`
          DELETE FROM public."FileVersion"
          WHERE username = ${username}
          AND device = ${device}
          AND directory ~ ${regex_dir}`);
    await prisma.$executeRaw(Prisma.sql`
          DELETE FROM public."File"
          WHERE username = ${username}
          AND device = ${device}
          AND directory ~ ${regex_dir}`);
  } else {
    await prisma.$executeRaw(Prisma.sql`
            DELETE FROM  public."FileVersion"
            WHERE username = ${username}
            AND device = ${device}`);
    await prisma.$executeRaw(Prisma.sql`
          DELETE FROM  public."File"
          WHERE username = ${username}
          AND device = ${device}`);
  }
};

export const delete_copied_directories = async (prisma, data) => {
  const { username, dir, device, regex_dir, regex_path } = data;

  let fileExists;
  if (dir !== "/") {
    fileExists = await prisma.$queryRaw(Prisma.sql`
                          SELECT filename,directory 
                          FROM public."File"
                          WHERE username = ${username}
                          AND device = ${device}
                          AND directory ~ ${regex_dir}`);
  } else {
    fileExists = await prisma.$queryRaw(Prisma.sql`
                        SELECT filename,directory 
                        FROM public."File"
                        WHERE username = ${username}
                        AND device = ${device}`);
  }
  console.log(regex_path);
  if (fileExists.length === 0) {
    await prisma.$executeRaw(Prisma.sql`
        DELETE FROM public."Directory"
        WHERE username = ${username}
        AND path ~ ${regex_path}`);
  } else {
    throw Error();
  }
};

export const delete_file_version_directory = async (prisma, path, username) => {
  let dir = path.split("/").slice(2).join("/");
  dir = dir === "" ? "/" : dir;
  const device = path.split("/")[1];
  const regex_dir = `^${dir}(/[^/]+)*$`;
  const regex_path = `^${path}(/[^/]+)*$`;
  const data = { username, device, regex_dir, dir, regex_path };
  await delete_files_their_versions_from_directories(prisma, data);
  await delete_copied_directories(prisma, data);
};
