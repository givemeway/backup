DROP DATABASE IF EXISTS `cryptoKeys`;
CREATE DATABASE `cryptoKeys`;
USE `cryptoKeys`;
SET NAMES utf8;
SET character_set_client = utf8mb4;

CREATE TABLE `userCryptoKeys`(
    `username` VARCHAR(70) NOT NULL,
    `enc` VARCHAR(10) NOT NULL,
    `key` VARCHAR(64) NOT NULL,
    `salt` VARCHAR(255) NOT NULL,
    `iv` VARCHAR(255) NOT NULL,
    FOREIGN KEY (`username`) REFERENCES customers.users(`username`)
);