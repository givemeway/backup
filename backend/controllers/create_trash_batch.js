import { Prisma, prisma } from "../config/prismaDBConfig.js";

const folder_groups = await prisma.$queryRaw(Prisma.sql`
    SELECT rel_path,rel_name, count(folder) AS folder_count
    FROM  public."DeletedDirectory"
    WHERE username = ${username}
    GROUP BY
    rel_name, rel_path;`);

const files = await prisma.deletedFile.findMany({
  where: {
    username,
    deletion_type: "file",
  },
});
