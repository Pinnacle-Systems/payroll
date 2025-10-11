/*
  Warnings:

  - You are about to drop the column `uid` on the `punchdata` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mIdCard,timestamp]` on the table `PunchData` will be added. If there are existing duplicate values, this will fail.
  - Made the column `mIdCard` on table `punchdata` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `PunchData_uid_timestamp_key` ON `punchdata`;

-- AlterTable
ALTER TABLE `punchdata` DROP COLUMN `uid`,
    MODIFY `mIdCard` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `PunchData_mIdCard_timestamp_key` ON `PunchData`(`mIdCard`, `timestamp`);
