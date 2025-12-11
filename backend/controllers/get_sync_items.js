import { prisma, Prisma } from "../config/prismaDBConfig.js";
import { join } from "node:path";
export const get_sync_items = async (req, res, next) => {
  const { username } = req.query
  try {
    const [results, count] = await prisma.$transaction([
      prisma.$queryRaw(Prisma.sql`
        SELECT uuid,origin, filename as name, device, directory as path, hashvalue, versions,'file' as type,
        last_modified as modified,size,"dirID"
        FROM public."File"
        WHERE username = ${username}
        UNION ALL
        SELECT uuid,'--' as origin, folder as name, device,path, '--' as hashvalue, 0 as versions,
        'folder' as type, created_at as modified, 0 as size,'--' as dirID
        FROM public."Directory"
        WHERE username = ${username}
        AND
        path ~ '^(/[^/]+)*$'
        ORDER BY name ASC;
      `),
      prisma.$queryRaw(Prisma.sql`
        SELECT COUNT(*)
        FROM public."File"
        WHERE username = ${username}
        UNION ALL
        SELECT COUNT(*)
        FROM public."Directory"
        WHERE username = ${username};
      `),
    ]);
    const filesFolders = results.map(a => {
      if (a.type === 'file') {
        let path = "";
        if (a.path !== "/")
          path = join("/", a.device, a.path).split(/[/\\]/).join("/");
        else {
          path = join("/", a.device).split(/[/\\]/).join("/")
        }
        return {
          filename: a.name, type: a.type, dirID: a.dirID,
          hashvalue: a.hashvalue, last_modified: a.modified,
          path, size: parseInt(a.size),
          uuid: a.uuid, origin: a.origin,
          versions: a.versions
        }
      } else {
        return { folder: a.name, path: a.path, uuid: a.uuid, device: a.device, type: a.type, created_at: a.modified }
      }
    });
    const totalCount = count.reduce((total, a) => total + parseInt(a.count), 0);
    res.status(200).json({ success: true, items: filesFolders, count: totalCount })
  }
  catch (err) {
    res.status(500).json({ success: false, msg: "something went wrong. try again" })
  }
} 
