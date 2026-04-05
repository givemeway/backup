import { prisma } from "../config/prismaDBConfig.js";
import { v4 as uuidv4 } from "uuid";

const getTreePath = (path) => {
  const pathParts = path.split("/");
  return pathParts
    .map((a, i) => [
      a === "" ? "/" : a,
      pathParts.slice(0, i + 1).join("/") === ""
        ? "/"
        : pathParts.slice(0, i + 1).join("/"),
    ])
    .slice(1);
};

const createFolder = async (req, res) => {
  try {
    const { path, device, created_at, username, uuid, folder } = req.query;
    await prisma.directory.upsert({
      where: {
        username_device_folder_path: { username, device, folder, path },
      },
      update: { path, device, created_at: new Date(parseInt(created_at) * 1000).toISOString(), username, uuid, folder },
      create: { path, device, created_at: new Date(parseInt(created_at) * 1000).toISOString(), username, uuid, folder },
    });
    // const pathParts = getTreePath(path);
    // const all_paths = [];
    // for (const [folder, pth] of pathParts) {
    //   const obj = {
    //     username,
    //     path: pth,
    //     device,
    //     folder,
    //     created_at,
    //     uuid: uuidv4(),
    //   };
    //   all_paths.push(obj);
    // }

    // await prisma.directory.createMany({
    //   data: all_paths,
    //   skipDuplicates: true,
    // });
    res.status(200).json({ success: true, [path]: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
};

export { createFolder };
