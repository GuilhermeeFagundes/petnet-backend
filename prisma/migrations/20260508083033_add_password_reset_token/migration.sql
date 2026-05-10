-- CreateTable
CREATE TABLE `password_reset_token` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_cpf` CHAR(11) NOT NULL,
    `token` CHAR(64) NOT NULL,
    `expires_at` DATETIME(0) NOT NULL,
    `used_at` DATETIME(0) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `password_reset_token_token_key`(`token`),
    INDEX `password_reset_token_user_cpf_idx`(`user_cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `password_reset_token` ADD CONSTRAINT `password_reset_token_user_cpf_fkey` FOREIGN KEY (`user_cpf`) REFERENCES `user`(`cpf`) ON DELETE CASCADE ON UPDATE CASCADE;
