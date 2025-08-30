/*
  Warnings:

  - You are about to drop the `paytype` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `paytype`;

-- CreateTable
CREATE TABLE `PayFrequencyItems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `salaryDate` DATETIME(3) NULL,
    `notes` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
