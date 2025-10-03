/*
  Warnings:

  - You are about to drop the column `date` on the `punchdata` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `punchdata` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uid,timestamp]` on the table `PunchData` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `timestamp` to the `PunchData` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `PunchData_uid_date_time_key` ON `punchdata`;

-- AlterTable
ALTER TABLE `punchdata` DROP COLUMN `date`,
    DROP COLUMN `time`,
    ADD COLUMN `timestamp` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `PunchData_uid_timestamp_key` ON `PunchData`(`uid`, `timestamp`);
