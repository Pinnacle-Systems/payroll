-- DropForeignKey
ALTER TABLE `designation` DROP FOREIGN KEY `Designation_companyId_fkey`;

-- AlterTable
ALTER TABLE `designation` MODIFY `departmentId` INTEGER NULL,
    MODIFY `companyId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Designation` ADD CONSTRAINT `Designation_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
