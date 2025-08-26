-- AlterTable
ALTER TABLE `orderbillitems` ADD COLUMN `styleSheetId` INTEGER NULL;

-- AlterTable
ALTER TABLE `pogrid` ADD COLUMN `styleSheetId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `orderBillItems` ADD CONSTRAINT `orderBillItems_styleSheetId_fkey` FOREIGN KEY (`styleSheetId`) REFERENCES `StyleSheet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `poGrid` ADD CONSTRAINT `poGrid_styleSheetId_fkey` FOREIGN KEY (`styleSheetId`) REFERENCES `StyleSheet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
