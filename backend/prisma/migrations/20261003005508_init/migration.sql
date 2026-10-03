-- CreateTable
CREATE TABLE `FlightOffer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `offerId` VARCHAR(191) NOT NULL,
    `supplier` VARCHAR(191) NOT NULL,
    `supplierResultId` VARCHAR(191) NOT NULL,
    `airlineCode` VARCHAR(191) NOT NULL,
    `flightNumber` VARCHAR(191) NOT NULL,
    `origin` VARCHAR(191) NOT NULL,
    `destination` VARCHAR(191) NOT NULL,
    `departure` DATETIME(3) NOT NULL,
    `arrival` DATETIME(3) NOT NULL,
    `baggage` VARCHAR(191) NULL,
    `refundable` BOOLEAN NOT NULL DEFAULT false,
    `supplierBaseFare` DECIMAL(10, 2) NOT NULL,
    `supplierTaxes` DECIMAL(10, 2) NOT NULL,
    `supplierTotal` DECIMAL(10, 2) NOT NULL,
    `serviceFee` DECIMAL(10, 2) NOT NULL,
    `discount` DECIMAL(10, 2) NOT NULL,
    `customerTotal` DECIMAL(10, 2) NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'INR',
    `expiresAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FlightOffer_offerId_key`(`offerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tixxgoBookingReference` VARCHAR(191) NOT NULL,
    `flightOfferId` INTEGER NOT NULL,
    `supplier` VARCHAR(191) NOT NULL,
    `supplierResultId` VARCHAR(191) NOT NULL,
    `supplierBookingReference` VARCHAR(191) NULL,
    `supplierTotal` DECIMAL(10, 2) NOT NULL,
    `customerTotal` DECIMAL(10, 2) NOT NULL,
    `paymentStatus` ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUND_PENDING', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `bookingStatus` ENUM('PAYMENT_PENDING', 'PAYMENT_SUCCESS', 'SUPPLIER_BOOKING', 'BOOKING_CONFIRMED', 'BOOKING_FAILED', 'BOOKING_UNKNOWN', 'CANCELLATION_REQUESTED', 'CANCELLED') NOT NULL DEFAULT 'PAYMENT_PENDING',
    `ticketingStatus` ENUM('PENDING', 'TICKETED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Booking_tixxgoBookingReference_key`(`tixxgoBookingReference`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Traveller` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingId` INTEGER NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATETIME(3) NULL,
    `gender` VARCHAR(191) NULL,
    `passportNumber` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingId` INTEGER NOT NULL,
    `paymentReference` VARCHAR(191) NOT NULL,
    `idempotencyKey` VARCHAR(191) NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUND_PENDING', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Payment_paymentReference_key`(`paymentReference`),
    UNIQUE INDEX `Payment_idempotencyKey_key`(`idempotencyKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cancellation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingId` INTEGER NOT NULL,
    `supplierCharge` DECIMAL(10, 2) NOT NULL,
    `tixxgoFee` DECIMAL(10, 2) NOT NULL,
    `refundAmount` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('CANCELLATION_REQUESTED', 'CANCELLED', 'REFUND_PENDING', 'REFUNDED', 'FAILED') NOT NULL DEFAULT 'CANCELLATION_REQUESTED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IdempotencyKey` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `requestHash` VARCHAR(191) NOT NULL,
    `response` JSON NULL,
    `bookingId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `IdempotencyKey_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_flightOfferId_fkey` FOREIGN KEY (`flightOfferId`) REFERENCES `FlightOffer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Traveller` ADD CONSTRAINT `Traveller_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cancellation` ADD CONSTRAINT `Cancellation_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
