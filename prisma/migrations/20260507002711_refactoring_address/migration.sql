/*
  Warnings:

  - You are about to drop the column `location` on the `address` table. All the data in the column will be lost.
  - Added the required column `address` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locaticion` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `address` DROP COLUMN `location`,
    ADD COLUMN `address` VARCHAR(45) NOT NULL,
    ADD COLUMN `locaticion` VARCHAR(150) NOT NULL,
    ADD COLUMN `neighborhood` VARCHAR(45) NOT NULL,
    ADD COLUMN `number` VARCHAR(10) NOT NULL;
