-- =====================================================================
-- DỮ LIỆU MẪU DÀNH CHO NHÂN VIÊN: PHẠM HOÀI MAI (ID = 8)
-- Hệ thống: PhotoStudio Management System
-- File: docs/seed_employee_pham_hoai_mai.sql
-- =====================================================================

USE `photo_studio`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- 0. DỌN DẸP DỮ LIỆU CŨ TRÁNH XUNG ĐỘT KHÓA NGOẠI
-- ---------------------------------------------------------------------
DELETE FROM `notifications` WHERE `user_id` = 8;
DELETE FROM `employee_reviews` WHERE `employee_id` = 8;
DELETE FROM `booking_employee_assignments` WHERE `employee_id` = 8;
DELETE FROM `employees` WHERE `id` = 8 OR `user_id` = 8;
DELETE FROM `users` WHERE `id` = 8 OR `username` = 'hoaimai';

-- ---------------------------------------------------------------------
-- 1. TẠO TÀI KHOẢN NGƯỜI DÙNG (USERS) VỚI ID = 8
-- Mật khẩu mặc định mã hóa BCrypt: 123456
-- ---------------------------------------------------------------------
INSERT INTO `users` (
    `id`,
    `username`,
    `email`,
    `password`,
    `fullname`,
    `date_of_birth`,
    `gender`,
    `address`,
    `phone`,
    `avatar`,
    `role`,
    `status`,
    `created_at`,
    `updated_at`
) VALUES (
    8,
    'hoaimai',
    'phamhoaimai@photostudio.com',
    '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.',
    'Phạm Hoài Mai',
    '1997-09-18',
    'Female',
    'Số 45 Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội',
    '0968123456',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'Employee',
    'active',
    NOW(),
    NOW()
);

-- ---------------------------------------------------------------------
-- 2. TẠO HỒ SƠ NHÂN VIÊN (EMPLOYEES) VỚI ID = 8 & USER_ID = 8
-- ---------------------------------------------------------------------
INSERT INTO `employees` (`id`, `user_id`, `position`, `hire_date`, `status`)
VALUES (8, 8, 'makeup', '2023-04-01', 'active');

-- ---------------------------------------------------------------------
-- 3. PHÂN CÔNG BUỔI CHỤP CHO NHÂN VIÊN ID = 8 (BOOKING_EMPLOYEE_ASSIGNMENTS)
-- ---------------------------------------------------------------------
INSERT INTO `booking_employee_assignments` (`booking_id`, `employee_id`, `assigned_at`, `status`, `note`)
VALUES 
(1, 8, '2026-10-09 10:00:00', 'completed', 'Phụ trách layout cô dâu Hàn Quốc tone cam đào'),
(2, 8, '2026-10-11 15:00:00', 'completed', 'Makeup nhẹ nhàng, làm tóc xoăn lơi nàng thơ'),
(5, 8, '2026-10-19 14:00:00', 'completed', 'Búi tóc cổ trang, cài trâm ngọc cung đình'),
(7, 8, NOW(), 'assigned', 'Lịch chụp cá nhân mùa thu - chuẩn bị layout tone ấm');

-- ---------------------------------------------------------------------
-- 4. ĐÁNH GIÁ CHẤT LƯỢNG CHO NHÂN VIÊN ID = 8 (EMPLOYEE_REVIEWS)
-- ---------------------------------------------------------------------
INSERT INTO `employee_reviews` (`review_id`, `employee_id`, `rating`, `comment`)
VALUES 
(1, 8, 5.0, 'Bạn Mai makeup rất tỉ mỉ, lớp nền mỏng nhẹ tự nhiên suốt buổi chụp. Thái độ rất ân cần, đáng yêu!'),
(2, 8, 5.0, 'Chị Mai làm tóc xinh xỉu, tư vấn tone son cực kỳ hợp với chiếc váy hoa nhí. Rất ưng ý!'),
(5, 8, 4.9, 'Tay nghề búi tóc cổ phục của bạn Mai rất khéo léo, phụ kiện phối hài hòa đúng phong cách.');

-- ---------------------------------------------------------------------
-- 5. THÔNG BÁO HỆ THỐNG GỬI CHO USER_ID = 8 (NOTIFICATIONS)
-- ---------------------------------------------------------------------
INSERT INTO `notifications` (`user_id`, `title`, `message`, `type`, `read_at`, `created_at`)
VALUES 
(8, 'Phân công lịch làm việc mới', 'Bạn được phân công phụ trách trang điểm cho Booking #7 vào ngày 28/10/2026.', 'employee_assignment', NULL, NOW()),
(8, 'Đánh giá 5 sao mới từ khách hàng', 'Khách hàng vừa để lại đánh giá 5 sao cho bạn tại đơn chụp ảnh cưới #1.', 'system', NOW(), '2026-10-11 17:00:00');

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- KIỂM TRA LẠI DỮ LIỆU
-- ---------------------------------------------------------------------
SELECT u.id AS user_id, u.username, u.fullname, u.email, e.id AS employee_id, e.position, e.status
FROM users u
JOIN employees e ON u.id = e.user_id
WHERE u.id = 8;
