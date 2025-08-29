/*
  Warnings:

  - You are about to drop the `hrcommontemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hrtemplate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `hrcommontemplate` DROP FOREIGN KEY `HRCommonTemplate_branchId_fkey`;

-- DropForeignKey
ALTER TABLE `hrcommontemplate` DROP FOREIGN KEY `HRCommonTemplate_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `hrcommontemplate` DROP FOREIGN KEY `HRCommonTemplate_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `hrcommontemplate` DROP FOREIGN KEY `HRCommonTemplate_employeeCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `hrcommontemplate` DROP FOREIGN KEY `HRCommonTemplate_updatedById_fkey`;

-- DropForeignKey
ALTER TABLE `hrtemplate` DROP FOREIGN KEY `HRTemplate_branchId_fkey`;

-- DropForeignKey
ALTER TABLE `hrtemplate` DROP FOREIGN KEY `HRTemplate_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `hrtemplate` DROP FOREIGN KEY `HRTemplate_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `hrtemplate` DROP FOREIGN KEY `HRTemplate_updatedById_fkey`;

-- DropTable
DROP TABLE `hrcommontemplate`;

-- DropTable
DROP TABLE `hrtemplate`;

-- CreateTable
CREATE TABLE `Shift` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` INTEGER NULL,
    `updatedById` INTEGER NULL,
    `companyId` INTEGER NULL,
    `branchId` INTEGER NULL,
    `name` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `docId` VARCHAR(191) NULL,
    `active` BOOLEAN NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShiftCommonTemplate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` INTEGER NULL,
    `updatedById` INTEGER NULL,
    `companyId` INTEGER NULL,
    `branchId` INTEGER NULL,
    `employeeCategoryId` INTEGER NULL,
    `docId` VARCHAR(191) NULL,
    `active` BOOLEAN NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Shift` ADD CONSTRAINT `Shift_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shift` ADD CONSTRAINT `Shift_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shift` ADD CONSTRAINT `Shift_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shift` ADD CONSTRAINT `Shift_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShiftCommonTemplate` ADD CONSTRAINT `ShiftCommonTemplate_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShiftCommonTemplate` ADD CONSTRAINT `ShiftCommonTemplate_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShiftCommonTemplate` ADD CONSTRAINT `ShiftCommonTemplate_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShiftCommonTemplate` ADD CONSTRAINT `ShiftCommonTemplate_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShiftCommonTemplate` ADD CONSTRAINT `ShiftCommonTemplate_employeeCategoryId_fkey` FOREIGN KEY (`employeeCategoryId`) REFERENCES `EmployeeCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
