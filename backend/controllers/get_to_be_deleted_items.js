export const getDeletedItemsList = (req, res, next) => {
  const username = req.user.Username;
  console.log(req.body);
  const folders = req.body.directories;
  const files = req.body.fileIds;
  const deletionTime = new Date()
    .toISOString()
    .substring(0, 19)
    .replace("T", " ");
  const filesToDelete = files.map((file) => {
    const params = new URLSearchParams(file.path);
    const device = params.get("device");
    const dir = params.get("dir");
    const name = params.get("file");
    let path = "";
    if (device === "/") {
      path = "/";
    } else if (dir === "/") {
      path = "/" + device;
    } else {
      path = "/" + device + "/" + dir;
    }
    return {
      id: file.id,
      name,
      dir,
      device,
      path,
    };
  });

  const foldersToDelete = folders.map((folder) => {
    const device = folder.path.split("/")[1];
    const dirParts = folder.path.split("/").slice(2).join("/");
    const dir = dirParts === "" ? "/" : dirParts;

    return {
      id: folder.id,
      name: folder.folder,
      device,
      username,
      dir,
      path: folder.path,
    };
  });
  req.files = filesToDelete;
  req.folders = foldersToDelete;
  req.failed = { files: [], folders: [] };
  req.deletionTime = deletionTime;
  next();
};
