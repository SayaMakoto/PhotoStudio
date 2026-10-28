-- =====================================================================
-- DỮ LIỆU MẪU TOÀN DIỆN CHO PHOTOSTUDIO (PHÒNG, THIẾT BỊ, ĐÁNH GIÁ, GÓI CHỤP)
-- File: docs/seed_full_studio_data.sql
-- Hướng dẫn: Bạn có thể chạy trực tiếp file này trong MySQL Workbench / phpMyAdmin,
-- hoặc dán vào cuối file photo_studio.sql.
-- =====================================================================

USE `photo_studio`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- 1. XÓA DỮ LIỆU CŨ ĐỂ ĐẢM BẢO CHẠY ĐỘC LẬP KHÔNG LỖI TRÙNG LẶP KHÓA
-- ---------------------------------------------------------------------
DELETE FROM `employee_reviews`;
DELETE FROM `reviews`;
DELETE FROM `booking_packages`;
DELETE FROM `bookings` WHERE `id` BETWEEN 1 AND 10;
DELETE FROM `package_equipments` WHERE `package_id` BETWEEN 1 AND 8;
DELETE FROM `package_services` WHERE `package_id` BETWEEN 1 AND 8;
DELETE FROM `package_backgrounds` WHERE `package_id` BETWEEN 1 AND 8;
DELETE FROM `images` WHERE `imageable_type` = 'package' AND `imageable_id` BETWEEN 1 AND 8;
DELETE FROM `packages` WHERE `id` BETWEEN 1 AND 8;
DELETE FROM `services` WHERE `id` BETWEEN 1 AND 7;
DELETE FROM `clothes` WHERE `id` BETWEEN 1 AND 8;
DELETE FROM `accessories` WHERE `id` BETWEEN 1 AND 6;
DELETE FROM `equipments` WHERE `id` BETWEEN 1 AND 13;
DELETE FROM `backgrounds` WHERE `id` BETWEEN 1 AND 6;
DELETE FROM `rooms` WHERE `id` BETWEEN 1 AND 5;

-- ---------------------------------------------------------------------
-- 2. DỮ LIỆU PHÒNG CHỤP STUDIO (ROOMS TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `rooms` (`id`, `name`, `description`, `capacity`, `status`) VALUES
(1, 'Phòng Studio A - Phong Cách Hàn Quốc', 'Tone màu sáng pastel, rèm voan trắng, hoa khô nghệ thuật, chuyên chụp chân dung, nàng thơ và beauty layout nhẹ nhàng', 5, 'active'),
(2, 'Phòng Studio B - Concept Cổ Điển & Hoàng Gia', 'Diện tích 75m2, trần cao 4.2m, nội thất gỗ sồi cao cấp, đèn chùm pha lê, chuyên ảnh cưới VIP và dạ tiệc sang trọng', 10, 'active'),
(3, 'Phòng Studio VIP - Cinema & Đa Năng', 'Trang bị hệ thống chiếu sáng kịch tính Arri/Aputure, dàn phông màu điện tử 8 màu tự động, phù hợp chụp profile doanh nhân & lookbook', 8, 'active'),
(4, 'Phòng Studio C - Không Gian Gia Đình Vintage', 'Bối cảnh phòng khách ấm cúng với sofa nhung cổ, lò sưởi, đàn piano, chuyên chụp ảnh gia đình đa thế hệ và thôi nôi cho bé', 12, 'active'),
(5, 'Phòng Studio D - Concept Monochromatic', 'Tường xi măng công nghiệp tối giản, hệ thống tản sáng khổ lớn, chuyên chụp lookbook thời trang thương hiệu và nghệ thuật đen trắng', 6, 'active');

-- ---------------------------------------------------------------------
-- 3. DỮ LIỆU BỐI CẢNH CHỤP (BACKGROUNDS TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `backgrounds` (`id`, `name`, `description`, `status`) VALUES
(1, 'Phông Trơn Màu Pastel Hàn Quốc', 'Bối cảnh phông trơn tối giản phong cách Hàn Quốc với các gam màu hồng phấn, be nhạt và xanh mint', 'active'),
(2, 'Góc Phố Cổ Hội An & Sen Hồ', 'Bối cảnh hoài niệm với đèn lồng, tường vàng rêu phong, bàn gỗ mộc mạc và tiểu cảnh hoa sen', 'active'),
(3, 'Cung Điện Hoàng Gia Châu Âu', 'Bối cảnh trang trọng với hoa tươi nhập khẩu, cột thạch cao cổ điển và rèm lụa nhung đỏ', 'active'),
(4, 'Khu Vườn Bí Mật Bohemian', 'Bối cảnh ngập tràn cây xanh nhiệt đới, lều vải canvas và ánh sáng tự nhiên xuyên rèm', 'active'),
(5, 'Phòng Khách Vintage Thập Niên 90', 'Bối cảnh ấm cúng với sofa da nâu, tivi cổ, kệ sách gỗ và ánh đèn vàng ấm áp', 'active'),
(6, 'Ánh Sáng Kịch Tính Cyberpunk & Neon', 'Bối cảnh hiện đại với đèn LED RGB đổi màu, phông kim loại phản quang tạo phong cách tương lai', 'active');

-- ---------------------------------------------------------------------
-- 4. DỮ LIỆU TRANG THIẾT BỊ STUDIO (EQUIPMENTS TABLE)
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
-- 5. DỮ LIỆU TRANG PHỤC STUDIO (CLOTHES TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `clothes` (`id`, `type`, `name`, `size`, `gender`, `color`, `description`, `price`, `status`) VALUES
(1, 'wedding', 'Váy Cưới Xòe Công Chúa Ren Pháp', 'M', 'Female', 'Trắng tinh khôi', 'Váy cưới đính kết 2000 viên đá Swarovski lấp lánh', 600000.0, 'available'),
(2, 'wedding', 'Váy Cưới Đuôi Cá Satin Hoàng Gia', 'S', 'Female', 'Trắng ngà', 'Váy cưới lụa satin Ý tôn dáng đường cong kiêu sa', 550000.0, 'available'),
(3, 'suit', 'Bộ Vest Nam Tuxedo Cổ Điển Kèm Nơ', 'L', 'Male', 'Đen huyền bí', 'Vest cưới chú rể dáng slim-fit chuẩn quý ông Châu Âu', 350000.0, 'available'),
(4, 'suit', 'Bộ Vest Nam Caro Màu Be Vintage', 'XL', 'Male', 'Be nhạt', 'Vest phong cách Hàn Quốc trẻ trung lãng mạn', 300000.0, 'available'),
(5, 'traditional', 'Áo Dài Lụa Tơ Tằm Hà Đông Thêu Sen', 'M', 'Female', 'Hồng phấn', 'Áo dài truyền thống thủ công mềm mại, bay bổng', 300000.0, 'available'),
(6, 'traditional', 'Cổ Phục Việt Nhật Bình Triều Nguyễn', 'Free size', 'Female', 'Đỏ thắm', 'Cổ phục ngũ thân hoàng gia thêu rồng phượng tinh xảo', 400000.0, 'available'),
(7, 'casual', 'Set Váy Nàng Thơ Trễ Vai Voan Tơ', 'Free size', 'Female', 'Trắng kem', 'Váy tiểu thư nhẹ nhàng cho concept chụp cá nhân trong nắng', 200000.0, 'available'),
(8, 'casual', 'Set Đồ Gia Đình Đồng Điệu 4 Người', 'Free size', 'other', 'Tone Pastel', 'Trang phục đồng điệu cho bố, mẹ và 2 bé chụp kỷ niệm gia đình', 450000.0, 'available');

-- ---------------------------------------------------------------------
-- 6. DỮ LIỆU PHỤ KIỆN CHỤP ẢNH (ACCESSORIES TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `accessories` (`id`, `type`, `name`, `description`, `quantity`, `price`, `status`) VALUES
(1, 'wedding', 'Vương Miện Cô Dâu Pha Lê Ánh Bạc', 'Vương miện đính đá quý thủ công tinh xảo', 6, 120000.0, 'available'),
(2, 'wedding', 'Bó Hoa Cưới Cầm Tay Lụa Cao Cấp Tone Trắng Kem', 'Hoa cưới cầm tay nghệ thuật bền đẹp lên hình sang trọng', 12, 100000.0, 'available'),
(3, 'vintage', 'Mũ Beret Len Cổ Điển Phong Cách Paris', 'Mũ dạ beret chụp concept hoài niệm phố cổ', 10, 60000.0, 'available'),
(4, 'vintage', 'Bộ Trâm Cài Tóc Cổ Trang Mạ Vàng Đính Ngọc', 'Phụ kiện cổ phục trâm hoa cài tóc cô dâu truyền thống', 8, 80000.0, 'available'),
(5, 'concept', 'Kính Mắt Gọng Tròn Tri Thức & Sách Cổ Điển', 'Đạo cụ chụp ảnh chân dung concept thư sinh tri thức', 15, 50000.0, 'available'),
(6, 'fashion', 'Bóng Bay Helium Nghệ Thuật Đủ Màu', 'Phụ kiện chụp ảnh sinh nhật, kỷ yếu và gia đình rực rỡ', 30, 70000.0, 'available');

-- ---------------------------------------------------------------------
-- 7. DỮ LIỆU DỊCH VỤ GIA TĂNG (SERVICES TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `services` (`id`, `name`, `type`, `description`, `duration`, `price`, `status`) VALUES
(1, 'Trang Điểm & Làm Tóc Chuyên Nghiệp (Layout 1)', 'makeup', 'Layout makeup cá nhân phù hợp từng gương mặt và concept', 60, 300000.0, 'active'),
(2, 'Trang Điểm Thay Layout Thứ 2 Trong Buổi Chụp', 'makeup', 'Dặm phấn, thay đổi màu son và kiểu tóc sang concept mới', 30, 200000.0, 'active'),
(3, 'Chỉnh Sửa Ảnh Chuyên Sâu (Retouch Da & Dáng 10 Ảnh)', 'photography', 'Kỹ thuật Frequency Separation giữ vân da thật, cân màu điện ảnh', 60, 250000.0, 'active'),
(4, 'Thuê Phụ Kiện Không Giới Hạn Toàn Buổi', 'accessory', 'Sử dụng toàn bộ vương miện, hoa cưới, đạo cụ trong studio', 0, 150000.0, 'active'),
(5, 'In Album Photobook Mở Phẳng Cao Cấp 25x25 (20 Trang)', 'photography', 'In giấy mỹ thuật phủ màng UV chống ẩm mốc, bìa bọc da sang trọng', 0, 850000.0, 'active'),
(6, 'In Ảnh Cổng Pha Lê Tráng Gương Khổ Lớn 60x90cm', 'photography', 'Khung viền mạ vàng, bề mặt tráng gương chống lóa sắc nét', 0, 650000.0, 'active'),
(7, 'Quay Video Highlight Hậu Kỳ Cinematic 4K (60 Giây)', 'photography', 'Video dọc định dạng Reels/TikTok/Shorts ghi lại hậu trường lung linh', 90, 900000.0, 'active');

-- ---------------------------------------------------------------------
-- 8. DỮ LIỆU 8 GÓI CHỤP & BÁO GIÁ ĐA DẠNG CONCEPT (PACKAGES TABLE)
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
-- 9. GÁN THIẾT BỊ, DỊCH VỤ VÀ BỐI CẢNH CHO CÁC GÓI CHỤP
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

INSERT INTO `package_services` (`package_id`, `service_id`, `quantity`) VALUES
(1, 1, 1),
(2, 1, 1), (2, 3, 1),
(3, 3, 1),
(4, 1, 2), (4, 3, 2), (4, 4, 1), (4, 5, 1),
(5, 4, 1),
(6, 1, 1),
(7, 1, 1), (7, 4, 1),
(8, 3, 1);

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
-- 10. THÊM HÌNH ẢNH TRƯNG BÀY BỘ SƯU TẬP (IMAGES TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `images` (`imageable_type`, `imageable_id`, `image_url`, `description`, `is_primary`, `created_at`, `updated_at`) VALUES
('package', 1, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85', 'Ảnh bìa Gói Chụp Cá Nhân Nàng Thơ Pastel Hàn Quốc', TRUE, NOW(), NOW()),
('package', 1, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85', 'Góc chụp cận cảnh chân dung nghệ thuật & makeup glow', FALSE, NOW(), NOW()),
('package', 2, 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85', 'Ảnh bìa Gói Chụp Ảnh Cưới Studio Cổ Điển', TRUE, NOW(), NOW()),
('package', 2, 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85', 'Khoảnh khắc cô dâu và chú rể trong cung điện hoàng gia', FALSE, NOW(), NOW()),
('package', 3, 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1200&q=85', 'Ảnh bìa Gói Chụp Gia Đình Đoàn Viên Ấm Cúng', TRUE, NOW(), NOW()),
('package', 4, 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85', 'Ảnh bìa Gói Cưới Luxury Hoàng Hôn Ngoại Cảnh VIP', TRUE, NOW(), NOW()),
('package', 4, 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85', 'Váy cưới bồng bềnh dưới ánh sáng tự nhiên lãng mạn', FALSE, NOW(), NOW()),
('package', 5, 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=85', 'Ảnh bìa Gói Chụp Kỷ Yếu Tốt Nghiệp Rực Rỡ Tuổi Trẻ', TRUE, NOW(), NOW()),
('package', 6, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85', 'Ảnh bìa Gói Chụp Doanh Nhân Đẳng Cấp Phong Cách Forbes', TRUE, NOW(), NOW()),
('package', 7, 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85', 'Ảnh bìa Gói Chụp Áo Dài Truyền Thống Nét Đẹp Á Đông', TRUE, NOW(), NOW()),
('package', 8, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85', 'Ảnh bìa Gói Chụp Lookbook Thời Trang Thương Hiệu High-End', TRUE, NOW(), NOW());

-- ---------------------------------------------------------------------
-- 11. ĐƠN ĐẶT LỊCH MẪU ĐÃ HOÀN TẤT ĐỂ LIÊN KẾT ĐÁNH GIÁ (BOOKINGS TABLE)
-- Khách hàng: ID 4 (Lê Minh Tuấn), ID 5 (Phạm Phương Linh)
-- ---------------------------------------------------------------------
INSERT INTO `bookings` (`id`, `customer_id`, `room_id`, `booking_date`, `start_time`, `end_time`, `status`, `customer_note`, `created_at`, `updated_at`) VALUES
(1, 4, 2, '2026-10-10 09:00:00', '09:00:00', '11:00:00', 'completed', 'Khách: Nguyễn Thu Trang & Hoàng Nam - Gói: Gói Chụp Ảnh Cưới Studio Cổ Điển', '2026-10-05 08:30:00', NOW()),
(2, 4, 1, '2026-10-12 14:00:00', '14:00:00', '15:30:00', 'completed', 'Khách: Lê Minh Tuấn - Gói: Gói Chụp Ảnh Cá Nhân / Nàng Thơ', '2026-10-08 10:00:00', NOW()),
(3, 5, 4, '2026-10-15 09:30:00', '09:30:00', '11:30:00', 'completed', 'Khách: Phạm Phương Linh - Gói: Gói Chụp Gia Đình Đoàn Viên', '2026-10-10 14:20:00', NOW()),
(4, 4, 3, '2026-10-18 10:00:00', '10:00:00', '11:30:00', 'completed', 'Khách: Đặng Quốc Bảo (CEO TechLab) - Gói: Gói Doanh Nhân & Profile', '2026-10-12 09:15:00', NOW()),
(5, 5, 2, '2026-10-20 15:00:00', '15:00:00', '16:30:00', 'completed', 'Khách: Trần Khánh Huyền - Gói: Gói Chụp Nghệ Thuật Cổ Trang & Áo Dài', '2026-10-16 11:45:00', NOW()),
(6, 5, 3, '2026-10-22 13:30:00', '13:30:00', '15:30:00', 'completed', 'Khách: Hà My & Nhóm Bạn - Gói: Gói Chụp Kỷ Yếu & Tốt Nghiệp Sáng Tạo', '2026-10-18 16:00:00', NOW()),
(7, 4, 1, '2026-10-28 09:00:00', '09:00:00', '10:30:00', 'confirmed', 'Khách: Vũ Hoàng Mai - Đặt lịch chụp cá nhân mùa thu', NOW(), NOW()),
(8, 5, 2, '2026-10-29 14:00:00', '14:00:00', '17:00:00', 'pending', 'Khách: Trịnh Đình Quang - Đặt lịch chụp cưới Studio Luxury', NOW(), NOW());

-- ---------------------------------------------------------------------
-- 12. GÁN GÓI VÀO ĐƠN ĐẶT LỊCH (BOOKING_PACKAGES TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `booking_packages` (`id`, `booking_id`, `package_id`, `quantity`, `unit_price`) VALUES
(1, 1, 2, 1, 2990000.0),
(2, 2, 1, 1, 990000.0),
(3, 3, 3, 1, 1890000.0),
(4, 4, 6, 1, 1290000.0),
(5, 5, 7, 1, 1690000.0),
(6, 6, 5, 1, 1490000.0),
(7, 7, 1, 1, 990000.0),
(8, 8, 4, 1, 5990000.0);

-- ---------------------------------------------------------------------
-- 13. ĐÁNH GIÁ THỰC TẾ TỪ KHÁCH HÀNG (REVIEWS TABLE)
-- ---------------------------------------------------------------------
INSERT INTO `reviews` (`id`, `booking_id`, `customer_id`, `rating`, `comment`, `created_at`, `updated_at`) VALUES
(
    1,
    1,
    4,
    5.0,
    'Ekip chụp ảnh cưới có tâm nhất mình từng trải nghiệm! Bạn photographer hướng dẫn tạo dáng rất tự nhiên, cô dâu không bị gượng gạo. Makeup bạn Tiên làm nhẹ nhàng trong trẻo đúng style Hàn Quốc mình thích. Ảnh nhận về đẹp lung linh!',
    '2026-10-11 16:45:00',
    NOW()
),
(
    2,
    2,
    4,
    5.0,
    'Mình chụp gói Nàng Thơ kỷ niệm sinh nhật cho bạn gái. Phòng studio ánh sáng dịu mắt, váy áo sạch sẽ thơm tho. Bộ ảnh nhận về bạn bè ai cũng khen nức nở. Chắc chắn sẽ quay lại ủng hộ studio nhiều lần nữa!',
    '2026-10-13 11:20:00',
    NOW()
),
(
    3,
    3,
    5,
    5.0,
    'Gia đình mình có cả ông bà và 2 bé nhỏ, lúc đầu sợ các cháu quấy khóc nhưng ekip rất kiên nhẫn và vui tính, bắt trọn từng khoảnh khắc cười tươi tự nhiên của cả nhà. Ảnh in ép gỗ treo phòng khách tuyệt đẹp!',
    '2026-10-16 17:30:00',
    NOW()
),
(
    4,
    4,
    4,
    4.8,
    'Mình làm bộ profile doanh nhân để làm thương hiệu cá nhân và đăng báo. Ánh sáng setup chuẩn chỉ, phong thái chỉnh chu đẳng cấp. Ảnh trả nhanh đúng tiến độ công việc của mình!',
    '2026-10-19 14:10:00',
    NOW()
),
(
    5,
    5,
    5,
    5.0,
    'Bộ ảnh áo dài sen hồ phố cổ xuất sắc! Đạo cụ trâm cài và nón quai thao được chuẩn bị rất kỹ lưỡng. Thợ ảnh nhiệt tình chụp không quản ngại thời gian. 10/10 điểm cho chất lượng phục vụ!',
    '2026-10-21 18:00:00',
    NOW()
),
(
    6,
    6,
    5,
    5.0,
    'Cả nhóm 5 đứa chụp kỷ yếu tốt nghiệp đại học ở đây cười tẹt ga. Studio hỗ trợ phụ kiện hoa tươi, bóng bay và bằng tốt nghiệp đầy đủ. Giá cả hợp lý mà chất lượng thì như chụp bìa tạp chí!',
    '2026-10-23 10:40:00',
    NOW()
);

-- ---------------------------------------------------------------------
-- 14. ĐÁNH GIÁ NHÂN VIÊN TRONG BUỔI CHỤP (EMPLOYEE_REVIEWS TABLE)
-- Nhân viên: ID 1 (Photographer Hoàng Anh), ID 2 (Makeup Thủy Tiên)
-- ---------------------------------------------------------------------
INSERT INTO `employee_reviews` (`id`, `review_id`, `employee_id`, `rating`, `comment`) VALUES
(1, 1, 1, 5.0, 'Photographer nhiệt tình, bắt góc cô dâu rất xinh và khéo léo'),
(2, 1, 2, 5.0, 'Makeup tone Hàn Quốc cực kỳ tôn nét da và giữ phấn lâu trôi'),
(3, 2, 1, 5.0, 'Bắt khoảnh khắc ánh sáng tự nhiên rất đẹp'),
(4, 3, 1, 5.0, 'Tương tác với trẻ nhỏ và ông bà rất thân thiện, kiên nhẫn'),
(5, 4, 1, 5.0, 'Phong cách chụp chuyên nghiệp, chuẩn style ảnh doanh nhân Forbes'),
(6, 5, 2, 5.0, 'Búi tóc cổ trang cầu kỳ và phối phụ kiện rất có gu');

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- KẾT THÚC SEED DỮ LIỆU TOÀN DIỆN CHO PHOTOSTUDIO
-- =====================================================================
