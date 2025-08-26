-- CreateTable
CREATE TABLE `PartyMasterNew` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `createdById` INTEGER NULL,
    `updatedById` INTEGER NULL,
    `isClient` BOOLEAN NULL DEFAULT false,
    `isSupplier` BOOLEAN NULL DEFAULT false,
    `name` VARCHAR(191) NOT NULL,
    `aliasName` VARCHAR(191) NULL,
    `partyCode` VARCHAR(191) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `displayName` VARCHAR(191) NULL,
    `address` LONGTEXT NULL,
    `landMark` VARCHAR(191) NULL,
    `cityId` INTEGER NULL,
    `pincode` INTEGER NULL,
    `email` VARCHAR(191) NULL,
    `contact` BIGINT NULL,
    `contactPersonName` VARCHAR(191) NULL,
    `designation` VARCHAR(191) NULL,
    `department` VARCHAR(191) NULL,
    `contactPersonEmail` VARCHAR(191) NULL,
    `contactPersonNumber` BIGINT NULL,
    `alterContactNumber` INTEGER NULL,
    `currencyId` INTEGER NULL,
    `payTermDay` VARCHAR(191) NULL,
    `panNo` VARCHAR(191) NULL,
    `gstNo` VARCHAR(191) NULL,
    `msmeNo` VARCHAR(191) NULL,
    `cinNo` VARCHAR(191) NULL,
    `bankName` VARCHAR(191) NULL,
    `bankBranchName` VARCHAR(191) NULL,
    `accountNumber` BIGINT NULL,
    `ifscCode` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PartyMasterNew` ADD CONSTRAINT `PartyMasterNew_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PartyMasterNew` ADD CONSTRAINT `PartyMasterNew_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PartyMasterNew` ADD CONSTRAINT `PartyMasterNew_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PartyMasterNew` ADD CONSTRAINT `PartyMasterNew_currencyId_fkey` FOREIGN KEY (`currencyId`) REFERENCES `Currency`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
