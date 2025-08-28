/*
  Warnings:

  - You are about to drop the column `description` on the `hrcommontemplate` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `hrcommontemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `hrcommontemplate` DROP COLUMN `description`,
    DROP COLUMN `name`,
    ADD COLUMN `employeeCategoryId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `HRCommonTemplate` ADD CONSTRAINT `HRCommonTemplate_employeeCategoryId_fkey` FOREIGN KEY (`employeeCategoryId`) REFERENCES `EmployeeCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
