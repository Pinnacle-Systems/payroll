/*
  Warnings:

  - A unique constraint covering the columns `[mIdCard,timestamp]` on the table `PythonPunchData` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `pythonpunchdata` ADD COLUMN `employeeId` INTEGER NULL,
    ADD COLUMN `machineIP` VARCHAR(191) NULL,
    ADD COLUMN `machineInOutGridId` INTEGER NULL,
    ADD COLUMN `machineType` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `PythonPunchData_mIdCard_timestamp_key` ON `PythonPunchData`(`mIdCard`, `timestamp`);

-- AddForeignKey
ALTER TABLE `PythonPunchData` ADD CONSTRAINT `PythonPunchData_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PythonPunchData` ADD CONSTRAINT `PythonPunchData_machineInOutGridId_fkey` FOREIGN KEY (`machineInOutGridId`) REFERENCES `MachineInOutGrid`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
