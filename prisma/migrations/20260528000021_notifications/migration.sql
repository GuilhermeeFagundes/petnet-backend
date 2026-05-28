-- CreateTable
CREATE TABLE `notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `topic` VARCHAR(100) NOT NULL,
    `message` TEXT NOT NULL,
    `user_cpf` CHAR(11) NOT NULL,
    `viewed` BOOLEAN NOT NULL DEFAULT false,

    INDEX `notification_user_cpf_idx`(`user_cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_user_cpf_fkey` FOREIGN KEY (`user_cpf`) REFERENCES `user`(`cpf`) ON DELETE CASCADE ON UPDATE CASCADE;
