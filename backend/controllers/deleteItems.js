import { prisma, Prisma } from "../config/prismaDBConfig.js";

const insertIntoDeletedDirectory = async (prisma, data) => {
  const { rel_path, rel_name, path, device, username, directory } = data;
  if (directory === "/") {
    await prisma.$executeRaw(Prisma.sql`
            INSERT INTO public."DeletedDirectory"
            (uuid,username,device,folder,path,created_at,deleted,rel_path,rel_name)
            SELECT uuid,username,device,folder,path,created_at,CURRENT_TIMESTAMP,${rel_path},${rel_name}
            FROM public."Directory"
            WHERE username = ${username}
            AND device = ${device}
            ON CONFLICT (username,device,folder,path)
            DO UPDATE SET deletion_type = 'folder', 
            rel_path = ${rel_path},
            rel_name = ${rel_name};`);
  } else {
    const regex_path = `^${path}(/[^/]+)*$`;
    await prisma.$executeRaw(Prisma.sql`
        INSERT INTO public."DeletedDirectory"
        (uuid,username,device,folder,path,created_at,deleted,rel_path,rel_name)
        SELECT uuid,username,device,folder,path,created_at,CURRENT_TIMESTAMP,${rel_path},${rel_name}
        FROM public."Directory"
        WHERE username = ${username}
        AND device = ${device}
        AND path ~ ${regex_path}
        ON CONFLICT (username,device,folder,path)
        DO UPDATE SET deletion_type = 'folder', 
        rel_path = ${rel_path},
        rel_name = ${rel_name};`);
  }
};

const insertIntoDeletedFile = async (prisma, data) => {
  const { deletion_type, device, username, directory } = data;
  if (directory === "/") {
    await prisma.$executeRaw(Prisma.sql`
    INSERT INTO public."DeletedFile"
    (username,device,directory,uuid,origin,filename,last_modified,
      hashvalue,enc_hashvalue,versions,size,salt,iv,deletion_date,
      deletion_type,"dirID")
    SELECT username,device,directory,uuid,origin,filename,last_modified,hashvalue,
    enc_hashvalue,versions,size,salt,iv,CURRENT_TIMESTAMP,${deletion_type},"dirID"
    FROM public."File"
    WHERE 
    username = ${username} AND 
    device = ${device};`);
  } else {
    const regex_dir = `^${directory}(/[^/]+)*$`;

    await prisma.$executeRaw(Prisma.sql`
    INSERT INTO public."DeletedFile"
    (username,device,directory,uuid,origin,filename,last_modified,
      hashvalue,enc_hashvalue,versions,size,salt,iv,deletion_date,
      deletion_type,"dirID")
    SELECT username,device,directory,uuid,origin,filename,
    last_modified,hashvalue,enc_hashvalue,versions,size,salt,iv,CURRENT_TIMESTAMP,
    ${deletion_type},"dirID"
      FROM public."File"
      WHERE username = ${username}
      AND device =  ${device}
      AND directory ~ ${regex_dir};`);
  }
};

const insertIntoDeletedFileVersion = async (prisma, data) => {
  const { deletion_type, device, username, directory } = data;
  console.log({ deletion_type, device, username, directory });
  if (directory === "/") {
    console.log("-----------------inside directory--------------------");
    const affected = await prisma.$executeRaw(Prisma.sql`
        INSERT INTO public."DeletedFileVersion"
        (username,device,directory,uuid,origin,filename,last_modified,
          hashvalue,enc_hashvalue,versions,size,salt,iv,deletion_date,
          deletion_type)
        SELECT username,device,directory,uuid,origin,filename,last_modified,
        hashvalue,enc_hashvalue,versions,size,salt,iv,CURRENT_TIMESTAMP,${deletion_type}
        FROM public."FileVersion"
        WHERE 
        username = ${username} AND 
        device = ${device};`);
    console.log(affected);
    console.log("-----------------inside directory--------------------");
  } else {
    console.log("-----------------outside directory--------------------");

    const regex_dir = `^${directory}(/[^/]+)*$`;
    console.log(regex_dir);
    const affected = await prisma.$executeRaw(Prisma.sql`
        INSERT INTO public."DeletedFileVersion"
        (username,device,directory,uuid,origin,filename,last_modified,
          hashvalue,enc_hashvalue,versions,size,salt,iv,deletion_date,
          deletion_type)
        SELECT username,device,directory,uuid,origin,filename,
        last_modified,hashvalue,enc_hashvalue,versions,size,salt,iv,CURRENT_TIMESTAMP,
        ${deletion_type}
          FROM public."FileVersion"
          WHERE username = ${username}
          AND device =  ${device}
          AND directory ~ ${regex_dir};`);
    console.log(affected);
    console.log("-----------------outside directory--------------------");
  }
};

const deleteFromDirectory = async (prisma, data) => {
  const { path, device, username, directory } = data;
  if (directory === "/") {
    await prisma.directory.deleteMany({
      where: {
        username,
        device,
      },
    });
  } else {
    const regex_path = `^${path}(/[^/]+)*$`;
    await prisma.$executeRaw(Prisma.sql`
      DELETE FROM public."Directory"
       WHERE username = ${username}
        AND device = ${device}
        AND path ~ ${regex_path};`);
  }
};

const deleteFromFile = async (prisma, data) => {
  const { device, username, directory } = data;
  if (directory === "/") {
    await prisma.file.deleteMany({
      where: {
        username,
        device,
      },
    });
  } else {
    const regex_dir = `^${directory}(/[^/]+)*$`;
    await prisma.$executeRaw(Prisma.sql`
    DELETE FROM public."File"
     WHERE username = ${username}
      AND device = ${device}
      AND directory ~ ${regex_dir};`);
  }
};

const deleteFromFileVersion = async (prisma, data) => {
  const { device, username, directory } = data;

  if (directory === "/") {
    await prisma.fileVersion.deleteMany({
      where: {
        username,
        device,
      },
    });
  } else {
    const regex_dir = `^${directory}(/[^/]+)*$`;
    await prisma.$executeRaw(Prisma.sql`
       DELETE FROM public."FileVersion"
       WHERE username = ${username}
        AND device = ${device}
        AND directory ~ ${regex_dir};`);
  }
};

const transactionFn = (data) => async (prisma) => {
  await insertIntoDeletedDirectory(prisma, data);
  await insertIntoDeletedFile(prisma, data);
  await insertIntoDeletedFileVersion(prisma, data);
  await deleteFromFileVersion(prisma, data);
  await deleteFromFile(prisma, data);
  await deleteFromDirectory(prisma, data);
};

const deleteFolder = async (data) => {
  await prisma.$transaction(transactionFn(data));
};

const insertFileDirectoryIntoDeletedDirectory = async (prisma, data) => {
  const { username, device, path, name } = data;
  console.log("=======insert directdory =============");
  console.log({ username, device, path, name });

  const affected = await prisma.$executeRaw(Prisma.sql`
            INSERT INTO public."DeletedDirectory"
                (uuid,username,device,folder,path,created_at,deleted,rel_path,rel_name,deletion_type)
            SELECT uuid,username,device,folder,path,created_at,
            CURRENT_TIMESTAMP,${path},${name},'file'
            FROM public."Directory"
            WHERE username = ${username}
            AND device = ${device}
            AND path = ${path}
            ON CONFLICT DO NOTHING;`);
  console.log(affected);
  console.log("=======insert directory =============");
};

const insertRowIntoDeletedFile = async (prisma, data) => {
  const { deletion_type, username, device, name, dir } = data;
  console.log("+++++++++++ insert file into delete ++++++++++++++");
  console.log({ deletion_type, username, device, name, dir });
  const affected = await prisma.$executeRaw(Prisma.sql`
    INSERT INTO public."DeletedFile"
        (username,device,directory,uuid,origin,filename,last_modified,
        hashvalue,enc_hashvalue,versions,size,salt,iv,deletion_date,
        deletion_type,"dirID")
    SELECT username,device,directory,uuid,origin,filename,
        last_modified,hashvalue,enc_hashvalue,versions,size,salt,iv,CURRENT_TIMESTAMP,
        ${deletion_type},"dirID"
    FROM public."File"
    WHERE username = ${username}
    AND device =  ${device}
    AND directory = ${dir} 
    AND filename = ${name};`);
  console.log(affected, " affected");
  console.log("+++++++++++ insert file into delete ++++++++++++++");
};

const insertRowIntoDeletedFileVersion = async (prisma, data) => {
  const { deletion_type, username, device, name, dir } = data;
  console.log("+++++++++++ insert file into delete version ++++++++++++++");
  console.log({ deletion_type, username, device, name, dir });
  const affected = await prisma.$executeRaw(Prisma.sql`
    INSERT INTO public."DeletedFileVersion"
        (username,device,directory,uuid,origin,filename,last_modified,
        hashvalue,enc_hashvalue,versions,size,salt,iv,deletion_date,
        deletion_type)
    SELECT username,device,directory,uuid,origin,filename,last_modified,
        hashvalue,enc_hashvalue,versions,size,salt,iv,CURRENT_TIMESTAMP,
        ${deletion_type}
    FROM public."FileVersion"
    WHERE username = ${username}
    AND device =  ${device}
    AND directory = ${dir} 
    AND filename = ${name};`);
  console.log(affected, " affected");
  console.log("+++++++++++ insert file into delete version ++++++++++++++");
};

const deleteRowFromFile = async (prisma, data) => {
  const { username, dir, device, name } = data;
  console.log("+++++++++++ delete file from  file ++++++++++++++");
  console.log({ username, dir, device, name });

  const affected = await prisma.$executeRaw(Prisma.sql`
    DELETE FROM public."File"
    WHERE username = ${username}
    AND filename = ${name}
    AND directory = ${dir}
    AND device = ${device};`);
  console.log(affected, " affected");
  console.log("+++++++++++ delete file from  file ++++++++++++++");
};

const deleteRowFromFileVersion = async (prisma, data) => {
  const { username, dir, device, name } = data;
  console.log("+++++++++++ delete file from  version ++++++++++++++");
  console.log({ username, dir, device, name });
  const affected = await prisma.$executeRaw(Prisma.sql`
      DELETE FROM public."FileVersion"
      WHERE username = ${username}
      AND filename = ${name}
      AND directory = ${dir}
      AND device = ${device};`);
  console.log(affected, " affected");
  console.log("+++++++++++ delete file from  version ++++++++++++++");
};

const fileTransactionFn = (data) => async (prisma) => {
  const fileData = { ...data };
  fileData["deletion_type"] = "file";
  console.log(fileData);
  await insertFileDirectoryIntoDeletedDirectory(prisma, fileData);
  await insertRowIntoDeletedFile(prisma, fileData);
  await insertRowIntoDeletedFileVersion(prisma, fileData);
  await deleteRowFromFileVersion(prisma, fileData);
  await deleteRowFromFile(prisma, fileData);
};

const deleteFile = async (data) => {
  await prisma.$transaction(fileTransactionFn(data));
};

export const deleteItems = async (req, res) => {
  const username = req.user.Username;
  const directories = req.folders;
  const files = req.files;
  for (const file of files) {
    try {
      file["username"] = username;
      console.log(
        "+++++++++++ inside individual file delete++++++++++++++++++++++"
      );
      console.log(file);
      console.log(
        "+++++++++++ inside individual file delete++++++++++++++++++++++"
      );

      await deleteFile(file);
    } catch (err) {
      console.error(err);
    }
  }

  for (const directory of directories) {
    try {
      const data = {
        rel_path: directory.path,
        rel_name: directory.name,
        deletion_type: `folder`,
        path: directory.path,
        directory: directory.dir,
        device: directory.device,
        username,
      };
      await deleteFolder(data);
    } catch (err) {
      console.log(err);
    }
  }
  res.status(200).json({ success: true, msg: "success" });
};
