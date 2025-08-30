-- AlterTable
ALTER TABLE `payfrequency` ADD COLUMN `branchId` INTEGER NULL,
    ADD COLUMN `companyId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `PayFrequency` ADD CONSTRAINT `PayFrequency_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PayFrequency` ADD CONSTRAINT `PayFrequency_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
