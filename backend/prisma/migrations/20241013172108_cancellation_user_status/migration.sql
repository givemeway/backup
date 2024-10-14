/*
  Warnings:

  - You are about to drop the `DeletedDirectory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DeletedFile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DeletedFileVersion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Directory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FileVersion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DeletedFile" DROP CONSTRAINT "DeletedFile_dirID_fkey";

-- DropForeignKey
ALTER TABLE "DeletedFileVersion" DROP CONSTRAINT "DeletedFileVersion_origin_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_dirID_fkey";

-- DropForeignKey
ALTER TABLE "FileVersion" DROP CONSTRAINT "FileVersion_origin_fkey";

-- DropTable
DROP TABLE "DeletedDirectory";

-- DropTable
DROP TABLE "DeletedFile";

-- DropTable
DROP TABLE "DeletedFileVersion";

-- DropTable
DROP TABLE "Directory";

-- DropTable
DROP TABLE "File";

-- DropTable
DROP TABLE "FileVersion";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(70) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(70) NOT NULL,
    "last_name" VARCHAR(70) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "enc" VARCHAR(64) NOT NULL,
    "is2FA" BOOLEAN NOT NULL DEFAULT false,
    "isSMS" BOOLEAN NOT NULL DEFAULT false,
    "isEmail" BOOLEAN NOT NULL DEFAULT false,
    "isTOTP" BOOLEAN NOT NULL DEFAULT false,
    "hotpCounter" BIGINT NOT NULL DEFAULT 0,
    "OTPGenTime" BIGINT NOT NULL DEFAULT 0,
    "OTPValidity" INTEGER NOT NULL DEFAULT 300,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "cancellation_date" TEXT NOT NULL DEFAULT 'NULL',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
