-- CreateTable
CREATE TABLE `leaveRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NULL,
    `branchId` INTEGER NULL,
    `createdById` INTEGER NULL,
    `updatedById` INTEGER NULL,
    `finYearId` INTEGER NULL,
    `employeeId` INTEGER NULL,
    `docId` VARCHAR(191) NULL,
    `date` DATETIME(3) NULL,
    `fromDate` DATETIME(3) NULL,
    `toDate` DATETIME(3) NULL,
    `totalDays` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LeaveDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `leaveRequestId` INTEGER NULL,
    `leaveId` INTEGER NOT NULL,
    `startDate` DATETIME(3) NULL,
    `shiftTime` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `leaveRequest` ADD CONSTRAINT `leaveRequest_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leaveRequest` ADD CONSTRAINT `leaveRequest_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leaveRequest` ADD CONSTRAINT `leaveRequest_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leaveRequest` ADD CONSTRAINT `leaveRequest_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leaveRequest` ADD CONSTRAINT `leaveRequest_finYearId_fkey` FOREIGN KEY (`finYearId`) REFERENCES `FinYear`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leaveRequest` ADD CONSTRAINT `leaveRequest_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveDetails` ADD CONSTRAINT `LeaveDetails_leaveRequestId_fkey` FOREIGN KEY (`leaveRequestId`) REFERENCES `leaveRequest`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveDetails` ADD CONSTRAINT `LeaveDetails_leaveId_fkey` FOREIGN KEY (`leaveId`) REFERENCES `LeaveCode`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
