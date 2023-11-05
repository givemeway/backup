const FILE = "file";
const FOLDER = "folder";

const sqlExecute = async (req, res, next) => {
  try {
    // const con = req.headers.connection;
    const con = req.db;

    const [rows] = await con.execute(req.headers.query, [
      ...req.headers.queryValues,
    ]);
    req.headers.queryStatus = rows;
    req.headers.query_success = true;
  } catch (error) {
    res.status(500).json(error.message);
    res.end();
  }
};

const getFilesInDirectory = async (req, res, next) => {
  const currentdirectory = req.headers.currentdirectory;
  const username = req.headers.username;
  const devicename = req.headers.devicename;
  const backupType = req.headers.backuptype;
  //   const start = parseInt(req.headers.start);
  //   const end = parseInt(req.headers.end);
  req.headers.data = [];
  if (backupType === FOLDER) {
    if (currentdirectory === "/") {
      const filesInOtherDirectories = `SELECT directory,filename,hashvalue,last_modified,salt,iv,device,uuid,origin,versions
                                      FROM  files 
                                      WHERE 
                                      username = ?
                                      AND
                                      device = ?`;
      req.headers.query = filesInOtherDirectories;
      req.headers.queryValues = [username, devicename];
      await sqlExecute(req, res, next);
      req.headers.data.push(...req.headers.queryStatus);
    } else {
      const regex_other_files = `^${currentdirectory}(/[^/]+)+$`;
      const filesInOtherDirectories = `SELECT directory,filename,hashvalue,last_modified,salt,iv,device,uuid,origin,versions 
                                       FROM files 
                                       WHERE username = ? AND device = ? AND directory REGEXP ?`;
      req.headers.query = filesInOtherDirectories;
      req.headers.queryValues = [username, devicename, regex_other_files];
      await sqlExecute(req, res, next);
      req.headers.data.push(...req.headers.queryStatus);
      const filesInCurrentDirectory = `SELECT directory,filename,hashvalue,last_modified,salt,iv,device,uuid,origin,versions 
                                       FROM files 
                                       WHERE  username = ? AND device = ? AND directory = ?`;

      req.headers.query = filesInCurrentDirectory;
      req.headers.queryValues = [username, devicename, currentdirectory];
      await sqlExecute(req, res, next);
      req.headers.data.push(...req.headers.queryStatus);
    }
  } else {
    if (currentdirectory === "/") {
      const filesInOtherDirectories = `SELECT 
                                      directory,filename,hashvalue,last_modified,salt,iv,device,uuid,origin,versions
                                      FROM files 
                                      WHERE username = ? AND device = ?`;
      req.headers.query = filesInOtherDirectories;
      req.headers.queryValues = [username, devicename];
      await sqlExecute(req, res, next);
      req.headers.data.push(...req.headers.queryStatus);
    } else {
      const filesInFolderRoot = `SELECT directory,filename,hashvalue,last_modified,salt,iv,device,uuid,origin,versions 
                                FROM files 
                                WHERE  username = ? AND device = ? AND directory = ?`;
      req.headers.query = filesInFolderRoot;
      req.headers.queryValues = [username, devicename, currentdirectory];
      await sqlExecute(req, res, next);
      req.headers.data.push(...req.headers.queryStatus);
    }
  }
  next();
};

export { getFilesInDirectory };
