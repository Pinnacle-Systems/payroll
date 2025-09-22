-- DropForeignKey
ALTER TABLE `machineinoutgrid` DROP FOREIGN KEY `MachineInOutGrid_machineInOutEntryId_fkey`;

-- AddForeignKey
ALTER TABLE `MachineInOutGrid` ADD CONSTRAINT `MachineInOutGrid_machineInOutEntryId_fkey` FOREIGN KEY (`machineInOutEntryId`) REFERENCES `MachineInOutEntry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
