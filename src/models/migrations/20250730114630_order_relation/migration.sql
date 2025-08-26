-- AlterTable
ALTER TABLE `purchaseinwardentry` ADD COLUMN `orderId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `purchaseInwardEntry` ADD CONSTRAINT `purchaseInwardEntry_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
