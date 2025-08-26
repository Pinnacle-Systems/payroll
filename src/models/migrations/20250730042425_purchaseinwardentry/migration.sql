-- CreateTable
CREATE TABLE `purchaseInwardEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` INTEGER NULL,
    `updatedById` INTEGER NULL,
    `branchId` INTEGER NULL,
    `poId` INTEGER NULL,
    `date` DATETIME(3) NULL,
    `isPurchased` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchaseInwardEntryGrid` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `purchaseInwardEntryId` INTEGER NULL,
    `styleSheetId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchaseInwardEntrySubGrid` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `purchaseInwardEntryGridId` INTEGER NULL,
    `colorId` INTEGER NULL,
    `uomId` INTEGER NULL,
    `fabType` VARCHAR(191) NULL,
    `fiberContent` VARCHAR(191) NULL,
    `quantity` DOUBLE NULL,
    `actualQuantity` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `purchaseInwardEntry` ADD CONSTRAINT `purchaseInwardEntry_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchaseInwardEntry` ADD CONSTRAINT `purchaseInwardEntry_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchaseInwardEntry` ADD CONSTRAINT `purchaseInwardEntry_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchaseInwardEntry` ADD CONSTRAINT `purchaseInwardEntry_poId_fkey` FOREIGN KEY (`poId`) REFERENCES `Po`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchaseInwardEntryGrid` ADD CONSTRAINT `purchaseInwardEntryGrid_purchaseInwardEntryId_fkey` FOREIGN KEY (`purchaseInwardEntryId`) REFERENCES `purchaseInwardEntry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchaseInwardEntryGrid` ADD CONSTRAINT `purchaseInwardEntryGrid_styleSheetId_fkey` FOREIGN KEY (`styleSheetId`) REFERENCES `StyleSheet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchaseInwardEntrySubGrid` ADD CONSTRAINT `purchaseInwardEntrySubGrid_purchaseInwardEntryGridId_fkey` FOREIGN KEY (`purchaseInwardEntryGridId`) REFERENCES `purchaseInwardEntryGrid`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchaseInwardEntrySubGrid` ADD CONSTRAINT `purchaseInwardEntrySubGrid_colorId_fkey` FOREIGN KEY (`colorId`) REFERENCES `Color`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchaseInwardEntrySubGrid` ADD CONSTRAINT `purchaseInwardEntrySubGrid_uomId_fkey` FOREIGN KEY (`uomId`) REFERENCES `UnitOfMeasurement`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
