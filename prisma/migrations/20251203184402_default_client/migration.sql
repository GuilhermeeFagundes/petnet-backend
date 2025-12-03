-- AlterTable
ALTER TABLE `user` MODIFY `type` ENUM('Cliente', 'Gerente', 'Colaborador') NOT NULL DEFAULT 'Cliente';
