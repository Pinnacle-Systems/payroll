-- DropForeignKey
ALTER TABLE `employeefamilydetails` DROP FOREIGN KEY `EmployeeFamilyDetails_relationShipId_fkey`;

-- AlterTable
ALTER TABLE `employeefamilydetails` MODIFY `relationShipId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `EmployeeFamilyDetails` ADD CONSTRAINT `EmployeeFamilyDetails_relationShipId_fkey` FOREIGN KEY (`relationShipId`) REFERENCES `RelationShip`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
