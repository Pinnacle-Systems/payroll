-- AlterTable
ALTER TABLE `pogrid` ADD COLUMN `gridId` INTEGER NULL;

-- AlterTable
ALTER TABLE `posubgrid` ADD COLUMN `subgridId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `poGrid` ADD CONSTRAINT `poGrid_gridId_fkey` FOREIGN KEY (`gridId`) REFERENCES `orderBillItems`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `poSubGrid` ADD CONSTRAINT `poSubGrid_subgridId_fkey` FOREIGN KEY (`subgridId`) REFERENCES `SubGrid`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
