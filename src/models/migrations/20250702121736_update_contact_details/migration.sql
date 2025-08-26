-- AlterTable
ALTER TABLE `partybranchcontactdetails` ADD COLUMN `partyBranchId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `PartyBranchContactDetails` ADD CONSTRAINT `PartyBranchContactDetails_partyBranchId_fkey` FOREIGN KEY (`partyBranchId`) REFERENCES `PartyBranch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
