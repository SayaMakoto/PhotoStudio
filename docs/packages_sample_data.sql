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
(6, 'reflector', 1),
(7, 'camera', 1),
(7, 'lighting', 2),
(8, 'camera', 1),
(8, 'lighting', 4),
(8, 'softbox', 2);

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
