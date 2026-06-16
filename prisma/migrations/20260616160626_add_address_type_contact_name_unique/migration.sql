/*
  Warnings:

  - A unique constraint covering the columns `[user_cpf,type]` on the table `address` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_cpf,name]` on the table `contact` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `address_user_cpf_type_key` ON `address`(`user_cpf`, `type`);

-- CreateIndex
CREATE UNIQUE INDEX `contact_user_cpf_name_key` ON `contact`(`user_cpf`, `name`);
