/*
  Warnings:

  - You are about to alter the column `surCharges` on the `stylesheet` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.

*/
-- AlterTable
ALTER TABLE `stylesheet` MODIFY `surCharges` DOUBLE NULL;
