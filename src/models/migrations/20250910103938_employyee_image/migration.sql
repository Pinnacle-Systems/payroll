/*
  Warnings:

  - Added the required column `bloodGroupId` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Made the column `presentCityId` on table `employee` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_presentCityId_fkey`;

-- AlterTable
ALTER TABLE `employee` ADD COLUMN `bloodGroupId` INTEGER NOT NULL,
    ADD COLUMN `image` TEXT NULL,
    MODIFY `presentCityId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_presentCityId_fkey` FOREIGN KEY (`presentCityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_bloodGroupId_fkey` FOREIGN KEY (`bloodGroupId`) REFERENCES `BloodGroupMaster`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
