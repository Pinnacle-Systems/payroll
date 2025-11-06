/*
  Warnings:

  - Made the column `relationShipId` on table `employeefamilydetails` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `employeefamilydetails` DROP FOREIGN KEY `EmployeeFamilyDetails_relationShipId_fkey`;

-- AlterTable
ALTER TABLE `employeefamilydetails` MODIFY `relationShipId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `EmployeeFamilyDetails` ADD CONSTRAINT `EmployeeFamilyDetails_relationShipId_fkey` FOREIGN KEY (`relationShipId`) REFERENCES `RelationShip`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
