USE `files`;

DELIMITER //
CREATE PROCEDURE DeletePaths(IN user VARCHAR(70),REGEX VARCHAR(300))
BEGIN
  DECLARE deviceName VARCHAR(255);
  DECLARE pth VARCHAR(255);
  DECLARE done INT DEFAULT 0;
  DECLARE fileCount INT;
  DECLARE cur CURSOR FOR SELECT device,path FROM directories.directories WHERE username = user AND path REGEXP REGEX;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
  END;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  BEGIN
    OPEN cur;
    folder_loop: LOOP
      START TRANSACTION;
      FETCH cur INTO deviceName,pth;
      IF done = 1 THEN
        LEAVE folder_loop;
      END IF;
      SET @dir = SUBSTRING(pth,LOCATE('/', pth, 2) + 1,LENGTH(pth));
      SET @sanitizedDir_1 = REPLACE(@dir,"(","\\(");
      SET @sanitizedDir = REPLACE(@sanitizedDir_1,"(","\\(");
      SET @sanitizedPath_1 = REPLACE(pth,"(","\\(");
      SET @sanitizedPath = REPLACE(@sanitizedPath_1,")","\\)");
      SET @pathsRegex = CONCAT("^",@sanitizedPath,"(/[^/]+)*$");
      IF @dir = pth THEN
        SET fileCount = (SELECT COUNT(*) FROM files.files WHERE username = user AND device = deviceName);
      ELSE
        
        SET @dirFilesRegex = CONCAT("^",@sanitizedDir,"(/[^/]+)*$");
        SET fileCount = (SELECT COUNT(*) FROM files.files WHERE username = user AND device = deviceName AND directory REGEXP @dirFilesRegex);
      END IF;
      IF fileCount = 0 THEN
        DELETE FROM directories.directories WHERE username = user AND path REGEXP @pathsRegex;
        COMMIT;
      ELSE 
        SET @subFolderRegex = CONCAT("^",@sanitizedPath,"(/[^/]+)$");
        CALL DeletePaths(user,@subFolderRegex);
      END IF;
    END LOOP;  
  END;

END//
DELIMITER ;


DELIMITER //
CREATE PROCEDURE moveRootDevice(IN dst VARCHAR(255),IN src VARCHAR(255),IN username_in VARCHAR(70),IN from_device VARCHAR(255))
BEGIN
  DECLARE device_dst VARCHAR(255);
  DECLARE device_src VARCHAR(255);
  DECLARE src_rel_path VARCHAR(255);
  DECLARE dst_rel_path VARCHAR(255);
  DECLARE dir_src VARCHAR(255);
  DECLARE dir_dst VARCHAR(255);
  DECLARE done INT DEFAULT 0;
  DECLARE user VARCHAR(70);
  DECLARE dev VARCHAR(70);
  DECLARE dir VARCHAR(255);
  DECLARE uuid VARCHAR(36);
  DECLARE origin VARCHAR(36);
  DECLARE file_name VARCHAR(291);
  DECLARE last_modified DATETIME;
  DECLARE hashvalue CHAR(64);
  DECLARE enc_hashvalue CHAR(64);
  DECLARE versions INTEGER;
  DECLARE size BIGINT UNSIGNED;
  DECLARE salt VARCHAR(64);
  DECLARE iv VARCHAR(64);
  DECLARE cur CURSOR FOR SELECT * FROM files.files WHERE username = username_in AND device = from_device;
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
  END;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  IF dst = "/" THEN
    SET device_dst = SUBSTRING_INDEX(src,"/",-1);
  ELSE
    SET @device_dst_path = SUBSTRING_INDEX(dst,'/',2);
    SET device_dst = SUBSTRING(@device_dst_path,2,LENGTH(@device_dst_path));
  END IF;
  SET @device_src_path = SUBSTRING_INDEX(src,'/',2);
  SET device_src = SUBSTRING(@device_src_path,2,LENGTH(@device_src_path));
  SET @total1 = LENGTH(src) - LENGTH(REPLACE(src,"/",""));
  SET @srcRelPath =  SUBSTRING_INDEX(src,"/",@total1);
  SET @total = LENGTH(dst) - LENGTH(REPLACE(dst,"/",""));

  SET dst_rel_path = SUBSTRING_INDEX(dst,"/", -1 * (@total - 1));
  IF dst_rel_path = "" THEN
    SET dst_rel_path = "/";
  END IF;
  
  BEGIN
    OPEN cur;
    file_loop: LOOP
      FETCH cur INTO user,dev,dir,uuid,origin,file_name,last_modified,hashvalue,enc_hashvalue,versions,size,salt,iv;
      IF done = 1 THEN
        LEAVE file_loop;
      END IF;
      -- update the device and directory values
      IF dir = "/" THEN
        SET @src_current_path = CONCAT("/",device_src);
      ELSE
        SET @src_current_path = CONCAT("/",device_src,"/",dir);
      END IF;
      SET @src_folder = SUBSTRING_INDEX(src,"/",-1);
      -- IF dst = "/" THEN
      --   set @data = SUBSTRING_INDEX(@src_current_path,src, -1);
      --   SET src_rel_path = SUBSTRING(@data,2,LENGTH(@data));
      -- ELSE
      -- END IF;
      SET src_rel_path = CONCAT(@src_folder,  SUBSTRING_INDEX(@src_current_path,src, -1));
      IF src_rel_path = "" THEN
        SET src_rel_path = "/";
      END IF;
      IF dst = "/" THEN
        set @relPath = SUBSTRING_INDEX(@src_current_path,src, -1);
        SET @dst_dir = SUBSTRING(@relPath,2,LENGTH(@relPath));
        IF @dst_dir = "" THEN
          SET @dst_dir = "/";
        END IF;
      ELSE
        IF src_rel_path = "/" THEN
          SET @dst_dir = dst_rel_path;
        ELSE 
          IF dst_rel_path != "/" THEN
            SET @dst_dir = CONCAT(dst_rel_path,"/",src_rel_path);
          ELSE
            SET @dst_dir = src_rel_path;
          END IF;
        END IF;
      END IF;
      START TRANSACTION;
      INSERT IGNORE INTO files.files
      VALUES (user,device_dst,@dst_dir,uuid,origin,file_name,last_modified,
              hashvalue,enc_hashvalue,versions,size,salt,iv);
      COMMIT;
      SET @ROWCOUNT = ROW_COUNT();
      IF @ROWCOUNT = 1 THEN
          CALL InsertPathsInDirectoryTable(src_rel_path,dst,@srcRelPath,username_in,from_device,device_dst);
          START TRANSACTION;
          DELETE FROM files.files 
          WHERE username = username_in AND filename = file_name AND directory = dir and device = dev;
          COMMIT;
      END IF;
      START TRANSACTION;
      INSERT IGNORE INTO versions.file_versions 
      SELECT username,device,directory,uuid,origin,filename,last_modified,
             hashvalue,enc_hashvalue,versions,size,salt,iv 
      FROM versions.file_versions
      WHERE directory = @dst_dir AND device = device_dst AND username = username_in AND filename = file_name;
      COMMIT;
      SET @ROWCOUNT = ROW_COUNT();
      IF @ROWCOUNT = 1 THEN 
        START TRANSACTION;
        DELETE FROM versions.file_versions
        WHERE username = username_in AND filename = file_name AND directory = dir and device = dev;
        COMMIT;
      END IF;
    END LOOP;
    CLOSE cur;
    CALL DeletePaths(username_in,CONCAT("^",src,"(/?([^/]+))?$"));
  END;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE moveFolder(IN dst VARCHAR(255),IN src VARCHAR(255),IN username_in VARCHAR(70),IN from_device VARCHAR(255),IN regex VARCHAR(300))
BEGIN
  DECLARE device_dst VARCHAR(255);
  DECLARE device_src VARCHAR(255);
  DECLARE src_rel_path VARCHAR(255);
  DECLARE dst_rel_path VARCHAR(255);
  DECLARE dir_src VARCHAR(255);
  DECLARE dir_dst VARCHAR(255);
  DECLARE done INT DEFAULT 0;
  DECLARE user VARCHAR(70);
  DECLARE dev VARCHAR(70);
  DECLARE dir VARCHAR(255);
  DECLARE uuid VARCHAR(36);
  DECLARE origin VARCHAR(36);
  DECLARE file_name VARCHAR(291);
  DECLARE last_modified DATETIME;
  DECLARE hashvalue CHAR(64);
  DECLARE enc_hashvalue CHAR(64);
  DECLARE versions INTEGER;
  DECLARE size BIGINT UNSIGNED;
  DECLARE salt VARCHAR(64);
  DECLARE iv VARCHAR(64);
  DECLARE cur CURSOR FOR SELECT * FROM files.files WHERE username = username_in AND device = from_device AND directory REGEXP regex;
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
  END;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  IF dst = "/" THEN
    SET device_dst = SUBSTRING_INDEX(src,"/",-1);
  ELSE
    SET @device_dst_path = SUBSTRING_INDEX(dst,'/',2);
    SET device_dst = SUBSTRING(@device_dst_path,2,LENGTH(@device_dst_path));
  END IF;
  SET @device_src_path = SUBSTRING_INDEX(src,'/',2);
  SET device_src = SUBSTRING(@device_src_path,2,LENGTH(@device_src_path));
  SET @total1 = LENGTH(src) - LENGTH(REPLACE(src,"/",""));
  SET @srcRelPath =  SUBSTRING_INDEX(src,"/",@total1);
  SET @total = LENGTH(dst) - LENGTH(REPLACE(dst,"/",""));

  SET dst_rel_path = SUBSTRING_INDEX(dst,"/", -1 * (@total - 1));
  IF dst_rel_path = "" THEN
    SET dst_rel_path = "/";
  END IF;
  
  BEGIN
    OPEN cur;
    file_loop: LOOP
      FETCH cur INTO user,dev,dir,uuid,origin,file_name,last_modified,hashvalue,enc_hashvalue,versions,size,salt,iv;
      IF done = 1 THEN
        LEAVE file_loop;
      END IF;
      -- update the device and directory values
      IF dir = "/" THEN
        SET @src_current_path = CONCAT("/",device_src);
      ELSE
        SET @src_current_path = CONCAT("/",device_src,"/",dir);
      END IF;
      SET @src_folder = SUBSTRING_INDEX(src,"/",-1);
      -- IF dst = "/" THEN
      --   set @data = SUBSTRING_INDEX(@src_current_path,src, -1);
      --   SET src_rel_path = SUBSTRING(@data,2,LENGTH(@data));
      -- ELSE
      -- END IF;
      SET src_rel_path = CONCAT(@src_folder,  SUBSTRING_INDEX(@src_current_path,src, -1));
      IF src_rel_path = "" THEN
        SET src_rel_path = "/";
      END IF;
      IF dst = "/" THEN
        set @relPath = SUBSTRING_INDEX(@src_current_path,src, -1);
        SET @dst_dir = SUBSTRING(@relPath,2,LENGTH(@relPath));
        IF @dst_dir = "" THEN
          SET @dst_dir = "/";
        END IF;
      ELSE
        IF src_rel_path = "/" THEN
          SET @dst_dir = dst_rel_path;
        ELSE 
          IF dst_rel_path != "/" THEN
            SET @dst_dir = CONCAT(dst_rel_path,"/",src_rel_path);
          ELSE
            SET @dst_dir = src_rel_path;
          END IF;
        END IF;
      END IF;
      START TRANSACTION;
      INSERT IGNORE INTO files.files
      VALUES (user,device_dst,@dst_dir,uuid,origin,file_name,last_modified,
              hashvalue,enc_hashvalue,versions,size,salt,iv);
      COMMIT;
      SET @ROWCOUNT = ROW_COUNT();
      IF @ROWCOUNT = 1 THEN
          CALL InsertPathsInDirectoryTable(src_rel_path,dst,@srcRelPath,username_in,from_device,device_dst);
          START TRANSACTION;
          DELETE FROM files.files 
          WHERE username = username_in AND filename = file_name AND directory = dir and device = dev;
          COMMIT;
      END IF;
      START TRANSACTION;
      INSERT IGNORE INTO versions.file_versions 
      SELECT username,device,directory,uuid,origin,filename,last_modified,
             hashvalue,enc_hashvalue,versions,size,salt,iv 
      FROM versions.file_versions
      WHERE directory = @dst_dir AND device = device_dst AND username = username_in AND filename = file_name;
      COMMIT;
      SET @ROWCOUNT = ROW_COUNT();
      IF @ROWCOUNT = 1 THEN
        START TRANSACTION;
        DELETE FROM versions.file_versions
        WHERE username = username_in AND filename = file_name AND directory = dir and device = dev;
        COMMIT;
      END IF;
    END LOOP;
    CLOSE cur;
    CALL DeletePaths(username_in,CONCAT("^",src,"(/?([^/]+))?$"));
  END;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE InsertPathsInDirectoryTable(IN relative_directory VARCHAR(255),
                                             IN dstPath VARCHAR(255),
                                             IN srcPath VARCHAR(255),
                                             IN username_in VARCHAR(255), 
                                             IN device_src VARCHAR(255),
                                             IN device_dst VARCHAR(255))
BEGIN
  DECLARE pathParts VARCHAR(255);
  DECLARE dir VARCHAR(255);
  DECLARE pos INT DEFAULT 1;
  DECLARE total INT;
  DECLARE rows_count INT;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
  END;

  START TRANSACTION;

  SET total = LENGTH(relative_directory) - LENGTH(REPLACE(relative_directory, '/', '')) + 1;
  IF relative_directory = "/" THEN
    SET total = total - 1;
  END IF;
  -- numpy/core 
  
  -- /LAPTOP/C/Users/Sandeep/Desktop/numpy - core,data,etc subfolders
  -- /DESKTOP/C/Users/Deetya/Documents/numpy - core,data,etc subfolders

  -- dstPath - /DESKTOP/C/Users/Deetya/Documents/numpy
  -- srcPath - /LAPTOP/C/Users/Sandeep/Desktop/numpy

  WHILE pos <= total DO
    SET pathParts = SUBSTRING_INDEX(relative_directory,"/",pos);
    -- numpy ==> numpy/core 
    IF pathParts = "" THEN
      SET @current_src_path = srcPath; -- /LAPTOP/C/Users/Sandeep/Desktop
      IF dstPath = "/" THEN
        SET @current_dst_path = CONCAT("/",device_dst);
      ELSE
        SET @current_dst_path = dstPath; -- /DESKTOP/C/Users/Deetya/Documents
      END IF;
    ELSE 
      SET @current_src_path = CONCAT(srcPath,"/",pathParts);
      IF dstPath = "/" THEN
        SET @current_dst_path = CONCAT("/",pathParts);
      ELSE
        SET @current_dst_path = CONCAT(dstPath,"/",pathParts);
      END IF;
    END IF;

    INSERT IGNORE INTO directories.directories
    SELECT uuid, username, device_dst, folder, @current_dst_path, created_at
    FROM directories.directories
    WHERE username = username_in AND device = device_src AND path = @current_src_path;
    SET pos = pos + 1;
  END WHILE;

  COMMIT;

END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE InsertPaths(IN inputPath VARCHAR(255), IN username_in VARCHAR(255), IN device_in VARCHAR(255))
BEGIN
  DECLARE pathParts VARCHAR(255);
  DECLARE dir VARCHAR(255);
  DECLARE pos INT DEFAULT 2;
  DECLARE total INT;
  DECLARE rows_count INT;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    -- An error has occurred, rollback the transaction
    ROLLBACK;
  END;

  -- Start a new transaction
  START TRANSACTION;

  -- Calculate the total number of "/" characters in inputPath
  SET total = LENGTH(inputPath) - LENGTH(REPLACE(inputPath, '/', ''));
  
  -- Loop as long as there are more "/" characters in inputPath and pos does not exceed the total number of "/" characters
  WHILE pos <= total + 1 DO
    SET pathParts = SUBSTRING_INDEX(inputPath,"/",pos);

    INSERT IGNORE INTO directories.directories
    SELECT uuid, username_in, device_in, folder, pathParts, created_at
    FROM deleted_directories.directories
    WHERE username = username AND device = device AND path = pathParts;

    SET pos = pos + 1;
    -- If no errors, commit the transaction
  END WHILE;

  COMMIT;

END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE restoreFileFromTrash(IN username_in VARCHAR(70),IN device_in VARCHAR(255),IN directory_in VARCHAR(255),IN filename_in VARCHAR(255))
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
  END;
  INSERT INTO files.files 
    SELECT username,device,directory,uuid,origin,filename,last_modified,hashvalue,enc_hashvalue,versions,size,salt,iv 
    FROM deleted_files.files 
    WHERE username = username_in AND device = device_in AND directory = directory_in AND filename = filename_in;

  IF ROW_COUNT() > 0 THEN
    SET @path = CONCAT("/",device_in,"/",directory_in);
    CALL InsertPaths(@path,username_in,device_in);
    DELETE FROM deleted_files.files WHERE username = username_in AND device = device_in AND directory = directory_in AND filename = filename_in;
    -- CALL DeletePaths(username_in,"^(/[^/]+)$");
  END IF;
END//
DELIMITER ;

USE `directories`;

DELIMITER //
CREATE PROCEDURE putBackFilesFromTrash2(IN username_ori VARCHAR(70),IN device_ori VARCHAR(255),IN dir VARCHAR(300),IN begin INT, IN end INT)
BEGIN
    -- fetch the files based on username, device, directory and limit criteria
    -- create a cursor and loop through the rows
    -- For each row Insert the file into files.files table
    -- For each row Insert the directory into directories.directories
    -- For each row delete the file from deleted_files.files table
    -- After each deletion check the file count in the deleted_files.files table for corresponding directory
    -- if the file count for the corresponding directory is 0 delete the corresponding directory( folder & path) 
    -- from the deleted_directories.directories
    -- repeat the operation until it is complete.
    -- roll back if there are any errors
  DECLARE username1 VARCHAR(70);
	DECLARE device1 VARCHAR(70); 
	DECLARE directory1 VARCHAR(255);
	DECLARE uuid1 VARCHAR(36);
	DECLARE origin1 VARCHAR(36); 
	DECLARE filename1 VARCHAR(291); 
	DECLARE last_modified1 DATETIME; 
	DECLARE hashvalue1 VARCHAR(64); 
	DECLARE enc_hashvalue1 VARCHAR(64); 
	DECLARE versions1 INT; 
	DECLARE size1 BIGINT UNSIGNED; 
	DECLARE salt1 VARCHAR(64);
	DECLARE iv1 VARCHAR(64);
	DECLARE done INT DEFAULT 0;
  DECLARE REGEX2 VARCHAR(300);
  DECLARE subFolderExp VARCHAR(10) DEFAULT "(/[^/]+)$";
  DECLARE pth VARCHAR(255);
	DECLARE cur CURSOR FOR SELECT username,device,directory,uuid,origin,filename,last_modified,hashvalue,enc_hashvalue,versions,size,salt,iv 
						  FROM deleted_files.files WHERE username = username_ori AND device = device_ori AND directory = dir
						  ORDER BY directory LIMIT begin,end;
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
	  ROLLBACK;
	END;
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
  CREATE TEMPORARY TABLE IF NOT EXISTS PathsVisited (
    visitedPath VARCHAR(300)
  );
  BEGIN
    OPEN cur;
    read_loop: LOOP 
      FETCH cur INTO username1, device1, directory1, uuid1, origin1, filename1, last_modified1, hashvalue1, enc_hashvalue1, versions1, size1, salt1, iv1;
      IF done = 1 THEN
        LEAVE read_loop;
      END IF;
      START TRANSACTION;
      SET pth = CONCAT("/",device_ori,"/",directory1);
      SET @sanitizedPath_1 = REPLACE(pth,"(","\\(");
      SET @sanitizedPath = REPLACE(@sanitizedPath_1,")","\\)");
      SET REGEX2 = CONCAT("^",@sanitizedPath,subFolderExp);
      -- put files from trash table to files table
      INSERT INTO files.files (username,device,directory,uuid,origin,filename,last_modified,hashvalue,enc_hashvalue,versions,size,salt,iv )
      VALUES(username1, device1, directory1, uuid1, origin1, filename1, last_modified1, hashvalue1, enc_hashvalue1, versions1, size1, salt1, iv1);
      -- insert path into the directories.directories table
      SET @visitedPath = (SELECT 1 FROM PathsVisited WHERE visitedPath = pth LIMIT 1);
      IF @visitedPath IS NULL THEN
        CALL InsertPaths(pth, username1,device1);
      END IF;
      -- delete file from trash table
      DELETE FROM deleted_files.files 
      WHERE username = username1 AND device = device1 AND directory = directory1 AND filename = filename1;
      COMMIT;
    END LOOP;
    CLOSE cur;
    DROP TEMPORARY TABLE IF EXISTS PathsVisited;
    -- CALL DeletePaths(username_ori,"^(/[^/]+)$");
  END;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE putBackFilesFromTrash(IN username_ori VARCHAR(70),IN device_ori VARCHAR(255),IN REGEX VARCHAR(300),IN begin INT, IN end INT)
BEGIN
    -- fetch the files based on username, device, directory and limit criteria
    -- create a cursor and loop through the rows
    -- For each row Insert the file into files.files table
    -- For each row Insert the directory into directories.directories
    -- For each row delete the file from deleted_files.files table
    -- After each deletion check the file count in the deleted_files.files table for corresponding directory
    -- if the file count for the corresponding directory is 0 delete the corresponding directory( folder & path) 
    -- from the deleted_directories.directories
    -- repeat the operation until it is complete.
    -- roll back if there are any errors
  DECLARE username1 VARCHAR(70);
	DECLARE device1 VARCHAR(70); 
	DECLARE directory1 VARCHAR(255);
	DECLARE uuid1 VARCHAR(36);
	DECLARE origin1 VARCHAR(36); 
	DECLARE filename1 VARCHAR(291); 
	DECLARE last_modified1 DATETIME; 
	DECLARE hashvalue1 VARCHAR(64); 
	DECLARE enc_hashvalue1 VARCHAR(64); 
	DECLARE versions1 INT; 
	DECLARE size1 BIGINT UNSIGNED; 
	DECLARE salt1 VARCHAR(64);
	DECLARE iv1 VARCHAR(64);
	DECLARE done INT DEFAULT 0;
  DECLARE pth VARCHAR(255);
  DECLARE REGEX2 VARCHAR(300);
  DECLARE subFolderExp VARCHAR(10) DEFAULT "(/[^/]+)$";
	DECLARE cur CURSOR FOR SELECT username,device,directory,uuid,origin,filename,last_modified,hashvalue,enc_hashvalue,versions,size,salt,iv 
						  FROM deleted_files.files WHERE username = username_ori AND device = device_ori AND directory REGEXP REGEX 
						  ORDER BY directory LIMIT begin,end; 
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
	  ROLLBACK;
	END;
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
  CREATE TEMPORARY TABLE IF NOT EXISTS PathsVisited (
    visitedPath VARCHAR(300)
  );
  OPEN cur;
  read_loop: LOOP 
    FETCH cur INTO username1, device1, directory1, uuid1, origin1, filename1, last_modified1, hashvalue1, enc_hashvalue1, versions1, size1, salt1, iv1;
    IF done = 1 THEN
      LEAVE read_loop;
    END IF;
    START TRANSACTION;
    SET pth = CONCAT("/",device_ori,"/",directory1);
    SET @sanitizedPath_1 = REPLACE(pth,"(","\\(");
    SET @sanitizedPath = REPLACE(@sanitizedPath_1,")","\\)");
    SET REGEX2 = CONCAT("^",@sanitizedPath,subFolderExp);
    -- put files from trash table to files table
    INSERT INTO files.files (username,device,directory,uuid,origin,filename,last_modified,hashvalue,enc_hashvalue,versions,size,salt,iv )
    VALUES(username1, device1, directory1, uuid1, origin1, filename1, last_modified1, hashvalue1, enc_hashvalue1, versions1, size1, salt1, iv1);
    -- insert path into the directories.directories table
    SET @visitedPath = (SELECT 1 FROM PathsVisited WHERE visitedPath = pth LIMIT 1);
    IF @visitedPath IS NULL THEN
      CALL InsertPaths(pth, username1,device1);
    END IF;
    -- delete file from trash table
    DELETE FROM deleted_files.files 
    WHERE username = username1 AND device = device1 AND directory = directory1 AND filename = filename1;
    COMMIT; 

  END LOOP;
  CLOSE cur;
  DROP TEMPORARY TABLE IF EXISTS PathsVisited;
  -- CALL DeletePaths(username_ori,"^(/[^/]+)$");

END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE DeletePaths(IN user VARCHAR(70),REGEX VARCHAR(300))
BEGIN
  DECLARE deviceName VARCHAR(255);
  DECLARE pth VARCHAR(255);
  DECLARE done INT DEFAULT 0;
  DECLARE fileCount INT;
  DECLARE cur CURSOR FOR SELECT device,path FROM deleted_directories.directories WHERE username = user AND path REGEXP REGEX;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
  END;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  BEGIN
    OPEN cur;
    folder_loop: LOOP
      START TRANSACTION;
      FETCH cur INTO deviceName,pth;
      IF done = 1 THEN
        LEAVE folder_loop;
      END IF;
      SET @dir = SUBSTRING(pth,LOCATE('/', pth, 2) + 1,LENGTH(pth));
      SET @sanitizedDir_1 = REPLACE(@dir,"(","\\(");
      SET @sanitizedDir = REPLACE(@sanitizedDir_1,"(","\\(");
      SET @sanitizedPath_1 = REPLACE(pth,"(","\\(");
      SET @sanitizedPath = REPLACE(@sanitizedPath_1,")","\\)");
      SET @pathsRegex = CONCAT("^",@sanitizedPath,"(/[^/]+)*$");
      IF @dir = pth THEN
        SET fileCount = (SELECT COUNT(*) FROM deleted_files.files WHERE username = user AND device = deviceName);
      ELSE
        
        SET @dirFilesRegex = CONCAT("^",@sanitizedDir,"(/[^/]+)*$");
        SET fileCount = (SELECT COUNT(*) FROM deleted_files.files WHERE username = user AND device = deviceName AND directory REGEXP @dirFilesRegex);
      END IF;
      IF fileCount = 0 THEN
        DELETE FROM deleted_directories.directories WHERE username = user AND path REGEXP @pathsRegex;
        COMMIT;
      ELSE 
        SET @subFolderRegex = CONCAT("^",@sanitizedPath,"(/[^/]+)$");
        CALL DeletePaths(user,@subFolderRegex);
      END IF;
    END LOOP;  
  END;

END//
DELIMITER ;


DELIMITER //
CREATE PROCEDURE InsertPaths(IN inputPath VARCHAR(255), IN username VARCHAR(255), IN device VARCHAR(255))
BEGIN
  DECLARE pathParts VARCHAR(255);
  DECLARE dir VARCHAR(255);
  DECLARE pos INT DEFAULT 2;
  DECLARE total INT;
  DECLARE rows_count INT;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    -- An error has occurred, rollback the transaction
    ROLLBACK;
  END;

  -- Start a new transaction
  START TRANSACTION;

  -- Calculate the total number of "/" characters in inputPath
  SET total = LENGTH(inputPath) - LENGTH(REPLACE(inputPath, '/', ''));
  
  -- Loop as long as there are more "/" characters in inputPath and pos does not exceed the total number of "/" characters
  WHILE pos <= total + 1 DO
    SET pathParts = SUBSTRING_INDEX(inputPath,"/",pos);

    INSERT IGNORE INTO directories.directories
    SELECT uuid, username, device, folder, path, created_at
    FROM deleted_directories.directories
    WHERE username = username AND device = device AND path = pathParts;

    SET pos = pos + 1;
    -- If no errors, commit the transaction
  END WHILE;

  COMMIT;

END//
DELIMITER ;