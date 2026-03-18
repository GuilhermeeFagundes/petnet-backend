/*
  Warnings:

  - You are about to drop the column `picture_url` on the `pet` table. All the data in the column will be lost.
  - You are about to drop the column `picture_url` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `pet` DROP COLUMN `picture_url`,
    ADD COLUMN `picture_blob` LONGBLOB NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `picture_url`,
    ADD COLUMN `picture_blob` LONGBLOB NULL;
