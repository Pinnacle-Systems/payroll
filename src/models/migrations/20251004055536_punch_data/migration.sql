-- AlterTable
ALTER TABLE `punchdata` ADD COLUMN `machineIP` VARCHAR(191) NULL,
    ADD COLUMN `machineInOutGridId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `PunchData` ADD CONSTRAINT `PunchData_machineInOutGridId_fkey` FOREIGN KEY (`machineInOutGridId`) REFERENCES `MachineInOutGrid`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
