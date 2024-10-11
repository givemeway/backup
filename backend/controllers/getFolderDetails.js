import { prisma, Prisma } from "../config/prismaDBConfig.js";

export const getFolderDetails = async (req, res, next) => {
  try {
    const username = req.user.Username;
    const { directory, device } = req.query;
    if (directory === "/") {
      const size =
        await prisma.$queryRaw(Prisma.sql`SELECT SUM(size) as Size, COUNT(*) as Count
              FROM public."File" WHERE username = ${username}
              AND device = ${device}
              `);
      return res.status(200).json({
        success: true,
        files: parseInt(size[0]["count"]),
        size: parseInt(size[0]["size"]),
      });
    } else {
      const regex = `${directory}(/[^/]+)*$`;
      const size = await prisma.$queryRaw(Prisma.sql`
              SELECT SUM(size) as Size, COUNT(*) as Count FROM public."File"
              WHERE username = ${username}
              AND device = ${device}
              AND  directory ~ ${regex}
              `);
      return res.status(200).json({
        success: true,
        files: parseInt(size[0]["count"]),
        size: parseInt(size[0]["size"]),
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, msg: err });
  }
};
