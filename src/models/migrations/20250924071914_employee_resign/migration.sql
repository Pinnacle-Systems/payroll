-- AlterTable
ALTER TABLE `employee` ADD COLUMN `active` BOOLEAN NULL DEFAULT true,
    ADD COLUMN `lastWorkingDate` DATETIME(3) NULL,
    ADD COLUMN `leaveReason` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `EmployeeResign` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NULL,
    `branchId` INTEGER NULL,
    `createdById` INTEGER NULL,
    `updatedById` INTEGER NULL,
    `docId` VARCHAR(191) NULL,
    `date` DATETIME(3) NULL,
    `employeeId` INTEGER NOT NULL,
    `lastWorkingDate` DATETIME(3) NULL,
    `leaveReason` VARCHAR(191) NULL,
    `remarks` VARCHAR(191) NULL,
    `joinAgain` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EmployeeResign` ADD CONSTRAINT `EmployeeResign_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeResign` ADD CONSTRAINT `EmployeeResign_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeResign` ADD CONSTRAINT `EmployeeResign_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeResign` ADD CONSTRAINT `EmployeeResign_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeResign` ADD CONSTRAINT `EmployeeResign_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
