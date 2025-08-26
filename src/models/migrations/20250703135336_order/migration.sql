/*
  Warnings:

  - You are about to drop the column `barCode` on the `orderbillitems` table. All the data in the column will be lost.
  - You are about to drop the column `class` on the `orderbillitems` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `orderbillitems` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `orderbillitems` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `orderbillitems` table. All the data in the column will be lost.
  - You are about to drop the column `excessQty` on the `orderbillitems` table. All the data in the column will be lost.
  - You are about to drop the column `itemCode` on the `orderbillitems` table. All the data in the column will be lost.
  - You are about to drop the column `mrp` on the `orderbillitems` table. All the data in the column will be lost.
  - You are about to drop the column `orderQty` on the `orderbillitems` table. All the data in the column will be lost.
  - You are about to drop the column `product` on the `orderbillitems` table. All the data in the column will be lost.
  - You are about to drop the column `qty` on the `orderbillitems` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `orderbillitems` table. All the data in the column will be lost.
  - You are about to drop the column `sizeDesc` on the `orderbillitems` table. All the data in the column will be lost.
  - You are about to drop the column `styleCode` on the `orderbillitems` table. All the data in the column will be lost.
  - You are about to drop the column `supplierCode` on the `orderbillitems` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `orderbillitems` DROP COLUMN `barCode`,
    DROP COLUMN `class`,
    DROP COLUMN `color`,
    DROP COLUMN `date`,
    DROP COLUMN `department`,
    DROP COLUMN `excessQty`,
    DROP COLUMN `itemCode`,
    DROP COLUMN `mrp`,
    DROP COLUMN `orderQty`,
    DROP COLUMN `product`,
    DROP COLUMN `qty`,
    DROP COLUMN `size`,
    DROP COLUMN `sizeDesc`,
    DROP COLUMN `styleCode`,
    DROP COLUMN `supplierCode`,
    ADD COLUMN `FabCode` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `SubGrid` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderBillItemsId` INTEGER NULL,
    `Fabrictype` VARCHAR(191) NULL,
    `FiberContent` VARCHAR(191) NULL,
    `GSM` VARCHAR(191) NULL,
    `Width` VARCHAR(191) NULL,
    `Price` INTEGER NULL,
    `color` VARCHAR(191) NULL,
    `Quantity` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SubGrid` ADD CONSTRAINT `SubGrid_orderBillItemsId_fkey` FOREIGN KEY (`orderBillItemsId`) REFERENCES `orderBillItems`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
