/*
  Warnings:

  - Added the required column `dirID` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_uuid_fkey";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "dirID" VARCHAR(36) NOT NULL;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_dirID_fkey" FOREIGN KEY ("dirID") REFERENCES "Directory"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
