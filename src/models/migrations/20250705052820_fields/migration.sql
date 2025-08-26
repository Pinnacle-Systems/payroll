/*
  Warnings:

  - You are about to drop the column `customerName` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `partyId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `supplierName` on the `order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `order_partyId_fkey`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `customerName`,
    DROP COLUMN `partyId`,
    DROP COLUMN `supplierName`,
    ADD COLUMN `customerId` INTEGER NULL,
    ADD COLUMN `supplierId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Party`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Party`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
