const FILE = "file";
const FOLDER = "folder";
import { prisma, Prisma } from "../config/prismaDBConfig.js";

const selectedFields = {
  directory: true,
  filename: true,
  hashvalue: true,
  last_modified: true,
  salt: true,
  iv: true,
  device: true,
  uuid: true,
  origin: true,
  versions: true,
};

const getFilesInDirectory = async (req, res, next) => {
  try {
    const currentdirectory = req.headers.currentdirectory;
    const username = req.user.Username;
    // const username = req.headers.username;
    const devicename = req.headers.devicename;
    const backupType = req.headers.backuptype;
    req.headers.data = [];
    if (backupType === FOLDER) {
      if (currentdirectory === "/") {
        const files =
          await prisma.$queryRaw(Prisma.sql`SELECT directory,filename,hashvalue,last_modified,salt,iv,device,uuid,origin,versions
                        FROM  public."File" 
                        WHERE username = ${username} AND  device = ${devicename}
                        UNION ALL
                        SELECT directory,filename,hashvalue,last_modified,salt,iv,device,uuid,origin,versions
                        FROM  public."FileVersion" 
                        WHERE username = ${username} AND  device = ${devicename}`);
        req.headers.data.push(...files);
      } else {
        const regex_other_files = `^${currentdirectory}(/[^/]+)*$`;

        const rows =
          await prisma.$queryRaw(Prisma.sql`SELECT directory,filename,hashvalue,last_modified,salt,iv,device,uuid,origin,versions 
                                            FROM public."File"
                                            WHERE username = ${username} AND device = ${devicename} AND directory ~ ${regex_other_files}
                                            UNION ALL
                                            SELECT directory,filename,hashvalue,last_modified,salt,iv,device,uuid,origin,versions 
                                            FROM public."FileVersion"
                                            WHERE username = ${username} AND device = ${devicename} AND directory ~ ${regex_other_files}`);
        req.headers.data.push(...rows);
      }
    } else {
      if (currentdirectory === "/") {
        const rows =
          await prisma.$queryRaw(Prisma.sql`SELECT  directory,filename,hashvalue,last_modified,
                                            salt,iv,device,uuid,origin,versions
                                            FROM public."File"
                                            WHERE username = ${username} AND device = ${devicename}
                                            UNION ALL
                                            SELECT  directory,filename,hashvalue,last_modified,
                                                  salt,iv,device,uuid,origin,versions
                                            FROM public."FileVersion"
                                            WHERE username = ${username} AND device = ${devicename}`);

        req.headers.data.push(...rows);
      } else {
        const rows = await prisma.$queryRaw(Prisma.sql`
                                SELECT directory,filename,hashvalue,last_modified,salt,iv,device,uuid,origin,versions 
                                FROM public."File"
                                WHERE  username = ${username} AND device = ${devicename} AND directory = ${currentdirectory}
                                UNION ALL
                                SELECT directory,filename,hashvalue,last_modified,salt,iv,device,uuid,origin,versions 
                                FROM public."FileVersion"  
                                WHERE  username = ${username} AND device = ${devicename} AND directory = ${currentdirectory}`);

        req.headers.data.push(...rows);
      }
    }
    next();
  } catch (err) {
    res.status(500).json(err);
    res.end();
  }
};

export { getFilesInDirectory };
