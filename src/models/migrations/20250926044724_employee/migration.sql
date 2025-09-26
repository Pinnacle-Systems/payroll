/*
  Warnings:

  - You are about to drop the column `shiftTemplateId` on the `employee` table. All the data in the column will be lost.
  - Added the required column `shiftCommonTemplateId` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_shiftTemplateId_fkey`;

-- AlterTable
ALTER TABLE `employee` DROP COLUMN `shiftTemplateId`,
    ADD COLUMN `finYearId` INTEGER NULL,
    ADD COLUMN `shiftCommonTemplateId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_shiftCommonTemplateId_fkey` FOREIGN KEY (`shiftCommonTemplateId`) REFERENCES `ShiftCommonTemplate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_finYearId_fkey` FOREIGN KEY (`finYearId`) REFERENCES `FinYear`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
