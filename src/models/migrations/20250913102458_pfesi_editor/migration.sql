-- CreateTable
CREATE TABLE `PFESIEditor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` INTEGER NULL,
    `updatedById` INTEGER NULL,
    `companyId` INTEGER NULL,
    `branchId` INTEGER NULL,
    `payDetailsId` INTEGER NULL,
    `docId` VARCHAR(191) NULL,
    `date` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PfEsiGrid` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pFESIEditorId` INTEGER NULL,
    `fromValue` DOUBLE NULL,
    `toValue` DOUBLE NULL,
    `percentage` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PFESIEditor` ADD CONSTRAINT `PFESIEditor_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PFESIEditor` ADD CONSTRAINT `PFESIEditor_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PFESIEditor` ADD CONSTRAINT `PFESIEditor_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PFESIEditor` ADD CONSTRAINT `PFESIEditor_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PFESIEditor` ADD CONSTRAINT `PFESIEditor_payDetailsId_fkey` FOREIGN KEY (`payDetailsId`) REFERENCES `PayDetails`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PfEsiGrid` ADD CONSTRAINT `PfEsiGrid_pFESIEditorId_fkey` FOREIGN KEY (`pFESIEditorId`) REFERENCES `PFESIEditor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
