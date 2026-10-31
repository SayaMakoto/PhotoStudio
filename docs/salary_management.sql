-- =====================================================================
-- BẢNG QUẢN LÝ LƯƠNG & HOA HỒNG NHÂN VIÊN (SALARIES & COMMISSIONS)
-- Cơ chế tính lương cho Nhiếp ảnh gia (Photographer):
--   1. Lương cơ bản theo ngày làm việc: 250.000 VNĐ / ngày.
--   2. Hoa hồng: 10% giá trị trên mỗi gói chụp hoàn thành.
--      Ví dụ: Gói 1.000.000 VNĐ -> Hoa hồng = 100.000 VNĐ.
-- =====================================================================

USE `photo_studio`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `salary_commission_details`;
DROP TABLE IF EXISTS `salaries`;
SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- 1. BẢNG SALARIES (Phiếu lương định kỳ theo tháng của nhân viên)
-- ---------------------------------------------------------------------
CREATE TABLE `salaries` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Mã phiếu lương',
    `employee_id` BIGINT NOT NULL COMMENT 'FK - employees (Nhân viên nhận lương)',
    `month` INT NOT NULL COMMENT 'Tháng tính lương (1 - 12)',
    `year` INT NOT NULL COMMENT 'Năm tính lương (Ví dụ: 2026)',
    `work_days` INT NOT NULL DEFAULT 0 COMMENT 'Số ngày làm việc / tác nghiệp trong tháng',
    `daily_rate` DECIMAL(12, 2) NOT NULL DEFAULT 250000.00 COMMENT 'Đơn giá lương ngày công (250.000 đ/ngày)',
    `base_salary` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT 'Tổng lương cơ bản = work_days * daily_rate',
    `total_shoots` INT NOT NULL DEFAULT 0 COMMENT 'Tổng số gói chụp hoàn thành trong tháng',
    `commission_rate` DECIMAL(5, 2) NOT NULL DEFAULT 0.10 COMMENT 'Tỷ lệ hoa hồng mặc định (0.10 = 10%)',
    `total_commission` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT 'Tổng tiền hoa hồng nhận được trên các gói chụp',
    `bonus` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT 'Tiền thưởng KPI / Thưởng chuyên cần',
    `deduction` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT 'Các khoản phạt / khấu trừ',
    `net_salary` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT 'Tổng lương thực nhận = base + commission + bonus - deduction',
    `status` ENUM('pending', 'approved', 'paid') NOT NULL DEFAULT 'pending' COMMENT 'Trạng thái: pending (Chờ duyệt), approved (Đã duyệt), paid (Đã thanh toán)',
    `note` VARCHAR(255) NULL COMMENT 'Ghi chú của quản trị viên',
    `paid_at` DATETIME NULL COMMENT 'Ngày chi trả lương',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_salaries_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY `uk_employee_period` (`employee_id`, `month`, `year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng quản lý lương nhân viên theo tháng';

-- ---------------------------------------------------------------------
-- 2. BẢNG SALARY_COMMISSION_DETAILS (Chi tiết hoa hồng từng gói chụp)
-- ---------------------------------------------------------------------
CREATE TABLE `salary_commission_details` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Mã chi tiết hoa hồng',
    `salary_id` BIGINT NOT NULL COMMENT 'FK - salaries (Phiếu lương)',
    `booking_id` BIGINT NOT NULL COMMENT 'FK - bookings (Buổi chụp tương ứng)',
    `package_id` BIGINT NOT NULL COMMENT 'Mã gói chụp',
    `package_name` VARCHAR(255) NOT NULL COMMENT 'Tên gói chụp đã hoàn thành',
    `package_price` DECIMAL(12, 2) NOT NULL COMMENT 'Đơn giá gói chụp (VNĐ)',
    `commission_rate` DECIMAL(5, 2) NOT NULL DEFAULT 0.10 COMMENT 'Tỷ lệ hoa hồng (0.10 = 10%)',
    `commission_amount` DECIMAL(12, 2) NOT NULL COMMENT 'Tiền hoa hồng nhận được = package_price * commission_rate',
    `shoot_date` DATE NOT NULL COMMENT 'Ngày chụp thực tế',
    `customer_name` VARCHAR(150) NULL COMMENT 'Tên khách hàng đặt gói',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_scd_salary` FOREIGN KEY (`salary_id`) REFERENCES `salaries` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_scd_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng kê hoa hồng chi tiết trên từng gói chụp';

-- ---------------------------------------------------------------------
-- 3. DỮ LIỆU MẪU (SEED DATA CHO THÁNG 10/2026 & THÁNG 9/2026)
-- ---------------------------------------------------------------------

-- Phiếu lương Tháng 10/2026 cho Nhân viên 1 (Nguyễn Hoàng Anh - Photographer)
-- 22 ngày làm x 250k = 5.500.000 đ
-- 5 gói chụp: tổng giá 13.060.000 đ -> hoa hồng 10% = 1.306.000 đ
-- Thưởng chuyên cần: 500.000 đ
-- Tổng thực nhận: 7.306.000 đ
INSERT INTO `salaries` (
    `id`, `employee_id`, `month`, `year`, `work_days`, `daily_rate`, `base_salary`,
    `total_shoots`, `commission_rate`, `total_commission`, `bonus`, `deduction`,
    `net_salary`, `status`, `note`, `paid_at`, `created_at`
) VALUES
(1, 1, 10, 2026, 22, 250000.00, 5500000.00, 5, 0.10, 1306000.00, 500000.00, 0.00, 7306000.00, 'approved', 'Đạt chỉ tiêu KPI tháng 10 và phản hồi 5 sao từ khách hàng', NULL, '2026-10-31 08:00:00'),
(2, 1, 9, 2026, 24, 250000.00, 6000000.00, 6, 0.10, 1650000.00, 300000.00, 0.00, 7950000.00, 'paid', 'Đã chuyển khoản lương kỳ tháng 9 qua VCB', '2026-10-05 10:30:00', '2026-09-30 18:00:00'),
(3, 2, 10, 2026, 20, 200000.00, 4000000.00, 4, 0.10, 850000.00, 200000.00, 0.00, 5050000.00, 'approved', 'Chuyên viên makeup hoàn thành tốt ca chụp', NULL, '2026-10-31 08:30:00');

-- Chi tiết hoa hồng từng gói chụp cho Phiếu lương #1 (Tháng 10/2026)
INSERT INTO `salary_commission_details` (
    `id`, `salary_id`, `booking_id`, `package_id`, `package_name`,
    `package_price`, `commission_rate`, `commission_amount`, `shoot_date`, `customer_name`
) VALUES
(1, 1, 1, 1, 'Gói Chụp Ảnh Cưới Luxury & Ngoại Cảnh VIP', 6390000.00, 0.10, 639000.00, '2026-10-12', 'Lê Minh Tuấn'),
(2, 1, 2, 2, 'Gói Chụp Chân Dung Nghệ Thuật Nàng Thơ', 990000.00, 0.10, 99000.00, '2026-10-15', 'Nguyễn Thu Trang'),
(3, 1, 3, 3, 'Gói Chụp Ảnh Gia Đình Vintage Ấm Cúng', 1890000.00, 0.10, 189000.00, '2026-10-20', 'Phạm Hoàng Long'),
(4, 1, 4, 4, 'Gói Chụp Ảnh Doanh Nhân & Profile VIP', 1290000.00, 0.10, 129000.00, '2026-10-25', 'Trần Thị Mai'),
(5, 1, 5, 5, 'Gói Chụp Concept Thời Trang & Lookbook', 2500000.00, 0.10, 250000.00, '2026-10-28', 'Đỗ Minh Quân');
