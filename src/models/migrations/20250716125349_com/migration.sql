/*
  Warnings:

  - Added the required column `companyId` to the `UnitOfMeasurement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `unitofmeasurement` ADD COLUMN `companyId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `UnitOfMeasurement` ADD CONSTRAINT `UnitOfMeasurement_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
