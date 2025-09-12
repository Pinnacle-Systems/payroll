-- CreateTable
CREATE TABLE `CompanyPayStructure` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` INTEGER NULL,
    `updatedById` INTEGER NULL,
    `companyId` INTEGER NULL,
    `branchId` INTEGER NULL,
    `docId` VARCHAR(191) NULL,
    `date` DATETIME(3) NULL,
    `employeeCategoryId` INTEGER NOT NULL,
    `category` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PayStructure` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyPayStructureId` INTEGER NULL,
    `payDetailsId` INTEGER NULL,
    `salaryPercentage` DOUBLE NULL,
    `formula` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CompanyPayStructure` ADD CONSTRAINT `CompanyPayStructure_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyPayStructure` ADD CONSTRAINT `CompanyPayStructure_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyPayStructure` ADD CONSTRAINT `CompanyPayStructure_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyPayStructure` ADD CONSTRAINT `CompanyPayStructure_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyPayStructure` ADD CONSTRAINT `CompanyPayStructure_employeeCategoryId_fkey` FOREIGN KEY (`employeeCategoryId`) REFERENCES `EmployeeCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PayStructure` ADD CONSTRAINT `PayStructure_companyPayStructureId_fkey` FOREIGN KEY (`companyPayStructureId`) REFERENCES `CompanyPayStructure`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PayStructure` ADD CONSTRAINT `PayStructure_payDetailsId_fkey` FOREIGN KEY (`payDetailsId`) REFERENCES `PayDetails`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
