/*
  Warnings:

  - You are about to drop the column `startDate` on the `leavedetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `leavedetails` DROP COLUMN `startDate`,
    ADD COLUMN `date` DATETIME(3) NULL;
