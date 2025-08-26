-- AlterTable
ALTER TABLE `order` ADD COLUMN `isPurchased` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `orderbillitems` ADD COLUMN `isPurchased` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `subgrid` ADD COLUMN `isPurchased` BOOLEAN NULL;
