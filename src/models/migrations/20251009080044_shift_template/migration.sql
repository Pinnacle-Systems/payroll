/*
  Warnings:

  - You are about to drop the column `templateId` on the `shifttemplateitems` table. All the data in the column will be lost.
  - Added the required column `shiftCommonTemplateId` to the `ShiftTemplateItems` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `shifttemplateitems` DROP FOREIGN KEY `ShiftTemplateItems_templateId_fkey`;

-- AlterTable
ALTER TABLE `shifttemplateitems` DROP COLUMN `templateId`,
    ADD COLUMN `shiftCommonTemplateId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ShiftTemplateItems` ADD CONSTRAINT `ShiftTemplateItems_shiftCommonTemplateId_fkey` FOREIGN KEY (`shiftCommonTemplateId`) REFERENCES `ShiftCommonTemplate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
