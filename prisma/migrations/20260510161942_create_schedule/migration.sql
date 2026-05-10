-- CreateTable
CREATE TABLE `schedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `client_cpf` CHAR(11) NOT NULL,
    `pet_id` INTEGER NOT NULL,
    `collaborator_cpf` CHAR(11) NOT NULL,
    `date_time` DATETIME(0) NOT NULL,
    `duration` ENUM('THIRTY_MIN', 'FORTY_FIVE_MIN', 'ONE_HOUR', 'ONE_HALF_HOUR', 'TWO_HOURS') NOT NULL DEFAULT 'THIRTY_MIN',
    `status` ENUM('SCHEDULED', 'CONFIRMED', 'CANCELED', 'FINISHED') NOT NULL DEFAULT 'SCHEDULED',
    `observation` TEXT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `schedule_client_cpf_idx`(`client_cpf`),
    INDEX `schedule_pet_id_idx`(`pet_id`),
    INDEX `schedule_collaborator_cpf_idx`(`collaborator_cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_scheduleToservice` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_scheduleToservice_AB_unique`(`A`, `B`),
    INDEX `_scheduleToservice_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `schedule` ADD CONSTRAINT `schedule_client_cpf_fkey` FOREIGN KEY (`client_cpf`) REFERENCES `user`(`cpf`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `schedule` ADD CONSTRAINT `schedule_pet_id_fkey` FOREIGN KEY (`pet_id`) REFERENCES `pet`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `schedule` ADD CONSTRAINT `schedule_collaborator_cpf_fkey` FOREIGN KEY (`collaborator_cpf`) REFERENCES `user`(`cpf`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `_scheduleToservice` ADD CONSTRAINT `_scheduleToservice_A_fkey` FOREIGN KEY (`A`) REFERENCES `schedule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_scheduleToservice` ADD CONSTRAINT `_scheduleToservice_B_fkey` FOREIGN KEY (`B`) REFERENCES `service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
