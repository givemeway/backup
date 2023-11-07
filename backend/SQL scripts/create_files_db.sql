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

