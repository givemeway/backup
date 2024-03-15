import { prisma } from "../config/prismaDBConfig.js";
import { DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../server.js";
import dotenv from "dotenv";
import {
  create_all_possible_paths_of_a_dir,
  delete_dir_from_deletedDir_table,
  delete_file_from_deletedFile_table,
  delete_file_ver_from_deletedFileVersion_table,
  delete_files_from_deletedFile_table,
  delete_version_from_deletedFileVersion_table,
  get_all_possible_paths_of_a_dir,
  getBatchDeletedFiles,
  getDeletedFiles,
  getPathsToInsert,
} from "./putBackFilesFromTrash.js";
dotenv.config();
const SINGLEFILE = "singleFile";
const BUCKET = process.env.BUCKET;

const deleteS3Objects = (username, files) => {
  return new Promise(async (resolve, reject) => {
    try {
      const objects = [];
      for (const file of files) {
        const key = { Key: `${username}/${file.uuid}` };
        objects.push(key);
      }
      if (objects.length > 0) {
        console.log("inside the s3 delete block");

        const objectsDeleteCommand = new DeleteObjectsCommand({
          Bucket: BUCKET,
          Delete: {
            Objects: objects,
          },
        });
        await s3Client.send(objectsDeleteCommand);
      }
      resolve();
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const deleteS3Object = (username, uuid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const Key = `${username}/${uuid}`;
      const deleteCommand = new DeleteObjectCommand({
        Bucket: BUCKET,
        Key,
      });
      await s3Client.send(deleteCommand);
      resolve();
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const tagDuplicates = (files) => {
  const fileData = {};
  for (const file of files) {
    if (fileData.hasOwnProperty(file.uuid)) {
      fileData[file.uuid].push(file);
    } else {
      fileData[file.uuid] = [];
      fileData[file.uuid].push(file);
    }
  }
  // return Object.entries(fileData).map(([k, v]) => ({ [k]: v }));
  return fileData;
};

const getData = (path, begin, end, root, username) => {
  const dirParts = path.split("/").slice(2).join("/");
  const device = path.split("/")[1];
  let dir = dirParts === "" ? "/" : dirParts;
  dir = dir.replace(/\(/g, "\\(");
  dir = dir.replace(/\)/g, "\\)");
  const regexp = `^${dir}(/[^/]+)*$`;
  let data = {};
  data.root = root;
  data.dir = dir;
  data.device = device;
  data.username = username;
  data.reg = regexp;
  data.pg = end;
  data.bg = begin;
  return data;
};

const findCommonFiles = (files, allfiles) => {
  let commonFiles = [];
  Object.entries(files).forEach(([k, v]) => {
    if (allfiles.hasOwnProperty(k)) {
      const batchFiles = v;
      const all_common_files = allfiles[k];
      const batchFilesSet = {};
      const all_common_files_set = {};
      for (const file of batchFiles) {
        batchFilesSet[file.origin] = file;
      }
      for (const file of all_common_files) {
        all_common_files_set[file.origin] = file;
      }
      const common = Object.entries(all_common_files_set)
        .filter(([x, v]) => batchFilesSet.hasOwnProperty(x))
        .map(([k, v]) => {
          if (batchFiles.length === all_common_files.length) {
            return {
              origin: v.origin,
              uuid: v.uuid,
              deletedFileVersions: v.deletedFileVersions,
              deleteFromS3: true,
            };
          } else if (all_common_files.length > batchFiles.length) {
            return {
              origin: v.origin,
              uuid: v.uuid,
              deletedFileVersions: v.deletedFileVersions,
              deleteFromS3: false,
            };
          }
        });

      commonFiles = commonFiles.concat([...common]);
    }
  });
  return commonFiles;
};

const get_DB_rows_s3_files_to_delete = (rows) => {
  const fileVersionRows = rows
    .filter((file) => file.deleteFromDB)
    .map((file) =>
      file.deletedFileVersions.map((file) => ({
        uuid: file.uuid,
        origin: file.uuid,
        username: file.username,
      }))
    )
    .flat();
  let uniqueVersions = {};
  fileVersionRows.forEach((file) => {
    if (!uniqueVersions.hasOwnProperty(file.uuid)) {
      uniqueVersions[file.uuid] = 1;
    } else {
      uniqueVersions[file.uuid] += 1;
    }
  });
  let s3Files = [];

  for (const row of rows) {
    if (row.deleteFromS3) {
      s3Files.push({ uuid: row.uuid });
      if (row.deletedFileVersions.length > 0) {
        row.deletedFileVersions.forEach((file) => {
          if (
            uniqueVersions.hasOwnProperty(file.uuid) &&
            uniqueVersions[file.uuid] === 1
          ) {
            s3Files.push({ uuid: file.uuid });
          }
        });
      }
    }
  }
  return { s3Files };
};

const transaction = (data) => async (prisma) => {
  const files = await getBatchDeletedFiles(prisma, data);
  const all_files = await getDeletedFiles(prisma, data);
  const all_files_tag = tagDuplicates(all_files);
  const files_tag = tagDuplicates(files);
  const commonFiles = findCommonFiles(files_tag, all_files_tag);
  const { s3Files } = get_DB_rows_s3_files_to_delete(commonFiles);
  await deleteS3Objects(data.username, s3Files);
  const folders = await getPathsToInsert(prisma, data, files);
  await delete_version_from_deletedFileVersion_table(prisma, data);
  await delete_files_from_deletedFile_table(prisma, data);
  await delete_dir_from_deletedDir_table(prisma, folders);
};

export const deleteTrashItems = async (req, res) => {
  console.log(req.body.items);
  const items = req.body.items;
  const username = req.user.Username;

  try {
    for (const item of items) {
      if (item.item !== SINGLEFILE) {
        if (item?.items) {
          for (const el of item?.items) {
            try {
              const { path, limit } = el;
              const { begin, end } = limit;
              const data = getData(path, begin, end, el?.root, username);
              await prisma.$transaction(transaction(data));
            } catch (err) {
              console.error(err);
              break;
            }
          }
        } else {
          try {
            const { path, begin, end } = item;
            const data = getData(path, begin, end, item?.root, username);
            await prisma.$transaction(transaction(data));
          } catch (err) {
            console.error(err);
            break;
          }
        }
      } else {
        try {
          const devicePart = item.path.split("/")[1];
          const device = devicePart === "" ? "/" : devicePart;
          const dirParts = item.path.split("/").slice(2).join("/");
          const dir = dirParts === "" ? "/" : dirParts;
          const data = {
            dir: dir,
            username,
            filename: item.name,
            device: device,
            path: item.path,
          };

          await prisma.$transaction(deleteFileTransaction(data));

          const duplicateExist = await prisma.deletedFile.findFirst({
            where: { username, uuid: item.id },
          });
          if (duplicateExist === null) {
            console.log("deleted --single file-->", item.id);
            await deleteS3Object(username, item.id);
          }
        } catch (err) {
          console.error(err);
          break;
        }
      }
    }
    res.status(200).json({ success: true, msg: "Deleted Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: err });
  }
};

const deleteFileTransaction = (data) => async (prisma) => {
  const pathTree = create_all_possible_paths_of_a_dir(data.path);
  const folders = await get_all_possible_paths_of_a_dir(
    prisma,
    pathTree,
    data.username
  );
  console.log(folders);
  await delete_file_ver_from_deletedFileVersion_table(prisma, data);
  await delete_file_from_deletedFile_table(prisma, data);
  await delete_dir_from_deletedDir_table(prisma, folders);
};
