/*
  Warnings:

  - You are about to alter the column `priceFob` on the `stylesheet` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `priceFob` on the `subgrid` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `quantity` on the `subgrid` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `stylesheet` MODIFY `priceFob` DOUBLE NULL;

-- AlterTable
ALTER TABLE `subgrid` MODIFY `priceFob` DOUBLE NULL,
    MODIFY `quantity` DOUBLE NULL;

-- CreateTable
CREATE TABLE `UnitOfMeasurement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `orderId` INTEGER NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `isCutting` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UnitOfMeasurement` ADD CONSTRAINT `UnitOfMeasurement_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
