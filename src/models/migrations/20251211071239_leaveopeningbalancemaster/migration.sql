/*
  Warnings:

  - You are about to drop the column `leaveId` on the `leaveopeningbalance` table. All the data in the column will be lost.
  - You are about to drop the column `openingBalance` on the `leaveopeningbalance` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `leaveopeningbalance` DROP FOREIGN KEY `LeaveOPeningBalance_leaveId_fkey`;

-- AlterTable
ALTER TABLE `leaveopeningbalance` DROP COLUMN `leaveId`,
    DROP COLUMN `openingBalance`,
    ADD COLUMN `leaveCodeId` INTEGER NULL;

-- CreateTable
CREATE TABLE `LeaveOPeningBalanceGrid` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `leaveOPeningBalanceId` INTEGER NULL,
    `leaveId` INTEGER NOT NULL,
    `openingBalance` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LeaveOPeningBalance` ADD CONSTRAINT `LeaveOPeningBalance_leaveCodeId_fkey` FOREIGN KEY (`leaveCodeId`) REFERENCES `LeaveCode`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveOPeningBalanceGrid` ADD CONSTRAINT `LeaveOPeningBalanceGrid_leaveOPeningBalanceId_fkey` FOREIGN KEY (`leaveOPeningBalanceId`) REFERENCES `LeaveOPeningBalance`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveOPeningBalanceGrid` ADD CONSTRAINT `LeaveOPeningBalanceGrid_leaveId_fkey` FOREIGN KEY (`leaveId`) REFERENCES `LeaveCode`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
