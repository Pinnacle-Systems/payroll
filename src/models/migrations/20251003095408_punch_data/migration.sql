/*
  Warnings:

  - A unique constraint covering the columns `[uid,date,time]` on the table `PunchData` will be added. If there are existing duplicate values, this will fail.
  - Made the column `date` on table `punchdata` required. This step will fail if there are existing NULL values in that column.
  - Made the column `time` on table `punchdata` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uid` on table `punchdata` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `punchdata` MODIFY `date` DATETIME(3) NOT NULL,
    MODIFY `time` DATETIME(3) NOT NULL,
    MODIFY `uid` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `PunchData_uid_date_time_key` ON `PunchData`(`uid`, `date`, `time`);
