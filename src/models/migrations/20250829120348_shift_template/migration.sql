-- DropForeignKey
ALTER TABLE `shifttemplateitems` DROP FOREIGN KEY `ShiftTemplateItems_shiftTemplateId_fkey`;

-- AlterTable
ALTER TABLE `shifttemplate` ADD COLUMN `category` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `ShiftTemplateItems` ADD CONSTRAINT `ShiftTemplateItems_shiftTemplateId_fkey` FOREIGN KEY (`shiftTemplateId`) REFERENCES `ShiftTemplate`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
