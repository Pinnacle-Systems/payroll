/*
  Warnings:

  - Made the column `payDetailsId` on table `pfesieditor` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `pfesieditor` DROP FOREIGN KEY `PFESIEditor_payDetailsId_fkey`;

-- AlterTable
ALTER TABLE `pfesieditor` MODIFY `payDetailsId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `PFESIEditor` ADD CONSTRAINT `PFESIEditor_payDetailsId_fkey` FOREIGN KEY (`payDetailsId`) REFERENCES `PayDetails`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
