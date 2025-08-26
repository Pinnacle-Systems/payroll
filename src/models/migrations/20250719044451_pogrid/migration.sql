/*
  Warnings:

  - You are about to drop the column `color` on the `posubgrid` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `posubgrid` DROP COLUMN `color`,
    ADD COLUMN `colorId` INTEGER NULL,
    ADD COLUMN `uomId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `poSubGrid` ADD CONSTRAINT `poSubGrid_colorId_fkey` FOREIGN KEY (`colorId`) REFERENCES `Color`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `poSubGrid` ADD CONSTRAINT `poSubGrid_uomId_fkey` FOREIGN KEY (`uomId`) REFERENCES `UnitOfMeasurement`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
