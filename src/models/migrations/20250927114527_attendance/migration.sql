/*
  Warnings:

  - You are about to drop the column `department` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `designation` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `empName` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `mIdCard` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `shiftTemplate` on the `attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `attendance` DROP COLUMN `department`,
    DROP COLUMN `designation`,
    DROP COLUMN `empName`,
    DROP COLUMN `mIdCard`,
    DROP COLUMN `shiftTemplate`;
