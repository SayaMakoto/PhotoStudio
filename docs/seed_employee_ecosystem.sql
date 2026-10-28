-- =====================================================================
-- SEED DỮ LIỆU ĐỒNG BỘ TOÀN DIỆN CHO NHÂN VIÊN PHẠM HOÀI MAI (ID = 8)
-- File: docs/seed_employee_ecosystem.sql
-- Database: photo_studio
-- =====================================================================

USE `photo_studio`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- 1. BẢO ĐẢM PHÒNG CHỤP (ROOMS)
-- ---------------------------------------------------------------------
INSERT INTO `rooms` (`id`, `name`, `description`, `capacity`, `status`) VALUES
(1, 'Phòng Studio A - Phong Cách Hàn Quốc', 'Tone màu pastel sáng, rèm voan, hoa khô nghệ thuật', 5, 'active'),
(2, 'Phòng Studio B - Concept Cổ Điển & Cung Điện', 'Nội thất gỗ sồi sang trọng, đèn chùm hoàng gia', 10, 'active'),
(3, 'Phòng Studio VIP - Cinema & Đa Năng', 'Hệ thống đèn Arri/Godox kịch tính, phông điện tử', 8, 'active')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `status` = VALUES(`status`);

-- ---------------------------------------------------------------------
-- 2. BẢO ĐẢM TÀI KHOẢN KHÁCH HÀNG & NHÂN VIÊN (USERS)
-- ---------------------------------------------------------------------
INSERT INTO `users` (`id`, `username`, `email`, `password`, `fullname`, `date_of_birth`, `gender`, `address`, `phone`, `avatar`, `role`, `status`) VALUES
(4, 'customer1', 'minhtuan@gmail.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Lê Minh Tuấn', '2000-03-10', 'Male', 'Cầu Giấy, Hà Nội', '0934567890', '/avatars/cust1.jpg', 'Customer', 'active'),
(5, 'customer2', 'phuonglinh@gmail.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Phạm Phương Linh', '2001-11-25', 'Female', 'Đống Đa, Hà Nội', '0945678901', '/avatars/cust2.jpg', 'Customer', 'active'),
(8, 'hoaimai', 'phamhoaimai@photostudio.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Phạm Hoài Mai', '1997-09-18', 'Female', 'Số 45 Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội', '0968123456', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'Employee', 'active')
ON DUPLICATE KEY UPDATE `fullname` = VALUES(`fullname`), `phone` = VALUES(`phone`), `role` = VALUES(`role`), `status` = VALUES(`status`);

-- ---------------------------------------------------------------------
-- 3. BẢO ĐẢM HỒ SƠ NHÂN VIÊN (EMPLOYEES)
-- ---------------------------------------------------------------------
INSERT INTO `employees` (`id`, `user_id`, `position`, `hire_date`, `status`) VALUES
(8, 8, 'makeup', '2023-04-01', 'active')
ON DUPLICATE KEY UPDATE `position` = VALUES(`position`), `status` = VALUES(`status`);

-- ---------------------------------------------------------------------
-- 4. BẢO ĐẢM DANH MỤC THIẾT BỊ STUDIO (EQUIPMENTS)
-- ---------------------------------------------------------------------
INSERT INTO `equipments` (`id`, `type`, `name`, `brand`, `model`, `serial_number`, `purchase_date`, `description`, `status`) VALUES
(1, 'camera', 'Sony Alpha 7 IV Full-Frame', 'Sony', 'ILCE-7M4', 'SN-SONY-7M4-01', '2023-05-10', 'Máy ảnh chuyên chụp chân dung & studio', 'available'),
(2, 'camera', 'Canon EOS R5 Độ Phân Giải 45MP', 'Canon', 'EOS R5', 'SN-CANON-R5-02', '2023-06-12', 'Chi tiết da cực cao cho bộ ảnh cưới', 'available'),
(3, 'lighting', 'Đèn Studio Godox AD600 Pro TTL', 'Godox', 'AD600Pro', 'SN-LIGHT-AD600-09', '2023-04-01', 'Đèn công suất 600W chuẩn quốc tế', 'available'),
(4, 'lighting', 'Đèn Nanlite Forza 500B II Bi-Color', 'Nanlite', 'Forza-500B', 'SN-LIGHT-NANLITE-11', '2023-10-18', 'Đèn liên tục nhiệt độ màu 2700K - 6500K', 'available'),
(5, 'tripod', 'Chân Máy Ảnh Manfrotto 055 Pro', 'Manfrotto', 'MK055XPRO3', 'SN-TRIPOD-055-12', '2023-02-18', 'Chân máy carbon chịu tải lớn', 'available')
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

-- ---------------------------------------------------------------------
-- 5. NẠP ĐƠN ĐẶT LỊCH / CA CHỤP THẬT (BOOKINGS TABLE)
-- Khớp hoàn toàn với các ca phân công của nhân viên ID 8
-- ---------------------------------------------------------------------
INSERT INTO `bookings` (`id`, `customer_id`, `room_id`, `booking_date`, `start_time`, `end_time`, `status`, `customer_note`, `created_at`, `updated_at`) VALUES
(1, 4, 2, '2026-10-10 09:00:00', '09:00:00', '11:00:00', 'completed', 'Khách: Nguyễn Thu Trang & Hoàng Nam - Gói Chụp Cưới Cổ Điển', '2026-10-05 08:30:00', NOW()),
(2, 4, 1, '2026-10-12 14:00:00', '14:00:00', '15:30:00', 'completed', 'Khách: Lê Minh Tuấn - Gói Nàng Thơ Tone Trong Trẻo', '2026-10-08 10:00:00', NOW()),
(5, 5, 2, '2026-10-20 15:00:00', '15:00:00', '16:30:00', 'completed', 'Khách: Trần Khánh Huyền - Gói Nghệ Thuật Cổ Trang & Áo Dài', '2026-10-16 11:45:00', NOW()),
(7, 4, 1, '2026-10-28 09:00:00', '09:00:00', '10:30:00', 'confirmed', 'Khách: Vũ Hoàng Mai - Đặt lịch chụp cá nhân mùa thu', NOW(), NOW()),
(8, 5, 3, '2026-10-29 14:00:00', '14:00:00', '16:30:00', 'in_progress', 'Khách: Trịnh Đình Quang - Đặt lịch chụp Profile Doanh Nhân', NOW(), NOW())
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`), `customer_note` = VALUES(`customer_note`);

-- ---------------------------------------------------------------------
-- 6. PHÂN CÔNG NHÂN VIÊN CHO CA CHỤP (BOOKING_EMPLOYEE_ASSIGNMENTS)
-- ---------------------------------------------------------------------
INSERT INTO `booking_employee_assignments` (`id`, `booking_id`, `employee_id`, `assigned_at`, `status`, `note`) VALUES
(1, 1, 8, '2026-10-09 10:00:00', 'completed', 'Phụ trách layout cô dâu Hàn Quốc tone cam đào'),
(2, 2, 8, '2026-10-11 15:00:00', 'completed', 'Makeup nhẹ nhàng, làm tóc xoăn lơi nàng thơ'),
(3, 5, 8, '2026-10-19 14:00:00', 'completed', 'Búi tóc cổ trang, cài trâm ngọc cung đình'),
(4, 7, 8, NOW(), 'assigned', 'Lịch chụp cá nhân mùa thu - chuẩn bị layout tone ấm'),
(5, 8, 8, NOW(), 'assigned', 'Hỗ trợ dặm phấn và chỉnh trang phục doanh nhân')
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`), `note` = VALUES(`note`);

-- ---------------------------------------------------------------------
-- 7. CẤP PHÁT THIẾT BỊ / ĐẠO CỤ CHO BUỔI CHỤP (BOOKING_EQUIPMENT)
-- ---------------------------------------------------------------------
INSERT INTO `booking_equipment` (`id`, `booking_id`, `equipment_id`, `assigned_at`, `returned_at`, `status`, `note`) VALUES
(1, 1, 3, '2026-10-10 08:30:00', '2026-10-10 11:30:00', 'returned', 'Đèn Godox AD600 hoạt động tốt, đã hoàn trả kho'),
(2, 2, 4, '2026-10-12 13:30:00', '2026-10-12 16:00:00', 'returned', 'Đèn Nanlite Forza 500B đã hoàn trả đủ chóa đèn'),
(3, 7, 3, NOW(), NULL, 'assigned', 'Cấp đèn Godox cho ca chụp cá nhân mùa thu phòng A'),
(4, 8, 4, NOW(), NULL, 'assigned', 'Cấp đèn Nanlite cho ca chụp Profile phòng VIP')
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

-- ---------------------------------------------------------------------
-- 8. NẠP ĐÁNH GIÁ TỪ KHÁCH HÀNG (REVIEWS TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `reviews` (`id`, `booking_id`, `customer_id`, `rating`, `comment`, `created_at`, `updated_at`) VALUES
(1, 1, 4, 5.0, 'Ekip chụp ảnh cưới có tâm nhất mình từng trải nghiệm! Makeup bạn Mai làm nhẹ nhàng trong trẻo đúng style mình thích. Ảnh nhận về đẹp lung linh!', '2026-10-11 16:45:00', NOW()),
(2, 2, 4, 5.0, 'Mình chụp gói Nàng Thơ kỷ niệm sinh nhật cho bạn gái. Layout trang điểm rất dịu mắt, bạn bè ai cũng khen nức nở!', '2026-10-13 11:20:00', NOW()),
(5, 5, 5, 5.0, 'Bộ ảnh áo dài sen hồ xuất sắc! Búi tóc cổ phục của bạn Mai rất khéo léo, phụ kiện cài tóc phối hài hòa chuẩn phong cách hoàng gia.', '2026-10-21 18:00:00', NOW())
ON DUPLICATE KEY UPDATE `rating` = VALUES(`rating`), `comment` = VALUES(`comment`);

-- ---------------------------------------------------------------------
-- 9. NẠP ĐÁNH GIÁ TAY NGHỀ NHÂN VIÊN (EMPLOYEE_REVIEWS TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `employee_reviews` (`id`, `review_id`, `employee_id`, `rating`, `comment`) VALUES
(1, 1, 8, 5.0, 'Bạn Mai makeup rất tỉ mỉ, lớp nền mỏng nhẹ tự nhiên suốt buổi chụp 4 tiếng không hề bị mốc hay bóng dầu. Thái độ rất ân cần, đáng yêu!'),
(2, 2, 8, 5.0, 'Chị Mai làm tóc xinh xỉu, tư vấn tone son cực kỳ hợp với chiếc váy hoa nhí. Rất ưng ý với phong cách làm việc của chị!'),
(3, 5, 8, 4.9, 'Tay nghề búi tóc cổ phục của bạn Mai rất khéo léo và chắc chắn, phụ kiện cài tóc phối hài hòa đúng phong cách cung đình.')
ON DUPLICATE KEY UPDATE `rating` = VALUES(`rating`), `comment` = VALUES(`comment`);

-- ---------------------------------------------------------------------
-- 10. NẠP THÔNG BÁO HỆ THỐNG GỬI ĐẾN NHÂN VIÊN PHẠM HOÀI MAI (NOTIFICATIONS)
-- ---------------------------------------------------------------------
INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `read_at`, `created_at`) VALUES
(1, 8, 'Phân công ca chụp mới #7', 'Bạn được phân công phụ trách trang điểm cho Booking #7 vào ngày 28/10/2026.', 'employee_assignment', NULL, NOW()),
(2, 8, 'Đánh giá 5 sao mới từ khách hàng', 'Khách hàng vừa để lại đánh giá 5 sao khen ngợi tay nghề makeup tại ca chụp cưới #1.', 'system', NOW(), '2026-10-11 17:00:00'),
(3, 8, 'Phân công ca chụp mới #8', 'Bạn được phân công phụ trách trang điểm cho Booking #8 (Doanh nhân Profile) vào ngày 29/10/2026.', 'employee_assignment', NULL, NOW()),
(4, 8, 'Khen thưởng nhân viên xuất sắc tuần', 'Chúc mừng Phạm Hoài Mai đạt điểm hài lòng khách hàng 5.0/5.0 cao nhất tuần qua.', 'system', NULL, NOW())
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`), `message` = VALUES(`message`);

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- KIỂM TRA ĐỒNG BỘ
-- ---------------------------------------------------------------------
SELECT 'bookings' AS bang, COUNT(*) AS so_luong FROM `bookings`
UNION ALL
SELECT 'booking_employee_assignments', COUNT(*) FROM `booking_employee_assignments` WHERE `employee_id` = 8
UNION ALL
SELECT 'reviews', COUNT(*) FROM `reviews`
UNION ALL
SELECT 'employee_reviews', COUNT(*) FROM `employee_reviews` WHERE `employee_id` = 8
UNION ALL
SELECT 'notifications', COUNT(*) FROM `notifications` WHERE `user_id` = 8;
