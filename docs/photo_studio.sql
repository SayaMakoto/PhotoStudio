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
    `deleted_at` DATETIME NULL COMMENT 'Thời điểm đưa phòng chụp vào thùng rác'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý phòng chụp';

-- Bảng 4: backgrounds (Bối cảnh chụp)
CREATE TABLE `backgrounds` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `name` VARCHAR(255) NOT NULL COMMENT 'Tên bối cảnh',
    `description` VARCHAR(255) NULL COMMENT 'Mô tả bối cảnh',
    `status` ENUM('active', 'inactive', 'maintenance') NOT NULL DEFAULT 'active' COMMENT 'Trạng thái bối cảnh',
    `deleted_at` DATETIME NULL COMMENT 'Thời điểm đưa bối cảnh vào thùng rác'
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
    `deleted_at` DATETIME NULL COMMENT 'Thời điểm đưa thiết bị vào thùng rác'
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
    `status` ENUM('available', 'rented', 'maintenance', 'damaged', 'retired') NOT NULL DEFAULT 'available' COMMENT 'Trạng thái trang phục'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý trang phục cho thuê';

-- Bảng 7: accessories (Phụ kiện)
CREATE TABLE `accessories` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `type` ENUM('fashion', 'concept', 'vintage', 'wedding', 'other') NOT NULL COMMENT 'Loại phụ kiện',
    `name` VARCHAR(255) NOT NULL COMMENT 'Tên phụ kiện',
    `description` VARCHAR(255) NULL COMMENT 'Mô tả phụ kiện',
    `quantity` INT NOT NULL DEFAULT 0 COMMENT 'Số lượng trong kho',
    `price` DOUBLE NOT NULL DEFAULT 0.0 COMMENT 'Giá thuê phụ kiện',
    `status` ENUM('available', 'rented', 'maintenance', 'damaged', 'retired') NOT NULL DEFAULT 'available' COMMENT 'Trạng thái phụ kiện'
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
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật dịch vụ'
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
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật gói chụp'
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
    `imageable_type` ENUM('background', 'equipment', 'clothing', 'accessory', 'package', 'service') NOT NULL COMMENT 'Loại đối tượng gắn ảnh',
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


-- =====================================================================
-- DỮ LIỆU MẪU CƠ BẢN
-- =====================================================================
-- =====================================================================
-- SEED DATA: Dữ liệu mẫu khởi tạo cho hệ thống PhotoStudio
-- File: docs/seed_data.sql
-- Database: photo_studio
-- =====================================================================

USE `photo_studio`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Thêm tài khoản người dùng (users)
-- Tài khoản mẫu dùng mật khẩu mặc định: '123456'
INSERT INTO `users` (`id`, `username`, `email`, `password`, `fullname`, `date_of_birth`, `gender`, `address`, `phone`, `avatar`, `role`, `status`) VALUES
(1, 'admin', 'admin@photostudio.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Quản Trị Viên', '1990-01-01', 'Male', 'Hà Nội', '0901234567', '/avatars/admin.jpg', 'Admin', 'active'),
(2, 'photographer1', 'hoanganh@photostudio.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Nguyễn Hoàng Anh', '1995-05-15', 'Male', 'Hà Nội', '0912345678', '/avatars/emp1.jpg', 'Employee', 'active'),
(3, 'makeup1', 'thuytien@photostudio.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Trần Thủy Tiên', '1998-08-20', 'Female', 'Hà Nội', '0923456789', '/avatars/emp2.jpg', 'Employee', 'active'),
(4, 'customer1', 'minhtuan@gmail.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Lê Minh Tuấn', '2000-03-10', 'Male', 'Cầu Giấy, Hà Nội', '0934567890', '/avatars/cust1.jpg', 'Customer', 'active'),
(5, 'customer2', 'phuonglinh@gmail.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Phạm Phương Linh', '2001-11-25', 'Female', 'Đống Đa, Hà Nội', '0945678901', '/avatars/cust2.jpg', 'Customer', 'active');

-- 2. Thêm hồ sơ nhân viên (employees)
INSERT INTO `employees` (`id`, `user_id`, `position`, `hire_date`, `status`) VALUES
(1, 2, 'photographer', '2023-01-15', 'active'),
(2, 3, 'makeup', '2023-03-01', 'active');

-- 3. Thêm phòng chụp (rooms)
INSERT INTO `rooms` (`id`, `name`, `description`, `capacity`, `status`) VALUES
(1, 'Phòng Studio A - Phong cách Hàn Quốc', 'Phòng chụp tone sáng, phù hợp ảnh chân dung, beauty, thời trang trẻ trung', 5, 'active'),
(2, 'Phòng Studio B - Concept Cổ Điển & Cưới', 'Phòng chụp diện tích lớn, trần cao, phù hợp chụp ảnh cưới, gia đình', 10, 'active'),
(3, 'Phòng Studio VIP - Không gian đa năng', 'Phòng trang bị hệ thống ánh sáng cinema và phông màu tự động', 8, 'active');

-- 4. Thêm bối cảnh chụp (backgrounds)
INSERT INTO `backgrounds` (`id`, `name`, `description`, `status`) VALUES
(1, 'Phông Trơn Màu Pastel', 'Bối cảnh phông trơn tối giản phong cách Hàn Quốc', 'active'),
(2, 'Góc Phố Cổ Vintage', 'Bối cảnh hoài niệm với đèn vàng, bàn gỗ cổ và sách cũ', 'active'),
(3, 'Cung Điện Hoàng Gia', 'Bối cảnh trang trọng với hoa tươi, cột cổ điển và rèm lụa', 'active');

-- 5. Thêm thiết bị (equipments)
INSERT INTO `equipments` (`id`, `type`, `name`, `brand`, `model`, `serial_number`, `purchase_date`, `description`, `status`) VALUES
(1, 'camera', 'Sony A7 IV', 'Sony', 'ILCE-7M4', 'SN-SONY-001', '2023-05-10', 'Máy ảnh Full-frame chuyên chụp studio', 'available'),
(2, 'camera', 'Canon EOS R5', 'Canon', 'EOS R5', 'SN-CANON-002', '2023-06-12', 'Máy ảnh độ phân giải 45MP cho chi tiết cực cao', 'available'),
(3, 'lens', 'Sony FE 24-70mm F2.8 GM II', 'Sony', 'SEL2470GM2', 'SN-LENS-003', '2023-05-15', 'Ống kính zoom tiêu chuẩn cao cấp', 'available'),
(4, 'lighting', 'Đèn Godox AD600 Pro', 'Godox', 'AD600Pro', 'SN-LIGHT-004', '2023-04-01', 'Đèn công suất 600W cho ánh sáng studio chuẩn', 'available'),
(5, 'tripod', 'Chân máy Manfrotto 055', 'Manfrotto', 'MK055XPRO3', 'SN-TRIPOD-005', '2023-02-18', 'Chân máy ảnh chịu tải lớn, đầm chắc', 'available');

-- 6. Thêm trang phục (clothes)
INSERT INTO `clothes` (`id`, `type`, `name`, `size`, `gender`, `color`, `description`, `price`, `status`) VALUES
(1, 'wedding', 'Váy Cưới Xòe Công Chúa Ren Pháp', 'M', 'Female', 'Trắng tinh khôi', 'Váy cưới lộng lẫy đính pha lê cao cấp', 500000, 'available'),
(2, 'suit', 'Bộ Vest Nam Tuxedo Cổ Điển', 'L', 'Male', 'Đen huyền bí', 'Vest cưới nam thanh lịch, tôn dáng', 300000, 'available'),
(3, 'traditional', 'Áo Dài Truyền Thống Thêu Hoa Sen', 'S', 'Female', 'Hồng phấn', 'Áo dài lụa tơ tằm mềm mại thêu tay thủ công', 250000, 'available'),
(4, 'casual', 'Set Váy Nàng Thơ Vintage', 'Free size', 'Female', 'Be nhạt', 'Váy dạo phố chụp ngoại cảnh hoặc studio phong cách nhẹ nhàng', 150000, 'available');

-- 7. Thêm phụ kiện (accessories)
INSERT INTO `accessories` (`id`, `type`, `name`, `description`, `quantity`, `price`, `status`) VALUES
(1, 'wedding', 'Vương Miện Cô Dâu Hoàng Gia', 'Vương miện đính đá lấp lánh cho cô dâu', 5, 100000, 'available'),
(2, 'wedding', 'Bó Hoa Cưới Cầm Tay Lụa Cao Cấp', 'Hoa cưới cầm tay tone pastel nhẹ nhàng', 10, 80000, 'available'),
(3, 'vintage', 'Mũ Beret Phong Cách Cổ Điển', 'Mũ len beret phong cách Pháp', 8, 50000, 'available');

-- 8. Thêm dịch vụ (services)
INSERT INTO `services` (`id`, `name`, `type`, `description`, `duration`, `price`, `status`) VALUES
(1, 'Trang Điểm & Làm Tóc Chuyên Nghiệp', 'makeup', 'Layout makeup cá nhân phù hợp từng concept', 60, 300000, 'active'),
(2, 'Chụp Thêm Thời Gian (Mỗi 30 phút)', 'photography', 'Gia hạn thời gian chụp thêm với nhiếp ảnh gia', 30, 200000, 'active'),
(3, 'Chỉnh Sửa Ảnh Chuyên Sâu (Retouch)', 'photography', 'Retouch da, dáng và màu sắc nghệ thuật theo yêu cầu (10 ảnh)', 60, 250000, 'active'),
(4, 'Thuê Phụ Kiện Cao Cấp Đi Kèm', 'accessory', 'Không giới hạn phụ kiện chụp ảnh trong buổi chụp', 0, 150000, 'active');

-- 9. Thêm gói chụp ảnh (packages)
INSERT INTO `packages` (`id`, `name`, `description`, `duration`, `price`, `status`) VALUES
(1, 'Gói Chụp Ảnh Cá Nhân / Nàng Thơ', 'Bao gồm chụp studio 60 phút, hỗ trợ 1 trang phục, makeup cơ bản và 15 ảnh chỉnh sửa', 60, 990000, 'active'),
(2, 'Gói Chụp Ảnh Cưới Studio Cơ Bản', 'Chụp 120 phút với 2 bối cảnh, váy cưới và vest nam, makeup chuyên nghiệp, tặng album mini', 120, 2990000, 'active'),
(3, 'Gói Chụp Ảnh Gia Đình / Nhóm Bạn', 'Chụp không gian phòng lớn VIP, phù hợp nhóm 4-8 người, chụp thoải mái trong 90 phút', 90, 1890000, 'active');

-- 10. Gán dịch vụ cho gói chụp (package_services)
INSERT INTO `package_services` (`id`, `package_id`, `service_id`, `quantity`) VALUES
(1, 1, 1, 1), -- Gói Nàng Thơ có Makeup
(2, 2, 1, 1), -- Gói Cưới có Makeup
(3, 2, 3, 1); -- Gói Cưới có Retouch

-- 11. Gán bối cảnh cho gói chụp (package_backgrounds)
INSERT INTO `package_backgrounds` (`id`, `package_id`, `background_id`) VALUES
(1, 1, 1), -- Gói Nàng Thơ dùng phông pastel
(2, 2, 2), -- Gói Cưới dùng góc phố cổ
(3, 2, 3); -- Gói Cưới dùng cung điện

-- 12. Gán yêu cầu thiết bị cho gói chụp (package_equipments)
INSERT INTO `package_equipments` (`id`, `package_id`, `equipment_type`, `quantity`) VALUES
(1, 1, 'camera', 1),
(2, 1, 'lighting', 2),
(3, 2, 'camera', 1),
(4, 2, 'lighting', 3),
(5, 2, 'tripod', 1);

-- 13. Thêm banner quảng cáo (banners)
INSERT INTO `banners` (`id`, `title`, `image_url`, `link`, `status`) VALUES
(1, 'Khuyến Mãi Mùa Cưới 2026 - Giảm Ngay 20%', '/banners/wedding_sale.jpg', '/packages/wedding', 'active'),
(2, 'BST Trang Phục Dạ Hội Mới Nhất', '/banners/fashion_lookbook.jpg', '/clothes', 'active');

-- 14. Thêm bài viết / nội dung (contents)
INSERT INTO `contents` (`id`, `type`, `title`, `slug`, `content`, `image_url`, `status`) VALUES
(1, 'page', 'Về Chúng Tôi - PhotoStudio', 'gioi-thieu', 'PhotoStudio tự hào là đơn vị cung cấp dịch vụ chụp ảnh chuyên nghiệp hàng đầu với trang thiết bị hiện đại...', '/contents/about.jpg', 'published'),
(2, 'post', 'Bí quyết chọn trang phục chụp ảnh cưới studio đẹp nhất', 'bi-quyet-chon-trang-phuc-cuoi', 'Chụp ảnh cưới studio đang là xu hướng được nhiều cặp đôi lựa chọn bởi sự tiện lợi và phong cách tinh tế...', '/contents/tips.jpg', 'published');

-- 15. Thêm dữ liệu mẫu liên hệ (contacts)
INSERT INTO `contacts` (`id`, `user_id`, `fullname`, `email`, `phone`, `subject`, `message`, `status`, `reply_message`) VALUES
(1, 4, 'Lê Minh Tuấn', 'minhtuan@gmail.com', '0934567890', 'Tư vấn gói chụp cưới ngoại cảnh', 'Chào studio, mình muốn hỏi gói chụp cưới phong cách vintage có hỗ trợ trang điểm và xe di chuyển không ạ?', 'completed', 'Dạ chào bạn Tuấn, gói chụp cưới bên mình đã bao gồm trọn gói trang điểm và ekip hỗ trợ bạn nhé! Nhân viên sẽ liên hệ tư vấn chi tiết ạ.'),
(2, NULL, 'Nguyễn Mai Phương', 'maiphuong@outlook.com', '0988776655', 'Hỏi báo giá chụp kỷ yếu nhóm', 'Cho em xin báo giá chi tiết gói chụp ảnh kỷ yếu cho nhóm 15 người tại studio vào cuối tuần này với ạ.', 'pending', NULL);

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- HOÀN TẤT DỮ LIỆU MẪU
-- =====================================================================


-- =====================================================================
-- DỮ LIỆU GÓI CHỤP MỞ RỘNG
-- =====================================================================
-- =====================================================================
-- DỮ LIỆU MẪU GÓI CHỤP (PACKAGES SAMPLE DATA) CHO PHOTOSTUDIO
-- File: docx/packages_sample_data.sql
-- Cơ sở dữ liệu: photo_studio
-- Bảng liên quan: packages, package_equipments, package_services, package_backgrounds, images
-- =====================================================================

USE `photo_studio`;

SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- 1. XÓA DỮ LIỆU CŨ CỦA CÁC GÓI MẪU (NẾU CẦN RESET)
-- ---------------------------------------------------------------------
DELETE FROM `package_equipments` WHERE `package_id` IN (1, 2, 3, 4, 5, 6, 7, 8);
DELETE FROM `package_services` WHERE `package_id` IN (1, 2, 3, 4, 5, 6, 7, 8);
DELETE FROM `package_backgrounds` WHERE `package_id` IN (1, 2, 3, 4, 5, 6, 7, 8);
DELETE FROM `images` WHERE `imageable_type` = 'package' AND `imageable_id` IN (1, 2, 3, 4, 5, 6, 7, 8);
DELETE FROM `packages` WHERE `id` IN (1, 2, 3, 4, 5, 6, 7, 8);

-- ---------------------------------------------------------------------
-- 2. THÊM 8 GÓI CHỤP ĐA DẠNG CONCEPT (PACKAGES)
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
-- 3. GÁN TRANG THIẾT BỊ ĐI KÈM CHO TỪNG GÓI CHỤP (PACKAGE_EQUIPMENTS)
-- ---------------------------------------------------------------------
INSERT INTO `package_equipments` (`package_id`, `equipment_type`, `quantity`) VALUES
(1, 'camera', 1),
(1, 'lighting', 2),
(2, 'camera', 1),
(2, 'lighting', 3),
(2, 'tripod', 1),
(3, 'camera', 1),
(3, 'lighting', 3),
(4, 'camera', 2),
(4, 'lighting', 4),
(4, 'tripod', 1),
(4, 'lens', 2),
(5, 'camera', 1),
(5, 'lighting', 2),
(6, 'camera', 1),
(6, 'lighting', 3),
(6, 'other', 1),
(7, 'camera', 1),
(7, 'lighting', 2),
(8, 'camera', 1),
(8, 'lighting', 4),
(8, 'other', 2);

-- ---------------------------------------------------------------------
-- 4. GÁN DỊCH VỤ GIA TĂNG BAO GỒM TRONG GÓI (PACKAGE_SERVICES)
-- ---------------------------------------------------------------------
INSERT INTO `package_services` (`package_id`, `service_id`, `quantity`) VALUES
(1, 1, 1),
(2, 1, 1),
(2, 3, 1),
(3, 3, 1),
(4, 1, 2),
(4, 3, 2),
(4, 4, 1),
(6, 1, 1),
(7, 1, 1),
(7, 4, 1),
(8, 3, 1);

-- ---------------------------------------------------------------------
-- 5. GÁN BỐI CẢNH CHO TỪNG GÓI (PACKAGE_BACKGROUNDS)
-- ---------------------------------------------------------------------
INSERT INTO `package_backgrounds` (`package_id`, `background_id`) VALUES
(1, 1),
(2, 2),
(2, 3),
(3, 2),
(4, 3),
(5, 1),
(6, 1),
(7, 2),
(8, 1);

-- ---------------------------------------------------------------------
-- 6. THÊM HÌNH ẢNH TRƯNG BÀY SẢN PHẨM VÀO BẢNG IMAGES (IMAGES TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `images` (`imageable_type`, `imageable_id`, `image_url`, `description`, `is_primary`, `created_at`, `updated_at`) VALUES
('package', 1, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85', 'Ảnh bìa Gói Chụp Cá Nhân Nàng Thơ Pastel', TRUE, NOW(), NOW()),
('package', 1, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85', 'Góc chụp cận cảnh chân dung nghệ thuật', FALSE, NOW(), NOW()),
('package', 2, 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85', 'Ảnh bìa Gói Chụp Ảnh Cưới Studio Cổ Điển', TRUE, NOW(), NOW()),
('package', 2, 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85', 'Khoảnh khắc cô dâu và chú rể trong cung điện hoàng gia', FALSE, NOW(), NOW()),
('package', 3, 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1200&q=85', 'Ảnh bìa Gói Chụp Gia Đình Đoàn Viên', TRUE, NOW(), NOW()),
('package', 4, 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85', 'Ảnh bìa Gói Cưới Luxury Hoàng Hôn Ngoại Cảnh', TRUE, NOW(), NOW()),
('package', 4, 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85', 'Váy cưới bồng bềnh dưới ánh sáng tự nhiên', FALSE, NOW(), NOW()),
('package', 5, 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=85', 'Ảnh bìa Gói Chụp Kỷ Yếu Tốt Nghiệp Rực Rỡ', TRUE, NOW(), NOW()),
('package', 6, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85', 'Ảnh bìa Gói Chụp Doanh Nhân Đẳng Cấp Phong Cách Forbes', TRUE, NOW(), NOW()),
('package', 7, 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85', 'Ảnh bìa Gói Chụp Áo Dài Truyền Thống Nét Đẹp Á Đông', TRUE, NOW(), NOW()),
('package', 8, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85', 'Ảnh bìa Gói Chụp Lookbook Thương Hiệu High-End', TRUE, NOW(), NOW());

SET FOREIGN_KEY_CHECKS = 1;


-- =====================================================================
-- TƯƠNG THÍCH HASH ADMIN TỪ SEED CŨ (không đổi user/employee)
-- =====================================================================
-- Chạy một lần trên database photo_studio hiện tại nếu admin đang dùng hash mẫu cũ.
-- Nếu cần giữ dữ liệu hiện có, chỉ chạy riêng câu UPDATE bên dưới; không chạy toàn bộ file,
-- vì phần schema ở đầu file sẽ xóa và tạo lại các bảng.
-- Chỉ cập nhật tài khoản admin có đúng hash seed lỗi; không thay đổi mật khẩu user/employee.
USE `photo_studio`;

UPDATE `users`
SET `password` = '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.'
WHERE `username` = 'admin'
  AND `password` = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcd7qaUfqWg6';
