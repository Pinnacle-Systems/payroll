-- CreateTable
CREATE TABLE `PreEmployee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `dob` DATETIME(3) NULL,
    `maritalStatus` VARCHAR(191) NULL,
    `mobileNumber` INTEGER NULL,
    `aadharNo` VARCHAR(191) NULL,
    `panNo` VARCHAR(191) NULL,
    `religion` VARCHAR(191) NULL,
    `presentAddress` VARCHAR(191) NULL,

    UNIQUE INDEX `PreEmployee_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
