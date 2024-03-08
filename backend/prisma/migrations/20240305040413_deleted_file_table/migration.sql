/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `DeletedDirectory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[origin]` on the table `DeletedFile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dirID` to the `DeletedFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DeletedFile" ADD COLUMN     "dirID" VARCHAR(36) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DeletedDirectory_uuid_key" ON "DeletedDirectory"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "DeletedFile_origin_key" ON "DeletedFile"("origin");

-- AddForeignKey
ALTER TABLE "DeletedFile" ADD CONSTRAINT "DeletedFile_dirID_fkey" FOREIGN KEY ("dirID") REFERENCES "DeletedDirectory"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeletedFileVersion" ADD CONSTRAINT "DeletedFileVersion_origin_fkey" FOREIGN KEY ("origin") REFERENCES "DeletedFile"("origin") ON DELETE RESTRICT ON UPDATE CASCADE;
