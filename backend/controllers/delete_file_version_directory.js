import { Prisma } from "../config/prismaDBConfig.js";

export const delete_file_version_directory = async (prisma, path, username) => {
  return new Promise(async (resolve, reject) => {
    try {
      let dir = path.split("/").slice(2).join("/");
      dir = dir === "" ? "/" : dir;
      const device = path.split("/")[1];
      const regex_dir = `^${dir}(/[^/]+)*$`;
      const regex_path = `^${path}(/[^/]+)*$`;
      if (dir !== "/") {
        await prisma.$executeRaw(Prisma.sql`
          DELETE FROM public."File"
          WHERE username = ${username}
          AND device = ${device}
          AND directory ~ ${regex_dir}`);

        await prisma.$executeRaw(Prisma.sql`
          DELETE FROM public."FileVersion"
          WHERE username = ${username}
          AND device = ${device}
          AND directory ~ ${regex_dir}`);
      } else {
        await prisma.$executeRaw(Prisma.sql`
          DELETE FROM  public."File"
          WHERE username = ${username}
          AND device = ${device}`);

        await prisma.$executeRaw(Prisma.sql`
          DELETE FROM  public."FileVersion"
          WHERE username = ${username}
          AND device = ${device}`);
      }
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

      if (fileExists.length === 0) {
        await prisma.$executeRaw(Prisma.sql`
            DELETE FROM public."Directory"
            WHERE username = ${username}
            AND path ~ ${regex_path}`);
      } else {
        reject();
      }
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};
