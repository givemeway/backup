DROP DATABASE IF EXISTS `data`;
CREATE DATABASE `data`;
USE `data`;
SET NAMES utf8;
SET character_set_client = utf8mb4;

CREATE TABLE `files`(
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(70) NOT NULL,
    `device` VARCHAR(70) NOT NULL,
    `directory` VARCHAR(255) NOT NULL,
    `enc_directory` VARCHAR(255) NOT NULL,
    `filename` VARCHAR(255) NOT NULL,
    `enc_filename` VARCHAR(255) NOT NULL,
    `hashed_filename` VARCHAR(350) NOT NULL,
    `last_modified` DATETIME NOT NULL,
    `hashvalue` CHAR(64) NOT NULL,
    `enc_hashvalue` CHAR(64) NOT NULL,
    `versions` INTEGER NOT NULL,
    `size` BIGINT UNSIGNED NOT NULL,
    `snapshot` VARCHAR(255) NOT NULL,
    `salt` VARCHAR(255) NOT NULL,
    `iv` VARCHAR(255) NOT NULL,
    UNIQUE(`username`,`device`,`directory`,`filename`),
    FOREIGN KEY (`username`) REFERENCES customers.users(`username`)
);
CREATE INDEX device_index ON files(device);
CREATE INDEX directory_index ON files(directory);
ALTER TABLE data.files ADD FULLTEXT(filename); 

CREATE TABLE `directories`(
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(70) NOT NULL,
    `device` VARCHAR(70) NOT NULL,
    `folder` VARCHAR(255) NOT NULL,
    `path` VARCHAR(255) NOT NULL,
     UNIQUE(`username`,`device`,`folder`,`path`),
     FOREIGN KEY (`username`) REFERENCES customers.users(`username`)
);

CREATE INDEX path_index ON directories(path);
ALTER TABLE data.directories ADD FULLTEXT(folder); 
