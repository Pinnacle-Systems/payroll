/*
  Warnings:

  - You are about to drop the column `leaveCodeId` on the `leaveopeningbalance` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `leaveopeningbalance` DROP FOREIGN KEY `LeaveOPeningBalance_leaveCodeId_fkey`;

-- AlterTable
ALTER TABLE `leaveopeningbalance` DROP COLUMN `leaveCodeId`,
    ADD COLUMN `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NULL;
