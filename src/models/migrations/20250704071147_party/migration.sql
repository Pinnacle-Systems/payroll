-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_partyId_fkey` FOREIGN KEY (`partyId`) REFERENCES `Party`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
