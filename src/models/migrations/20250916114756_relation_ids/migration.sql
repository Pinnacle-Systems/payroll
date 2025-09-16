/*
  Warnings:

  - Made the column `finYearId` on table `payfrequency` required. This step will fail if there are existing NULL values in that column.
  - Made the column `employeeCategoryId` on table `shiftcommontemplate` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `country` DROP FOREIGN KEY `Country_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `department` DROP FOREIGN KEY `Department_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `payfrequency` DROP FOREIGN KEY `PayFrequency_finYearId_fkey`;

-- DropForeignKey
ALTER TABLE `shiftcommontemplate` DROP FOREIGN KEY `ShiftCommonTemplate_employeeCategoryId_fkey`;

-- AlterTable
ALTER TABLE `city` ADD COLUMN `branchId` INTEGER NULL,
    ADD COLUMN `companyId` INTEGER NULL,
    ADD COLUMN `createdById` INTEGER NULL,
    ADD COLUMN `updatedById` INTEGER NULL;

-- AlterTable
ALTER TABLE `country` ADD COLUMN `branchId` INTEGER NULL,
    ADD COLUMN `createdById` INTEGER NULL,
    ADD COLUMN `updatedById` INTEGER NULL,
    MODIFY `name` VARCHAR(191) NULL,
    MODIFY `code` VARCHAR(191) NULL,
    MODIFY `active` BOOLEAN NULL DEFAULT true,
    MODIFY `companyId` INTEGER NULL;

-- AlterTable
ALTER TABLE `department` ADD COLUMN `branchId` INTEGER NULL,
    ADD COLUMN `createdById` INTEGER NULL,
    ADD COLUMN `updatedById` INTEGER NULL,
    MODIFY `companyId` INTEGER NULL;

-- AlterTable
ALTER TABLE `designation` ADD COLUMN `branchId` INTEGER NULL,
    ADD COLUMN `createdById` INTEGER NULL,
    ADD COLUMN `updatedById` INTEGER NULL;

-- AlterTable
ALTER TABLE `employee` ADD COLUMN `companyId` INTEGER NULL;

-- AlterTable
ALTER TABLE `employeecategory` ADD COLUMN `companyId` INTEGER NULL,
    ADD COLUMN `createdById` INTEGER NULL,
    ADD COLUMN `updatedById` INTEGER NULL;

-- AlterTable
ALTER TABLE `finyear` ADD COLUMN `branchId` INTEGER NULL,
    ADD COLUMN `createdById` INTEGER NULL,
    ADD COLUMN `updatedById` INTEGER NULL;

-- AlterTable
ALTER TABLE `payfrequency` MODIFY `finYearId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `shiftcommontemplate` MODIFY `employeeCategoryId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `state` ADD COLUMN `branchId` INTEGER NULL,
    ADD COLUMN `companyId` INTEGER NULL,
    ADD COLUMN `createdById` INTEGER NULL,
    ADD COLUMN `updatedById` INTEGER NULL,
    MODIFY `name` VARCHAR(191) NULL,
    MODIFY `code` VARCHAR(191) NULL,
    MODIFY `gstNo` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinYear` ADD CONSTRAINT `FinYear_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinYear` ADD CONSTRAINT `FinYear_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinYear` ADD CONSTRAINT `FinYear_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeCategory` ADD CONSTRAINT `EmployeeCategory_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeCategory` ADD CONSTRAINT `EmployeeCategory_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeCategory` ADD CONSTRAINT `EmployeeCategory_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Country` ADD CONSTRAINT `Country_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Country` ADD CONSTRAINT `Country_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Country` ADD CONSTRAINT `Country_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Country` ADD CONSTRAINT `Country_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `State` ADD CONSTRAINT `State_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `State` ADD CONSTRAINT `State_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `State` ADD CONSTRAINT `State_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `State` ADD CONSTRAINT `State_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `City` ADD CONSTRAINT `City_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `City` ADD CONSTRAINT `City_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `City` ADD CONSTRAINT `City_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `City` ADD CONSTRAINT `City_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Department` ADD CONSTRAINT `Department_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Department` ADD CONSTRAINT `Department_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Department` ADD CONSTRAINT `Department_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Department` ADD CONSTRAINT `Department_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Designation` ADD CONSTRAINT `Designation_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Designation` ADD CONSTRAINT `Designation_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Designation` ADD CONSTRAINT `Designation_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShiftCommonTemplate` ADD CONSTRAINT `ShiftCommonTemplate_employeeCategoryId_fkey` FOREIGN KEY (`employeeCategoryId`) REFERENCES `EmployeeCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PayFrequency` ADD CONSTRAINT `PayFrequency_finYearId_fkey` FOREIGN KEY (`finYearId`) REFERENCES `FinYear`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
