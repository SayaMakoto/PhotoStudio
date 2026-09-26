-- =====================================================================
-- SEED DATA: Dữ liệu mẫu khởi tạo cho hệ thống PhotoStudio
-- File: docs/seed_data.sql
-- Database: photo_studio
-- =====================================================================

USE `photo_studio`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Thêm tài khoản người dùng (users)
-- Mật khẩu mặc định: '123456' (hoặc chuỗi hash mẫu)
INSERT INTO `users` (`id`, `username`, `email`, `password`, `fullname`, `date_of_birth`, `gender`, `address`, `phone`, `avatar`, `role`, `status`) VALUES
(1, 'admin', 'admin@photostudio.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcd7qaUfqWg6', 'Quản Trị Viên', '1990-01-01', 'Male', 'Hà Nội', '0901234567', '/avatars/admin.jpg', 'Admin', 'active'),
(2, 'photographer1', 'hoanganh@photostudio.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcd7qaUfqWg6', 'Nguyễn Hoàng Anh', '1995-05-15', 'Male', 'Hà Nội', '0912345678', '/avatars/emp1.jpg', 'Employee', 'active'),
(3, 'makeup1', 'thuytien@photostudio.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcd7qaUfqWg6', 'Trần Thủy Tiên', '1998-08-20', 'Female', 'Hà Nội', '0923456789', '/avatars/emp2.jpg', 'Employee', 'active'),
(4, 'customer1', 'minhtuan@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcd7qaUfqWg6', 'Lê Minh Tuấn', '2000-03-10', 'Male', 'Cầu Giấy, Hà Nội', '0934567890', '/avatars/cust1.jpg', 'Customer', 'active'),
(5, 'customer2', 'phuonglinh@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcd7qaUfqWg6', 'Phạm Phương Linh', '2001-11-25', 'Female', 'Đống Đa, Hà Nội', '0945678901', '/avatars/cust2.jpg', 'Customer', 'active');

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

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- HOÀN TẤT DỮ LIỆU MẪU
-- =====================================================================
