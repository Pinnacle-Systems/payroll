/*
  Warnings:

  - Made the column `payDetailsId` on table `paystructure` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `paystructure` DROP FOREIGN KEY `PayStructure_payDetailsId_fkey`;

-- AlterTable
ALTER TABLE `paystructure` MODIFY `payDetailsId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `PayStructure` ADD CONSTRAINT `PayStructure_payDetailsId_fkey` FOREIGN KEY (`payDetailsId`) REFERENCES `PayDetails`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
