DROP DATABASE IF EXISTS `files`;
CREATE DATABASE `files`;
USE `files`;
SET NAMES utf8;
SET character_set_client = utf8mb4;

CREATE TABLE `files`(
    `username` VARCHAR(70) NOT NULL,
    `device` VARCHAR(70) NOT NULL,
    `directory` VARCHAR(255) NOT NULL,
    `uuid` VARCHAR(36) NOT NULL,
    `origin` VARCHAR(36) NOT NULL,
    `filename` VARCHAR(291) NOT NULL,
    `last_modified` DATETIME NOT NULL,
    `hashvalue` CHAR(64) NOT NULL,
    `enc_hashvalue` CHAR(64) NOT NULL,
    `versions` INTEGER NOT NULL,
    `size` BIGINT UNSIGNED NOT NULL,
    `salt` VARCHAR(64) NOT NULL,
    `iv` VARCHAR(64) NOT NULL,
    UNIQUE(`username`,`device`,`directory`,`filename`),
    FOREIGN KEY (`username`) REFERENCES customers.users(`username`)
);
CREATE INDEX device_index ON files(device);
CREATE INDEX directory_index ON files(directory);
ALTER TABLE files ADD FULLTEXT(filename); 

DROP DATABASE IF EXISTS `directories`;
CREATE DATABASE `directories`;
USE `directories`;
SET NAMES utf8;
SET character_set_client = utf8mb4;

CREATE TABLE `directories`(
    `uuid` VARCHAR(36) NOT NULL,
    `username` VARCHAR(70) NOT NULL,
    `device` VARCHAR(70) NOT NULL,
    `folder` VARCHAR(255) NOT NULL,
    `path` VARCHAR(255) NOT NULL,
    `created_at` DATETIME NOT NULL,
     UNIQUE(`username`,`device`,`folder`,`path`),
     FOREIGN KEY (`username`) REFERENCES customers.users(`username`)
);

CREATE INDEX path_index ON directories(path);
ALTER TABLE directories ADD FULLTEXT(folder); 


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
  DECLARE pth VARCHAR(255);
  
	DECLARE cur CURSOR FOR SELECT username,device,directory,uuid,origin,filename,last_modified,hashvalue,enc_hashvalue,versions,size,salt,iv 
						  FROM deleted_files.files WHERE username = username_ori AND device = device_ori AND directory = dir
						  ORDER BY directory LIMIT begin,end;
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
	  ROLLBACK;
	END;
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
  CREATE TEMPORARY TABLE temp_paths(path VARCHAR(255) NOT NULL);
  START TRANSACTION;
  BEGIN
    OPEN cur;
    read_loop: LOOP 
      FETCH cur INTO username1, device1, directory1, uuid1, origin1, filename1, last_modified1, hashvalue1, enc_hashvalue1, versions1, size1, salt1, iv1;
      IF done = 1 THEN
        LEAVE read_loop;
      END IF;
      SET pth = CONCAT("/",device_ori,"/",directory1);
      -- put files from trash table to files table
      INSERT INTO files.files (username,device,directory,uuid,origin,filename,last_modified,hashvalue,enc_hashvalue,versions,size,salt,iv )
      VALUES(username1, device1, directory1, uuid1, origin1, filename1, last_modified1, hashvalue1, enc_hashvalue1, versions1, size1, salt1, iv1);
      -- insert path into the directories.directories table
      IF NOT EXISTS( SELECT 1 FROM TEMPORARY.temp_paths WHERE path = pth) THEN
        INSERT INTO TEMPORARY.temp_paths (path) VALUES(pth);
        CALL InsertPaths(pth, username1,device1);
      END IF;
      -- delete file from trash table
      DELETE FROM deleted_files.files 
      WHERE
      username = username1 AND device = device1
      AND directory = directory1
      AND filename = filename1;
          --  check if the directory is empty before deleting it from the trash directory table
      SET @count = (SELECT COUNT(*) FROM deleted_files.files WHERE username = username1 AND device = device1 AND directory = directory1); 
      IF @count = 0 THEN
        DELETE FROM deleted_directories.directories WHERE username = username1 AND device = device1 AND path = pth;
      END IF;
    END LOOP;
    CLOSE cur;
    COMMIT;
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
	DECLARE cur CURSOR FOR SELECT username,device,directory,uuid,origin,filename,last_modified,hashvalue,enc_hashvalue,versions,size,salt,iv 
						  FROM deleted_files.files WHERE username = username_ori AND device = device_ori AND directory REGEXP REGEX 
						  ORDER BY directory LIMIT begin,end;
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
	  ROLLBACK;
	END;
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
  CREATE TEMPORARY TABLE temp_paths(path VARCHAR(255) NOT NULL);
  START TRANSACTION;
  BEGIN
    OPEN cur;
    read_loop: LOOP 
      FETCH cur INTO username1, device1, directory1, uuid1, origin1, filename1, last_modified1, hashvalue1, enc_hashvalue1, versions1, size1, salt1, iv1;
      IF done = 1 THEN
        LEAVE read_loop;
      END IF;
      SET pth = CONCAT("/",device_ori,"/",directory1);
      -- put files from trash table to files table
      INSERT INTO files.files (username,device,directory,uuid,origin,filename,last_modified,hashvalue,enc_hashvalue,versions,size,salt,iv )
      VALUES(username1, device1, directory1, uuid1, origin1, filename1, last_modified1, hashvalue1, enc_hashvalue1, versions1, size1, salt1, iv1);
      -- insert path into the directories.directories table
      IF NOT EXISTS( SELECT 1 FROM TEMPORARY.temp_paths WHERE path = pth) THEN
        INSERT INTO TEMPORARY.temp_paths (path) VALUES(pth);
        CALL InsertPaths(pth, username1,device1);
	    END IF;
      -- delete file from trash table
      DELETE FROM deleted_files.files 
      WHERE
      username = username1 AND device = device1
      AND directory = directory1
      AND filename = filename1;
          --  check if the directory is empty before deleting it from the trash directory table
      SET @count = (SELECT COUNT(*) FROM deleted_files.files WHERE username = username1 AND device = device1 AND directory = directory1); 
      IF @count = 0 THEN
        DELETE FROM deleted_directories.directories WHERE username = username1 AND device = device1 AND path = pth;
      END IF;
    END LOOP;
    CLOSE cur;
    COMMIT;
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

    SET dir = SUBSTRING(pathParts,LOCATE('/', pathParts, 2) + 1,LENGTH(pathParts));

    SELECT COUNT(*) INTO rows_count
    FROM deleted_files.files
    WHERE username = username AND device = device AND directory = dir;

    IF rows_count = 0 THEN
        DELETE FROM deleted_directories.directories
        WHERE username = username AND device = device AND path = pathParts;
    END IF;

    SET pos = pos + 1;
    -- If no errors, commit the transaction
  END WHILE;

  -- DELETE FROM deleted_directories.directories
  -- WHERE username = username AND device = device AND path = inputPath;
  COMMIT;

END//
DELIMITER ;

DROP DATABASE IF EXISTS `deleted_files`;
CREATE DATABASE `deleted_files`;
USE `deleted_files`;
SET NAMES utf8;
SET character_set_client = utf8mb4;

CREATE TABLE `files` (
    `username` VARCHAR(70) NOT NULL,
    `device` VARCHAR(70) NOT NULL,
    `directory` VARCHAR(255) NOT NULL,
    `uuid` VARCHAR(36) NOT NULL,
    `origin` VARCHAR(36) NOT NULL,
    `filename` VARCHAR(291) NOT NULL,
    `last_modified` DATETIME NOT NULL,
    `hashvalue` CHAR(64) NOT NULL,
    `enc_hashvalue` CHAR(64) NOT NULL,
    `versions` INTEGER NOT NULL,
    `size` BIGINT UNSIGNED NOT NULL,
    `salt` VARCHAR(64) NOT NULL,
    `iv` VARCHAR(64) NOT NULL,
    `deletion_date` DATETIME NOT NULL,
    `deletion_type` VARCHAR(6) NOT NULL,
    UNIQUE(`username`,`device`,`directory`,`filename`),
    FOREIGN KEY (`username`) REFERENCES customers.users(`username`)
);

CREATE INDEX device_index ON files(device);
CREATE INDEX directory_index ON files(directory);
ALTER TABLE files ADD FULLTEXT(filename); 

CREATE TABLE `file_versions` (
    `username` VARCHAR(70) NOT NULL,
    `device` VARCHAR(70) NOT NULL,
    `directory` VARCHAR(255) NOT NULL,
    `uuid` VARCHAR(36) NOT NULL,
    `origin` VARCHAR(36) NOT NULL,
    `filename` VARCHAR(291) NOT NULL,
    `last_modified` DATETIME NOT NULL,
    `hashvalue` CHAR(64) NOT NULL,
    `enc_hashvalue` CHAR(64) NOT NULL,
    `versions` INTEGER NOT NULL,
    `size` BIGINT UNSIGNED NOT NULL,
    `salt` VARCHAR(64) NOT NULL,
    `iv` VARCHAR(64) NOT NULL,
    `deletion_date` DATETIME NOT NULL,
    `deletion_type` VARCHAR(6) NOT NULL,
    UNIQUE(`username`,`device`,`directory`,`filename`,`uuid`),
    FOREIGN KEY (`username`) REFERENCES customers.users(`username`)
);

CREATE INDEX device_index ON file_versions(device);
CREATE INDEX directory_index ON file_versions(directory);

DROP DATABASE IF EXISTS `deleted_directories`;
CREATE DATABASE `deleted_directories`;
USE `deleted_directories`;
SET NAMES utf8;
SET character_set_client = utf8mb4;

CREATE TABLE `directories`(
    `uuid` VARCHAR(36) NOT NULL,
    `username` VARCHAR(70) NOT NULL,
    `device` VARCHAR(70) NOT NULL,
    `folder` VARCHAR(255) NOT NULL,
    `path` VARCHAR(255) NOT NULL,
    `created_at` DATETIME NOT NULL,
    `deleted` DATETIME NOT NULL,
    `rel_path` VARCHAR(255) NOT NULL,
    `rel_name` VARCHAR(255) NOT NULL,
     UNIQUE(`username`,`device`,`folder`,`path`),
     FOREIGN KEY (`username`) REFERENCES customers.users(`username`)
);

CREATE INDEX path_index ON directories(path);
ALTER TABLE directories ADD FULLTEXT(folder); 

DROP DATABASE IF EXISTS `versions`;
CREATE DATABASE `versions`;
USE `versions`;
SET NAMES utf8;
SET character_set_client = utf8mb4;

CREATE TABLE `file_versions` (
    `username` VARCHAR(70) NOT NULL,
    `device` VARCHAR(70) NOT NULL,
    `directory` VARCHAR(255) NOT NULL,
    `uuid` VARCHAR(36) NOT NULL,
    `origin` VARCHAR(36) NOT NULL,
    `filename` VARCHAR(291) NOT NULL,
    `last_modified` DATETIME NOT NULL,
    `hashvalue` CHAR(64) NOT NULL,
    `enc_hashvalue` CHAR(64) NOT NULL,
    `versions` INTEGER NOT NULL,
    `size` BIGINT UNSIGNED NOT NULL,
    `salt` VARCHAR(64) NOT NULL,
    `iv` VARCHAR(64) NOT NULL,
    UNIQUE(`username`,`device`,`directory`,`filename`,`uuid`),
    FOREIGN KEY (`username`) REFERENCES customers.users(`username`)
);

CREATE INDEX origin_index ON file_versions(origin);

