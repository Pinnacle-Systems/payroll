-- DropForeignKey
ALTER TABLE `pogrid` DROP FOREIGN KEY `poGrid_poId_fkey`;

-- AddForeignKey
ALTER TABLE `poGrid` ADD CONSTRAINT `poGrid_poId_fkey` FOREIGN KEY (`poId`) REFERENCES `Po`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
