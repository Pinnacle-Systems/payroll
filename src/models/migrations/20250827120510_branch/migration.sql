-- AlterTable
ALTER TABLE `hrtemplate` ADD COLUMN `branchId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `HRTemplate` ADD CONSTRAINT `HRTemplate_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
