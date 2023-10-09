DROP DATABASE IF EXISTS `data`;
CREATE DATABASE `data`;
USE `data`;
SET NAMES utf8;
SET character_set_client = utf8mb4;

CREATE TABLE `files`(
    `username` VARCHAR(70) NOT NULL,
    `device` VARCHAR(70) NOT NULL,
    `directory` VARCHAR(255) NOT NULL,
    `uuid` VARCHAR(36) PRIMARY KEY,
    `origin` VARCHAR(36) NOT NULL,
    `filename` VARCHAR(255) NOT NULL,
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
CREATE INDEX device_index ON files(device);
CREATE INDEX directory_index ON files(directory);
ALTER TABLE data.files ADD FULLTEXT(filename); 

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
ALTER TABLE data.directories ADD FULLTEXT(folder); 

CREATE TABLE `versions` (
    `original_uuid` VARCHAR(36) NOT NULL,
    `uuid` VARCHAR(36) NOT NULL,
    `hashvalue` VARCHAR(64) NOT NULL,
    `size` BIGINT UNSIGNED NOT NULL,
    `salt` VARCHAR(64) NOT NULL,
    `iv` VARCHAR(64) NOT NULL,
    UNIQUE(`original_uuid`,`uuid`)
);

CREATE TABLE `deleted_files` (
    `username` VARCHAR(70) NOT NULL,
    `device` VARCHAR(70) NOT NULL,
    `directory` VARCHAR(255) NOT NULL,
    `uuid` VARCHAR(36) PRIMARY KEY,
    `origin` VARCHAR(36) NOT NULL,
    `filename` VARCHAR(255) NOT NULL,
    `last_modified` DATETIME NOT NULL,
    `hashvalue` CHAR(64) NOT NULL,
    `enc_hashvalue` CHAR(64) NOT NULL,
    `versions` INTEGER NOT NULL,
    `size` BIGINT UNSIGNED NOT NULL,
    `salt` VARCHAR(64) NOT NULL,
    `iv` VARCHAR(64) NOT NULL,
    `deletion_date` DATETIME NOT NULL,
    UNIQUE(`username`,`device`,`directory`,`filename`,`uuid`),
    FOREIGN KEY (`username`) REFERENCES customers.users(`username`)
);

CREATE TABLE `deleted_folders`(
    `uuid` VARCHAR(36) NOT NULL,
    `username` VARCHAR(70) NOT NULL,
    `device` VARCHAR(70) NOT NULL,
    `folder` VARCHAR(255) NOT NULL,
    `path` VARCHAR(255) NOT NULL,
    `created_at` DATETIME NOT NULL,
    `deleted` DATETIME NOT NULL,
     UNIQUE(`username`,`device`,`folder`,`path`),
     FOREIGN KEY (`username`) REFERENCES customers.users(`username`)
);

CREATE INDEX versions_device_index ON versions(original_uuid);
