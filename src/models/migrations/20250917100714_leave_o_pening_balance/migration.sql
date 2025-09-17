-- CreateTable
CREATE TABLE `LeaveOPeningBalance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NULL,
    `branchId` INTEGER NULL,
    `createdById` INTEGER NULL,
    `updatedById` INTEGER NULL,
    `employeeId` INTEGER NOT NULL,
    `finYearId` INTEGER NOT NULL,
    `leaveId` INTEGER NOT NULL,
    `openingBalance` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LeaveOPeningBalance` ADD CONSTRAINT `LeaveOPeningBalance_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveOPeningBalance` ADD CONSTRAINT `LeaveOPeningBalance_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveOPeningBalance` ADD CONSTRAINT `LeaveOPeningBalance_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveOPeningBalance` ADD CONSTRAINT `LeaveOPeningBalance_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveOPeningBalance` ADD CONSTRAINT `LeaveOPeningBalance_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveOPeningBalance` ADD CONSTRAINT `LeaveOPeningBalance_finYearId_fkey` FOREIGN KEY (`finYearId`) REFERENCES `FinYear`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveOPeningBalance` ADD CONSTRAINT `LeaveOPeningBalance_leaveId_fkey` FOREIGN KEY (`leaveId`) REFERENCES `LeaveCode`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
