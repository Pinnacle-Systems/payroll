/*
  Warnings:

  - You are about to drop the column `branchId` on the `payfrequency` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `payfrequency` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `shifttemplate` table. All the data in the column will be lost.
  - You are about to drop the column `fbIn` on the `shifttemplate` table. All the data in the column will be lost.
  - You are about to drop the column `fbOut` on the `shifttemplate` table. All the data in the column will be lost.
  - You are about to drop the column `inNextDay` on the `shifttemplate` table. All the data in the column will be lost.
  - You are about to drop the column `lBEnday` on the `shifttemplate` table. All the data in the column will be lost.
  - You are about to drop the column `lBSNDay` on the `shifttemplate` table. All the data in the column will be lost.
  - You are about to drop the column `lunchBET` on the `shifttemplate` table. All the data in the column will be lost.
  - You are about to drop the column `lunchBst` on the `shifttemplate` table. All the data in the column will be lost.
  - You are about to drop the column `otHrs` on the `shifttemplate` table. All the data in the column will be lost.
  - You are about to drop the column `outNxtDay` on the `shifttemplate` table. All the data in the column will be lost.
  - You are about to drop the column `quater` on the `shifttemplate` table. All the data in the column will be lost.
  - You are about to drop the column `sbIn` on the `shifttemplate` table. All the data in the column will be lost.
  - You are about to drop the column `sbOut` on the `shifttemplate` table. All the data in the column will be lost.
  - You are about to drop the column `shiftId` on the `shifttemplate` table. All the data in the column will be lost.
  - You are about to drop the column `shiftTimeHrs` on the `shifttemplate` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `shifttemplate` table. All the data in the column will be lost.
  - You are about to drop the column `templateId` on the `shifttemplate` table. All the data in the column will be lost.
  - You are about to drop the column `toleranceInAfterEnd` on the `shifttemplate` table. All the data in the column will be lost.
  - You are about to drop the column `toleranceInBeforeStart` on the `shifttemplate` table. All the data in the column will be lost.
  - You are about to drop the column `toleranceOutAfterEnd` on the `shifttemplate` table. All the data in the column will be lost.
  - You are about to drop the column `toleranceOutBeforeStart` on the `shifttemplate` table. All the data in the column will be lost.
  - You are about to drop the `employeesubcategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `employeesubcategory` DROP FOREIGN KEY `EmployeeSubCategory_branchId_fkey`;

-- DropForeignKey
ALTER TABLE `employeesubcategory` DROP FOREIGN KEY `EmployeeSubCategory_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `employeesubcategory` DROP FOREIGN KEY `EmployeeSubCategory_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `employeesubcategory` DROP FOREIGN KEY `EmployeeSubCategory_employeeCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `employeesubcategory` DROP FOREIGN KEY `EmployeeSubCategory_updatedById_fkey`;

-- DropForeignKey
ALTER TABLE `payfrequency` DROP FOREIGN KEY `PayFrequency_branchId_fkey`;

-- DropForeignKey
ALTER TABLE `payfrequency` DROP FOREIGN KEY `PayFrequency_companyId_fkey`;

-- AlterTable
ALTER TABLE `payfrequency` DROP COLUMN `branchId`,
    DROP COLUMN `companyId`;

-- AlterTable
ALTER TABLE `shifttemplate` DROP COLUMN `endTime`,
    DROP COLUMN `fbIn`,
    DROP COLUMN `fbOut`,
    DROP COLUMN `inNextDay`,
    DROP COLUMN `lBEnday`,
    DROP COLUMN `lBSNDay`,
    DROP COLUMN `lunchBET`,
    DROP COLUMN `lunchBst`,
    DROP COLUMN `otHrs`,
    DROP COLUMN `outNxtDay`,
    DROP COLUMN `quater`,
    DROP COLUMN `sbIn`,
    DROP COLUMN `sbOut`,
    DROP COLUMN `shiftId`,
    DROP COLUMN `shiftTimeHrs`,
    DROP COLUMN `startTime`,
    DROP COLUMN `templateId`,
    DROP COLUMN `toleranceInAfterEnd`,
    DROP COLUMN `toleranceInBeforeStart`,
    DROP COLUMN `toleranceOutAfterEnd`,
    DROP COLUMN `toleranceOutBeforeStart`;

-- DropTable
DROP TABLE `employeesubcategory`;

-- CreateTable
CREATE TABLE `ShiftTemplateItems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shiftTemplateId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` INTEGER NULL,
    `updatedById` INTEGER NULL,
    `name` VARCHAR(191) NULL,
    `docId` VARCHAR(191) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `templateId` INTEGER NULL,
    `shiftId` INTEGER NULL,
    `inNextDay` VARCHAR(191) NULL,
    `toleranceInBeforeStart` VARCHAR(191) NULL,
    `startTime` VARCHAR(191) NULL,
    `toleranceInAfterEnd` VARCHAR(191) NULL,
    `fbOut` VARCHAR(191) NULL,
    `fbIn` VARCHAR(191) NULL,
    `lunchBst` VARCHAR(191) NULL,
    `lBSNDay` VARCHAR(191) NULL,
    `lunchBET` VARCHAR(191) NULL,
    `lBEnday` VARCHAR(191) NULL,
    `sbOut` VARCHAR(191) NULL,
    `sbIn` VARCHAR(191) NULL,
    `toleranceOutBeforeStart` VARCHAR(191) NULL,
    `endTime` VARCHAR(191) NULL,
    `toleranceOutAfterEnd` VARCHAR(191) NULL,
    `outNxtDay` VARCHAR(191) NULL,
    `shiftTimeHrs` VARCHAR(191) NULL,
    `otHrs` VARCHAR(191) NULL,
    `quater` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ShiftTemplateItems` ADD CONSTRAINT `ShiftTemplateItems_shiftTemplateId_fkey` FOREIGN KEY (`shiftTemplateId`) REFERENCES `ShiftTemplate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShiftTemplateItems` ADD CONSTRAINT `ShiftTemplateItems_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShiftTemplateItems` ADD CONSTRAINT `ShiftTemplateItems_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
