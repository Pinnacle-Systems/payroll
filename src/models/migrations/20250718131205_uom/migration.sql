/*
  Warnings:

  - You are about to drop the column `color` on the `subgrid` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `unitofmeasurement` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `unitofmeasurement` DROP FOREIGN KEY `UnitOfMeasurement_orderId_fkey`;

-- AlterTable
ALTER TABLE `subgrid` DROP COLUMN `color`,
    ADD COLUMN `colorId` INTEGER NULL,
    ADD COLUMN `uomId` INTEGER NULL;

-- AlterTable
ALTER TABLE `unitofmeasurement` DROP COLUMN `orderId`;

-- AddForeignKey
ALTER TABLE `SubGrid` ADD CONSTRAINT `SubGrid_colorId_fkey` FOREIGN KEY (`colorId`) REFERENCES `Color`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubGrid` ADD CONSTRAINT `SubGrid_uomId_fkey` FOREIGN KEY (`uomId`) REFERENCES `UnitOfMeasurement`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
