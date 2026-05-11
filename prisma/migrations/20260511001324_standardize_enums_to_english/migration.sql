/*
  Warnings:

  - The values [G] on the enum `pet_size` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `type` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `pet` MODIFY `size` ENUM('S', 'M', 'L', 'XL') NOT NULL;

-- AlterTable
ALTER TABLE `schedule` MODIFY `duration` ENUM('THIRTY_MIN', 'FORTY_FIVE_MIN', 'ONE_HOUR', 'ONE_HALF_HOUR', 'TWO_HOURS', 'TWO_HALF_HOURS', 'THREE_HOURS') NOT NULL DEFAULT 'THIRTY_MIN';

-- AlterTable
ALTER TABLE `user` MODIFY `type` ENUM('CUSTOMER', 'MANAGER', 'COLLABORATOR') NULL DEFAULT 'CUSTOMER';
