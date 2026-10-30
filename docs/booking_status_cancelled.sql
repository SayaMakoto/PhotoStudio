USE `photo_studio`;

-- Keep the complete booking lifecycle and ensure older databases accept admin rejection.
ALTER TABLE `bookings`
    MODIFY COLUMN `status` ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')
    NOT NULL DEFAULT 'pending'
    COMMENT 'Trạng thái đơn booking';
