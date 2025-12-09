import { prisma } from "../config/prismaDBConfig.js"
import { v4 as uuidv4 } from "uuid";

const getTreePath = (path) => {
  const pathParts = path.split("/");
  return pathParts.map((a, i) => [a === "" ? "/" : a, pathParts.slice(0, i + 1).join("/") === "" ? "/" : pathParts.slice(0, i + 1).join("/")]).slice(1);
}

const createFolder = async (req, res,) => {
  try {

    const { path, device, created_at, username } = req.query
    const pathParts = getTreePath(path);
    const all_paths = []
    for (const [folder, pth] of pathParts) {
      const obj = { username, path: pth, device, folder, created_at, uuid: uuidv4() }
      all_paths.push(obj);
    }

    await prisma.directory.createMany({
      data: all_paths,
      skipDuplicates: true
    });

    res.status(200).json({ success: true, [path]: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err })
  }


}

export { createFolder }
