/*
  Warnings:

  - You are about to alter the column `proformaImage` on the `po` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Json`.

*/
-- AlterTable
ALTER TABLE `po` MODIFY `proformaImage` JSON NULL;
