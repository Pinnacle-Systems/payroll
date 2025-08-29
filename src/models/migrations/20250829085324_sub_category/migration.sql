-- AlterTable
ALTER TABLE `payfrequency` ADD COLUMN `branchId` INTEGER NULL,
    ADD COLUMN `companyId` INTEGER NULL;

-- CreateTable
CREATE TABLE `EmployeeSubCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` INTEGER NULL,
    `updatedById` INTEGER NULL,
    `companyId` INTEGER NULL,
    `branchId` INTEGER NULL,
    `employeeCategoryId` INTEGER NULL,
    `gradeName` VARCHAR(191) NULL,
    `active` BOOLEAN NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PayFrequency` ADD CONSTRAINT `PayFrequency_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PayFrequency` ADD CONSTRAINT `PayFrequency_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeSubCategory` ADD CONSTRAINT `EmployeeSubCategory_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeSubCategory` ADD CONSTRAINT `EmployeeSubCategory_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeSubCategory` ADD CONSTRAINT `EmployeeSubCategory_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeSubCategory` ADD CONSTRAINT `EmployeeSubCategory_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeSubCategory` ADD CONSTRAINT `EmployeeSubCategory_employeeCategoryId_fkey` FOREIGN KEY (`employeeCategoryId`) REFERENCES `EmployeeCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
