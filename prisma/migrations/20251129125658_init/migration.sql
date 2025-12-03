-- CreateTable
CREATE TABLE `user` (
    `cpf` CHAR(11) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `picture_url` VARCHAR(255) NULL,
    `type` ENUM('Cliente', 'Gerente', 'Colaborador') NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `excluded_at` DATETIME(0) NULL,

    UNIQUE INDEX `usu_email`(`email`),
    PRIMARY KEY (`cpf`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_cpf` CHAR(11) NOT NULL,
    `name` VARCHAR(45) NOT NULL,
    `number` VARCHAR(20) NULL,

    INDEX `contact_user_cpf_idx`(`user_cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(45) NOT NULL,
    `user_cpf` CHAR(11) NOT NULL,
    `cep` CHAR(8) NOT NULL,
    `location` VARCHAR(150) NOT NULL,
    `complement` VARCHAR(10) NULL,

    INDEX `address_user_cpf_idx`(`user_cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_cpf` CHAR(11) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `species` ENUM('dog', 'cat') NOT NULL,
    `breed` VARCHAR(50) NULL,
    `size` ENUM('S', 'M', 'L', 'G') NOT NULL,
    `birth_date` DATE NULL,
    `weight` DECIMAL(5, 2) NULL,
    `sex` ENUM('M', 'F') NULL,
    `picture_url` VARCHAR(255) NULL,
    `observations` TEXT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `excluded_at` DATETIME(0) NULL,

    INDEX `fk_pet_user_cpf_idx`(`user_cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `contact` ADD CONSTRAINT `fk_contact_user_cpf` FOREIGN KEY (`user_cpf`) REFERENCES `user`(`cpf`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `address` ADD CONSTRAINT `fk_address_user_cpf` FOREIGN KEY (`user_cpf`) REFERENCES `user`(`cpf`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pet` ADD CONSTRAINT `fk_pet_user_cpf` FOREIGN KEY (`user_cpf`) REFERENCES `user`(`cpf`) ON DELETE NO ACTION ON UPDATE NO ACTION;
