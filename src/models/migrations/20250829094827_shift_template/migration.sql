/*
  Warnings:

  - You are about to drop the column `description` on the `shifttemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `shifttemplate` DROP COLUMN `description`,
    ADD COLUMN `endTime` VARCHAR(191) NULL,
    ADD COLUMN `fbIn` VARCHAR(191) NULL,
    ADD COLUMN `fbOut` VARCHAR(191) NULL,
    ADD COLUMN `inNextDay` VARCHAR(191) NULL,
    ADD COLUMN `lBEnday` VARCHAR(191) NULL,
    ADD COLUMN `lBSNDay` VARCHAR(191) NULL,
    ADD COLUMN `lunchBET` VARCHAR(191) NULL,
    ADD COLUMN `lunchBst` VARCHAR(191) NULL,
    ADD COLUMN `otHrs` VARCHAR(191) NULL,
    ADD COLUMN `outNxtDay` VARCHAR(191) NULL,
    ADD COLUMN `quater` VARCHAR(191) NULL,
    ADD COLUMN `sbIn` VARCHAR(191) NULL,
    ADD COLUMN `sbOut` VARCHAR(191) NULL,
    ADD COLUMN `shiftId` INTEGER NULL,
    ADD COLUMN `shiftTimeHrs` VARCHAR(191) NULL,
    ADD COLUMN `startTime` VARCHAR(191) NULL,
    ADD COLUMN `templateId` INTEGER NULL,
    ADD COLUMN `toleranceInAfterEnd` VARCHAR(191) NULL,
    ADD COLUMN `toleranceInBeforeStart` VARCHAR(191) NULL,
    ADD COLUMN `toleranceOutAfterEnd` VARCHAR(191) NULL,
    ADD COLUMN `toleranceOutBeforeStart` VARCHAR(191) NULL;
