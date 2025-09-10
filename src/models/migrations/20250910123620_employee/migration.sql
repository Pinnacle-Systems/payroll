/*
  Warnings:

  - Added the required column `employeeSubCategoryId` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Made the column `departmentId` on table `employee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `designationId` on table `employee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `employeeCategoryId` on table `employee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `permanentCityId` on table `employee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shiftTemplateId` on table `employee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `permanentCountryId` on table `employee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `permanentStateId` on table `employee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `presentCountryId` on table `employee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `presentStateId` on table `employee` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_departmentId_fkey`;

-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_designationId_fkey`;

-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_employeeCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_permanentCityId_fkey`;

-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_permanentCountryId_fkey`;

-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_permanentStateId_fkey`;

-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_presentCountryId_fkey`;

-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_presentStateId_fkey`;

-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_shiftTemplateId_fkey`;

-- AlterTable
ALTER TABLE `employee` ADD COLUMN `employeeSubCategoryId` INTEGER NOT NULL,
    MODIFY `departmentId` INTEGER NOT NULL,
    MODIFY `designationId` INTEGER NOT NULL,
    MODIFY `employeeCategoryId` INTEGER NOT NULL,
    MODIFY `permanentCityId` INTEGER NOT NULL,
    MODIFY `shiftTemplateId` INTEGER NOT NULL,
    MODIFY `permanentCountryId` INTEGER NOT NULL,
    MODIFY `permanentStateId` INTEGER NOT NULL,
    MODIFY `presentCountryId` INTEGER NOT NULL,
    MODIFY `presentStateId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_shiftTemplateId_fkey` FOREIGN KEY (`shiftTemplateId`) REFERENCES `ShiftTemplate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_designationId_fkey` FOREIGN KEY (`designationId`) REFERENCES `Designation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_permanentCityId_fkey` FOREIGN KEY (`permanentCityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_presentCountryId_fkey` FOREIGN KEY (`presentCountryId`) REFERENCES `Country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_permanentCountryId_fkey` FOREIGN KEY (`permanentCountryId`) REFERENCES `Country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_presentStateId_fkey` FOREIGN KEY (`presentStateId`) REFERENCES `State`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_permanentStateId_fkey` FOREIGN KEY (`permanentStateId`) REFERENCES `State`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_employeeCategoryId_fkey` FOREIGN KEY (`employeeCategoryId`) REFERENCES `EmployeeCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_employeeSubCategoryId_fkey` FOREIGN KEY (`employeeSubCategoryId`) REFERENCES `EmployeSubCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
