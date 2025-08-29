/*
  Warnings:

  - You are about to drop the `employeesubcategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `employeesubcategory` DROP FOREIGN KEY `EmployeeSubCategory_branchId_fkey`;

-- DropForeignKey
ALTER TABLE `employeesubcategory` DROP FOREIGN KEY `EmployeeSubCategory_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `employeesubcategory` DROP FOREIGN KEY `EmployeeSubCategory_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `employeesubcategory` DROP FOREIGN KEY `EmployeeSubCategory_employeeCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `employeesubcategory` DROP FOREIGN KEY `EmployeeSubCategory_updatedById_fkey`;

-- DropTable
DROP TABLE `employeesubcategory`;
