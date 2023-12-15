const FILE = "file";
const FOLDER = "folder";

const sqlExecute = (req, res, next) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const con = req.headers.connection;
      const con = req.db;

      const [rows] = await con.execute(req.headers.query, [
        ...req.headers.queryValues,
      ]);
      // req.headers.queryStatus = rows;
      // req.headers.query_success = true;
      resolve(rows);
    } catch (error) {
      console.error(error);
      // res.status(500).json(error.message);
      // res.end();
      reject(error);
    }
  });
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
        const filesInOtherDirectoriesUnion = `SELECT directory,filename,hashvalue,last_modified,salt,iv,device,uuid,origin,versions
                                              FROM  files 
                                              WHERE username = ? AND  device = ?
                                              UNION ALL
                                              SELECT directory,filename,hashvalue,last_modified,salt,iv,device,uuid,origin,versions
                                              FROM  versions.file_versions 
                                              WHERE username = ? AND  device = ?;`;
        req.headers.query = filesInOtherDirectoriesUnion;
        req.headers.queryValues = [username, devicename, username, devicename];
        const rows = await sqlExecute(req, res, next);
        req.headers.data.push(...rows);
      } else {
        const regex_other_files = `^${currentdirectory}(/[^/]+)*$`;

        const filesInOtherDirectoriesUnion = `SELECT directory,filename,hashvalue,last_modified,salt,iv,device,uuid,origin,versions 
                                              FROM files 
                                              WHERE username = ? AND device = ? AND directory REGEXP ?
                                              UNION ALL
                                              SELECT directory,filename,hashvalue,last_modified,salt,iv,device,uuid,origin,versions 
                                              FROM versions.file_versions  
                                              WHERE username = ? AND device = ? AND directory REGEXP ?;`;
        req.headers.query = filesInOtherDirectoriesUnion;
        req.headers.queryValues = [
          username,
          devicename,
          regex_other_files,
          username,
          devicename,
          regex_other_files,
        ];
        const rows = await sqlExecute(req, res, next);
        req.headers.data.push(...rows);
      }
    } else {
      if (currentdirectory === "/") {
        const filesInOtherDirectoriesUnion = `SELECT  directory,filename,hashvalue,last_modified,
                                                    salt,iv,device,uuid,origin,versions
                                              FROM files 
                                              WHERE username = ? AND device = ?
                                              UNION ALL
                                              SELECT  directory,filename,hashvalue,last_modified,
                                                    salt,iv,device,uuid,origin,versions
                                              FROM versions.file_versions 
                                              WHERE username = ? AND device = ?;`;
        req.headers.query = filesInOtherDirectoriesUnion;
        req.headers.queryValues = [username, devicename, username, devicename];
        const rows = await sqlExecute(req, res, next);
        req.headers.data.push(...rows);
      } else {
        const filesInFolderRootUnion = `SELECT directory,filename,hashvalue,last_modified,salt,iv,device,uuid,origin,versions 
                                        FROM files 
                                        WHERE  username = ? AND device = ? AND directory = ?
                                        UNION ALL
                                        SELECT directory,filename,hashvalue,last_modified,salt,iv,device,uuid,origin,versions 
                                        FROM versions.file_versions  
                                        WHERE  username = ? AND device = ? AND directory = ?;`;
        req.headers.query = filesInFolderRootUnion;
        req.headers.queryValues = [
          username,
          devicename,
          currentdirectory,
          username,
          devicename,
          currentdirectory,
        ];
        const rows = await sqlExecute(req, res, next);
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
