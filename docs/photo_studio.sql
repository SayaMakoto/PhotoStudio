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
    `status` ENUM('active', 'inactive', 'maintenance') NOT NULL DEFAULT 'active' COMMENT 'Trạng thái hoạt động'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý phòng chụp';

-- Bảng 4: backgrounds (Bối cảnh chụp)
CREATE TABLE `backgrounds` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Khóa chính',
    `name` VARCHAR(255) NOT NULL COMMENT 'Tên bối cảnh',
    `description` VARCHAR(255) NULL COMMENT 'Mô tả bối cảnh',
    `status` ENUM('active', 'inactive', 'maintenance') NOT NULL DEFAULT 'active' COMMENT 'Trạng thái bối cảnh'
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
    `status` ENUM('available', 'in_use', 'maintenance', 'broken', 'retired') NOT NULL DEFAULT 'available' COMMENT 'Trạng thái thiết bị'
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
