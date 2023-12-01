DROP DATABASE IF EXISTS `files`;
DROP DATABASE IF EXISTS `directories`;
DROP DATABASE IF EXISTS `deleted_files`;
DROP DATABASE IF EXISTS `deleted_directories`;
DROP DATABASE IF EXISTS `versions`;
-- delete the other databases
DROP DATABASE IF EXISTS `customers`;
CREATE DATABASE `customers`;
USE `customers`;
SET NAMES utf8;
SET character_set_client = utf8mb4;

CREATE TABLE `users`(
`id` INTEGER AUTO_INCREMENT PRIMARY KEY,
`username` VARCHAR(70) UNIQUE NOT NULL,
`email` VARCHAR(255) NOT NULL,
`password` CHAR(255) NOT NULL,
`first_name` VARCHAR(70) NOT NULL,
`last_name` VARCHAR(70) NOT NULL,
`phone` VARCHAR(20) NOT NULL,
`enc` VARCHAR(64)
);

CREATE TABLE `cryptoKeys` (
`filename` VARCHAR(70) NOT NULL,
`salt` BLOB NOT NULL,
`iv` BLOB NOT NULL,
);

CREATE UNIQUE INDEX username_index ON users (username);

