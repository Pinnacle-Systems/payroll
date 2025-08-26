-- CreateTable
CREATE TABLE `SampleEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `createdById` INTEGER NULL,
    `updatedById` INTEGER NULL,
    `branchId` INTEGER NULL,
    `date` DATETIME(3) NULL,
    `submitter` VARCHAR(191) NULL,
    `submittingTo` VARCHAR(191) NULL,
    `supplierId` INTEGER NULL,
    `supplierAddress` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sampleEntryGrid` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sampleEntryId` INTEGER NULL,
    `fabCode` VARCHAR(191) NULL,
    `styleSheetId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sampleEntrySubGrid` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sampleEntryGridId` INTEGER NULL,
    `fabType` VARCHAR(191) NULL,
    `fiberContent` VARCHAR(191) NULL,
    `weightGSM` VARCHAR(191) NULL,
    `widthFinished` VARCHAR(191) NULL,
    `smsMcq` VARCHAR(191) NULL,
    `smsMoq` VARCHAR(191) NULL,
    `smsLeadTime` VARCHAR(191) NULL,
    `fabricImage` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SampleEntry` ADD CONSTRAINT `SampleEntry_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SampleEntry` ADD CONSTRAINT `SampleEntry_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SampleEntry` ADD CONSTRAINT `SampleEntry_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SampleEntry` ADD CONSTRAINT `SampleEntry_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Party`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sampleEntryGrid` ADD CONSTRAINT `sampleEntryGrid_sampleEntryId_fkey` FOREIGN KEY (`sampleEntryId`) REFERENCES `SampleEntry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sampleEntryGrid` ADD CONSTRAINT `sampleEntryGrid_styleSheetId_fkey` FOREIGN KEY (`styleSheetId`) REFERENCES `StyleSheet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sampleEntrySubGrid` ADD CONSTRAINT `sampleEntrySubGrid_sampleEntryGridId_fkey` FOREIGN KEY (`sampleEntryGridId`) REFERENCES `sampleEntryGrid`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
