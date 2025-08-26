-- AlterTable
ALTER TABLE `order` ADD COLUMN `customerAddress` VARCHAR(191) NULL,
    ADD COLUMN `customerName` VARCHAR(191) NULL,
    ADD COLUMN `supplierAddress` VARCHAR(191) NULL,
    ADD COLUMN `supplierName` VARCHAR(191) NULL;
