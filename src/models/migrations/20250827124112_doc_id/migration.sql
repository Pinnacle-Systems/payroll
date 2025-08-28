/*
  Warnings:

  - You are about to drop the column `tempCode` on the `hrtemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `hrtemplate` DROP COLUMN `tempCode`,
    ADD COLUMN `docId` VARCHAR(191) NULL;
