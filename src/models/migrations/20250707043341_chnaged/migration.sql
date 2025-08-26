/*
  Warnings:

  - You are about to drop the column `FabCode` on the `orderbillitems` table. All the data in the column will be lost.
  - You are about to drop the column `Fabrictype` on the `subgrid` table. All the data in the column will be lost.
  - You are about to drop the column `FiberContent` on the `subgrid` table. All the data in the column will be lost.
  - You are about to drop the column `GSM` on the `subgrid` table. All the data in the column will be lost.
  - You are about to drop the column `Price` on the `subgrid` table. All the data in the column will be lost.
  - You are about to drop the column `Quantity` on the `subgrid` table. All the data in the column will be lost.
  - You are about to drop the column `Width` on the `subgrid` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `orderbillitems` DROP COLUMN `FabCode`,
    ADD COLUMN `fabCode` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `subgrid` DROP COLUMN `Fabrictype`,
    DROP COLUMN `FiberContent`,
    DROP COLUMN `GSM`,
    DROP COLUMN `Price`,
    DROP COLUMN `Quantity`,
    DROP COLUMN `Width`,
    ADD COLUMN `fabType` VARCHAR(191) NULL,
    ADD COLUMN `fiberContent` VARCHAR(191) NULL,
    ADD COLUMN `priceFob` INTEGER NULL,
    ADD COLUMN `quantity` INTEGER NULL,
    ADD COLUMN `weightGSM` VARCHAR(191) NULL,
    ADD COLUMN `widthFinished` VARCHAR(191) NULL;
