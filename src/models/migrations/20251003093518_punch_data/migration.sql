/*
  Warnings:

  - You are about to drop the column `branchId` on the `punchdata` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `punchdata` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `punchdata` table. All the data in the column will be lost.
  - You are about to drop the column `finYearId` on the `punchdata` table. All the data in the column will be lost.
  - You are about to drop the column `punchId` on the `punchdata` table. All the data in the column will be lost.
  - You are about to drop the column `updatedById` on the `punchdata` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `punchdata` DROP FOREIGN KEY `PunchData_branchId_fkey`;

-- DropForeignKey
ALTER TABLE `punchdata` DROP FOREIGN KEY `PunchData_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `punchdata` DROP FOREIGN KEY `PunchData_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `punchdata` DROP FOREIGN KEY `PunchData_finYearId_fkey`;

-- DropForeignKey
ALTER TABLE `punchdata` DROP FOREIGN KEY `PunchData_updatedById_fkey`;

-- AlterTable
ALTER TABLE `punchdata` DROP COLUMN `branchId`,
    DROP COLUMN `companyId`,
    DROP COLUMN `createdById`,
    DROP COLUMN `finYearId`,
    DROP COLUMN `punchId`,
    DROP COLUMN `updatedById`,
    ADD COLUMN `uid` INTEGER NULL;
