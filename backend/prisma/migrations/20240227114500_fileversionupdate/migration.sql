/*
  Warnings:

  - A unique constraint covering the columns `[origin]` on the table `FileVersion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FileVersion_origin_key" ON "FileVersion"("origin");
