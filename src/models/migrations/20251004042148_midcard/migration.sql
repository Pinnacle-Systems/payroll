/*
  Warnings:

  - A unique constraint covering the columns `[mIdCard]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `employee` ADD COLUMN `mIdCard` INTEGER NULL;

-- AlterTable
ALTER TABLE `punchdata` ADD COLUMN `mIdCard` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Employee_mIdCard_key` ON `Employee`(`mIdCard`);
