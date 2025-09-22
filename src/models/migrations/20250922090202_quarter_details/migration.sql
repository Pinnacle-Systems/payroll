-- DropForeignKey
ALTER TABLE `quarterdetails` DROP FOREIGN KEY `QuarterDetails_oTDetailsId_fkey`;

-- AlterTable
ALTER TABLE `quarterdetails` MODIFY `oTDetailsId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `QuarterDetails` ADD CONSTRAINT `QuarterDetails_oTDetailsId_fkey` FOREIGN KEY (`oTDetailsId`) REFERENCES `OTDetails`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
