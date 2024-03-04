/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `FileVersion` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "FileVersion_origin_key";

-- CreateIndex
CREATE UNIQUE INDEX "FileVersion_uuid_key" ON "FileVersion"("uuid");
