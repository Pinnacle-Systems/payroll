-- CreateTable
CREATE TABLE `PartyBranchContactDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contactPersonName` VARCHAR(191) NULL,
    `mobileNo` INTEGER NULL,
    `email` VARCHAR(191) NULL,
    `branchName` VARCHAR(191) NULL,
    `branchCode` VARCHAR(191) NULL,
    `branchAddress` VARCHAR(191) NULL,
    `partyId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PartyBranchContactDetails` ADD CONSTRAINT `PartyBranchContactDetails_partyId_fkey` FOREIGN KEY (`partyId`) REFERENCES `Party`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
