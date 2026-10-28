-- FILE HỢP NHẤT: schema + seed data + dữ liệu gói chụp mẫu.
-- CẢNH BÁO: Script sẽ DROP và tạo lại các bảng trong database photo_studio, làm mất dữ liệu hiện có.
-- Tài khoản mẫu: admin / 123456 (hoặc admin@photostudio.com / 123456).

-- =====================================================================
-- DATABASE SCHEMA: PhotoStudio Management System
-- Source: docs/csdl.xlsx
-- Database Engine: MySQL 8.x
-- Character Set: utf8mb4, Collation: utf8mb4_unicode_ci
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `photo_studio`
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE `photo_studio`;

-- Disable foreign key checks for dropping tables cleanly
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- DROP TABLES (in reverse dependency order)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `contacts`;
DROP TABLE IF EXISTS `contents`;
DROP TABLE IF EXISTS `banners`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `employee_reviews`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `booking_equipment`;
DROP TABLE IF EXISTS `booking_employee_assignments`;
DROP TABLE IF EXISTS `booking_accessories`;
DROP TABLE IF EXISTS `booking_clothing`;
DROP TABLE IF EXISTS `booking_backgrounds`;
DROP TABLE IF EXISTS `booking_services`;
DROP TABLE IF EXISTS `booking_packages`;
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `images`;
DROP TABLE IF EXISTS `package_equipments`;
DROP TABLE IF EXISTS `package_backgrounds`;
DROP TABLE IF EXISTS `package_services`;
DROP TABLE IF EXISTS `packages`;
DROP TABLE IF EXISTS `services`;
DROP TABLE IF EXISTS `accessories`;
DROP TABLE IF EXISTS `clothes`;
DROP TABLE IF EXISTS `equipments`;
DROP TABLE IF EXISTS `backgrounds`;
DROP TABLE IF EXISTS `rooms`;
DROP TABLE IF EXISTS `employees`;
DROP TABLE IF EXISTS `users`;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- 1. NHÓM QUẢN LÝ TÀI KHOẢN VÀ NHÂN VIÊN (Sheet: QL Tài Khoản)
-- =====================================================================

-- Bảng 1: users (Quản lý thông tin tài khoản người dùng)
CREATE TABLE `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `username` VARCHAR(255) NOT NULL UNIQUE COMMENT 'Tên đăng nhập',
    `email` VARCHAR(255) NOT NULL UNIQUE COMMENT 'Email người dùng',
    `password` VARCHAR(255) NOT NULL COMMENT 'Mật khẩu tài khoản (đã mã hóa hash)',
    `fullname` VARCHAR(255) NULL COMMENT 'Họ và tên người dùng',
    `date_of_birth` DATE NULL COMMENT 'Ngày tháng năm sinh',
    `gender` ENUM('Male', 'Female') NULL COMMENT 'Giới tính',
    `address` VARCHAR(255) NULL COMMENT 'Địa chỉ',
    `phone` VARCHAR(11) NULL COMMENT 'Số điện thoại liên lạc',
    `avatar` VARCHAR(255) NULL COMMENT 'Đường dẫn ảnh đại diện',
    `role` ENUM('Customer', 'Employee', 'Admin') NOT NULL DEFAULT 'Customer' COMMENT 'Vai trò người dùng',
    `status` ENUM('active', 'inactive', 'banned') NOT NULL DEFAULT 'active' COMMENT 'Trạng thái tài khoản',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo tài khoản',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật tài khoản'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý thông tin tài khoản và người dùng';

-- Bảng 2: employees (Hồ sơ nhân viên - Quan hệ 1-1 với users)
CREATE TABLE `employees` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `user_id` BIGINT NOT NULL UNIQUE COMMENT 'FK - users (Một user tối đa 1 hồ sơ nhân viên)',
    `position` ENUM('photographer', 'makeup', 'logistics') NOT NULL COMMENT 'Vị trí chuyên môn của nhân viên',
    `hire_date` DATE NULL COMMENT 'Ngày tuyển dụng nhân viên',
    `status` ENUM('active', 'inactive', 'on_leave') NOT NULL DEFAULT 'active' COMMENT 'Trạng thái nhân sự',
    CONSTRAINT `fk_employees_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý hồ sơ nhân viên studio';


-- =====================================================================
-- 2. NHÓM QUẢN LÝ CƠ SỞ VẬT CHẤT VÀ TÀI NGUYÊN (Sheet: QL CSVT & TN)
-- =====================================================================

-- Bảng 3: rooms (Phòng chụp)
CREATE TABLE `rooms` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `name` VARCHAR(255) NOT NULL COMMENT 'Tên phòng chụp',
    `description` VARCHAR(255) NULL COMMENT 'Mô tả phòng',
    `capacity` INT NOT NULL DEFAULT 1 COMMENT 'Sức chứa tối đa của 1 phòng',
    `status` ENUM('active', 'inactive', 'maintenance') NOT NULL DEFAULT 'active' COMMENT 'Trạng thái hoạt động',
    deleted_at DATETIME NULL COMMENT 'Thời điểm đưa phòng chụp vào thùng rác'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý phòng chụp';

-- Bảng 4: backgrounds (Bối cảnh chụp)
CREATE TABLE `backgrounds` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `name` VARCHAR(255) NOT NULL COMMENT 'Tên bối cảnh',
    `description` VARCHAR(255) NULL COMMENT 'Mô tả bối cảnh',
    `status` ENUM('active', 'inactive', 'maintenance') NOT NULL DEFAULT 'active' COMMENT 'Trạng thái bối cảnh',
    deleted_at DATETIME NULL COMMENT 'Thời điểm đưa bối cảnh vào thùng rác'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý bối cảnh chụp';

-- Bảng 5: equipments (Thiết bị)
CREATE TABLE `equipments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `type` ENUM('camera', 'lens', 'lighting', 'tripod', 'other') NOT NULL COMMENT 'Loại thiết bị',
    `name` VARCHAR(255) NOT NULL COMMENT 'Tên thiết bị',
    `brand` VARCHAR(255) NULL COMMENT 'Hãng thiết bị',
    `model` VARCHAR(255) NULL COMMENT 'Mẫu thiết bị',
    `serial_number` VARCHAR(255) NULL UNIQUE COMMENT 'Mã sê-ri thiết bị',
    `purchase_date` DATETIME NULL COMMENT 'Ngày mua thiết bị',
    `description` VARCHAR(255) NULL COMMENT 'Mô tả thiết bị',
    `status` ENUM('available', 'in_use', 'maintenance', 'broken', 'retired') NOT NULL DEFAULT 'available' COMMENT 'Trạng thái thiết bị',
    deleted_at DATETIME NULL COMMENT 'Thời điểm đưa thiết bị vào thùng rác'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý thiết bị studio';

-- Bảng 6: clothes (Trang phục)
CREATE TABLE `clothes` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `type` ENUM('wedding', 'traditional', 'casual', 'suit', 'cosplay', 'other') NOT NULL COMMENT 'Loại trang phục',
    `name` VARCHAR(255) NOT NULL COMMENT 'Tên trang phục',
    `size` VARCHAR(255) NULL COMMENT 'Kích cỡ (S, M, L, XL, Free size...)',
    `gender` ENUM('Male', 'Female') NULL COMMENT 'Đặc điểm giới tính trang phục',
    `color` VARCHAR(255) NULL COMMENT 'Màu sắc',
    `description` VARCHAR(255) NULL COMMENT 'Mô tả trang phục',
    `price` DOUBLE NOT NULL DEFAULT 0.0 COMMENT 'Giá thuê trang phục',
    `status` ENUM('available', 'rented', 'maintenance', 'damaged', 'retired') NOT NULL DEFAULT 'available' COMMENT 'Trạng thái trang phục',
    deleted_at DATETIME NULL COMMENT 'Thời điểm đưa trang phục vào thùng rác'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý trang phục cho thuê';

-- Bảng 7: accessories (Phụ kiện)
CREATE TABLE `accessories` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `type` ENUM('fashion', 'concept', 'vintage', 'wedding', 'other') NOT NULL COMMENT 'Loại phụ kiện',
    `name` VARCHAR(255) NOT NULL COMMENT 'Tên phụ kiện',
    `description` VARCHAR(255) NULL COMMENT 'Mô tả phụ kiện',
    `quantity` INT NOT NULL DEFAULT 0 COMMENT 'Số lượng trong kho',
    `price` DOUBLE NOT NULL DEFAULT 0.0 COMMENT 'Giá thuê phụ kiện',
    `status` ENUM('available', 'rented', 'maintenance', 'damaged', 'retired') NOT NULL DEFAULT 'available' COMMENT 'Trạng thái phụ kiện',
    deleted_at DATETIME NULL COMMENT 'Thời điểm đưa phụ kiện vào thùng rác'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý phụ kiện chụp ảnh';


-- =====================================================================
-- 3. NHÓM QUẢN LÝ DỊCH VỤ VÀ GÓI CHỤP (Sheet: QL DV & GC)
-- =====================================================================

-- Bảng 8: services (Dịch vụ gia tăng / đơn lẻ)
CREATE TABLE `services` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `name` VARCHAR(255) NOT NULL COMMENT 'Tên dịch vụ',
    `type` ENUM('photography', 'makeup', 'clothing', 'accessory', 'background') NOT NULL COMMENT 'Loại dịch vụ thêm',
    `description` VARCHAR(255) NULL COMMENT 'Mô tả dịch vụ',
    `duration` INT NOT NULL DEFAULT 0 COMMENT 'Thời lượng dự kiến thực hiện (phút)',
    `price` DOUBLE NOT NULL DEFAULT 0.0 COMMENT 'Giá dịch vụ',
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT 'Trạng thái dịch vụ',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo dịch vụ',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật dịch vụ',
    deleted_at DATETIME NULL COMMENT 'Thời điểm đưa dịch vụ vào thùng rác'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý danh mục dịch vụ';

-- Bảng 9: packages (Gói chụp ảnh)
CREATE TABLE `packages` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `name` VARCHAR(255) NOT NULL COMMENT 'Tên gói chụp',
    `description` VARCHAR(255) NULL COMMENT 'Mô tả gói chụp',
    `duration` INT NOT NULL DEFAULT 0 COMMENT 'Thời lượng dự kiến toàn bộ gói chụp (phút)',
    `price` DOUBLE NOT NULL DEFAULT 0.0 COMMENT 'Giá gói chụp',
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT 'Trạng thái gói chụp',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo gói chụp',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật gói chụp',
    deleted_at DATETIME NULL COMMENT 'Thời điểm đưa gói chụp vào thùng rác'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý danh mục gói chụp ảnh';

-- Bảng 10: package_services (Dịch vụ bao gồm trong gói chụp - Quan hệ N-N giữa packages và services)
CREATE TABLE `package_services` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `package_id` BIGINT NOT NULL COMMENT 'FK - packages',
    `service_id` BIGINT NOT NULL COMMENT 'FK - services',
    `quantity` INT NOT NULL DEFAULT 1 COMMENT 'Số lượng dịch vụ trong gói chụp',
    CONSTRAINT `fk_ps_package` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_ps_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chi tiết dịch vụ đi kèm trong gói chụp';

-- Bảng 11: package_backgrounds (Bối cảnh trong gói chụp - Quan hệ N-N giữa packages và backgrounds)
CREATE TABLE `package_backgrounds` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `package_id` BIGINT NOT NULL COMMENT 'FK - packages',
    `background_id` BIGINT NOT NULL COMMENT 'FK - backgrounds',
    CONSTRAINT `fk_pb_package` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_pb_background` FOREIGN KEY (`background_id`) REFERENCES `backgrounds` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chi tiết bối cảnh áp dụng cho gói chụp';

-- Bảng 12: package_equipments (Yêu cầu thiết bị trong gói chụp - Quan hệ 1-N từ package)
CREATE TABLE `package_equipments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `package_id` BIGINT NOT NULL COMMENT 'FK - packages',
    `equipment_type` ENUM('camera', 'lens', 'lighting', 'tripod', 'other') NOT NULL COMMENT 'Loại thiết bị yêu cầu cho gói chụp',
    `quantity` INT NOT NULL DEFAULT 1 COMMENT 'Số lượng thiết bị trong gói chụp',
    CONSTRAINT `fk_pe_package` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Yêu cầu thiết bị tối thiểu cho gói chụp';


-- =====================================================================
-- 4. NHÓM QUẢN LÝ HÌNH ẢNH (Sheet: QL Hình Ảnh)
-- =====================================================================

-- Bảng 13: images (Quản lý hình ảnh đa hình - Polymorphic Images)
CREATE TABLE `images` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `imageable_type` ENUM('room', 'background', 'equipment', 'clothing', 'accessory', 'package', 'service') NOT NULL COMMENT 'Loại đối tượng gắn ảnh',
    `imageable_id` BIGINT NOT NULL COMMENT 'Mã ID đối tượng gắn ảnh',
    `image_url` VARCHAR(255) NOT NULL COMMENT 'Đường dẫn ảnh',
    `description` VARCHAR(255) NULL COMMENT 'Mô tả hình ảnh',
    `is_primary` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Đặt làm hình đại diện/tiêu đề',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo ảnh',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật ảnh',
    INDEX `idx_images_imageable` (`imageable_type`, `imageable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng lưu trữ hình ảnh đa hình cho các tài nguyên và dịch vụ';


-- =====================================================================
-- 5. NHÓM QUẢN LÝ BOOKING & PHÂN BỔ TÀI NGUYÊN (Sheet: QL Booking & PBTN)
-- =====================================================================

-- Bảng 14: bookings (Đơn đặt lịch chụp)
CREATE TABLE `bookings` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `customer_id` BIGINT NOT NULL COMMENT 'FK - users (Khách hàng đặt lịch)',
    `room_id` BIGINT NOT NULL COMMENT 'FK - rooms (Phòng chụp)',
    `booking_date` DATETIME NOT NULL COMMENT 'Ngày chụp / Ngày đặt lịch',
    `start_time` TIME NOT NULL COMMENT 'Thời gian bắt đầu chụp',
    `end_time` TIME NOT NULL COMMENT 'Thời gian kết thúc chụp',
    `status` ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending' COMMENT 'Trạng thái đơn booking',
    `customer_note` VARCHAR(255) NULL COMMENT 'Ghi chú của khách hàng',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo lịch book',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật lịch book',
    CONSTRAINT `fk_bookings_customer` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_bookings_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý thông tin đặt lịch chụp của khách hàng';

-- Bảng 15: booking_packages (Gói chụp được chọn trong đơn booking)
CREATE TABLE `booking_packages` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `booking_id` BIGINT NOT NULL COMMENT 'FK - bookings',
    `package_id` BIGINT NOT NULL COMMENT 'FK - packages',
    `quantity` INT NOT NULL DEFAULT 1 COMMENT 'Số lượng gói chụp',
    `unit_price` DOUBLE NOT NULL DEFAULT 0.0 COMMENT 'Đơn giá gói chụp tại thời điểm đặt',
    CONSTRAINT `fk_bp_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_bp_package` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chi tiết gói chụp được sử dụng trong buổi chụp';

-- Bảng 16: booking_services (Dịch vụ phát sinh/thêm trong đơn booking)
CREATE TABLE `booking_services` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `booking_id` BIGINT NOT NULL COMMENT 'FK - bookings',
    `service_id` BIGINT NOT NULL COMMENT 'FK - services',
    `quantity` INT NOT NULL DEFAULT 1 COMMENT 'Số lượng dịch vụ',
    `unit_price` DOUBLE NOT NULL DEFAULT 0.0 COMMENT 'Đơn giá dịch vụ tại thời điểm đặt',
    CONSTRAINT `fk_bs_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_bs_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chi tiết dịch vụ thêm trong buổi chụp';

-- Bảng 17: booking_backgrounds (Bối cảnh sử dụng trong đơn booking)
CREATE TABLE `booking_backgrounds` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `booking_id` BIGINT NOT NULL COMMENT 'FK - bookings',
    `background_id` BIGINT NOT NULL COMMENT 'FK - backgrounds',
    CONSTRAINT `fk_bbg_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_bbg_background` FOREIGN KEY (`background_id`) REFERENCES `backgrounds` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chi tiết bối cảnh sử dụng cho buổi chụp';

-- Bảng 18: booking_clothing (Trang phục thuê trong đơn booking)
CREATE TABLE `booking_clothing` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `booking_id` BIGINT NOT NULL COMMENT 'FK - bookings',
    `cloth_id` BIGINT NOT NULL COMMENT 'FK - clothes',
    `quantity` INT NOT NULL DEFAULT 1 COMMENT 'Số lượng trang phục thuê',
    CONSTRAINT `fk_bc_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_bc_cloth` FOREIGN KEY (`cloth_id`) REFERENCES `clothes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chi tiết trang phục thuê trong buổi chụp';

-- Bảng 19: booking_accessories (Phụ kiện thuê trong đơn booking)
CREATE TABLE `booking_accessories` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `booking_id` BIGINT NOT NULL COMMENT 'FK - bookings',
    `accessory_id` BIGINT NOT NULL COMMENT 'FK - accessories',
    `quantity` INT NOT NULL DEFAULT 1 COMMENT 'Số lượng phụ kiện thuê',
    CONSTRAINT `fk_ba_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_ba_accessory` FOREIGN KEY (`accessory_id`) REFERENCES `accessories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chi tiết phụ kiện thuê trong buổi chụp';

-- Bảng 20: booking_employee_assignments (Phân công nhân viên cho đơn booking)
CREATE TABLE `booking_employee_assignments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `booking_id` BIGINT NOT NULL COMMENT 'FK - bookings',
    `employee_id` BIGINT NOT NULL COMMENT 'FK - employees',
    `assigned_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày nhân viên nhận lịch làm việc',
    `status` ENUM('assigned', 'completed', 'cancelled') NOT NULL DEFAULT 'assigned' COMMENT 'Trạng thái phân công',
    `note` VARCHAR(255) NULL COMMENT 'Ghi chú dành cho nhân viên',
    CONSTRAINT `fk_bea_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_bea_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Phân công nhân viên phụ trách buổi chụp';

-- Bảng 21: booking_equipment (Cấp phát thiết bị cho đơn booking)
CREATE TABLE `booking_equipment` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `booking_id` BIGINT NOT NULL COMMENT 'FK - bookings',
    `equipment_id` BIGINT NOT NULL COMMENT 'FK - equipments',
    `assigned_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày bắt đầu cấp thiết bị cho nhân viên',
    `returned_at` DATETIME NULL COMMENT 'Ngày hoàn trả thiết bị',
    `status` ENUM('assigned', 'returned', 'cancelled') NOT NULL DEFAULT 'assigned' COMMENT 'Trạng thái thiết bị',
    `note` VARCHAR(255) NULL COMMENT 'Ghi chú bàn giao/tình trạng thiết bị',
    CONSTRAINT `fk_be_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_be_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipments` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý cấp phát và hoàn trả thiết bị cho buổi chụp';


-- =====================================================================
-- 6. NHÓM QUẢN LÝ THANH TOÁN VÀ ĐÁNH GIÁ (Sheet: QL TT & DG)
-- =====================================================================

-- Bảng 22: payments (Lịch sử thanh toán đơn booking - Quan hệ 1-N)
CREATE TABLE `payments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `booking_id` BIGINT NOT NULL COMMENT 'FK - bookings (1 booking có thể có nhiều lần thanh toán/đặt cọc)',
    `payment_method` ENUM('cash', 'vnpay', 'credit_card') NOT NULL COMMENT 'Phương thức thanh toán',
    `amount` DOUBLE NOT NULL DEFAULT 0.0 COMMENT 'Số tiền thanh toán',
    `paid_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm thanh toán',
    `note` VARCHAR(255) NULL COMMENT 'Ghi chú thanh toán',
    `status` ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending' COMMENT 'Trạng thái giao dịch',
    CONSTRAINT `fk_payments_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý giao dịch thanh toán của đơn đặt lịch';

-- Bảng 23: reviews (Đánh giá buổi chụp từ khách hàng - Quan hệ 1-1 với booking)
CREATE TABLE `reviews` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `booking_id` BIGINT NOT NULL UNIQUE COMMENT 'FK - bookings (1 booking chỉ có tối đa 1 bài đánh giá)',
    `customer_id` BIGINT NOT NULL COMMENT 'FK - users (Khách hàng đánh giá)',
    `rating` DOUBLE NOT NULL DEFAULT 5.0 COMMENT 'Số sao đánh giá (ví dụ: 1.0 - 5.0)',
    `comment` VARCHAR(255) NULL COMMENT 'Bình luận nhận xét của khách hàng',
    `admin_reply` TEXT NULL COMMENT 'Phản hồi của quản trị viên',
    `admin_replied_at` DATETIME NULL COMMENT 'Thời điểm quản trị viên phản hồi',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo đánh giá',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày sửa bài đánh giá',
    CONSTRAINT `fk_reviews_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_reviews_customer` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý đánh giá buổi chụp của khách hàng';

-- Bảng 24: employee_reviews (Đánh giá cụ thể từng nhân viên trong bài review - Quan hệ N-N)
CREATE TABLE `employee_reviews` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `review_id` BIGINT NOT NULL COMMENT 'FK - reviews',
    `employee_id` BIGINT NOT NULL COMMENT 'FK - employees',
    `rating` DOUBLE NOT NULL DEFAULT 5.0 COMMENT 'Số sao đánh giá cho nhân viên',
    `comment` VARCHAR(255) NULL COMMENT 'Bình luận đánh giá nhân viên',
    `admin_reply` TEXT NULL COMMENT 'Phản hồi của quản trị viên',
    `admin_replied_at` DATETIME NULL COMMENT 'Thời điểm quản trị viên phản hồi',
    CONSTRAINT `fk_er_review` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_er_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Đánh giá chi tiết thái độ và tay nghề của từng nhân viên';


-- =====================================================================
-- 7. NHÓM QUẢN LÝ NỘI DUNG VÀ TƯƠNG TÁC HỆ THỐNG (Sheet: QL ND & TTHT)
-- =====================================================================

-- Bảng 25: notifications (Thông báo người dùng)
CREATE TABLE `notifications` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `user_id` BIGINT NOT NULL COMMENT 'FK - users (Người nhận thông báo)',
    `title` VARCHAR(255) NOT NULL COMMENT 'Tiêu đề thông báo',
    `message` VARCHAR(255) NOT NULL COMMENT 'Nội dung thông báo',
    `type` ENUM('booking', 'payment', 'employee_assignment', 'equipment', 'system') NOT NULL COMMENT 'Loại thông báo',
    `read_at` DATETIME NULL COMMENT 'Thời gian người dùng đã đọc thông báo',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo thông báo',
    CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý thông báo gửi đến người dùng';

-- Bảng 26: banners (Banner quảng cáo/trưng bày)
CREATE TABLE `banners` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `title` VARCHAR(255) NOT NULL COMMENT 'Tiêu đề banner',
    `image_url` VARCHAR(255) NOT NULL COMMENT 'Đường dẫn ảnh banner',
    `link` VARCHAR(255) NULL COMMENT 'Đường dẫn liên kết khi nhấn vào banner',
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT 'Trạng thái hiển thị banner'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý banner quảng cáo hiển thị trên website';

-- Bảng 27: contents (Nội dung tĩnh, bài viết blog, trang giới thiệu...)
CREATE TABLE `contents` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `type` ENUM('page', 'post') NOT NULL COMMENT 'Loại nội dung (trang tĩnh hoặc bài viết)',
    `title` VARCHAR(255) NOT NULL COMMENT 'Tiêu đề nội dung/bài viết',
    `slug` VARCHAR(255) NOT NULL UNIQUE COMMENT 'Đường dẫn thân thiện (slug)',
    `content` TEXT NULL COMMENT 'Nội dung chi tiết',
    `image_url` VARCHAR(255) NULL COMMENT 'Đường dẫn ảnh đại diện bài viết',
    `status` ENUM('draft', 'published', 'hidden') NOT NULL DEFAULT 'draft' COMMENT 'Trạng thái bài viết',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo bài viết',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật bài viết'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý bài viết và các trang nội dung tĩnh của website';

-- Bảng 28: contacts (Quản lý liên hệ, phản hồi và yêu cầu tư vấn từ khách hàng)
CREATE TABLE `contacts` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `user_id` BIGINT NULL COMMENT 'FK - users (Tài khoản người dùng nếu đã đăng nhập, NULL nếu là khách vãng lai)',
    `fullname` VARCHAR(255) NOT NULL COMMENT 'Họ và tên người gửi liên hệ',
    `email` VARCHAR(255) NOT NULL COMMENT 'Email người gửi để nhận phản hồi',
    `phone` VARCHAR(20) NULL COMMENT 'Số điện thoại liên hệ',
    `subject` VARCHAR(255) NULL COMMENT 'Tiêu đề / Chủ đề liên hệ (tư vấn gói chụp, báo giá, thắc mắc...)',
    `message` TEXT NOT NULL COMMENT 'Nội dung tin nhắn / yêu cầu liên hệ',
    `status` ENUM('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending' COMMENT 'Trạng thái xử lý liên hệ',
    `reply_message` TEXT NULL COMMENT 'Nội dung phản hồi từ quản trị viên / nhân viên studio',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm gửi liên hệ',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật trạng thái hoặc gửi phản hồi',
    CONSTRAINT `fk_contacts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý tin nhắn liên hệ và phản hồi của khách hàng';

-- =====================================================================
-- KẾT THÚC CẤU TRÚC CƠ SỞ DỮ LIỆU


-- =====================================================================
-- DỮ LIỆU MẪU TOÀN DIỆN CHO PHOTOSTUDIO (DUY NHẤT VÀ ĐẦY ĐỦ NHẤT)
-- Database: photo_studio
-- =====================================================================

USE `photo_studio`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- 1. TÀI KHOẢN NGƯỜI DÙNG (USERS TABLE)
-- Mật khẩu mặc định cho tất cả tài khoản mẫu là: 123456
-- ---------------------------------------------------------------------
INSERT INTO `users` (`id`, `username`, `email`, `password`, `fullname`, `date_of_birth`, `gender`, `address`, `phone`, `avatar`, `role`, `status`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@photostudio.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Quản Trị Viên', '1990-01-01', 'Male', 'Hà Nội', '0901234567', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'Admin', 'active', NOW(), NOW()),
(2, 'photographer1', 'hoanganh@photostudio.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Nguyễn Hoàng Anh', '1995-05-15', 'Male', 'Hà Nội', '0912345678', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 'Employee', 'active', NOW(), NOW()),
(3, 'makeup1', 'thuytien@photostudio.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Trần Thủy Tiên', '1998-08-20', 'Female', 'Hà Nội', '0923456789', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', 'Employee', 'active', NOW(), NOW()),
(4, 'customer1', 'minhtuan@gmail.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Lê Minh Tuấn', '2000-03-10', 'Male', 'Cầu Giấy, Hà Nội', '0934567890', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80', 'Customer', 'active', NOW(), NOW()),
(5, 'customer2', 'phuonglinh@gmail.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Phạm Phương Linh', '2001-11-25', 'Female', 'Đống Đa, Hà Nội', '0945678901', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', 'Customer', 'active', NOW(), NOW()),
(6, 'customer3', 'thutrang.nguyen@gmail.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Nguyễn Thu Trang', '1998-04-12', 'Female', 'Tây Hồ, Hà Nội', '0911223344', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'Customer', 'active', NOW(), NOW()),
(7, 'customer4', 'hoangnam.studio@gmail.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Hoàng Nam', '1996-09-18', 'Male', 'Ba Đình, Hà Nội', '0922334455', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 'Customer', 'active', NOW(), NOW()),
(8, 'customer5', 'khanhhuyen.tran@gmail.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Trần Khánh Huyền', '2001-02-14', 'Female', 'Hoàn Kiếm, Hà Nội', '0933445566', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', 'Customer', 'active', NOW(), NOW()),
(9, 'customer6', 'quocbao.ceo@techlab.vn', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Đặng Quốc Bảo', '1992-12-05', 'Male', 'Thanh Xuân, Hà Nội', '0944556677', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', 'Customer', 'active', NOW(), NOW()),
(10, 'customer7', 'hoangmai.vu@gmail.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Vũ Hoàng Mai', '2002-07-21', 'Female', 'Hai Bà Trưng, Hà Nội', '0955667788', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', 'Customer', 'active', NOW(), NOW()),
(11, 'customer8', 'thang.duc@gmail.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Nguyễn Đức Thắng', '1994-06-30', 'Male', 'Nam Từ Liêm, Hà Nội', '0966778899', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', 'Customer', 'active', NOW(), NOW());

-- ---------------------------------------------------------------------
-- 2. HỒ SƠ NHÂN VIÊN (EMPLOYEES TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `employees` (`id`, `user_id`, `position`, `hire_date`, `status`) VALUES
(1, 2, 'photographer', '2023-01-15', 'active'),
(2, 3, 'makeup', '2023-03-01', 'active');

-- ---------------------------------------------------------------------
-- 3. PHÒNG CHỤP STUDIO (ROOMS TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `rooms` (`id`, `name`, `description`, `capacity`, `status`) VALUES
(1, 'Phòng Studio A - Phong Cách Hàn Quốc', 'Tone màu sáng pastel, rèm voan trắng, hoa khô nghệ thuật, chuyên chụp chân dung, nàng thơ và beauty layout nhẹ nhàng', 5, 'active'),
(2, 'Phòng Studio B - Concept Cổ Điển & Hoàng Gia', 'Diện tích 75m2, trần cao 4.2m, nội thất gỗ sồi cao cấp, đèn chùm pha lê, chuyên ảnh cưới VIP và dạ tiệc sang trọng', 10, 'active'),
(3, 'Phòng Studio VIP - Cinema & Đa Năng', 'Trang bị hệ thống chiếu sáng kịch tính Arri/Aputure, dàn phông màu điện tử 8 màu tự động, phù hợp chụp profile doanh nhân & lookbook', 8, 'active'),
(4, 'Phòng Studio C - Không Gian Gia Đình Vintage', 'Bối cảnh phòng khách ấm cúng với sofa nhung cổ, lò sưởi, đàn piano, chuyên chụp ảnh gia đình đa thế hệ và thôi nôi cho bé', 12, 'active'),
(5, 'Phòng Studio D - Concept Monochromatic', 'Tường xi măng công nghiệp tối giản, hệ thống tản sáng khổ lớn, chuyên chụp lookbook thời trang thương hiệu và nghệ thuật đen trắng', 6, 'active'),
(6, 'Phòng Studio E - Ban Công Hoàng Hôn & Vườn Kính', 'Không gian đón trọn ánh sáng tự nhiên hoàng hôn với cửa kính panorama và giàn hoa nghệ thuật cho cặp đôi', 6, 'active'),
(7, 'Phòng Studio F - Phong Cách Á Đông & Cổ Phục', 'Tường vàng rêu phong hoài niệm, hồ sen tiểu cảnh và đèn lồng lụa chuyên chụp áo dài truyền thống và cổ phục', 8, 'active'),
(8, 'Phòng Studio G - Thư Viện Quý Tộc & Gỗ Trầm', 'Kệ sách gỗ sồi kịch trần, sofa da bò Chesterfield cổ điển chuyên chụp profile chuyên gia và gia đình cao cấp', 6, 'active'),
(9, 'Phòng Studio H - Industrial Loft Sáng Tạo', 'Trần cao bê tông mộc nghệ thuật, khung thép phong cách New York loft chuyên chụp lookbook street-style và nghệ thuật', 8, 'active'),
(10, 'Phòng Studio I - Không Gian Em Bé & Thôi Nôi', 'Không gian an toàn decor tone màu pastel ngọt ngào, đồ chơi gỗ phong cách Scandinavian chuyên chụp cho bé và mẹ bầu', 5, 'active'),
(11, 'Phòng Studio K - Sảnh Cưới Grand Ballroom', 'Sàn gương bóng bẩy, vòm hoa cưới khổng lồ và đèn chùm pha lê lộng lẫy chuyên chụp ảnh cưới dạ hội sang trọng', 12, 'active'),
(12, 'Phòng Studio L - High-End Cyclorama Vô Cực', 'Vách cong vô cực 3D 180 độ tiêu chuẩn quốc tế, hệ thống thanh treo ray điện chuyên nghiệp cho thương mại điện tử', 10, 'active');

-- ---------------------------------------------------------------------
-- 4. BỐI CẢNH CHỤP STUDIO (BACKGROUNDS TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `backgrounds` (`id`, `name`, `description`, `status`) VALUES
(1, 'Phông Hàn Quốc Pastel Tối Giản', 'Phông nền màu pastel tự động, ánh sáng dịu mắt phù hợp chụp chân dung nàng thơ và profile cá nhân', 'active'),
(2, 'Góc Phố Cổ Hội An & Sen Hồ Á Đông', 'Bối cảnh tường vàng rêu phong, đèn lồng và hoa sen chụp áo dài truyền thống, cổ trang', 'active'),
(3, 'Cung Điện Cổ Điển Châu Âu Luxury', 'Thiết kế vòm đá cẩm thạch phong cách Pháp, rèm nhung và đèn chùm pha lê sang trọng cho ảnh cưới', 'active'),
(4, 'Ban Công Hoàng Hôn & Vườn Hoa Studio', 'Không gian mở đón trọn ánh sáng tự nhiên hoàng hôn lãng mạn cho cặp đôi và cô dâu', 'active'),
(5, 'Phòng Đọc Sách & Sofa Da Vintage', 'Nội thất gỗ trầm ấm cổ điển, kệ sách gỗ sồi và sofa Chesterfield dành cho gia đình và doanh nhân', 'active'),
(6, 'Phông Trắng / Đen Studio High-End', 'Phông nền vô cực tiêu chuẩn quốc tế cho lookbook thời trang và ảnh thương mại', 'active');

-- ---------------------------------------------------------------------
-- 5. THIẾT BỊ STUDIO (EQUIPMENTS TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `equipments` (`id`, `type`, `name`, `brand`, `model`, `serial_number`, `purchase_date`, `description`, `status`) VALUES
(1, 'camera', 'Sony Alpha 7 IV Full-Frame', 'Sony', 'ILCE-7M4', 'SN-SONY-7M4-01', '2023-05-10', 'Máy ảnh độ phân giải 33MP chuyên chụp studio & chân dung màu chuẩn', 'available'),
(2, 'camera', 'Canon EOS R5 Độ Phân Giải 45MP', 'Canon', 'EOS R5', 'SN-CANON-R5-02', '2023-06-12', 'Máy ảnh cao cấp chụp chi tiết da cực cao cho bộ ảnh cưới và beauty', 'available'),
(3, 'camera', 'Sony Alpha 7R V (61 Megapixels)', 'Sony', 'ILCE-7RM5', 'SN-SONY-7R5-03', '2023-11-20', 'Siêu máy ảnh studio 61MP cho ảnh in ấn khổ lớn và biển quảng cáo', 'available'),
(4, 'camera', 'Fujifilm GFX 100S Medium Format', 'Fujifilm', 'GFX-100S', 'SN-FUJI-100S-04', '2024-01-15', 'Cảm biến Medium Format 102MP chụp lookbook thời trang thương hiệu cao cấp', 'available'),
(5, 'lens', 'Sony FE 24-70mm F2.8 GM II', 'Sony', 'SEL2470GM2', 'SN-LENS-2470GM-05', '2023-05-15', 'Ống kính đa dụng cao cấp bậc nhất của dòng G Master', 'available'),
(6, 'lens', 'Sony FE 85mm F1.4 GM Chân Dung', 'Sony', 'SEL85F14GM', 'SN-LENS-85GM-06', '2023-07-01', 'Ống kính chuyên trị chân dung, bokeh mịn như nhung', 'available'),
(7, 'lens', 'Canon RF 50mm F1.2L USM', 'Canon', 'RF-50-F12', 'SN-LENS-RF50-07', '2023-08-10', 'Ống kính tiêu cự chuẩn mắt người, độ nét tối đa ở khẩu f/1.2', 'available'),
(8, 'lens', 'Canon RF 70-200mm F2.8L IS USM', 'Canon', 'RF-70200-F28', 'SN-LENS-RF70200-08', '2023-09-05', 'Ống kính tele bắt góc cận cảnh từ xa cho cô dâu chú rể tự nhiên', 'available'),
(9, 'lighting', 'Đèn Studio Godox AD600 Pro TTL', 'Godox', 'AD600Pro', 'SN-LIGHT-AD600-09', '2023-04-01', 'Đèn công suất mạnh 600W cho ánh sáng studio chuẩn quốc tế', 'available'),
(10, 'lighting', 'Đèn Studio Godox AD400 Pro', 'Godox', 'AD400Pro', 'SN-LIGHT-AD400-10', '2023-04-10', 'Đèn flash studio cơ động đánh sáng viền và tóc cho mẫu', 'available'),
(11, 'lighting', 'Đèn Nanlite Forza 500B II Bi-Color', 'Nanlite', 'Forza-500B', 'SN-LIGHT-NANLITE-11', '2023-10-18', 'Đèn liên tục nhiệt độ màu 2700K - 6500K quay video & chụp ảnh điện ảnh', 'available'),
(12, 'tripod', 'Chân Máy Ảnh Manfrotto 055 Pro', 'Manfrotto', 'MK055XPRO3', 'SN-TRIPOD-055-12', '2023-02-18', 'Chân máy ảnh carbon chịu tải 15kg, vô cùng đầm chắc', 'available'),
(13, 'other', 'Softbox Bát Giác Aputure Light Dome 150cm', 'Aputure', 'Dome-150', 'SN-SOFTBOX-150-13', '2023-03-25', 'Chao tản sáng tổ ong cực lớn tạo ánh sáng mềm mịn cho da mặt', 'available');

-- ---------------------------------------------------------------------
-- 6. TRANG PHỤC STUDIO (CLOTHES TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `clothes` (`id`, `type`, `name`, `size`, `gender`, `color`, `description`, `price`, `status`) VALUES
(1, 'wedding', 'Váy Cưới Xòe Công Chúa Ren Pháp', 'M', 'Female', 'Trắng tinh khôi', 'Váy cưới đính kết 2000 viên đá Swarovski lấp lánh', 600000.0, 'available'),
(2, 'wedding', 'Váy Cưới Đuôi Cá Satin Hoàng Gia', 'S', 'Female', 'Trắng ngà', 'Váy cưới lụa satin Ý tôn dáng đường cong kiêu sa', 550000.0, 'available'),
(3, 'suit', 'Bộ Vest Nam Tuxedo Cổ Điển Kèm Nơ', 'L', 'Male', 'Đen huyền bí', 'Vest cưới chú rể dáng slim-fit chuẩn quý ông Châu Âu', 350000.0, 'available'),
(4, 'suit', 'Bộ Vest Nam Caro Màu Be Vintage', 'XL', 'Male', 'Be nhạt', 'Vest phong cách Hàn Quốc trẻ trung lãng mạn', 300000.0, 'available'),
(5, 'traditional', 'Áo Dài Lụa Tơ Tằm Hà Đông Thêu Sen', 'M', 'Female', 'Hồng phấn', 'Áo dài truyền thống thủ công mềm mại, bay bổng', 300000.0, 'available'),
(6, 'traditional', 'Cổ Phục Việt Nhật Bình Triều Nguyễn', 'Free size', 'Female', 'Đỏ thắm', 'Cổ phục ngũ thân hoàng gia thêu rồng phượng tinh xảo', 400000.0, 'available'),
(7, 'casual', 'Set Váy Nàng Thơ Trễ Vai Voan Tơ', 'Free size', 'Female', 'Trắng kem', 'Váy tiểu thư nhẹ nhàng cho concept chụp cá nhân trong nắng', 200000.0, 'available'),
(8, 'casual', 'Set Đồ Gia Đình Đồng Điệu 4 Người', 'Free size', 'Female', 'Tone Pastel', 'Trang phục đồng điệu cho bố, mẹ và 2 bé chụp kỷ niệm gia đình', 450000.0, 'available');

-- ---------------------------------------------------------------------
-- 7. PHỤ KIỆN CHỤP ẢNH (ACCESSORIES TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `accessories` (`id`, `type`, `name`, `description`, `quantity`, `price`, `status`) VALUES
(1, 'wedding', 'Vương Miện Cô Dâu Pha Lê Ánh Bạc', 'Vương miện đính đá quý thủ công tinh xảo', 6, 120000.0, 'available'),
(2, 'wedding', 'Bó Hoa Cưới Cầm Tay Lụa Cao Cấp Tone Trắng Kem', 'Hoa cưới cầm tay nghệ thuật bền đẹp lên hình sang trọng', 12, 100000.0, 'available'),
(3, 'vintage', 'Mũ Beret Len Cổ Điển Phong Cách Paris', 'Mũ dạ beret chụp concept hoài niệm phố cổ', 10, 60000.0, 'available'),
(4, 'vintage', 'Bộ Trâm Cài Tóc Cổ Trang Mạ Vàng Đính Ngọc', 'Phụ kiện cổ phục trâm hoa cài tóc cô dâu truyền thống', 8, 80000.0, 'available'),
(5, 'concept', 'Kính Mắt Gọng Tròn Tri Thức & Sách Cổ Điển', 'Đạo cụ chụp ảnh chân dung concept thư sinh tri thức', 15, 50000.0, 'available'),
(6, 'fashion', 'Bóng Bay Helium Nghệ Thuật Đủ Màu', 'Phụ kiện chụp ảnh sinh nhật, kỷ yếu và gia đình rực rỡ', 30, 70000.0, 'available');

-- ---------------------------------------------------------------------
-- 8. DỊCH VỤ GIA TĂNG (SERVICES TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `services` (`id`, `name`, `type`, `description`, `duration`, `price`, `status`) VALUES
(1, 'Trang Điểm & Làm Tóc Chuyên Nghiệp (Layout 1)', 'makeup', 'Layout makeup cá nhân phù hợp từng đường nét gương mặt và concept chụp', 60, 300000.0, 'active'),
(2, 'Trang Điểm Thay Layout Thứ 2 Trong Buổi Chụp', 'makeup', 'Dặm phấn, thay đổi màu son và kiểu tóc sang concept trang phục mới', 30, 200000.0, 'active'),
(3, 'Chỉnh Sửa Ảnh Chuyên Sâu (Retouch Da & Dáng 10 Ảnh)', 'photography', 'Kỹ thuật Frequency Separation giữ vân da thật, cân chỉnh màu sắc điện ảnh', 60, 250000.0, 'active'),
(4, 'Thuê Phụ Kiện Không Giới Hạn Toàn Buổi', 'accessory', 'Sử dụng toàn bộ vương miện, hoa cưới, đạo cụ trong studio', 0, 150000.0, 'active'),
(5, 'In Album Photobook Mở Phẳng Cao Cấp 25x25 (20 Trang)', 'photography', 'In giấy mỹ thuật phủ màng UV chống ẩm mốc, bìa bọc da sang trọng', 0, 850000.0, 'active'),
(6, 'In Ảnh Cổng Pha Lê Tráng Gương Khổ Lớn 60x90cm', 'photography', 'Khung viền mạ vàng, bề mặt tráng gương chống lóa sắc nét', 0, 650000.0, 'active'),
(7, 'Quay Video Highlight Hậu Kỳ Cinematic 4K (60 Giây)', 'photography', 'Video dọc định dạng Reels/TikTok/Shorts ghi lại hậu trường lung linh', 90, 900000.0, 'active'),
(8, 'Thuê Thêm Trang Phục Thiết Kế (1 Bộ / Concept)', 'clothing', 'Tự chọn váy cưới ren Pháp, áo dài hoặc vest cao cấp kèm hỗ trợ là ủi hơi nước', 30, 200000.0, 'active');

-- ---------------------------------------------------------------------
-- 9. GÓI CHỤP STUDIO & BÁO GIÁ (PACKAGES TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `packages` (`id`, `name`, `description`, `duration`, `price`, `status`, `created_at`, `updated_at`) VALUES
(
    1,
    'Gói Chụp Ảnh Cá Nhân / Nàng Thơ',
    'Chụp studio 60 phút tone Pastel Hàn Quốc, hỗ trợ 1 set trang phục Vintage, makeup cơ bản và retouch 15 ảnh chuyên sâu',
    60,
    990000.0,
    'active',
    NOW(),
    NOW()
),
(
    2,
    'Gói Chụp Ảnh Cưới Studio Cơ Bản',
    'Chụp 120 phút với 2 bối cảnh Cung Điện & Cổ Điển, 1 váy cưới ren Pháp, 1 tuxedo nam cao cấp, makeup cô dâu và tặng album mini 15x21',
    120,
    2990000.0,
    'active',
    NOW(),
    NOW()
),
(
    3,
    'Gói Chụp Ảnh Gia Đình / Nhóm Bạn',
    'Chụp phòng lớn VIP đa năng trong 90 phút cho nhóm 4-8 thành viên, đạo cụ sofa cổ điển, bàn giao toàn bộ file gốc và chỉnh sửa 25 ảnh',
    90,
    1890000.0,
    'active',
    NOW(),
    NOW()
),
(
    4,
    'Gói Chụp Cưới Luxury & Ngoại Cảnh VIP',
    'Trải nghiệm đẳng cấp 240 phút kết hợp studio và ngoại cảnh hoàng hôn, 3 bộ trang phục cao cấp, 2 layout makeup, ekip riêng và album photobook 30x30',
    240,
    5990000.0,
    'active',
    NOW(),
    NOW()
),
(
    5,
    'Gói Chụp Kỷ Yếu & Tốt Nghiệp Sáng Tạo',
    'Dành cho học sinh sinh viên cá nhân hoặc nhóm 2-5 bạn, chụp 90 phút với phông màu tự động, phụ kiện bằng tốt nghiệp và hoa tươi',
    90,
    1490000.0,
    'active',
    NOW(),
    NOW()
),
(
    6,
    'Gói Chụp Doanh Nhân & Profile Thương Hiệu',
    'Chụp ảnh chân dung lãnh đạo, profile doanh nghiệp chuẩn tạp chí Forbes trong 60 phút, set ánh sáng kịch tính Rembrandt và retouch da tự nhiên',
    60,
    1290000.0,
    'active',
    NOW(),
    NOW()
),
(
    7,
    'Gói Chụp Nghệ Thuật Cổ Trang & Áo Dài',
    'Chụp 90 phút với bối cảnh phố cổ và sen hồ, hỗ trợ áo dài tơ tằm thêu tay hoặc cổ phục Việt, làm tóc và phụ kiện trâm cài truyền thống',
    90,
    1690000.0,
    'active',
    NOW(),
    NOW()
),
(
    8,
    'Gói Chụp Lookbook Thời Trang & Sản Phẩm',
    'Dành cho nhà thiết kế và shop thời trang, chụp 120 phút không giới hạn số lượng mẫu trang phục, màn hình live-view tức thì và kỹ thuật viên hỗ trợ',
    120,
    2490000.0,
    'active',
    NOW(),
    NOW()
);

-- ---------------------------------------------------------------------
-- 10. GÁN THIẾT BỊ CHO TỪNG GÓI CHỤP (PACKAGE_EQUIPMENTS TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `package_equipments` (`package_id`, `equipment_type`, `quantity`) VALUES
(1, 'camera', 1), (1, 'lighting', 2),
(2, 'camera', 1), (2, 'lighting', 3), (2, 'tripod', 1),
(3, 'camera', 1), (3, 'lighting', 3),
(4, 'camera', 2), (4, 'lighting', 4), (4, 'tripod', 1), (4, 'other', 2),
(5, 'camera', 1), (5, 'lighting', 2),
(6, 'camera', 1), (6, 'lighting', 3), (6, 'other', 1),
(7, 'camera', 1), (7, 'lighting', 2),
(8, 'camera', 1), (8, 'lighting', 4), (8, 'other', 2);

-- ---------------------------------------------------------------------
-- 11. GÁN DỊCH VỤ BAO GỒM CHO TỪNG GÓI CHỤP (PACKAGE_SERVICES TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `package_services` (`package_id`, `service_id`, `quantity`) VALUES
(1, 1, 1), (1, 3, 1),
(2, 1, 1), (2, 3, 1),
(3, 3, 1),
(4, 1, 2), (4, 3, 2), (4, 4, 1), (4, 5, 1),
(5, 4, 1),
(6, 1, 1),
(7, 1, 1), (7, 4, 1),
(8, 3, 1);

-- ---------------------------------------------------------------------
-- 12. GÁN BỐI CẢNH PHÙ HỢP CHO GÓI CHỤP (PACKAGE_BACKGROUNDS TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `package_backgrounds` (`package_id`, `background_id`) VALUES
(1, 1),
(2, 2), (2, 3),
(3, 5),
(4, 3), (4, 4),
(5, 1),
(6, 5), (6, 6),
(7, 2),
(8, 1), (8, 6);

-- ---------------------------------------------------------------------
-- 13. BỘ SƯU TẬP ẢNH GÓI CHỤP CHI TIẾT (IMAGES TABLE - 48 ẢNH CHẤT LƯỢNG CAO)
-- ---------------------------------------------------------------------
INSERT INTO `images` (`imageable_type`, `imageable_id`, `image_url`, `description`, `is_primary`, `created_at`, `updated_at`) VALUES
-- ===== GÓI 1: CÁ NHÂN / NÀNG THƠ (8 ẢNH) =====
('package', 1, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85', 'Ảnh bìa chân dung nàng thơ trong trẻo tone pastel', TRUE, NOW(), NOW()),
('package', 1, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85', 'Góc cận cảnh ánh mắt và layout trang điểm tự nhiên', FALSE, NOW(), NOW()),
('package', 1, 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85', 'Phong cách vintage nhẹ nhàng cùng váy hoa voan nàng thơ', FALSE, NOW(), NOW()),
('package', 1, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=85', 'Nụ cười tỏa nắng dưới ánh sáng studio mềm mại', FALSE, NOW(), NOW()),
('package', 1, 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=85', 'Tạo dáng thanh lịch cùng hoa tươi nghệ thuật nàng thơ', FALSE, NOW(), NOW()),
('package', 1, 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=85', 'Góc nghiêng điện ảnh sắc nét từng đường nét chân dung', FALSE, NOW(), NOW()),
('package', 1, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=85', 'Ánh nhìn kiêu sa tinh tế trong khung hình nghệ thuật', FALSE, NOW(), NOW()),
('package', 1, 'https://images.unsplash.com/photo-1526510747491-58f928ec870f?auto=format&fit=crop&w=1200&q=85', 'Dáng vẻ dịu dàng nàng thơ đón nắng sớm mai', FALSE, NOW(), NOW()),

-- ===== GÓI 2: ẢNH CƯỚI STUDIO CƠ BẢN (8 ẢNH) =====
('package', 2, 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85', 'Ảnh bìa ảnh cưới studio hoàng hôn lãng mạn bên hồ', TRUE, NOW(), NOW()),
('package', 2, 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85', 'Khoảnh khắc kề trán ngọt ngào của cô dâu chú rể', FALSE, NOW(), NOW()),
('package', 2, 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85', 'Cô dâu rạng rỡ trong váy cưới ren Pháp cùng hoa trắng', FALSE, NOW(), NOW()),
('package', 2, 'https://images.unsplash.com/photo-1519225429980-715cb0215aed?auto=format&fit=crop&w=1200&q=85', 'Ánh nhìn trìu mến trong không gian cung điện cưới cổ điển', FALSE, NOW(), NOW()),
('package', 2, 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85', 'Tiếng cười hạnh phúc giữa không gian studio cưới ấm cúng', FALSE, NOW(), NOW()),
('package', 2, 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85', 'Dạo bước nắm tay cặp đôi chạng vạng đầy thơ mộng', FALSE, NOW(), NOW()),
('package', 2, 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=85', 'Lời thề nguyện dưới vòm hoa pha lê lấp lánh', FALSE, NOW(), NOW()),
('package', 2, 'https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?auto=format&fit=crop&w=1200&q=85', 'Hạnh phúc ngày rước dâu trao nhẫn thiêng liêng', FALSE, NOW(), NOW()),

-- ===== GÓI 3: GIA ĐÌNH & NHÓM BẠN (8 ẢNH) =====
('package', 3, 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1200&q=85', 'Ảnh bìa sum vầy gia đình 3 thế hệ ấm cúng', TRUE, NOW(), NOW()),
('package', 3, 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=85', 'Nụ cười rạng rỡ của bố mẹ cùng các con bên lò sưởi gia đình', FALSE, NOW(), NOW()),
('package', 3, 'https://images.unsplash.com/photo-1542037104857-ffbc0b91c487?auto=format&fit=crop&w=1200&q=85', 'Nhóm bạn thân thiết lưu giữ kỷ niệm tuổi thanh xuân', FALSE, NOW(), NOW()),
('package', 3, 'https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?auto=format&fit=crop&w=1200&q=85', 'Khoảnh khắc gia đình vui vẻ tự nhiên không khoảng cách', FALSE, NOW(), NOW()),
('package', 3, 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=85', 'Gia đình cùng tạo dáng trên sofa da cổ điển sang trọng', FALSE, NOW(), NOW()),
('package', 3, 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=85', 'Bé yêu cười rạng rỡ trong vòng tay yêu thương của cha mẹ', FALSE, NOW(), NOW()),
('package', 3, 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=85', 'Đại gia đình hội ngộ kỷ niệm ngày cưới kim cương', FALSE, NOW(), NOW()),
('package', 3, 'https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=1200&q=85', 'Gia đình trẻ hạnh phúc trong không gian hiện đại', FALSE, NOW(), NOW()),

-- ===== GÓI 4: CƯỚI LUXURY & NGOẠI CẢNH (8 ẢNH) =====
('package', 4, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=85', 'Ảnh bìa cưới Luxury kiêu sa với khăn voan dài bay bổng', TRUE, NOW(), NOW()),
('package', 4, 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85', 'Ánh sáng nghệ thuật tôn vinh từng chi tiết váy cưới luxury', FALSE, NOW(), NOW()),
('package', 4, 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1200&q=85', 'Cặp đôi khiêu vũ cưới dưới ánh đèn chùm cung điện lộng lẫy', FALSE, NOW(), NOW()),
('package', 4, 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85', 'Nụ hôn hoàng hôn trên đỉnh đồi thơ mộng của cô dâu chú rể', FALSE, NOW(), NOW()),
('package', 4, 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85', 'Váy cưới đuôi cá đính pha lê lấp lánh sang trọng', FALSE, NOW(), NOW()),
('package', 4, 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=85', 'Ánh nhìn ngập tràn yêu thương cô dâu chú rể hoàng gia', FALSE, NOW(), NOW()),
('package', 4, 'https://images.unsplash.com/photo-1519225433280-557371900f07?auto=format&fit=crop&w=1200&q=85', 'Hôn lễ cưới lãng mạn trên du thuyền ngắm hoàng hôn', FALSE, NOW(), NOW()),
('package', 4, 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85', 'Nghi thức rót rượu champagne hạnh phúc của cặp đôi cưới', FALSE, NOW(), NOW()),

-- ===== GÓI 5: KỶ YẾU & TỐT NGHIỆP SÁNG TẠO (8 ẢNH) =====
('package', 5, 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=85', 'Ảnh bìa nụ cười rạng rỡ ngày lễ tốt nghiệp đại học kỷ yếu', TRUE, NOW(), NOW()),
('package', 5, 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&w=1200&q=85', 'Tung mũ cử nhân ghi dấu mốc thanh xuân rực rỡ bạn bè', FALSE, NOW(), NOW()),
('package', 5, 'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?auto=format&fit=crop&w=1200&q=85', 'Nhóm bạn kỷ yếu với trang phục đồng phục trẻ trung', FALSE, NOW(), NOW()),
('package', 5, 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=85', 'Cầm bằng tốt nghiệp và bó hoa tươi rạng ngời cùng bạn bè', FALSE, NOW(), NOW()),
('package', 5, 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=85', 'Góc chụp kỷ yếu phong cách phim Hàn Quốc đầy hoài niệm', FALSE, NOW(), NOW()),
('package', 5, 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=85', 'Khoảnh khắc xúc động kỷ yếu chia tay thầy cô và bạn bè', FALSE, NOW(), NOW()),
('package', 5, 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85', 'Áo dài trắng nữ sinh kỷ yếu sân trường rợp bóng nắng', FALSE, NOW(), NOW()),
('package', 5, 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=85', 'Nhóm bạn trẻ trung sôi nổi lưu giữ thanh xuân tươi đẹp', FALSE, NOW(), NOW()),

-- ===== GÓI 6: DOANH NHÂN & PROFILE THƯƠNG HIỆU (8 ẢNH) =====
('package', 6, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85', 'Ảnh bìa chân dung doanh nhân bản lĩnh chuẩn phong cách Forbes', TRUE, NOW(), NOW()),
('package', 6, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85', 'Nữ lãnh đạo tự tin, phong thái quyết đoán và thanh lịch', FALSE, NOW(), NOW()),
('package', 6, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=85', 'Set ánh sáng Rembrandt kịch tính tạo chiều sâu gương mặt doanh nhân', FALSE, NOW(), NOW()),
('package', 6, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=85', 'Chân dung CEO vest xanh navy lịch lãm hiện đại profile', FALSE, NOW(), NOW()),
('package', 6, 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=1200&q=85', 'Góc làm việc studio với laptop và phong thái chuyên nghiệp', FALSE, NOW(), NOW()),
('package', 6, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=1200&q=85', 'Ảnh đại diện profile LinkedIn và ấn phẩm truyền thông thương hiệu', FALSE, NOW(), NOW()),
('package', 6, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=85', 'Profile chuyên gia tài chính phong thái điềm tĩnh và đẳng cấp', FALSE, NOW(), NOW()),
('package', 6, 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1200&q=85', 'Nữ doanh nhân thời đại mới thanh lịch và quyết đoán', FALSE, NOW(), NOW()),

-- ===== GÓI 7: NGHỆ THUẬT CỔ TRANG & ÁO DÀI (8 ẢNH) =====
('package', 7, 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85', 'Ảnh bìa áo dài tơ tằm thêu tay truyền thống nét đẹp Á Đông', TRUE, NOW(), NOW()),
('package', 7, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85', 'E ấp bên cành sen thơm ngát góc phố cổ rêu phong áo dài', FALSE, NOW(), NOW()),
('package', 7, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85', 'Tạo hình tóc cổ trang cùng trâm cài phượng hoàng tinh xảo', FALSE, NOW(), NOW()),
('package', 7, 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85', 'Dáng áo dài trắng tinh khôi thướt tha trong gió chiều', FALSE, NOW(), NOW()),
('package', 7, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=85', 'Nét dịu dàng đằm thắm của người phụ nữ Việt Nam áo dài', FALSE, NOW(), NOW()),
('package', 7, 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=85', 'Cổ phục Nhật Bình cung đình Huế trang nghiêm quý phái', FALSE, NOW(), NOW()),
('package', 7, 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=85', 'Vẻ đẹp thanh thoát áo dài lụa sen sớm mai', FALSE, NOW(), NOW()),
('package', 7, 'https://images.unsplash.com/photo-1514315384763-ba401779410f?auto=format&fit=crop&w=1200&q=85', 'Chân dung nghệ thuật Á Đông mờ ảo huyền bí', FALSE, NOW(), NOW()),

-- ===== GÓI 8: LOOKBOOK THỜI TRANG & SẢN PHẨM (8 ẢNH) =====
('package', 8, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85', 'Ảnh bìa lookbook thời trang thương hiệu high-end cá tính', TRUE, NOW(), NOW()),
('package', 8, 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=85', 'Tạo dáng người mẫu lookbook ấn tượng phong cách sàn diễn', FALSE, NOW(), NOW()),
('package', 8, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85', 'Màu sắc hiện đại tôn vinh chi tiết chất liệu vải cao cấp lookbook', FALSE, NOW(), NOW()),
('package', 8, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85', 'Góc chụp lookbook thương mại tối giản trên phông studio', FALSE, NOW(), NOW()),
('package', 8, 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&q=85', 'Bộ sưu tập trang phục dạo phố lookbook năng động và cuốn hút', FALSE, NOW(), NOW()),
('package', 8, 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85', 'Ánh sáng sắc nét phục vụ in ấn catalogue và website thương mại lookbook', FALSE, NOW(), NOW()),
('package', 8, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85', 'Phong cách thời trang high-fashion chuẩn tạp chí Vogue', FALSE, NOW(), NOW()),
('package', 8, 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&w=1200&q=85', 'Lookbook trang phục dạ tiệc đêm sang trọng quyến rũ', FALSE, NOW(), NOW()),

-- ===== BỐI CẢNH CHỤP STUDIO (BACKGROUNDS TABLE - 6 BỐI CẢNH THỰC TẾ) =====
('background', 1, 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85', 'Phông Hàn Quốc Pastel Tối Giản với vòm cong nghệ thuật và ánh sáng dịu', TRUE, NOW(), NOW()),
('background', 1, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85', 'Góc decor tối giản tone ấm kem beige thanh lịch', FALSE, NOW(), NOW()),
('background', 2, 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=85', 'Góc Phố Cổ Hội An & Sen Hồ Á Đông với đèn lồng và tường vàng rêu phong', TRUE, NOW(), NOW()),
('background', 2, 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=85', 'Không gian sân vườn kiến trúc truyền thống Á Đông trầm mặc', FALSE, NOW(), NOW()),
('background', 3, 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=85', 'Cung Điện Cổ Điển Châu Âu Luxury với đèn chùm pha lê và vòm đá cẩm thạch', TRUE, NOW(), NOW()),
('background', 3, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85', 'Sảnh tiệc phong cách Pháp tráng lệ dành cho ảnh cưới hoàng gia', FALSE, NOW(), NOW()),
('background', 4, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85', 'Ban Công Hoàng Hôn & Vườn Hoa Studio ngập tràn ánh sáng tự nhiên', TRUE, NOW(), NOW()),
('background', 4, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85', 'Góc ban công ngập sắc hoa tươi và rèm voan đón nắng chiều', FALSE, NOW(), NOW()),
('background', 5, 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1200&q=85', 'Phòng Đọc Sách & Sofa Da Vintage với kệ sách gỗ sồi và đèn bàn cổ điển', TRUE, NOW(), NOW()),
('background', 5, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85', 'Không gian nội thất gỗ trầm ấm lịch lãm phong cách quý tộc', FALSE, NOW(), NOW()),
('background', 6, 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=85', 'Phông Trắng / Đen Studio High-End vô cực tiêu chuẩn quốc tế', TRUE, NOW(), NOW()),
('background', 6, 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=85', 'Không gian studio xi măng công nghiệp tối giản phân mảng ánh sáng sắc nét', FALSE, NOW(), NOW()),

-- ===== PHÒNG CHỤP STUDIO (ROOMS TABLE - 5 PHÒNG THỰC TẾ) =====
('room', 1, 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85', 'Phòng Studio A - Không gian ánh sáng tự nhiên, tone màu pastel Hàn Quốc', TRUE, NOW(), NOW()),
('room', 1, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85', 'Góc cửa sổ vòm đón nắng mai dịu dàng Studio A', FALSE, NOW(), NOW()),
('room', 2, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85', 'Phòng Studio B - Đại cảnh cổ điển Châu Âu sang trọng với trần cao 4.2m', TRUE, NOW(), NOW()),
('room', 2, 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=85', 'Hệ thống đèn chùm pha lê và vòm phào chỉ nghệ thuật Studio B', FALSE, NOW(), NOW()),
('room', 3, 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=85', 'Phòng Studio VIP - Không gian Cinema & Đa Năng với hệ thống chiếu sáng chuẩn điện ảnh', TRUE, NOW(), NOW()),
('room', 3, 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=85', 'Dàn khung treo và phông cuốn điện tử 8 màu tự động Studio VIP', FALSE, NOW(), NOW()),
('room', 4, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85', 'Phòng Studio C - Không gian phòng khách gia đình vintage ấm cúng', TRUE, NOW(), NOW()),
('room', 4, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85', 'Bộ sofa nhung cổ điển bên góc đàn piano Studio C', FALSE, NOW(), NOW()),
('room', 5, 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=85', 'Phòng Studio D - Concept Monochromatic hiện đại với vách vô cực đa hướng', TRUE, NOW(), NOW()),
('room', 5, 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85', 'Mảng tường bê tông mài thô mộc phong cách high-fashion Studio D', FALSE, NOW(), NOW()),
('room', 6, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85', 'Phòng Studio E - Ban Công Hoàng Hôn & Vườn Kính với cửa kính panorama', TRUE, NOW(), NOW()),
('room', 6, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85', 'Góc giàn hoa nghệ thuật đón ánh hoàng hôn ấm áp Studio E', FALSE, NOW(), NOW()),
('room', 7, 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=85', 'Phòng Studio F - Phong Cách Á Đông & Cổ Phục với tường rêu và đèn lồng', TRUE, NOW(), NOW()),
('room', 7, 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=85', 'Không gian tiểu cảnh sen hồ và kiến trúc cung đình Studio F', FALSE, NOW(), NOW()),
('room', 8, 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1200&q=85', 'Phòng Studio G - Thư Viện Quý Tộc & Gỗ Trầm với kệ sách gỗ sồi', TRUE, NOW(), NOW()),
('room', 8, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85', 'Bộ sofa da bò Chesterfield cổ điển lịch lãm Studio G', FALSE, NOW(), NOW()),
('room', 9, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85', 'Phòng Studio H - Industrial Loft Sáng Tạo trần cao bê tông mộc', TRUE, NOW(), NOW()),
('room', 9, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85', 'Cửa sổ giếng trời đón nắng tự nhiên studio loft Studio H', FALSE, NOW(), NOW()),
('room', 10, 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=85', 'Phòng Studio I - Không Gian Em Bé & Thôi Nôi an toàn tone pastel', TRUE, NOW(), NOW()),
('room', 10, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85', 'Đồ chơi gỗ Scandinavian và nôi em bé cao cấp Studio I', FALSE, NOW(), NOW()),
('room', 11, 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85', 'Phòng Studio K - Sảnh Cưới Grand Ballroom sàn gương vòm hoa lộng lẫy', TRUE, NOW(), NOW()),
('room', 11, 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=85', 'Dàn đèn chùm pha lê và cổng hoa cưới hoàng gia Studio K', FALSE, NOW(), NOW()),
('room', 12, 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85', 'Phòng Studio L - High-End Cyclorama Vô Cực 3D 180 độ', TRUE, NOW(), NOW()),
('room', 12, 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=85', 'Hệ thống giàn treo ray đèn kịch trần điều khiển từ xa Studio L', FALSE, NOW(), NOW());

-- ---------------------------------------------------------------------
-- 14. ĐƠN ĐẶT LỊCH STUDIO THỰC TẾ (BOOKINGS TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `bookings` (`id`, `customer_id`, `room_id`, `booking_date`, `start_time`, `end_time`, `status`, `customer_note`, `created_at`, `updated_at`) VALUES
(1, 6, 2, '2026-10-10 09:00:00', '09:00:00', '11:00:00', 'completed', 'Khách: Nguyễn Thu Trang & Hoàng Nam - Gói: Gói Chụp Ảnh Cưới Studio Cơ Bản', '2026-10-05 08:30:00', NOW()),
(2, 4, 1, '2026-10-12 14:00:00', '14:00:00', '15:30:00', 'completed', 'Khách: Lê Minh Tuấn - Gói: Gói Chụp Ảnh Cá Nhân / Nàng Thơ', '2026-10-08 10:00:00', NOW()),
(3, 5, 4, '2026-10-15 09:30:00', '09:30:00', '11:30:00', 'completed', 'Khách: Phạm Phương Linh - Gói: Gói Chụp Gia Đình Đoàn Viên', '2026-10-10 14:20:00', NOW()),
(4, 9, 3, '2026-10-18 10:00:00', '10:00:00', '11:30:00', 'completed', 'Khách: Đặng Quốc Bảo (CEO TechLab) - Gói: Gói Doanh Nhân & Profile', '2026-10-12 09:15:00', NOW()),
(5, 8, 2, '2026-10-20 15:00:00', '15:00:00', '16:30:00', 'completed', 'Khách: Trần Khánh Huyền - Gói: Gói Chụp Nghệ Thuật Cổ Trang & Áo Dài', '2026-10-16 11:45:00', NOW()),
(6, 10, 3, '2026-10-22 13:30:00', '13:30:00', '15:30:00', 'completed', 'Khách: Vũ Hoàng Mai & Nhóm Bạn - Gói: Gói Chụp Kỷ Yếu & Tốt Nghiệp Sáng Tạo', '2026-10-18 16:00:00', NOW()),
(7, 7, 2, '2026-10-23 08:00:00', '08:00:00', '12:00:00', 'completed', 'Khách: Hoàng Nam & Lan Chi - Gói: Gói Chụp Cưới Luxury & Ngoại Cảnh VIP', '2026-10-19 09:00:00', NOW()),
(8, 11, 5, '2026-10-24 14:00:00', '14:00:00', '16:30:00', 'completed', 'Khách: Nguyễn Đức Thắng (Fashion Brand) - Gói: Gói Chụp Lookbook Thời Trang', '2026-10-20 10:30:00', NOW()),
(9, 10, 1, '2026-10-25 10:00:00', '10:00:00', '11:30:00', 'completed', 'Khách: Vũ Hoàng Mai - Gói: Gói Chụp Ảnh Cá Nhân / Nàng Thơ Tone Pastel', '2026-10-21 14:00:00', NOW()),
(10, 8, 2, '2026-10-25 15:00:00', '15:00:00', '17:30:00', 'completed', 'Khách: Trần Khánh Huyền & Quang Huy - Gói: Gói Chụp Ảnh Cưới Studio Cơ Bản', '2026-10-22 08:30:00', NOW()),
(11, 4, 4, '2026-10-26 09:00:00', '09:00:00', '11:00:00', 'completed', 'Khách: Lê Minh Tuấn & Đại Gia Đình - Gói: Gói Chụp Ảnh Gia Đình 3 Thế Hệ', '2026-10-22 11:00:00', NOW()),
(12, 6, 2, '2026-10-26 13:00:00', '13:00:00', '17:30:00', 'completed', 'Khách: Nguyễn Thu Trang - Gói: Gói Chụp Cưới Luxury & Ngoại Cảnh VIP', '2026-10-23 15:00:00', NOW()),
(13, 5, 3, '2026-10-27 09:30:00', '09:30:00', '11:30:00', 'completed', 'Khách: Phạm Phương Linh - Gói: Gói Chụp Kỷ Yếu & Tốt Nghiệp Sáng Tạo', '2026-10-24 16:30:00', NOW()),
(14, 11, 3, '2026-10-27 14:00:00', '14:00:00', '15:30:00', 'completed', 'Khách: Nguyễn Đức Thắng (Giám đốc sáng tạo) - Gói: Gói Doanh Nhân & Profile', '2026-10-25 09:30:00', NOW()),
(15, 6, 2, '2026-10-28 09:00:00', '09:00:00', '11:00:00', 'completed', 'Khách: Nguyễn Thu Trang - Gói: Gói Chụp Nghệ Thuật Cổ Trang & Áo Dài', '2026-10-25 17:00:00', NOW()),
(16, 9, 5, '2026-10-28 13:30:00', '13:30:00', '16:00:00', 'completed', 'Khách: Đặng Quốc Bảo - Gói: Gói Chụp Lookbook Bộ Sưu Tập Mới', '2026-10-26 10:00:00', NOW()),
(17, 4, 6, '2026-10-21 14:00:00', '14:00:00', '15:30:00', 'completed', 'Khách: Lê Minh Tuấn - Gói: Gói Chụp Ảnh Cá Nhân / Nàng Thơ', '2026-10-18 10:00:00', NOW()),
(18, 5, 7, '2026-10-22 09:30:00', '09:30:00', '11:30:00', 'completed', 'Khách: Phạm Phương Linh - Gói: Gói Chụp Nghệ Thuật Cổ Trang & Áo Dài', '2026-10-19 14:00:00', NOW()),
(19, 6, 8, '2026-10-23 10:00:00', '10:00:00', '11:30:00', 'completed', 'Khách: Nguyễn Thu Trang - Gói: Gói Doanh Nhân & Profile', '2026-10-20 09:00:00', NOW()),
(20, 7, 9, '2026-10-24 15:00:00', '15:00:00', '17:00:00', 'completed', 'Khách: Hoàng Nam - Gói: Gói Chụp Lookbook Thời Trang', '2026-10-21 11:00:00', NOW()),
(21, 8, 10, '2026-10-24 09:00:00', '09:00:00', '11:00:00', 'completed', 'Khách: Trần Khánh Huyền - Gói: Gói Chụp Gia Đình & Em Bé Thôi Nôi', '2026-10-21 16:30:00', NOW()),
(22, 9, 11, '2026-10-25 13:00:00', '13:00:00', '17:00:00', 'completed', 'Khách: Đặng Quốc Bảo - Gói: Gói Chụp Cưới Luxury Grand Ballroom', '2026-10-22 08:00:00', NOW()),
(23, 10, 12, '2026-10-25 10:00:00', '10:00:00', '12:00:00', 'completed', 'Khách: Vũ Hoàng Mai - Gói: Gói Chụp Kỷ Yếu & Tốt Nghiệp', '2026-10-23 14:00:00', NOW()),
(24, 11, 1, '2026-10-26 14:30:00', '14:30:00', '16:00:00', 'completed', 'Khách: Nguyễn Đức Thắng - Gói: Gói Chụp Ảnh Cá Nhân / Nàng Thơ', '2026-10-24 09:30:00', NOW()),
(25, 4, 2, '2026-10-26 09:00:00', '09:00:00', '11:30:00', 'completed', 'Khách: Lê Minh Tuấn & Thu Hương - Gói: Gói Chụp Ảnh Cưới Studio Cơ Bản', '2026-10-24 15:00:00', NOW()),
(26, 5, 3, '2026-10-27 10:00:00', '10:00:00', '11:30:00', 'completed', 'Khách: Phạm Phương Linh - Gói: Gói Doanh Nhân & Profile', '2026-10-25 10:30:00', NOW()),
(27, 6, 4, '2026-10-27 14:00:00', '14:00:00', '16:30:00', 'completed', 'Khách: Nguyễn Thu Trang & Gia Đình - Gói: Gói Chụp Ảnh Gia Đình Đoàn Viên', '2026-10-25 16:00:00', NOW()),
(28, 7, 5, '2026-10-28 09:30:00', '09:30:00', '12:00:00', 'completed', 'Khách: Hoàng Nam - Gói: Gói Chụp Lookbook Monochromatic', '2026-10-26 13:00:00', NOW()),
(29, 8, 6, '2026-10-28 15:00:00', '15:00:00', '18:00:00', 'completed', 'Khách: Trần Khánh Huyền - Gói: Gói Chụp Cưới Luxury Ban Công Hoàng Hôn', '2026-10-26 16:30:00', NOW()),
(30, 10, 7, '2026-10-28 10:00:00', '10:00:00', '12:00:00', 'completed', 'Khách: Vũ Hoàng Mai - Gói: Gói Chụp Nghệ Thuật Cổ Trang & Áo Dài', '2026-10-27 09:00:00', NOW());

-- ---------------------------------------------------------------------
-- 15. GÁN GÓI VÀO ĐƠN ĐẶT LỊCH (BOOKING_PACKAGES TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `booking_packages` (`id`, `booking_id`, `package_id`, `quantity`, `unit_price`) VALUES
(1, 1, 2, 1, 2990000.0),
(2, 2, 1, 1, 990000.0),
(3, 3, 3, 1, 1890000.0),
(4, 4, 6, 1, 1290000.0),
(5, 5, 7, 1, 1690000.0),
(6, 6, 5, 1, 1490000.0),
(7, 7, 4, 1, 5990000.0),
(8, 8, 8, 1, 2490000.0),
(9, 9, 1, 1, 990000.0),
(10, 10, 2, 1, 2990000.0),
(11, 11, 3, 1, 1890000.0),
(12, 12, 4, 1, 5990000.0),
(13, 13, 5, 1, 1490000.0),
(14, 14, 6, 1, 1290000.0),
(15, 15, 7, 1, 1690000.0),
(16, 16, 8, 1, 2490000.0),
(17, 17, 1, 1, 990000.0),
(18, 18, 7, 1, 1690000.0),
(19, 19, 6, 1, 1290000.0),
(20, 20, 8, 1, 2490000.0),
(21, 21, 3, 1, 1890000.0),
(22, 22, 4, 1, 5990000.0),
(23, 23, 5, 1, 1490000.0),
(24, 24, 1, 1, 990000.0),
(25, 25, 2, 1, 2990000.0),
(26, 26, 6, 1, 1290000.0),
(27, 27, 3, 1, 1890000.0),
(28, 28, 8, 1, 2490000.0),
(29, 29, 4, 1, 5990000.0),
(30, 30, 7, 1, 1690000.0);

-- ---------------------------------------------------------------------
-- 16. ĐÁNH GIÁ THỰC TẾ TỪ KHÁCH HÀNG (REVIEWS TABLE - 16 ĐÁNH GIÁ CHO CẢ 8 GÓI)
-- ---------------------------------------------------------------------
INSERT INTO `reviews` (`id`, `booking_id`, `customer_id`, `rating`, `comment`, `created_at`, `updated_at`) VALUES
-- GÓI 2: ẢNH CƯỚI CƠ BẢN
(1, 1, 6, 5.0, 'Ekip chụp ảnh cưới có tâm nhất mình từng trải nghiệm! Bạn photographer hướng dẫn tạo dáng rất tự nhiên, cô dâu không bị gượng gạo. Makeup bạn Tiên làm nhẹ nhàng trong trẻo đúng style Hàn Quốc mình thích. Ảnh nhận về đẹp lung linh!', '2026-10-11 16:45:00', NOW()),
(10, 10, 8, 5.0, 'Studio decor rất sang, váy cưới ren Pháp mới tinh và thơm tho. Hai vợ chồng mình đều ngại trước ống kính mà thợ chụp pha trò cười suốt buổi. Album mini in sắc nét!', '2026-10-26 18:20:00', NOW()),

-- GÓI 1: CÁ NHÂN / NÀNG THƠ
(2, 2, 4, 5.0, 'Mình chụp gói Nàng Thơ kỷ niệm sinh nhật cho bạn gái. Phòng studio ánh sáng dịu mắt, váy áo sạch sẽ thơm tho. Bộ ảnh nhận về bạn bè ai cũng khen nức nở. Chắc chắn sẽ quay lại ủng hộ studio nhiều lần nữa!', '2026-10-13 11:20:00', NOW()),
(9, 9, 10, 5.0, 'Từng góc máy đều bắt trọn nét tự nhiên của mình. Makeup trong veo chuẩn nàng thơ Hàn Quốc. Thợ ảnh kiên nhẫn chụp đến khi mình ưng ý mới thôi. Rất recommend mọi người gói này!', '2026-10-26 12:15:00', NOW()),

-- GÓI 3: GIA ĐÌNH & NHÓM BẠN
(3, 3, 5, 5.0, 'Gia đình mình có cả ông bà và 2 bé nhỏ, lúc đầu sợ các cháu quấy khóc nhưng ekip rất kiên nhẫn và vui tính, bắt trọn từng khoảnh khắc cười tươi tự nhiên của cả nhà. Ảnh in ép gỗ treo phòng khách tuyệt đẹp!', '2026-10-16 17:30:00', NOW()),
(11, 11, 4, 5.0, 'Phòng chụp VIP rộng rãi cho cả gia đình 8 người. Sofa da vintage sang trọng tạo cảm giác ấm cúng như ở nhà. Khâu bàn giao toàn bộ file gốc cực kỳ nhanh chóng!', '2026-10-27 10:45:00', NOW()),

-- GÓI 6: DOANH NHÂN & PROFILE
(4, 4, 9, 4.9, 'Mình làm bộ profile doanh nhân để làm thương hiệu cá nhân và đăng báo. Ánh sáng setup chuẩn chỉ, phong thái chỉnh chu đẳng cấp. Ảnh trả nhanh đúng tiến độ công việc của mình!', '2026-10-19 14:10:00', NOW()),
(14, 14, 11, 5.0, 'Set đèn kịch tính Rembrandt tạo thần thái rất quyền lực. Phông nền chuẩn quốc tế, da được retouch tự nhiên giữ nguyên lỗ chân lông không bị bệt. Rất chuyên nghiệp!', '2026-10-28 08:30:00', NOW()),

-- GÓI 7: CỔ TRANG & ÁO DÀI
(5, 5, 8, 5.0, 'Bộ ảnh áo dài sen hồ phố cổ xuất sắc! Đạo cụ trâm cài và nón quai thao được chuẩn bị rất kỹ lưỡng. Thợ ảnh nhiệt tình chụp không quản ngại thời gian. 10/10 điểm cho chất lượng phục vụ!', '2026-10-21 18:00:00', NOW()),
(15, 15, 6, 5.0, 'Cổ phục Nhật Bình thêu rồng phượng đẹp xuất sắc, đội ngũ chuẩn bị cả trâm cài mạ vàng và guốc mộc truyền thống. Ảnh màu phim hoài niệm như lạc vào cung đình xưa!', '2026-10-28 16:10:00', NOW()),

-- GÓI 5: KỶ YẾU & TỐT NGHIỆP
(6, 6, 10, 5.0, 'Cả nhóm 5 đứa chụp kỷ yếu tốt nghiệp đại học ở đây cười tẹt ga. Studio hỗ trợ phụ kiện hoa tươi, bóng bay và bằng tốt nghiệp đầy đủ. Giá cả hợp lý mà chất lượng thì như chụp bìa tạp chí!', '2026-10-23 10:40:00', NOW()),
(13, 13, 5, 5.0, 'Phông màu tự động đổi cực kỳ tiện, nhóm mình chụp được cả concept nghiêm túc nhận bằng và concept lầy lội quẩy tung studio. Mọi người ai cũng khen ảnh đẹp!', '2026-10-27 18:00:00', NOW()),

-- GÓI 4: CƯỚI LUXURY & NGOẠI CẢNH VIP
(7, 7, 7, 5.0, 'Trải nghiệm đỉnh cao của gói Luxury! Xe đưa đón riêng, 2 bạn makeup đi theo dặm phấn suốt buổi chụp hoàng hôn ngoại cảnh. Khăn voan dài bay bổng lên hình tráng lệ như phim điện ảnh Hollywood!', '2026-10-24 19:30:00', NOW()),
(12, 12, 6, 5.0, 'Album photobook 30x30 mở phẳng bìa da sang trọng vô cùng. Ekip đông đảo phục vụ tận tâm chu đáo từng chút một từ nước uống đến chỉnh vạt váy. Hoàn toàn xứng đáng từng đồng bỏ ra!', '2026-10-27 15:20:00', NOW()),

-- GÓI 8: LOOKBOOK THỜI TRANG & SẢN PHẨM
(8, 8, 11, 5.0, 'Shop thời trang bên mình chụp lookbook mùa đông tại đây. Màn hình tethering xem ảnh trực tiếp từ máy ảnh lên màn lớn 4K giúp stylist chọn góc cực kỳ nhanh. Tiến độ trả file màu rất thần tốc!', '2026-10-25 11:50:00', NOW()),
(16, 16, 9, 5.0, 'Hệ thống đèn Nanlite và chao tổ ong đánh sáng chuẩn xác từng sớ vải cao cấp. Kỹ thuật viên hỗ trợ căn chỉnh đèn liên tục rất nhiệt tình. Chắc chắn sẽ là đối tác chụp hình lâu dài của brand!', '2026-10-28 17:40:00', NOW()),
(17, 17, 4, 5.0, 'Phòng Studio E ban công hoàng hôn đón nắng chiều đẹp xuất sắc! Ảnh ngược sáng lung linh mà không hề bị lóa. Stylist tư vấn váy trắng ren rất hợp concept. Sẽ giới thiệu cho bạn bè!', '2026-10-22 17:00:00', NOW()),
(18, 18, 5, 5.0, 'Mê mẩn góc phố cổ và sen hồ tại Studio F. Đồ cổ trang được giặt ủi thơm phức, trâm cài tóc lấp lánh như phim truyền hình. Bạn photographer bắt góc nghiêng rất có hồn!', '2026-10-23 12:30:00', NOW()),
(19, 19, 6, 5.0, 'Chụp ảnh profile doanh nhân tại Studio G chuẩn phong cách Forbes. Ghế da Chesterfield cổ điển và kệ sách gỗ sồi tạo thần thái uy tín, đĩnh đạc. Giao file ngay trong ngày!', '2026-10-24 14:15:00', NOW()),
(20, 20, 7, 4.9, 'Studio H phong cách industrial loft trần cao thoáng đãng cực kỳ! Ekip đánh đèn sắc sảo, bắt trọn từng sớ vải lookbook thời trang cho brand bên mình. Rất hài lòng!', '2026-10-25 18:20:00', NOW()),
(21, 21, 8, 5.0, 'Gói thôi nôi cho bé tại Studio I ấm áp và an toàn tuyệt đối. Sàn gỗ sạch bóng, đồ chơi Scandinavian xinh xắn. Bạn trợ lý dỗ bé cười giòn tan suốt buổi chụp!', '2026-10-25 11:45:00', NOW()),
(22, 22, 9, 5.0, 'Sảnh cưới Grand Ballroom Studio K tráng lệ như cung điện Châu Âu! Sàn gương phản chiếu voan cưới bồng bềnh, ảnh in photobook mở phẳng nhìn sang chảnh vô cùng!', '2026-10-26 17:50:00', NOW()),
(23, 23, 10, 5.0, 'Nhóm bạn 8 đứa mình chụp kỷ yếu ở Studio L vách vô cực quẩy tưng bừng. Hệ thống đèn ray điện tử đổi phông nhanh chóng, màu ảnh trong veo chuẩn phim thanh xuân!', '2026-10-26 14:10:00', NOW()),
(24, 24, 11, 4.8, 'Gói chụp cá nhân layout Hàn Quốc tại Studio A nhẹ nhàng tinh tế. Bạn chuyên viên makeup bắt trend tone cam đào ngọt ngào. Trà bánh tiếp đón chu đáo như khách sạn 5 sao!', '2026-10-27 16:30:00', NOW()),
(25, 25, 4, 5.0, 'Album ảnh cưới tại Studio B vượt xa kỳ vọng của vợ chồng mình. Vòm đá cẩm thạch và đèn chùm Swarovski lên hình lung linh không khác gì chụp tại trời Âu!', '2026-10-27 11:20:00', NOW()),
(26, 26, 5, 5.0, 'Phòng Studio VIP trang bị màn hình 4K preview ảnh trực tiếp rất tiện, chụp tấm nào xem được ngay tấm đó để chỉnh dáng. Da được retouch giữ nét tự nhiên, rất có gu!', '2026-10-27 15:40:00', NOW()),
(27, 27, 6, 5.0, 'Chụp kỷ niệm 30 năm ngày cưới của bố mẹ tại Studio C. Không gian lò sưởi và đàn piano ấm cúng, cả nhà đều cảm thấy thư thái tự nhiên. Cảm ơn ekip rất nhiều!', '2026-10-28 11:15:00', NOW()),
(28, 28, 7, 4.9, 'Màu ảnh lookbook thời trang sắc nét, độ tương phản mượt mà tôn vinh form dáng sản phẩm. Kỹ thuật viên hỗ trợ căn chỉnh đèn liên tục rất nhiệt tình!', '2026-10-28 13:00:00', NOW()),
(29, 29, 8, 5.0, 'Trải nghiệm chụp ảnh cưới hoàng hôn tại ban công studio quá tuyệt vời! Gió chiều nhẹ làm tà váy bay tự nhiên, ekip chăm sóc cô dâu từng ngụm nước và dặm phấn kỹ càng!', '2026-10-28 18:10:00', NOW()),
(30, 30, 10, 5.0, 'Set cổ phục Nhật Bình và áo dài lụa tơ tằm quá lộng lẫy! Màu ảnh hoài niệm rực rỡ nét văn hóa truyền thống. Điểm 10 trọn vẹn cho tâm huyết và sự tận tụy của studio!', '2026-10-28 19:00:00', NOW());

-- ---------------------------------------------------------------------
-- 17. ĐÁNH GIÁ TỪNG NHÂN VIÊN (EMPLOYEE_REVIEWS TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `employee_reviews` (`id`, `review_id`, `employee_id`, `rating`, `comment`) VALUES
(1, 1, 1, 5.0, 'Photographer nhiệt tình, bắt góc cô dâu rất xinh và khéo léo'),
(2, 1, 2, 5.0, 'Makeup tone Hàn Quốc cực kỳ tôn nét da và giữ phấn lâu trôi'),
(3, 2, 1, 5.0, 'Bắt khoảnh khắc ánh sáng tự nhiên rất đẹp'),
(4, 3, 1, 5.0, 'Tương tác với trẻ nhỏ và ông bà rất thân thiện, kiên nhẫn'),
(5, 4, 1, 5.0, 'Phong cách chụp chuyên nghiệp, chuẩn style ảnh doanh nhân Forbes'),
(6, 5, 2, 5.0, 'Búi tóc cổ trang cầu kỳ và phối phụ kiện rất có gu'),
(7, 7, 1, 5.0, 'Kỹ thuật bắt góc hoàng hôn ngoại cảnh vô cùng đỉnh cao'),
(8, 7, 2, 5.0, 'Chăm sóc cô dâu chú rể tận tình suốt buổi chụp'),
(9, 8, 1, 5.0, 'Tốc độ chụp lookbook và setup ánh sáng thương mại chuẩn xác'),
(10, 17, 1, 5.0, 'Bắt khoảnh khắc hoàng hôn ngược sáng vô cùng xuất sắc'),
(11, 18, 2, 5.0, 'Tạo kiểu tóc cổ trang cầu kỳ và phối trâm cài rất sang'),
(12, 19, 1, 5.0, 'Định hình thần thái doanh nhân chuyên nghiệp chuẩn Forbes'),
(13, 21, 2, 5.0, 'Dỗ dành và chăm sóc các bé nhỏ cực kỳ khéo léo'),
(14, 22, 1, 5.0, 'Bắt góc đại cảnh sảnh cưới cực kỳ hoành tráng'),
(15, 25, 1, 5.0, 'Tận tâm hướng dẫn tạo dáng cho cô dâu chú rể'),
(16, 29, 2, 5.0, 'Trang điểm cô dâu bền màu, dặm phấn chu đáo suốt buổi');
-- 18. BANNER QUẢNG CÁO (BANNERS TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `banners` (`id`, `title`, `image_url`, `link`, `status`) VALUES
(1, 'Khuyến Mãi Mùa Cưới 2026 - Giảm Ngay 20%', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85', '/packages', 'active'),
(2, 'Bộ Sưu Tập Áo Cưới Ren Pháp Mới Nhất', 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=85', '/clothes', 'active');

-- ---------------------------------------------------------------------
-- 19. BÀI VIẾT VÀ NỘI DUNG (CONTENTS TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `contents` (`id`, `type`, `title`, `slug`, `content`, `image_url`, `status`) VALUES
(1, 'page', 'Về Chúng Tôi - PhotoStudio', 'gioi-thieu', 'PhotoStudio tự hào là đơn vị cung cấp dịch vụ chụp ảnh chuyên nghiệp hàng đầu với trang thiết bị hiện đại...', 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=85', 'published'),
(2, 'post', 'Bí quyết chọn trang phục chụp ảnh cưới studio đẹp nhất', 'bi-quyet-chon-trang-phuc-cuoi', 'Chụp ảnh cưới studio đang là xu hướng được nhiều cặp đôi lựa chọn bởi sự tiện lợi và phong cách tinh tế...', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85', 'published');

-- ---------------------------------------------------------------------
-- 20. LIÊN HỆ VÀ TƯ VẤN KHÁCH HÀNG (CONTACTS TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `contacts` (`id`, `user_id`, `fullname`, `email`, `phone`, `subject`, `message`, `status`, `reply_message`) VALUES
(1, 4, 'Lê Minh Tuấn', 'minhtuan@gmail.com', '0934567890', 'Tư vấn gói chụp cưới ngoại cảnh', 'Chào studio, mình muốn hỏi gói chụp cưới phong cách vintage có hỗ trợ trang điểm và xe di chuyển không ạ?', 'completed', 'Dạ chào bạn Tuấn, gói chụp cưới bên mình đã bao gồm trọn gói trang điểm và ekip hỗ trợ bạn nhé! Nhân viên sẽ liên hệ tư vấn chi tiết ạ.'),
(2, NULL, 'Nguyễn Mai Phương', 'maiphuong@outlook.com', '0988776655', 'Hỏi báo giá chụp kỷ yếu nhóm', 'Cho em xin báo giá chi tiết gói chụp ảnh kỷ yếu cho nhóm 15 người tại studio vào cuối tuần này với ạ.', 'pending', NULL);

-- =====================================================================
-- MIGRATION: THÊM CỘT DELETED_AT XÓA MỀM (CHO DATABASE ĐÃ TỒN TẠI)
-- =====================================================================
-- Run once against an existing photo_studio database before starting the backend.
-- New databases built from docs/photo_studio.sql already include this column.
ALTER TABLE `equipments`
    ADD COLUMN IF NOT EXISTS `deleted_at` DATETIME NULL COMMENT 'Thời điểm đưa thiết bị vào thùng rác';
-- Chạy một lần trên database photo_studio hiện có trước khi khởi động backend.
-- Database mới được tạo từ docs/photo_studio.sql đã có cột này.
ALTER TABLE `services`
    ADD COLUMN `deleted_at` DATETIME NULL COMMENT 'Thời điểm đưa dịch vụ vào thùng rác';
-- Chạy một lần trên database photo_studio hiện có trước khi khởi động backend.
-- Database mới được tạo từ docs/photo_studio.sql đã có cột này.
ALTER TABLE `rooms`
    ADD COLUMN `deleted_at` DATETIME NULL COMMENT 'Thời điểm đưa phòng chụp vào thùng rác';
-- Chạy một lần trên database photo_studio hiện có trước khi khởi động backend.
-- Database mới được tạo từ docs/photo_studio.sql đã có cột này.
ALTER TABLE `packages`
    ADD COLUMN `deleted_at` DATETIME NULL COMMENT 'Thời điểm đưa gói chụp vào thùng rác';
-- Chạy một lần trên database photo_studio hiện có trước khi khởi động backend.
-- Database mới được tạo từ docs/photo_studio.sql đã có cột này.
ALTER TABLE `clothes`
    ADD COLUMN `deleted_at` DATETIME NULL COMMENT 'Thời điểm đưa trang phục vào thùng rác';
-- Chạy một lần trên database photo_studio hiện có trước khi khởi động backend.
-- Database mới được tạo từ docs/photo_studio.sql đã có cột này.
ALTER TABLE `backgrounds`
    ADD COLUMN `deleted_at` DATETIME NULL COMMENT 'Thời điểm đưa bối cảnh vào thùng rác';
-- Chạy một lần trên database photo_studio hiện có trước khi khởi động backend.
-- Database mới được tạo từ docs/photo_studio.sql đã có cột này.
ALTER TABLE `accessories`
    ADD COLUMN `deleted_at` DATETIME NULL COMMENT 'Thời điểm đưa phụ kiện vào thùng rác';

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- KẾT THÚC TOÀN BỘ FILE PHOTO_STUDIO.SQL (SCHEMA + DATA)
-- =====================================================================
