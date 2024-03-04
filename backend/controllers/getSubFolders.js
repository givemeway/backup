import { Prisma, prisma } from "../config/prismaDBConfig.js";

export const getSubFolders = async (path, username) => {
  return new Promise(async (resolve, reject) => {
    try {
      let regex = "";
      if (path === "/") {
        regex = `^(/[^/]+)$`;
      } else {
        path = path.replace(/\(/g, "\\(");
        path = path.replace(/\)/g, "\\)");
        regex = `^${path}(/[^/]+)$`;
      }

      const rows = await prisma.$queryRaw(Prisma.sql`SELECT 
                              uuid,folder,path,created_at,device 
                              FROM public."Directory" 
                              WHERE username = ${username}
                              AND
                              path ~ ${regex} 
                              ORDER BY folder ASC`);
      resolve(rows);
    } catch (err) {
      reject(err);
    }
  });
};
