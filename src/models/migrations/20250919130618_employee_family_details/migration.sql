/*
  Warnings:

  - You are about to drop the column `relationShip` on the `employeefamilydetails` table. All the data in the column will be lost.
  - Added the required column `relationShipId` to the `EmployeeFamilyDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `employeefamilydetails` DROP COLUMN `relationShip`,
    ADD COLUMN `relationShipId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `EmployeeFamilyDetails` ADD CONSTRAINT `EmployeeFamilyDetails_relationShipId_fkey` FOREIGN KEY (`relationShipId`) REFERENCES `RelationShip`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
