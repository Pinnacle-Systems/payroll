/*
  Warnings:

  - You are about to drop the column `employeeCategoryId` on the `shiftcommontemplate` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `shiftcommontemplate` DROP FOREIGN KEY `ShiftCommonTemplate_employeeCategoryId_fkey`;

-- AlterTable
ALTER TABLE `shiftcommontemplate` DROP COLUMN `employeeCategoryId`,
    ADD COLUMN `name` VARCHAR(191) NULL,
    ADD COLUMN `notes` VARCHAR(191) NULL;
