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
`phone` VARCHAR(20) NOT NULL
);

CREATE UNIQUE INDEX username_index ON users (username);

