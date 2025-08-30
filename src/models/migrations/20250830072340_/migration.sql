-- AlterTable
ALTER TABLE `payfrequencyitems` ADD COLUMN `payFrequencyId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `PayFrequencyItems` ADD CONSTRAINT `PayFrequencyItems_payFrequencyId_fkey` FOREIGN KEY (`payFrequencyId`) REFERENCES `PayFrequency`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
