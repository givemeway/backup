DROP DATABASE IF EXISTS `cryptoKeys`;
CREATE DATABASE `cryptoKeys`;
USE `cryptoKeys`;
SET NAMES utf8;
SET character_set_client = utf8mb4;

CREATE TABLE `userCryptoKeys`(
    `username` VARCHAR(70) NOT NULL,
    `enc` VARCHAR(64) NOT NULL,
    `salt` BLOB NOT NULL,
    `iv` BLOB NOT NULL,
    FOREIGN KEY (`username`) REFERENCES customers.users(`username`)
);