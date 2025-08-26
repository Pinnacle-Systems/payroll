/*
  Warnings:

  - You are about to drop the column `customerName` on the `po` table. All the data in the column will be lost.
  - You are about to drop the column `dcNo` on the `po` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryDate` on the `po` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `po` table. All the data in the column will be lost.
  - You are about to drop the column `documantationFile` on the `po` table. All the data in the column will be lost.
  - You are about to drop the column `excelFile` on the `po` table. All the data in the column will be lost.
  - You are about to drop the column `jobNo` on the `po` table. All the data in the column will be lost.
  - You are about to drop the column `orderNo` on the `po` table. All the data in the column will be lost.
  - You are about to drop the column `poDate` on the `po` table. All the data in the column will be lost.
  - You are about to drop the column `poNumber` on the `po` table. All the data in the column will be lost.
  - You are about to drop the column `primaryEmail` on the `po` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryEmail` on the `po` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `po` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `po` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `Po` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Po` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplierId` to the `Po` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `po` DROP COLUMN `customerName`,
    DROP COLUMN `dcNo`,
    DROP COLUMN `deliveryDate`,
    DROP COLUMN `description`,
    DROP COLUMN `documantationFile`,
    DROP COLUMN `excelFile`,
    DROP COLUMN `jobNo`,
    DROP COLUMN `orderNo`,
    DROP COLUMN `poDate`,
    DROP COLUMN `poNumber`,
    DROP COLUMN `primaryEmail`,
    DROP COLUMN `secondaryEmail`,
    DROP COLUMN `status`,
    DROP COLUMN `subject`,
    ADD COLUMN `customerId` INTEGER NOT NULL,
    ADD COLUMN `customerPoNumber` VARCHAR(191) NULL,
    ADD COLUMN `date` DATETIME(3) NOT NULL,
    ADD COLUMN `deliveryTerm` VARCHAR(191) NULL,
    ADD COLUMN `docId` VARCHAR(191) NULL,
    ADD COLUMN `finalDestination` VARCHAR(191) NULL,
    ADD COLUMN `orderId` INTEGER NULL,
    ADD COLUMN `paymentTerms` VARCHAR(191) NULL,
    ADD COLUMN `portOrigin` VARCHAR(191) NULL,
    ADD COLUMN `quantityAllowance` VARCHAR(191) NULL,
    ADD COLUMN `revisedDate` DATETIME(3) NULL,
    ADD COLUMN `shipAddress` VARCHAR(191) NULL,
    ADD COLUMN `shipDate` DATETIME(3) NULL,
    ADD COLUMN `shipMobile` VARCHAR(191) NULL,
    ADD COLUMN `shipName` VARCHAR(191) NULL,
    ADD COLUMN `shipmentMode` VARCHAR(191) NULL,
    ADD COLUMN `shippingMark` VARCHAR(191) NULL,
    ADD COLUMN `supplierId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `poGrid` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `poId` INTEGER NOT NULL,
    `fabCode` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `poSubGrid` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `poGridId` INTEGER NOT NULL,
    `fabType` VARCHAR(191) NULL,
    `fiberContent` VARCHAR(191) NULL,
    `weightGSM` VARCHAR(191) NULL,
    `widthFinished` VARCHAR(191) NULL,
    `priceFob` DOUBLE NULL,
    `color` VARCHAR(191) NULL,
    `quantity` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Po` ADD CONSTRAINT `Po_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Party`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Po` ADD CONSTRAINT `Po_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Party`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Po` ADD CONSTRAINT `Po_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `poGrid` ADD CONSTRAINT `poGrid_poId_fkey` FOREIGN KEY (`poId`) REFERENCES `Po`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `poSubGrid` ADD CONSTRAINT `poSubGrid_poGridId_fkey` FOREIGN KEY (`poGridId`) REFERENCES `poGrid`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
