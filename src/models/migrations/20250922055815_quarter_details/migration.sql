-- CreateTable
CREATE TABLE `QuarterDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shiftTemplateItemsId` INTEGER NULL,
    `day` VARCHAR(191) NULL,
    `oTDetailsId` INTEGER NOT NULL,
    `ftMins` INTEGER NULL,
    `from` VARCHAR(191) NULL,
    `to` VARCHAR(191) NULL,
    `ttMins` INTEGER NULL,
    `endTime` INTEGER NULL,
    `nextDay` VARCHAR(191) NULL,
    `checkHrs` INTEGER NULL,
    `total` INTEGER NULL,
    `pickFrom` VARCHAR(191) NULL,
    `formula` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `QuarterDetails` ADD CONSTRAINT `QuarterDetails_shiftTemplateItemsId_fkey` FOREIGN KEY (`shiftTemplateItemsId`) REFERENCES `ShiftTemplateItems`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuarterDetails` ADD CONSTRAINT `QuarterDetails_oTDetailsId_fkey` FOREIGN KEY (`oTDetailsId`) REFERENCES `OTDetails`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
