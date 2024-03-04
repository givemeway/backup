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

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
