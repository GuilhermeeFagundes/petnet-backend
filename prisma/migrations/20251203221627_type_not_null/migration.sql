-- AlterTable
ALTER TABLE `user` MODIFY `type` ENUM('Cliente', 'Gerente', 'Colaborador') NULL DEFAULT 'Cliente';
