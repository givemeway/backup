DROP DATABASE IF EXISTS `data`;
CREATE DATABASE `data`;
USE `data`;
SET NAMES utf8;
SET character_set_client = utf8mb4;

CREATE TABLE `folders`(
    `DIRID` INTEGER AUTO_INCREMENT PRIMARY KEY,
    `DIRECTORY` VARCHAR(255) NOT NULL UNIQUE,
    `DEVICE` VARCHAR(70) NOT NULL
);

CREATE TABLE `files`(
    `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(70) NOT NULL,
    `device` VARCHAR(70) NOT NULL,
    `directory` VARCHAR(255) NOT NULL,
    `filename` VARCHAR(255) NOT NULL,
    `last_modified` DATETIME NOT NULL,
    `hashvalue` CHAR(64) NOT NULL,
    `versions` INTEGER NOT NULL,
    `snapshot` VARCHAR(255) NOT NULL,
    FOREIGN KEY (`username`) REFERENCES customers.users(`username`)
);