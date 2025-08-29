-- AlterTable
ALTER TABLE `payfrequency` ADD COLUMN `finYearId` INTEGER NULL;

-- AlterTable
ALTER TABLE `shifttemplate` ADD COLUMN `category` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `PayFrequency` ADD CONSTRAINT `PayFrequency_finYearId_fkey` FOREIGN KEY (`finYearId`) REFERENCES `FinYear`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
