import { prisma, Prisma } from "../config/prismaDBConfig.js";

export const insert_file_version = async (data) => {
  const {
    filename,
    device,
    username,
    directory,
    origin,
    insertData,
    updateData,
  } = data;

  const file = await prisma.file.findUnique({
    where: { origin, username },
  });

  const fileVersionData = {
    username: file.username,
    salt: file.salt,
    iv: file.iv,
    uuid: file.uuid,
    last_modified: file.last_modified,
    size: file.size,
    hashvalue: file.hashvalue,
    enc_hashvalue: file.enc_hashvalue,
    versions: file.versions,
    filename: file.filename,
    directory: file.directory,
    device: file.device,
  };
  console.log("fileVersionData-->", fileVersionData);
  console.log("insertData-->", insertData);
  console.log("updateData-->", updateData);

  await prisma.$transaction([
    prisma.file.update({
      where: {
        username_device_directory_filename: {
          filename,
          device,
          username,
          directory,
        },
      },
      data: {
        ...updateData,
        directoryID: {
          connect: {
            uuid: file.dirID,
          },
        },
      },
    }),
    prisma.fileVersion.create({
      data: {
        ...fileVersionData,
        LatestFile: {
          connect: {
            origin: file.origin,
          },
        },
      },
    }),
  ]);
};
