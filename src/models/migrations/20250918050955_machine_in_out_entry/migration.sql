-- CreateTable
CREATE TABLE `MachineInOutEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NULL,
    `branchId` INTEGER NULL,
    `createdById` INTEGER NULL,
    `updatedById` INTEGER NULL,
    `branchCode` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MachineInOutGrid` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `machineInOutEntryId` INTEGER NULL,
    `date` DATETIME(3) NULL,
    `machineTypeOne` VARCHAR(191) NULL,
    `machineIP` VARCHAR(191) NULL,
    `machineNo` INTEGER NULL,
    `machineTypeTwo` VARCHAR(191) NULL,
    `currentMachine` VARCHAR(191) NULL,
    `default` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MachineInOutEntry` ADD CONSTRAINT `MachineInOutEntry_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MachineInOutEntry` ADD CONSTRAINT `MachineInOutEntry_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MachineInOutEntry` ADD CONSTRAINT `MachineInOutEntry_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MachineInOutEntry` ADD CONSTRAINT `MachineInOutEntry_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MachineInOutGrid` ADD CONSTRAINT `MachineInOutGrid_machineInOutEntryId_fkey` FOREIGN KEY (`machineInOutEntryId`) REFERENCES `MachineInOutEntry`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
