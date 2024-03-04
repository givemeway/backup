/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "File" (
    "username" VARCHAR(70) NOT NULL,
    "device" VARCHAR(70) NOT NULL,
    "directory" VARCHAR(255) NOT NULL,
    "uuid" VARCHAR(36) NOT NULL,
    "origin" VARCHAR(36) NOT NULL,
    "filename" VARCHAR(255) NOT NULL,
    "last_modified" TIMESTAMP(3) NOT NULL,
    "hashvalue" CHAR(64) NOT NULL,
    "enc_hashvalue" CHAR(64) NOT NULL,
    "versions" INTEGER NOT NULL,
    "size" BIGINT NOT NULL,
    "salt" VARCHAR(64) NOT NULL,
    "iv" VARCHAR(64) NOT NULL
);

-- CreateTable
CREATE TABLE "FileVersion" (
    "username" VARCHAR(70) NOT NULL,
    "device" VARCHAR(70) NOT NULL,
    "directory" VARCHAR(255) NOT NULL,
    "uuid" VARCHAR(36) NOT NULL,
    "origin" VARCHAR(36) NOT NULL,
    "filename" VARCHAR(255) NOT NULL,
    "last_modified" TIMESTAMP(3) NOT NULL,
    "hashvalue" CHAR(64) NOT NULL,
    "enc_hashvalue" CHAR(64) NOT NULL,
    "versions" INTEGER NOT NULL,
    "size" BIGINT NOT NULL,
    "salt" VARCHAR(64) NOT NULL,
    "iv" VARCHAR(64) NOT NULL
);

-- CreateTable
CREATE TABLE "DeletedFile" (
    "username" VARCHAR(70) NOT NULL,
    "device" VARCHAR(70) NOT NULL,
    "directory" VARCHAR(255) NOT NULL,
    "uuid" VARCHAR(36) NOT NULL,
    "origin" VARCHAR(36) NOT NULL,
    "filename" VARCHAR(255) NOT NULL,
    "last_modified" TIMESTAMP(3) NOT NULL,
    "hashvalue" CHAR(64) NOT NULL,
    "enc_hashvalue" CHAR(64) NOT NULL,
    "versions" INTEGER NOT NULL,
    "size" BIGINT NOT NULL,
    "salt" VARCHAR(64) NOT NULL,
    "iv" VARCHAR(64) NOT NULL,
    "deletion_date" TIMESTAMP(3) NOT NULL,
    "deletion_type" VARCHAR(6) NOT NULL
);

-- CreateTable
CREATE TABLE "DeletedFileVersion" (
    "username" VARCHAR(70) NOT NULL,
    "device" VARCHAR(70) NOT NULL,
    "directory" VARCHAR(255) NOT NULL,
    "uuid" VARCHAR(36) NOT NULL,
    "origin" VARCHAR(36) NOT NULL,
    "filename" VARCHAR(255) NOT NULL,
    "last_modified" TIMESTAMP(3) NOT NULL,
    "hashvalue" CHAR(64) NOT NULL,
    "enc_hashvalue" CHAR(64) NOT NULL,
    "versions" INTEGER NOT NULL,
    "size" BIGINT NOT NULL,
    "salt" VARCHAR(64) NOT NULL,
    "iv" VARCHAR(64) NOT NULL,
    "deletion_date" TIMESTAMP(3) NOT NULL,
    "deletion_type" VARCHAR(6) NOT NULL
);

-- CreateTable
CREATE TABLE "Directory" (
    "uuid" VARCHAR(36) NOT NULL,
    "username" VARCHAR(70) NOT NULL,
    "device" VARCHAR(70) NOT NULL,
    "folder" VARCHAR(255) NOT NULL,
    "path" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "DeletedDirectory" (
    "uuid" VARCHAR(36) NOT NULL,
    "username" VARCHAR(70) NOT NULL,
    "device" VARCHAR(70) NOT NULL,
    "folder" VARCHAR(255) NOT NULL,
    "path" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3) NOT NULL,
    "rel_path" VARCHAR(255) NOT NULL,
    "rel_name" VARCHAR(255) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "File_origin_key" ON "File"("origin");

-- CreateIndex
CREATE INDEX "File_device_directory_idx" ON "File"("device", "directory");

-- CreateIndex
CREATE UNIQUE INDEX "File_username_device_directory_filename_key" ON "File"("username", "device", "directory", "filename");

-- CreateIndex
CREATE UNIQUE INDEX "FileVersion_uuid_key" ON "FileVersion"("uuid");

-- CreateIndex
CREATE INDEX "FileVersion_origin_idx" ON "FileVersion"("origin");

-- CreateIndex
CREATE UNIQUE INDEX "FileVersion_username_device_directory_filename_uuid_key" ON "FileVersion"("username", "device", "directory", "filename", "uuid");

-- CreateIndex
CREATE INDEX "DeletedFile_device_directory_idx" ON "DeletedFile"("device", "directory");

-- CreateIndex
CREATE UNIQUE INDEX "DeletedFile_username_device_directory_filename_key" ON "DeletedFile"("username", "device", "directory", "filename");

-- CreateIndex
CREATE INDEX "DeletedFileVersion_device_directory_origin_idx" ON "DeletedFileVersion"("device", "directory", "origin");

-- CreateIndex
CREATE UNIQUE INDEX "DeletedFileVersion_username_device_directory_filename_uuid_key" ON "DeletedFileVersion"("username", "device", "directory", "filename", "uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Directory_uuid_key" ON "Directory"("uuid");

-- CreateIndex
CREATE INDEX "Directory_path_idx" ON "Directory"("path");

-- CreateIndex
CREATE UNIQUE INDEX "Directory_username_device_folder_path_key" ON "Directory"("username", "device", "folder", "path");

-- CreateIndex
CREATE INDEX "DeletedDirectory_path_idx" ON "DeletedDirectory"("path");

-- CreateIndex
CREATE UNIQUE INDEX "DeletedDirectory_username_device_folder_path_key" ON "DeletedDirectory"("username", "device", "folder", "path");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_uuid_fkey" FOREIGN KEY ("uuid") REFERENCES "Directory"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileVersion" ADD CONSTRAINT "FileVersion_origin_fkey" FOREIGN KEY ("origin") REFERENCES "File"("origin") ON DELETE RESTRICT ON UPDATE CASCADE;
