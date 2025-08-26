/*
  Warnings:

  - You are about to drop the `partymasternew` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `partymasternew` DROP FOREIGN KEY `PartyMasterNew_cityId_fkey`;

-- DropForeignKey
ALTER TABLE `partymasternew` DROP FOREIGN KEY `PartyMasterNew_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `partymasternew` DROP FOREIGN KEY `PartyMasterNew_currencyId_fkey`;

-- DropForeignKey
ALTER TABLE `partymasternew` DROP FOREIGN KEY `PartyMasterNew_updatedById_fkey`;

-- DropTable
DROP TABLE `partymasternew`;
