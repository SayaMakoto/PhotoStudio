-- --------------------------------------------------------
-- Máy chủ:                      127.0.0.1
-- Server version:               8.4.3 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Phiên bản:           12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for photo_studio
CREATE DATABASE IF NOT EXISTS `photo_studio` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `photo_studio`;

-- Dumping structure for table photo_studio.accessories
CREATE TABLE IF NOT EXISTS `accessories` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính',
  `type` enum('fashion','concept','vintage','wedding','other') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Loại phụ kiện',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên phụ kiện',
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mô tả phụ kiện',
  `quantity` int NOT NULL DEFAULT '0' COMMENT 'Số lượng trong kho',
  `price` double NOT NULL DEFAULT '0' COMMENT 'Giá thuê phụ kiện',
  `status` enum('available','rented','maintenance','damaged','retired') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available' COMMENT 'Trạng thái phụ kiện',
  `deleted_at` datetime DEFAULT NULL COMMENT 'Thời điểm đưa phụ kiện vào thùng rác',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý phụ kiện chụp ảnh';

-- Dumping data for table photo_studio.accessories: ~16 rows (approximately)
REPLACE INTO `accessories` (`id`, `type`, `name`, `description`, `quantity`, `price`, `status`, `deleted_at`) VALUES
	(1, 'fashion', 'Hoa Cầm Tay Pastel', 'Hoa cầm tay tạo điểm nhấn cho ảnh cá nhân và nàng thơ.', 12, 0, 'available', NULL),
	(2, 'wedding', 'Vương Miện Cô Dâu Hoàng Gia', 'Vương miện đính đá pha lê lấp lánh dùng trong gói ảnh cưới.', 6, 0, 'available', NULL),
	(3, 'wedding', 'Bó Hoa Cưới Trắng Kem Cầm Tay', 'Bó hoa cưới cầm tay tulip và hồng trắng trang nhã.', 12, 0, 'available', NULL),
	(4, 'concept', 'Bóng Bay Nghệ Thuật Pastel', 'Đạo cụ bóng bay cho ảnh gia đình, nhóm bạn và sinh nhật.', 30, 0, 'available', NULL),
	(5, 'concept', 'Bằng Tốt Nghiệp & Cuộn Ruy Băng', 'Đạo cụ cầm tay danh dự cho bộ ảnh tốt nghiệp kỷ yếu.', 15, 0, 'available', NULL),
	(6, 'fashion', 'Kính Gọng Doanh Nhân Cổ Điển', 'Phụ kiện tạo phong cách tri thức cho ảnh profile lãnh đạo.', 10, 0, 'available', NULL),
	(7, 'vintage', 'Trâm Cài Tóc Cổ Trang Mạ Vàng', 'Trâm cài tóc truyền thống cho áo dài và cổ phục Việt.', 8, 0, 'available', NULL),
	(8, 'fashion', 'Móc Treo & Kẹp Trưng Bày Lookbook', 'Phụ kiện trưng bày sản phẩm thời trang chuyên nghiệp.', 20, 0, 'available', NULL),
	(9, 'wedding', 'Khăn Voan Cô Dâu Dài 3 Mét', 'Khăn voan cài tóc thêu hoa ren tinh xảo tạo hiệu ứng bay bổng.', 8, 0, 'available', NULL),
	(10, 'vintage', 'Quạt Trầm Hương Cầm Tay Cổ Điển', 'Quạt xếp khắc gỗ tinh xảo phối cùng cổ phục và áo dài.', 10, 0, 'available', NULL),
	(11, 'vintage', 'Nón Lá Thêu Hoa Nghệ Thuật', 'Nón lá truyền thống vẽ hoa sen thủ công đậm chất Việt.', 12, 0, 'available', NULL),
	(12, 'concept', 'Hộp Quà Sinh Nhật & Nến Decor', 'Bộ hộp quà thắt nơ và bánh kem đạo cụ mừng tuổi mới.', 15, 0, 'available', NULL),
	(13, 'vintage', 'Vali Da Cổ Điển Phong Cách Châu Âu', 'Vali da nâu vintage làm đạo cụ du mục và retro.', 6, 0, 'available', NULL),
	(14, 'fashion', 'Kính Râm Thời Trang High-Fashion', 'Kính mắt gọng đa giác sành điệu cho bộ ảnh lookbook cá tính.', 14, 0, 'available', NULL),
	(15, 'fashion', 'Vòng Hoa Đội Đầu Nàng Thơ Baby', 'Vòng hoa baby tươi đan thủ công đội đầu cho các nàng thơ.', 10, 0, 'available', NULL),
	(16, 'other', 'Bộ Đạo Cụ Chụp Bé Sơ Sinh & Gấu Bông', 'Thảm lông mềm, giỏ mây và gấu bông an toàn tuyệt đối cho trẻ nhỏ.', 8, 0, 'available', NULL);

-- Dumping structure for table photo_studio.backgrounds
CREATE TABLE IF NOT EXISTS `backgrounds` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên bối cảnh',
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mô tả bối cảnh',
  `status` enum('active','inactive','maintenance') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active' COMMENT 'Trạng thái bối cảnh',
  `deleted_at` datetime DEFAULT NULL COMMENT 'Thời điểm đưa bối cảnh vào thùng rác',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý bối cảnh chụp';

-- Dumping data for table photo_studio.backgrounds: ~14 rows (approximately)
REPLACE INTO `backgrounds` (`id`, `name`, `description`, `status`, `deleted_at`) VALUES
	(1, 'Phông Nền Pastel Hàn Quốc', 'Phông màu kem và hồng pastel nhẹ nhàng chuẩn style Hàn Quốc', 'active', NULL),
	(2, 'Vòm Hoa Cổ Điển & Đèn Chùm Pha Lê', 'Cổng vòm hoa hồng trắng cùng đèn chùm pha lê châu Âu quý phái', 'active', NULL),
	(3, 'Bối Cảnh Cung Điện Hoàng Gia', 'Kiến trúc tân cổ điển sang trọng cho ảnh cưới và dạ hội VIP', 'active', NULL),
	(4, 'Phòng Khách Gia Đình Ấm Cúng', 'Sofa da cao cấp, lò sưởi decor và kệ sách tạo không khí sum họp', 'active', NULL),
	(5, 'Góc Phố Cổ Rêu Phong & Đèn Lồng', 'Tường vàng phố Hội, đèn lồng và gạch ngói âm dương truyền thống', 'active', NULL),
	(6, 'Phông Nền Cyclorama Vô Cực Trắng', 'Phông vô cực liền mạch độ sáng đồng đều cho thời trang và sản phẩm', 'active', NULL),
	(7, 'Vườn Hoa Địa Đàng Nàng Thơ', 'Set hoa tulip, hồng và thạch thảo tự nhiên rực rỡ', 'active', NULL),
	(8, 'Không Gian Indochine Hoài Niệm', 'Gạch bông hoa văn cổ, bình phong gỗ khảm trai và quạt trần cổ', 'active', NULL),
	(9, 'Bối Cảnh Bức Tường Sách Cổ Điển', 'Kệ sách gỗ kịch trần phong cách học viện cổ điển châu Âu', 'active', NULL),
	(10, 'Góc Ban Công Nắng Sớm Vintage', 'Khung cửa gỗ mộc mạc đón ánh sáng tự nhiên tinh khôi', 'active', NULL),
	(11, 'Phông Neon Cyberpunk Hiện Đại', 'Hệ thống đèn tuýp led neon đa sắc phong cách tương lai', 'active', NULL),
	(12, 'Lều Canvas Du Mục Bohemian', 'Lều vải thô mộc, dreamcatcher và gối đệm họa tiết thổ cẩm', 'active', NULL),
	(13, 'Bối Cảnh Tết Truyền Thống Việt Nam', 'Chõng tre, nồi bánh chưng và sắc đỏ may mắn đầu xuân', 'active', NULL),
	(14, 'Phông Đen Nghệ Thuật Tối Giản', 'Phông vải nhung đen hấp thụ ánh sáng tuyệt đối cho ảnh chân dung nghệ thuật', 'active', NULL);

-- Dumping structure for table photo_studio.banners
CREATE TABLE IF NOT EXISTS `banners` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tiêu đề banner',
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Đường dẫn ảnh banner',
  `link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Đường dẫn liên kết khi nhấn vào banner',
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active' COMMENT 'Trạng thái hiển thị banner',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý banner quảng cáo hiển thị trên website';

-- Dumping data for table photo_studio.banners: ~5 rows (approximately)
REPLACE INTO `banners` (`id`, `title`, `image_url`, `link`, `status`) VALUES
	(1, 'Ưu đãi concept Nàng thơ tháng 12', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=85', '/packages', 'active'),
	(2, 'Bộ Sưu Tập Áo Cưới Ren Pháp Mới Nhất', 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1920&q=85', '/clothes', 'active'),
	(3, 'Dịch Vụ Chụp Ảnh Doanh Nhân Chuẩn Tạp Chí', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1920&q=85', '/packages', 'active'),
	(4, 'Trọn Gói Album Cưới Ngoại Cảnh & Studio VIP', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1920&q=85', '/packages', 'active'),
	(5, 'Không Gian Studio Hiện Đại & Sang Trọng', 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1920&q=85', '/studios', 'active');

-- Dumping structure for table photo_studio.bookings
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính',
  `customer_id` bigint NOT NULL COMMENT 'FK - users (Khách hàng đặt lịch)',
  `room_id` bigint NOT NULL COMMENT 'FK - rooms (Phòng chụp)',
  `booking_date` datetime NOT NULL COMMENT 'Ngày chụp / Ngày đặt lịch',
  `start_time` time NOT NULL COMMENT 'Thời gian bắt đầu chụp',
  `end_time` time NOT NULL COMMENT 'Thời gian kết thúc chụp',
  `status` enum('pending','confirmed','in_progress','completed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending' COMMENT 'Trạng thái đơn booking',
  `customer_note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ghi chú của khách hàng',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo lịch book',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật lịch book',
  PRIMARY KEY (`id`),
  KEY `fk_bookings_customer` (`customer_id`),
  KEY `fk_bookings_room` (`room_id`),
  CONSTRAINT `fk_bookings_customer` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_bookings_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý thông tin đặt lịch chụp của khách hàng';

-- Dumping data for table photo_studio.bookings: ~36 rows (approximately)
REPLACE INTO `bookings` (`id`, `customer_id`, `room_id`, `booking_date`, `start_time`, `end_time`, `status`, `customer_note`, `created_at`, `updated_at`) VALUES
	(1, 3, 2, '2026-10-10 09:00:00', '09:00:00', '11:00:00', 'completed', 'Khách: Lê Hoàng Khách Hàng - Gói Chụp Ảnh Cưới Studio Hàn Quốc', '2026-10-05 08:30:00', '2026-10-10 11:30:00'),
	(2, 3, 1, '2026-10-12 14:00:00', '14:00:00', '15:30:00', 'completed', 'Khách: Lê Hoàng Khách Hàng - Gói Chụp Ảnh Cá Nhân Pastel', '2026-10-08 10:00:00', '2026-10-12 16:00:00'),
	(3, 16, 4, '2026-10-15 09:30:00', '09:30:00', '11:30:00', 'completed', 'Khách: Lê Minh Tuấn - Gói Chụp Ảnh Gia Đình / Nhóm Bạn', '2026-10-10 14:20:00', '2026-10-15 12:00:00'),
	(4, 21, 5, '2026-10-18 10:00:00', '10:00:00', '11:30:00', 'completed', 'Khách: Đặng Quốc Bảo (CEO TechLab) - Gói Chụp Doanh Nhân & Profile Thương Hiệu', '2026-10-12 09:15:00', '2026-10-18 12:00:00'),
	(5, 20, 8, '2026-10-20 15:00:00', '15:00:00', '16:30:00', 'completed', 'Khách: Trần Khánh Huyền - Gói Chụp Nàng Thơ & Cổ Trang Áo Dài', '2026-10-16 11:45:00', '2026-10-20 17:00:00'),
	(6, 22, 6, '2026-10-22 13:30:00', '13:30:00', '15:30:00', 'completed', 'Khách: Vũ Hoàng Mai - Gói Chụp Kỷ Yếu & Nhóm Bạn Tốt Nghiệp', '2026-10-18 16:00:00', '2026-10-22 16:00:00'),
	(7, 3, 2, '2026-10-25 08:30:00', '08:30:00', '12:30:00', 'completed', 'Khách: Lê Hoàng Khách Hàng - Gói Chụp Cưới Luxury & Ngoại Cảnh VIP', '2026-10-20 09:00:00', '2026-10-25 13:00:00'),
	(8, 17, 1, '2026-10-26 10:00:00', '10:00:00', '11:30:00', 'completed', 'Khách: Phạm Phương Linh - Gói Chụp Beauty & Makeup Chân Dung Cá Nhân', '2026-10-21 14:00:00', '2026-10-26 12:00:00'),
	(9, 18, 3, '2026-10-28 14:00:00', '14:00:00', '15:30:00', 'completed', 'Khách: Nguyễn Thu Trang - Gói Chụp Chân Dung Profile Nghệ Sĩ', '2026-10-23 10:30:00', '2026-10-28 16:00:00'),
	(10, 19, 4, '2026-10-29 09:00:00', '09:00:00', '11:00:00', 'completed', 'Khách: Hoàng Nam - Gói Chụp Kỷ Niệm Ngày Cưới Gia Đình', '2026-10-24 15:45:00', '2026-10-29 11:30:00'),
	(11, 23, 6, '2026-10-30 13:00:00', '13:00:00', '15:00:00', 'completed', 'Khách: Nguyễn Đức Thắng - Gói Chụp Lookbook Thời Trang & Sản Phẩm', '2026-10-25 11:00:00', '2026-10-30 15:30:00'),
	(12, 24, 7, '2026-10-31 09:30:00', '09:30:00', '11:00:00', 'completed', 'Khách: Trịnh Bảo Ngọc - Gói Chụp Ảnh Cá Nhân Pastel', '2026-10-26 08:30:00', '2026-10-31 11:30:00'),
	(13, 25, 9, '2026-11-01 09:00:00', '09:00:00', '10:30:00', 'completed', 'Khách: Hồ Minh Trí - Gói Chụp Gia Đình Nhỏ & Em Bé Baby', '2026-10-27 10:00:00', '2026-11-01 11:00:00'),
	(14, 26, 10, '2026-11-01 14:00:00', '14:00:00', '15:30:00', 'completed', 'Khách: Bùi Hải Yến - Gói Chụp Couple Lãng Mạn & Hẹn Hò Đôi', '2026-10-28 14:30:00', '2026-11-01 16:00:00'),
	(15, 27, 5, '2026-11-02 09:00:00', '09:00:00', '10:30:00', 'in_progress', 'Khách: Dương Thanh Phong - Gói Chụp Doanh Nhân & Profile Thương Hiệu', '2026-10-29 16:00:00', '2026-11-02 09:00:00'),
	(16, 28, 7, '2026-11-02 14:00:00', '14:00:00', '15:30:00', 'in_progress', 'Khách: Phan Mỹ Uyên - Gói Chụp Nàng Thơ & Cổ Trang Áo Dài', '2026-10-30 09:00:00', '2026-11-02 14:00:00'),
	(17, 16, 2, '2026-11-03 09:00:00', '09:00:00', '11:30:00', 'confirmed', 'Khách: Lê Minh Tuấn - Gói Chụp Cưới Hoàng Gia Cổ Điển Châu Âu', '2026-10-31 10:00:00', '2026-11-01 09:00:00'),
	(18, 17, 3, '2026-11-03 14:00:00', '14:00:00', '15:30:00', 'confirmed', 'Khách: Phạm Phương Linh - Gói Chụp Ảnh Cá Nhân Pastel', '2026-10-31 11:30:00', '2026-11-01 09:30:00'),
	(19, 18, 4, '2026-11-04 09:30:00', '09:30:00', '11:30:00', 'confirmed', 'Khách: Nguyễn Thu Trang - Gói Chụp Ảnh Gia Đình / Nhóm Bạn', '2026-11-01 08:00:00', '2026-11-01 10:00:00'),
	(20, 19, 6, '2026-11-04 14:00:00', '14:00:00', '16:00:00', 'confirmed', 'Khách: Hoàng Nam - Gói Chụp Lookbook BST Thời Trang Cao Cấp', '2026-11-01 09:00:00', '2026-11-01 11:00:00'),
	(21, 20, 8, '2026-11-05 09:00:00', '09:00:00', '10:30:00', 'confirmed', 'Khách: Trần Khánh Huyền - Gói Chụp Nàng Thơ & Cổ Trang Áo Dài', '2026-11-01 10:00:00', '2026-11-01 13:00:00'),
	(22, 21, 13, '2026-11-05 13:30:00', '13:30:00', '16:30:00', 'confirmed', 'Khách: Đặng Quốc Bảo - Gói Chụp Sự Kiện Doanh Nghiệp & Event', '2026-11-01 11:00:00', '2026-11-01 14:00:00'),
	(23, 22, 1, '2026-11-06 09:00:00', '09:00:00', '10:30:00', 'confirmed', 'Khách: Vũ Hoàng Mai - Gói Chụp Beauty & Makeup Chân Dung Cá Nhân', '2026-11-01 12:00:00', '2026-11-01 15:00:00'),
	(24, 23, 2, '2026-11-06 14:00:00', '14:00:00', '16:00:00', 'confirmed', 'Khách: Nguyễn Đức Thắng - Gói Chụp Ảnh Cưới Studio Hàn Quốc', '2026-11-01 13:00:00', '2026-11-01 16:00:00'),
	(25, 24, 9, '2026-11-07 09:00:00', '09:00:00', '10:30:00', 'confirmed', 'Khách: Trịnh Bảo Ngọc - Gói Chụp Gia Đình Nhỏ & Em Bé Baby', '2026-11-01 14:00:00', '2026-11-01 17:00:00'),
	(26, 25, 10, '2026-11-07 14:00:00', '14:00:00', '15:30:00', 'confirmed', 'Khách: Hồ Minh Trí - Gói Chụp Couple Lãng Mạn & Hẹn Hò Đôi', '2026-11-01 15:00:00', '2026-11-01 18:00:00'),
	(27, 26, 11, '2026-11-08 09:30:00', '09:30:00', '11:00:00', 'pending', 'Khách: Bùi Hải Yến - Gói Chụp Ảnh Cá Nhân Pastel', '2026-11-02 08:00:00', '2026-11-02 08:00:00'),
	(28, 27, 12, '2026-11-08 14:00:00', '14:00:00', '15:30:00', 'pending', 'Khách: Dương Thanh Phong - Gói Chụp Nàng Thơ & Cổ Trang Áo Dài', '2026-11-02 08:30:00', '2026-11-02 08:30:00'),
	(29, 28, 5, '2026-11-09 09:00:00', '09:00:00', '10:30:00', 'pending', 'Khách: Phan Mỹ Uyên - Gói Chụp Doanh Nhân & Profile Thương Hiệu', '2026-11-02 08:45:00', '2026-11-02 08:45:00'),
	(30, 16, 4, '2026-11-09 14:00:00', '14:00:00', '16:00:00', 'pending', 'Khách: Lê Minh Tuấn - Gói Chụp Kỷ Niệm Ngày Cưới Gia Đình', '2026-11-02 09:00:00', '2026-11-02 09:00:00'),
	(31, 3, 1, '2026-11-01 15:00:00', '15:00:00', '17:00:00', 'completed', 'Khách: Lê Hoàng Khách Hàng - Gói Chụp Ảnh Cưới Studio Hàn Quốc (Cọc VNPay 50%)', '2026-11-01 14:00:00', '2026-11-01 17:30:00'),
	(32, 17, 2, '2026-11-01 16:00:00', '16:00:00', '18:00:00', 'completed', 'Khách: Phạm Phương Linh - Gói Chụp Ảnh Cá Nhân Pastel (Cọc VNPay 30%)', '2026-11-01 14:05:00', '2026-11-01 18:30:00'),
	(33, 18, 3, '2026-10-08 10:00:00', '10:00:00', '11:30:00', 'cancelled', 'Khách hủy hẹn do bận công tác đột xuất', '2026-10-01 09:00:00', '2026-10-05 10:00:00'),
	(34, 19, 4, '2026-10-14 14:00:00', '14:00:00', '15:30:00', 'cancelled', 'Đổi lịch sang tháng 11', '2026-10-06 14:00:00', '2026-10-10 11:00:00'),
	(35, 3, 1, '2026-11-10 09:00:00', '09:00:00', '10:30:00', 'confirmed', 'Khách: Lê Hoàng Khách Hàng - Gói Chụp Beauty & Makeup Chân Dung Cá Nhân', '2026-11-01 16:00:00', '2026-11-02 08:30:00'),
	(36, 20, 6, '2026-11-10 14:00:00', '14:00:00', '16:00:00', 'pending', 'Khách: Trần Khánh Huyền - Gói Chụp Lookbook Thời Trang & Sản Phẩm', '2026-11-02 09:15:00', '2026-11-02 09:15:00');

-- Dumping structure for table photo_studio.booking_employee_assignments
CREATE TABLE IF NOT EXISTS `booking_employee_assignments` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính',
  `booking_id` bigint NOT NULL COMMENT 'FK - bookings',
  `employee_id` bigint NOT NULL COMMENT 'FK - employees',
  `assigned_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày nhân viên nhận lịch làm việc',
  `status` enum('assigned','completed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'assigned' COMMENT 'Trạng thái phân công',
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ghi chú dành cho nhân viên',
  PRIMARY KEY (`id`),
  KEY `fk_bea_booking` (`booking_id`),
  KEY `fk_bea_employee` (`employee_id`),
  CONSTRAINT `fk_bea_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_bea_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Phân công nhân viên phụ trách buổi chụp';

-- Dumping data for table photo_studio.booking_employee_assignments: ~28 rows (approximately)
REPLACE INTO `booking_employee_assignments` (`id`, `booking_id`, `employee_id`, `assigned_at`, `status`, `note`) VALUES
	(1, 1, 1, '2026-10-06 09:00:00', 'completed', 'Nhiếp ảnh chính buổi chụp cưới studio'),
	(2, 2, 1, '2026-10-09 10:00:00', 'completed', 'Chụp cá nhân tone pastel'),
	(3, 3, 1, '2026-10-11 15:00:00', 'completed', 'Chụp gia đình phòng VIP'),
	(4, 4, 1, '2026-10-13 09:30:00', 'completed', 'Chụp profile CEO TechLab'),
	(5, 5, 1, '2026-10-17 14:00:00', 'completed', 'Chụp cổ trang áo dài phố cổ'),
	(6, 6, 1, '2026-10-19 16:30:00', 'completed', 'Chụp kỷ yếu nhóm bạn tốt nghiệp'),
	(7, 7, 1, '2026-10-21 09:00:00', 'completed', 'Chụp cưới Luxury ngoại cảnh VIP'),
	(8, 8, 1, '2026-10-22 14:00:00', 'completed', 'Chụp beauty chân dung nghệ thuật'),
	(9, 9, 1, '2026-10-24 11:00:00', 'completed', 'Chụp profile diễn viên nghệ sĩ'),
	(10, 10, 1, '2026-10-25 16:00:00', 'completed', 'Chụp kỷ niệm ngày cưới gia đình'),
	(11, 14, 1, '2026-10-29 15:00:00', 'completed', 'Chụp couple hẹn hò đôi'),
	(12, 15, 1, '2026-10-30 09:00:00', 'assigned', 'Ca chụp sáng hôm nay đang tác nghiệp'),
	(13, 17, 1, '2026-11-01 10:00:00', 'assigned', 'Lịch chụp cưới hoàng gia ngày mai'),
	(14, 31, 1, '2026-11-01 14:04:55', 'completed', 'Đơn đặt lịch khách cọc VNPay'),
	(15, 35, 1, '2026-11-02 08:30:00', 'assigned', 'Ca chụp beauty tuần tới'),
	(16, 1, 3, '2026-10-06 09:00:00', 'completed', 'Trần Thủy Tiên - Makeup cô dâu'),
	(17, 2, 3, '2026-10-09 10:00:00', 'completed', 'Trần Thủy Tiên - Makeup nhẹ nhàng'),
	(18, 4, 3, '2026-10-13 09:30:00', 'completed', 'Trần Thủy Tiên - Chăm sóc nền da nam'),
	(19, 7, 3, '2026-10-21 09:00:00', 'completed', 'Trần Thủy Tiên - 2 layout makeup cô dâu'),
	(20, 11, 2, '2026-10-26 10:00:00', 'completed', 'Nguyễn Hoàng Anh - Chụp lookbook'),
	(21, 12, 2, '2026-10-27 09:00:00', 'completed', 'Nguyễn Hoàng Anh - Chụp cá nhân'),
	(22, 13, 5, '2026-10-28 10:00:00', 'completed', 'Vũ Việt Dũng - Chụp bé baby'),
	(23, 16, 2, '2026-10-31 09:30:00', 'assigned', 'Nguyễn Hoàng Anh - Chụp cổ trang chiều nay'),
	(24, 18, 5, '2026-11-01 11:30:00', 'assigned', 'Vũ Việt Dũng - Chụp cá nhân'),
	(25, 19, 7, '2026-11-01 08:30:00', 'assigned', 'Phạm Quốc Huy - Chụp gia đình'),
	(26, 20, 2, '2026-11-01 09:30:00', 'assigned', 'Nguyễn Hoàng Anh - Chụp BST thời trang'),
	(27, 22, 7, '2026-11-01 11:30:00', 'assigned', 'Phạm Quốc Huy - Chụp sự kiện doanh nghiệp'),
	(28, 24, 5, '2026-11-01 13:30:00', 'assigned', 'Vũ Việt Dũng - Chụp cưới Hàn Quốc');

-- Dumping structure for table photo_studio.booking_packages
CREATE TABLE IF NOT EXISTS `booking_packages` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính',
  `booking_id` bigint NOT NULL COMMENT 'FK - bookings',
  `package_id` bigint NOT NULL COMMENT 'FK - packages',
  `quantity` int NOT NULL DEFAULT '1' COMMENT 'Số lượng gói chụp',
  `unit_price` double NOT NULL DEFAULT '0' COMMENT 'Đơn giá gói chụp tại thời điểm đặt',
  PRIMARY KEY (`id`),
  KEY `fk_bp_booking` (`booking_id`),
  KEY `fk_bp_package` (`package_id`),
  CONSTRAINT `fk_bp_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_bp_package` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chi tiết gói chụp được sử dụng trong buổi chụp';

-- Dumping data for table photo_studio.booking_packages: ~36 rows (approximately)
REPLACE INTO `booking_packages` (`id`, `booking_id`, `package_id`, `quantity`, `unit_price`) VALUES
	(1, 1, 2, 1, 2990000),
	(2, 2, 1, 1, 990000),
	(3, 3, 3, 1, 1890000),
	(4, 4, 6, 1, 1290000),
	(5, 5, 7, 1, 1690000),
	(6, 6, 5, 1, 1490000),
	(7, 7, 4, 1, 5990000),
	(8, 8, 11, 1, 1390000),
	(9, 9, 12, 1, 1590000),
	(10, 10, 13, 1, 2490000),
	(11, 11, 8, 1, 2490000),
	(12, 12, 1, 1, 990000),
	(13, 13, 14, 1, 1790000),
	(14, 14, 10, 1, 1890000),
	(15, 15, 6, 1, 1290000),
	(16, 16, 7, 1, 1690000),
	(17, 17, 9, 1, 4200000),
	(18, 18, 1, 1, 990000),
	(19, 19, 3, 1, 1890000),
	(20, 20, 16, 1, 4800000),
	(21, 21, 7, 1, 1690000),
	(22, 22, 15, 1, 3500000),
	(23, 23, 11, 1, 1390000),
	(24, 24, 2, 1, 2990000),
	(25, 25, 14, 1, 1790000),
	(26, 26, 10, 1, 1890000),
	(27, 27, 1, 1, 990000),
	(28, 28, 7, 1, 1690000),
	(29, 29, 6, 1, 1290000),
	(30, 30, 13, 1, 2490000),
	(31, 31, 2, 1, 2990000),
	(32, 32, 1, 1, 990000),
	(33, 33, 1, 1, 990000),
	(34, 34, 3, 1, 1890000),
	(35, 35, 11, 1, 1390000),
	(36, 36, 8, 1, 2490000);

-- Dumping structure for table photo_studio.clothes
CREATE TABLE IF NOT EXISTS `clothes` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính',
  `type` enum('wedding','traditional','casual','suit','cosplay','other') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Loại trang phục',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên trang phục',
  `size` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Kích cỡ (S, M, L, XL, Free size...)',
  `gender` enum('Male','Female') COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Đặc điểm giới tính trang phục',
  `color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Màu sắc',
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mô tả trang phục',
  `price` double NOT NULL DEFAULT '0' COMMENT 'Giá thuê trang phục',
  `status` enum('available','rented','maintenance','damaged','retired') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available' COMMENT 'Trạng thái trang phục',
  `deleted_at` datetime DEFAULT NULL COMMENT 'Thời điểm đưa trang phục vào thùng rác',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý trang phục cho thuê';

-- Dumping data for table photo_studio.clothes: ~18 rows (approximately)
REPLACE INTO `clothes` (`id`, `type`, `name`, `size`, `gender`, `color`, `description`, `price`, `status`, `deleted_at`) VALUES
	(1, 'casual', 'Váy Nàng Thơ Voan Pastel', 'Free size', 'Female', 'Trắng kem', 'Trang phục nhẹ nhàng đi kèm gói chụp ảnh cá nhân và nàng thơ.', 0, 'available', NULL),
	(2, 'wedding', 'Váy Cưới Ren Pháp', 'M', 'Female', 'Trắng tinh khôi', 'Váy cô dâu xòe bồng ren Pháp cao cấp cho gói chụp ảnh cưới.', 0, 'available', NULL),
	(3, 'suit', 'Tuxedo Chú Rể Ý', 'L', 'Male', 'Đen lịch lãm', 'Bộ tuxedo chú rể đồng bộ phong cách với váy cưới châu Âu.', 0, 'available', NULL),
	(4, 'casual', 'Set Đồ Gia Đình Đồng Điệu', 'Đủ size', 'Male', 'Be pastel', 'Trang phục tone màu pastel ấm cúng cho cả gia đình 4-6 người.', 0, 'available', NULL),
	(5, 'cosplay', 'Áo Cử Nhân Kỷ Yếu & Mũ', 'M', 'Female', 'Xanh đen', 'Bộ cử nhân kèm mũ và dải nơ phục vụ bộ ảnh tốt nghiệp.', 0, 'available', NULL),
	(6, 'suit', 'Bộ Vest Doanh Nhân Cao Cấp', 'XL', 'Male', 'Xanh navy', 'Vest doanh nhân may đo chuẩn form tôn dáng đĩnh đạc.', 0, 'available', NULL),
	(7, 'traditional', 'Áo Dài Tơ Tằm Thêu Sen', 'S', 'Female', 'Hồng phấn', 'Áo dài truyền thống thêu tay nghệ thuật cho concept cổ trang.', 0, 'available', NULL),
	(8, 'traditional', 'Cổ Phục Nhật Bình Triều Nguyễn', 'Free size', 'Female', 'Đỏ hoàng cung', 'Trang phục cung đình phục dựng tinh xảo cho bộ ảnh di sản.', 0, 'available', NULL),
	(9, 'casual', 'Set Blazer Lookbook Hàn Quốc', 'M', 'Female', 'Nâu tây', 'Thời trang phong cách street-style hiện đại cho shop lookbook.', 0, 'available', NULL),
	(10, 'wedding', 'Váy Cưới Đuôi Cá Satin Tối Giản', 'S', 'Female', 'Trắng ngà', 'Thiết kế tôn đường cong quyến rũ phong cách minimalism.', 0, 'available', NULL),
	(11, 'suit', 'Bộ Vest Nữ Công Sở Thanh Lịch', 'M', 'Female', 'Trắng kem', 'Vest nữ quyền lực cho nữ lãnh đạo và doanh nhân thành đạt.', 0, 'available', NULL),
	(12, 'traditional', 'Áo Dài Trắng Nữ Sinh Truyền Thống', 'M', 'Female', 'Trắng', 'Áo dài lụa trắng nữ sinh tinh khôi cho ảnh kỷ yếu và chân dung.', 0, 'available', NULL),
	(13, 'casual', 'Váy Maxi Hoa Nhí Bohemian', 'Free size', 'Female', 'Vàng mù tạt', 'Váy bohemian thướt tha du mục cho concept ngoại cảnh và studio mộc.', 0, 'available', NULL),
	(14, 'wedding', 'Váy Dạ Hội Đính Đá Ánh Bạc', 'M', 'Female', 'Ánh bạc', 'Đầm dạ hội đuôi xòe lấp lánh cho tiệc tối và ảnh kỷ niệm cưới.', 0, 'available', NULL),
	(15, 'traditional', 'Áo Dài Cách Tân Nam Gấm Thêu Rồng', 'L', 'Male', 'Đỏ đô', 'Áo dài cách tân nam truyền thống cho lễ cưới và Tết cổ truyền.', 0, 'available', NULL),
	(16, 'suit', 'Tuxedo Trắng Hoàng Gia Nam', 'L', 'Male', 'Trắng viền đen', 'Tuxedo bạch mã hoàng tử sang trọng cho chú rể chụp studio châu Âu.', 0, 'available', NULL),
	(17, 'cosplay', 'Trang Phục Kimono Cách Điệu', 'Free size', 'Female', 'Đỏ hoa anh đào', 'Trang phục truyền thống Nhật Bản cho concept cá tính.', 0, 'available', NULL),
	(18, 'cosplay', 'Set Đồ Công Chúa Elsa Trẻ Em', 'Size bé', 'Female', 'Xanh ngọc', 'Trang phục thần tiên đáng yêu cho bé gái 3-6 tuổi chụp sinh nhật.', 0, 'available', NULL);

-- Dumping structure for table photo_studio.contacts
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính',
  `user_id` bigint DEFAULT NULL COMMENT 'FK - users (Tài khoản người dùng nếu đã đăng nhập, NULL nếu là khách vãng lai)',
  `fullname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Họ và tên người gửi liên hệ',
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Email người gửi để nhận phản hồi',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Số điện thoại liên hệ',
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Tiêu đề / Chủ đề liên hệ (tư vấn gói chụp, báo giá, thắc mắc...)',
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nội dung tin nhắn / yêu cầu liên hệ',
  `status` enum('pending','completed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending' COMMENT 'Trạng thái xử lý liên hệ',
  `reply_message` text COLLATE utf8mb4_unicode_ci COMMENT 'Nội dung phản hồi từ quản trị viên / nhân viên studio',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm gửi liên hệ',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật trạng thái hoặc gửi phản hồi',
  PRIMARY KEY (`id`),
  KEY `fk_contacts_user` (`user_id`),
  CONSTRAINT `fk_contacts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý tin nhắn liên hệ và phản hồi của khách hàng';

-- Dumping data for table photo_studio.contacts: ~15 rows (approximately)
REPLACE INTO `contacts` (`id`, `user_id`, `fullname`, `email`, `phone`, `subject`, `message`, `status`, `reply_message`, `created_at`, `updated_at`) VALUES
	(1, 16, 'Lê Minh Tuấn', 'minhtuan@gmail.com', '0934567890', 'Tư vấn gói chụp cưới ngoại cảnh', 'Chào studio, mình muốn hỏi gói chụp cưới phong cách vintage có hỗ trợ trang điểm và xe di chuyển không ạ?', 'completed', 'Dạ chào bạn Tuấn, gói chụp cưới bên mình đã bao gồm trọn gói trang điểm và ekip hỗ trợ bạn nhé! Nhân viên sẽ liên hệ tư vấn chi tiết ạ.', '2026-10-05 08:30:00', '2026-10-05 09:30:00'),
	(2, NULL, 'Nguyễn Mai Phương', 'maiphuong@outlook.com', '0988776655', 'Hỏi báo giá chụp kỷ yếu nhóm', 'Cho em xin báo giá chi tiết gói chụp ảnh kỷ yếu cho nhóm 15 người tại studio vào cuối tuần này với ạ.', 'completed', 'Chào Phương, studio đã gửi bảng báo giá ưu đãi nhóm kỷ yếu qua email cho bạn rồi nhé!', '2026-10-10 14:00:00', '2026-10-10 15:00:00'),
	(3, 21, 'Đặng Quốc Bảo', 'quocbao.ceo@techlab.vn', '0945678906', 'Đặt lịch chụp profile doanh nghiệp', 'Bên công ty mình muốn chụp profile cho ban giám đốc 5 người, studio có xuất hóa đơn VAT không?', 'completed', 'Chào anh Bảo, PhotoStudio có xuất đầy đủ hóa đơn VAT điện tử cho doanh nghiệp ạ. Chuyên viên sẽ gọi trao đổi với anh nhé!', '2026-10-12 09:00:00', '2026-10-12 10:00:00'),
	(4, 17, 'Phạm Phương Linh', 'phuonglinh@gmail.com', '0945678902', 'Tư vấn gói chụp nàng thơ sinh nhật', 'Gói nàng thơ có được mượn 2 bộ váy không ạ hay chỉ được 1 bộ?', 'completed', 'Chào bạn Linh, gói cơ bản gồm 1 set váy cao cấp, bạn có thể thuê thêm bộ thứ 2 với giá ưu đãi 30% nha!', '2026-10-15 16:30:00', '2026-10-15 17:00:00'),
	(5, NULL, 'Trần Văn Hưng', 'hungtran@fpt.com.vn', '0912334455', 'Hỏi thuê phòng chụp tự tác nghiệp', 'Studio có cho thuê phòng kèm đèn cho ekip bên ngoài tự mang máy đến chụp không?', 'completed', 'Chào anh Hưng, studio có dịch vụ cho thuê không gian theo giờ đã bao gồm set đèn Godox đầy đủ ạ!', '2026-10-18 11:00:00', '2026-10-18 11:30:00'),
	(6, 18, 'Nguyễn Thu Trang', 'thutrang.nguyen@gmail.com', '0945678903', 'Hỏi về thời gian nhận ảnh hoàn thiện', 'Sau khi chụp gói gia đình thì bao lâu mình nhận được link ảnh gốc và ảnh chỉnh sửa ạ?', 'completed', 'File gốc bạn nhận ngay trong ngày, còn ảnh retouch chuyên sâu và album sẽ bàn giao trong 3-5 ngày làm việc ạ.', '2026-10-20 14:15:00', '2026-10-20 15:00:00'),
	(7, NULL, 'Vũ Đình Trọng', 'trongvu@gmail.com', '0977889900', 'Tư vấn chụp ảnh cưới kết hợp ngoại cảnh Hà Nội', 'Mình muốn chụp studio và chiều ra bãi đá sông Hồng đón hoàng hôn thì đăng ký gói nào phù hợp?', 'completed', 'Chào bạn Trọng, gói Cưới Luxury & Ngoại Cảnh VIP sinh ra chính là để phục vụ lịch trình này bạn nhé!', '2026-10-22 10:00:00', '2026-10-22 10:45:00'),
	(8, 20, 'Trần Khánh Huyền', 'khanhhuyen.tran@gmail.com', '0945678905', 'Hỏi về trang phục áo dài cổ phục', 'Bên mình có sẵn cổ phục Nhật Bình màu đỏ không ạ?', 'completed', 'Dạ studio có sẵn trọn bộ cổ phục Nhật Bình hoàng cung thêu tay tinh xảo và phụ kiện trâm cài đi kèm bạn nhé!', '2026-10-24 15:30:00', '2026-10-24 16:00:00'),
	(9, NULL, 'Bùi Quốc Anh', 'quocanh@gmail.com', '0933221100', 'Hỏi lịch trống cuối tuần này', 'Thứ 7 tuần này phòng Hàn Quốc lúc 14h có trống lịch không studio?', 'completed', 'Dạ hiện khung giờ đó đang trống, bạn có thể đặt trực tiếp trên website để giữ phòng nhé!', '2026-10-26 09:00:00', '2026-10-26 09:30:00'),
	(10, 24, 'Trịnh Bảo Ngọc', 'baongoc.trinh@gmail.com', '0945678909', 'Tư vấn chụp ảnh cho bé 1 tuổi', 'Studio có đạo cụ nôi và đồ chơi cho bé 1 tuổi thôi nôi không?', 'completed', 'Dạ bên mình có phòng chụp Baby chuyên biệt với đầy đủ đồ chơi khử khuẩn an toàn cho bé bạn nhé!', '2026-10-28 11:20:00', '2026-10-28 11:50:00'),
	(11, NULL, 'Lê Thị Thu', 'thule@gmail.com', '0909112233', 'Hỏi chương trình ưu đãi mùa cưới', 'Tháng 11 này studio có chương trình khuyến mãi tặng bàn để bàn hay album không ạ?', 'pending', NULL, '2026-11-01 08:30:00', '2026-11-01 08:30:00'),
	(12, NULL, 'Ngô Đức Minh', 'minhngo@gmail.com', '0918776644', 'Báo giá chụp lookbook BST thời trang', 'Shop mình ra mắt BST hè thu 30 mẫu cần chụp cả ngày, studio gửi mình báo giá trọn gói nhé.', 'pending', NULL, '2026-11-01 10:15:00', '2026-11-01 10:15:00'),
	(13, 27, 'Dương Thanh Phong', 'thanhphong.duong@gmail.com', '0945678912', 'Đổi giờ hẹn chụp sang buổi chiều', 'Mình có đặt lịch buổi sáng thứ 3, muốn đổi sang 14h chiều có được không?', 'pending', NULL, '2026-11-01 14:00:00', '2026-11-01 14:00:00'),
	(14, NULL, 'Hoàng Thùy Dương', 'thuyduong@gmail.com', '0944556688', 'Hỏi về makeup cho người nhà đi cùng', 'Mẹ mình muốn trang điểm nhẹ đi cùng chụp ảnh kỷ niệm thì thêm phụ phí bao nhiêu?', 'pending', NULL, '2026-11-01 16:30:00', '2026-11-01 16:30:00'),
	(15, NULL, 'Phạm Hữu Đạt', 'datpham@gmail.com', '0966554433', 'Hỏi dịch vụ quay video hậu trường ngắn', 'Mình muốn quay thêm video ngắn đăng TikTok lúc chụp cưới thì studio có hỗ trợ không?', 'pending', NULL, '2026-11-02 08:00:00', '2026-11-02 08:00:00');

-- Dumping structure for table photo_studio.contents
CREATE TABLE IF NOT EXISTS `contents` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính',
  `type` enum('page','post') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Loại nội dung (trang tĩnh hoặc bài viết)',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tiêu đề nội dung/bài viết',
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Đường dẫn thân thiện (slug)',
  `content` text COLLATE utf8mb4_unicode_ci COMMENT 'Nội dung chi tiết',
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Đường dẫn ảnh đại diện bài viết',
  `status` enum('draft','published','hidden') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft' COMMENT 'Trạng thái bài viết',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo bài viết',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật bài viết',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý bài viết và các trang nội dung tĩnh của website';

-- Dumping data for table photo_studio.contents: ~14 rows (approximately)
REPLACE INTO `contents` (`id`, `type`, `title`, `slug`, `content`, `image_url`, `status`, `created_at`, `updated_at`) VALUES
	(1, 'page', 'Về Chúng Tôi - PhotoStudio Luxury', 'gioi-thieu', 'PhotoStudio tự hào là đơn vị cung cấp dịch vụ chụp ảnh chuyên nghiệp hàng đầu với 14 phòng studio hiện đại, trang thiết bị tối tân và đội ngũ ekip tận tâm...', 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=85', 'published', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(2, 'post', 'Bí quyết chọn trang phục chụp ảnh cưới studio đẹp nhất 2026', 'bi-quyet-chon-trang-phuc-cuoi', 'Chụp ảnh cưới studio đang là xu hướng được nhiều cặp đôi lựa chọn bởi sự tiện lợi và phong cách tinh tế. Bài viết này sẽ hướng dẫn bạn chọn váy ren Pháp và tuxedo Ý...', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85', 'published', '2026-10-05 09:00:00', '2026-10-05 09:00:00'),
	(3, 'post', 'Top 5 layout makeup nàng thơ trong trẻo được yêu thích nhất', 'top-5-layout-makeup-nang-tho', 'Phong cách trang điểm tự nhiên Hàn Quốc tôn lên nét đẹp thanh thuần, làn da căng bóng và ánh mắt long lanh cho các bộ ảnh cá nhân...', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85', 'published', '2026-10-10 10:00:00', '2026-10-10 10:00:00'),
	(4, 'post', 'Hướng dẫn chuẩn bị chụp ảnh gia đình ấm cúng và đồng điệu', 'huong-dan-chup-anh-gia-dinh', 'Để có một bức ảnh đại gia đình 3 thế hệ đẹp hoàn hảo, việc lựa chọn tone màu trang phục be/pastel và sự gắn kết cảm xúc là chìa khóa quan trọng...', 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=85', 'published', '2026-10-15 14:00:00', '2026-10-15 14:00:00'),
	(5, 'post', 'Tại sao doanh nhân cần một bộ ảnh profile thương hiệu đẳng cấp?', 'anh-profile-doanh-nhan-dang-cap', 'Trong kỷ nguyên số, bức ảnh đại diện trên báo chí và mạng xã hội quyết định ấn tượng đầu tiên của đối tác và khách hàng về uy tín cá nhân lãnh đạo...', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85', 'published', '2026-10-20 11:00:00', '2026-10-20 11:00:00'),
	(6, 'post', 'Xu hướng chụp ảnh cổ trang & áo dài di sản Việt Nam', 'xu-huong-chup-anh-co-trang-ao-dai', 'Khám phá vẻ đẹp truyền thống của cổ phục Nhật Bình triều Nguyễn và áo dài tơ tằm thêu tay trong không gian studio cổ kính...', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85', 'published', '2026-10-22 09:30:00', '2026-10-22 09:30:00'),
	(7, 'post', 'Kinh nghiệm chụp ảnh lookbook thời trang cho các local brand', 'kinh-nghiem-chup-lookbook-thoi-trang', 'Cách tận dụng phông vô cực Cyclorama và dàn đèn công suất cao để thể hiện chất liệu vải và phom dáng trang phục một cách chuẩn xác nhất...', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85', 'published', '2026-10-25 15:00:00', '2026-10-25 15:00:00'),
	(8, 'post', 'Mẹo tạo dáng tự nhiên trước ống kính cho các cặp đôi ngại ngùng', 'meo-tao-dang-cho-cap-doi', 'Không cần tạo dáng cầu kỳ, những cử chỉ ân cần, cái nắm tay nhẹ nhàng hay ánh nhìn trìu mến sẽ tạo nên bức ảnh cưới giàu cảm xúc nhất...', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85', 'published', '2026-10-27 10:30:00', '2026-10-27 10:30:00'),
	(9, 'post', 'Lưu ý vàng khi chụp ảnh cho bé sơ sinh và trẻ nhỏ an toàn', 'luu-y-chup-anh-cho-be-so-sinh', 'Nhiệt độ phòng chụp, khử trùng đạo cụ và sự kiên nhẫn của ekip là 3 yếu tố quan trọng nhất để buổi chụp bé diễn ra suôn sẻ...', 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=85', 'published', '2026-10-28 14:00:00', '2026-10-28 14:00:00'),
	(10, 'post', 'Nghệ thuật sử dụng ánh sáng tự nhiên trong studio chân dung', 'nghe-thuat-anh-sang-tu-nhien', 'Tận dụng cửa sổ kính tràn và rèm voan mỏng để tạo ra những vệt sáng mềm mại ôm trọn đường nét gương mặt...', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=85', 'published', '2026-10-29 16:00:00', '2026-10-29 16:00:00'),
	(11, 'post', 'Phong cách chụp ảnh cưới Indochine Đông Dương hoài niệm', 'anh-cuoi-phong-cach-indochine', 'Vẻ đẹp giao thoa giữa nét lãng mạn nước Pháp và sự mộc mạc truyền thống Á Đông trong từng thước phim cưới...', 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85', 'published', '2026-10-30 09:00:00', '2026-10-30 09:00:00'),
	(12, 'post', 'Bí quyết giữ lớp trang điểm bền đẹp suốt buổi chụp kéo dài', 'bi-quyet-giu-lop-trang-diem-lau-troi', 'Quy trình dưỡng ẩm chuyên sâu và sử dụng xịt khóa nền cao cấp giúp lớp makeup luôn tươi mới dưới ánh đèn studio...', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=85', 'published', '2026-10-31 11:00:00', '2026-10-31 11:00:00'),
	(13, 'post', 'Checklist 10 điều cần chuẩn bị trước ngày chụp ảnh cưới studio', 'checklist-chuan-bi-chup-anh-cuoi', 'Từ việc chăm sóc da, ngủ đủ giấc đến chọn giày cưới phù hợp giúp cô dâu chú rể tự tin tỏa sáng trọn vẹn...', 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85', 'published', '2026-11-01 08:30:00', '2026-11-01 08:30:00'),
	(14, 'post', 'Khám phá concept chụp ảnh Cyberpunk & Neon ánh sáng tương lai', 'concept-chup-anh-cyberpunk-neon', 'Đột phá phong cách với dàn đèn led đổi màu neon và khói huyền ảo dành cho những bộ ảnh cá tính độc bản...', 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=85', 'published', '2026-11-01 10:00:00', '2026-11-01 10:00:00');

-- Dumping structure for table photo_studio.employees
CREATE TABLE IF NOT EXISTS `employees` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính',
  `user_id` bigint NOT NULL COMMENT 'FK - users (Một user tối đa 1 hồ sơ nhân viên)',
  `position` enum('photographer','makeup','logistics') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Vị trí chuyên môn của nhân viên',
  `hire_date` date DEFAULT NULL COMMENT 'Ngày tuyển dụng nhân viên',
  `status` enum('active','inactive','on_leave') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active' COMMENT 'Trạng thái nhân sự',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `fk_employees_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý hồ sơ nhân viên studio';

-- Dumping data for table photo_studio.employees: ~13 rows (approximately)
REPLACE INTO `employees` (`id`, `user_id`, `position`, `hire_date`, `status`) VALUES
	(1, 2, 'photographer', '2024-01-15', 'active'),
	(2, 4, 'photographer', '2024-02-01', 'active'),
	(3, 5, 'makeup', '2024-02-15', 'active'),
	(4, 6, 'logistics', '2024-03-01', 'active'),
	(5, 7, 'photographer', '2024-03-15', 'active'),
	(6, 8, 'makeup', '2024-04-01', 'active'),
	(7, 9, 'photographer', '2024-04-15', 'active'),
	(8, 10, 'makeup', '2024-05-01', 'active'),
	(9, 11, 'logistics', '2024-05-15', 'active'),
	(10, 12, 'photographer', '2024-06-01', 'active'),
	(11, 13, 'makeup', '2024-06-15', 'active'),
	(12, 14, 'photographer', '2024-07-01', 'on_leave'),
	(13, 15, 'logistics', '2024-07-15', 'inactive');

-- Dumping structure for table photo_studio.employee_reviews
CREATE TABLE IF NOT EXISTS `employee_reviews` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính',
  `review_id` bigint NOT NULL COMMENT 'FK - reviews',
  `employee_id` bigint NOT NULL COMMENT 'FK - employees',
  `rating` double NOT NULL DEFAULT '5' COMMENT 'Số sao đánh giá cho nhân viên',
  `comment` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Bình luận đánh giá nhân viên',
  `admin_reply` text COLLATE utf8mb4_unicode_ci COMMENT 'Phản hồi của quản trị viên',
  `admin_replied_at` datetime DEFAULT NULL COMMENT 'Thời điểm quản trị viên phản hồi',
  PRIMARY KEY (`id`),
  KEY `fk_er_review` (`review_id`),
  KEY `fk_er_employee` (`employee_id`),
  CONSTRAINT `fk_er_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_er_review` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Đánh giá chi tiết thái độ và tay nghề của từng nhân viên';

-- Dumping data for table photo_studio.employee_reviews: ~20 rows (approximately)
REPLACE INTO `employee_reviews` (`id`, `review_id`, `employee_id`, `rating`, `comment`, `admin_reply`, `admin_replied_at`) VALUES
	(1, 1, 1, 5, 'Photographer Nguyễn Văn Nhân Viên nhiệt tình, bắt góc cô dâu rất xinh và khéo léo', NULL, NULL),
	(2, 1, 3, 5, 'Makeup Trần Thủy Tiên tone Hàn Quốc cực kỳ tôn nét da và giữ phấn lâu trôi', NULL, NULL),
	(3, 2, 1, 5, 'Photographer bắt khoảnh khắc ánh sáng tự nhiên rất đẹp', NULL, NULL),
	(4, 2, 3, 5, 'Tạo kiểu tóc tiểu thư nhẹ nhàng thanh lịch', NULL, NULL),
	(5, 3, 1, 5, 'Nhiếp ảnh gia rất kiên nhẫn khi chụp cho các em bé nhỏ', NULL, NULL),
	(6, 3, 4, 5, 'Nhân viên hậu cần hỗ trợ sắp xếp đạo cụ và sofa chu đáo', NULL, NULL),
	(7, 4, 1, 5, 'Photographer hướng dẫn tư thế lãnh đạo đĩnh đạc tự nhiên', NULL, NULL),
	(8, 5, 1, 5, 'Bắt góc phố cổ và áo dài truyền thống rất thơ', NULL, NULL),
	(9, 5, 3, 5, 'Cài trâm và làm tóc cổ trang tỉ mỉ từng lọn', NULL, NULL),
	(10, 6, 1, 5, 'Tạo không khí chụp kỷ yếu vui nhộn, sáng tạo', NULL, NULL),
	(11, 7, 1, 5, 'Nhiếp ảnh gia chính lăn xả hết mình trong buổi chụp ngoại cảnh', NULL, NULL),
	(12, 7, 3, 5, 'Makeup dặm phấn và đổi layout kịp thời giữa các bối cảnh', NULL, NULL),
	(13, 8, 1, 5, 'Ánh sáng studio làm nổi bật đường nét khuôn mặt', NULL, NULL),
	(14, 9, 1, 5, 'Góc chụp drama cá tính đúng chuẩn phong cách nghệ sĩ', NULL, NULL),
	(15, 10, 1, 5, 'Thợ chụp nói chuyện lịch thiệp làm ba mẹ rất thoải mái', NULL, NULL),
	(16, 11, 2, 5, 'Nhiếp ảnh gia Hoàng Anh chụp sản phẩm và mẫu lookbook cực chuẩn màu', NULL, NULL),
	(17, 12, 1, 5, 'Photographer chỉ dẫn tạo dáng cho bạn gái rất ân cần', NULL, NULL),
	(18, 13, 5, 5, 'Nhiếp ảnh gia Việt Dũng bắt nụ cười trẻ thơ siêu đáng yêu', NULL, NULL),
	(19, 14, 1, 5, 'Chụp couple ngọt ngào, căn góc hai bạn nhìn nhau cực tình', NULL, NULL),
	(20, 15, 1, 5, 'Thao tác máy nhanh gọn, tác phong làm việc đúng giờ chuẩn chỉ', NULL, NULL);

-- Dumping structure for table photo_studio.equipments
CREATE TABLE IF NOT EXISTS `equipments` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính',
  `type` enum('camera','lens','lighting','tripod','other') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Loại thiết bị',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên thiết bị',
  `brand` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Hãng thiết bị',
  `model` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mẫu thiết bị',
  `serial_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mã sê-ri thiết bị',
  `purchase_date` datetime DEFAULT NULL COMMENT 'Ngày mua thiết bị',
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mô tả thiết bị',
  `status` enum('available','in_use','maintenance','broken','retired') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available' COMMENT 'Trạng thái thiết bị',
  `deleted_at` datetime DEFAULT NULL COMMENT 'Thời điểm đưa thiết bị vào thùng rác',
  PRIMARY KEY (`id`),
  UNIQUE KEY `serial_number` (`serial_number`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý thiết bị studio';

-- Dumping data for table photo_studio.equipments: ~16 rows (approximately)
REPLACE INTO `equipments` (`id`, `type`, `name`, `brand`, `model`, `serial_number`, `purchase_date`, `description`, `status`, `deleted_at`) VALUES
	(1, 'camera', 'Sony Alpha 7 IV - Bộ cá nhân', 'Sony', 'ILCE-7M4', 'SN-SONY-7M4-01', '2023-05-10 00:00:00', 'Máy ảnh full-frame dùng cho gói cá nhân, profile và lookbook.', 'available', NULL),
	(2, 'camera', 'Canon EOS R5 - Bộ cưới VIP', 'Canon', 'EOS R5', 'SN-CANON-R5-02', '2023-06-12 00:00:00', 'Máy ảnh độ phân giải 45MP phục vụ trọn gói album cưới cao cấp.', 'available', NULL),
	(3, 'camera', 'Sony Alpha 7R V - Bộ đa năng', 'Sony', 'ILCE-7RM5', 'SN-SONY-7R5-03', '2023-11-20 00:00:00', 'Máy ảnh cảm biến 61MP chi tiết cực cao cho ảnh gia đình và nhóm.', 'available', NULL),
	(4, 'lens', 'Sony FE 24-70mm f/2.8 GM II', 'Sony', 'SEL2470GM2', 'SN-LENS-2470-04', '2023-05-15 00:00:00', 'Ống kính zoom tiêu chuẩn đa dụng cho mọi thể loại chụp.', 'available', NULL),
	(5, 'lens', 'Canon RF 85mm f/1.2 L USM', 'Canon', 'RF85F12L', 'SN-LENS-85F12-05', '2023-07-01 00:00:00', 'Ống kính chân dung huyền thoại xóa phông mượt mà cho cô dâu.', 'available', NULL),
	(6, 'lens', 'Sony FE 85mm f/1.4 GM', 'Sony', 'SEL85F14GM', 'SN-LENS-85GM-06', '2023-08-10 00:00:00', 'Ống kính chân dung chuyên nghiệp dành cho concept nàng thơ.', 'available', NULL),
	(7, 'lighting', 'Đèn Godox AD600 Pro', 'Godox', 'AD600Pro', 'SN-LIGHT-600P-07', '2023-04-18 00:00:00', 'Đèn studio công suất 600Ws đánh sáng chính trường quay.', 'available', NULL),
	(8, 'lighting', 'Đèn Godox AD400 Pro', 'Godox', 'AD400Pro', 'SN-LIGHT-400P-08', '2023-04-20 00:00:00', 'Đèn flash cơ động cho fill-light và ven tóc chân dung.', 'available', NULL),
	(9, 'lighting', 'Đèn Godox V1 Round Head Flash', 'Godox', 'V1-Sony', 'SN-LIGHT-V1-09', '2023-09-05 00:00:00', 'Đèn speedlite đầu tròn ánh sáng mềm mại cho sự kiện.', 'available', NULL),
	(10, 'lighting', 'Softbox Bát Giác Parabolic 120cm', 'Godox', 'QR-P120', 'SN-ACC-BOX120-10', '2023-05-22 00:00:00', 'Tản sáng bát giác sâu cho ánh sáng chân dung mịn màng.', 'available', NULL),
	(11, 'tripod', 'Chân Máy Ảnh Manfrotto 055 Carbon', 'Manfrotto', 'MT055CXPRO4', 'SN-TRI-055C-11', '2023-03-14 00:00:00', 'Chân máy sợi carbon siêu vững chãi chống rung tối đa.', 'available', NULL),
	(12, 'tripod', 'Gimbal DJI RS 3 Pro', 'DJI', 'RS3-Pro', 'SN-GIM-RS3P-12', '2023-10-02 00:00:00', 'Thiết bị chống rung quay clip highlight và hậu trường 4K.', 'available', NULL),
	(13, 'other', 'Màn Hình Monitor Live-View Atomos Shinobi', 'Atomos', 'Shinobi-5', 'SN-MON-SHIN-13', '2023-06-25 00:00:00', 'Màn hình kiểm tra nét và màu sắc tức thì cho khách hàng xem ảnh.', 'available', NULL),
	(14, 'lighting', 'Bộ Đèn LED RGB Nanlite Pavotube 30C', 'Nanlite', 'Pavotube30C', 'SN-LIGHT-PAVO-14', '2024-01-10 00:00:00', 'Đèn tuýp LED đổi màu sáng tạo cho concept cyberpunk và nghệ thuật.', 'available', NULL),
	(15, 'lens', 'Canon RF 70-200mm f/2.8 L IS USM', 'Canon', 'RF70200L', 'SN-LENS-70200-15', '2024-02-15 00:00:00', 'Ống kính tele bắt góc từ xa sắc nét cho ảnh cưới ngoại cảnh.', 'available', NULL),
	(16, 'other', 'Máy Đo Sáng Chuyên Nghiệp Sekonic L-308X', 'Sekonic', 'L-308X', 'SN-ACC-SEK-16', '2023-08-01 00:00:00', 'Thiết bị đo sáng chuẩn xác từng stop khẩu độ trong studio.', 'available', NULL);

-- Dumping structure for table photo_studio.images
CREATE TABLE IF NOT EXISTS `images` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính',
  `imageable_type` enum('room','background','equipment','clothing','accessory','package','service') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Loại đối tượng gắn ảnh',
  `imageable_id` bigint NOT NULL COMMENT 'Mã ID đối tượng gắn ảnh',
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Đường dẫn ảnh',
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mô tả hình ảnh',
  `is_primary` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Đặt làm hình đại diện/tiêu đề',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo ảnh',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật ảnh',
  PRIMARY KEY (`id`),
  KEY `idx_images_imageable` (`imageable_type`,`imageable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng lưu trữ hình ảnh đa hình cho các tài nguyên và dịch vụ';

-- Dumping data for table photo_studio.images: ~127 rows (approximately)
REPLACE INTO `images` (`id`, `imageable_type`, `imageable_id`, `image_url`, `description`, `is_primary`, `created_at`, `updated_at`) VALUES
	(1, 'package', 1, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85', 'Ảnh bìa chân dung nàng thơ pastel', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(2, 'package', 1, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85', 'Góc cận cảnh ánh mắt và nụ cười', 0, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(3, 'package', 1, 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85', 'Tạo dáng thanh lịch cùng hoa tươi', 0, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(4, 'package', 2, 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85', 'Ảnh bìa album cưới studio Hàn Quốc lãng mạn', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(5, 'package', 2, 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85', 'Khoảnh khắc trao nhẫn ngọt ngào', 0, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(6, 'package', 2, 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85', 'Cô dâu chú rể dưới vòm hoa pha lê', 0, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(7, 'package', 3, 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=85', 'Ảnh đại gia đình sum vầy ấm cúng', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(8, 'package', 3, 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=85', 'Ba mẹ và con cái cười rạng rỡ trên sofa', 0, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(9, 'package', 4, 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85', 'Ảnh cưới hoàng hôn ngoại cảnh đẳng cấp', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(10, 'package', 4, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=85', 'Váy cưới đuôi dài bay trong gió', 0, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(11, 'package', 5, 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85', 'Nhóm bạn tốt nghiệp cử nhân tươi vui', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(12, 'package', 5, 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85', 'Tung mũ tốt nghiệp mừng thành công', 0, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(13, 'package', 6, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85', 'Profile doanh nhân đĩnh đạc chuẩn Forbes', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(14, 'package', 6, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=85', 'Phong thái tự tin của nhà lãnh đạo', 0, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(15, 'package', 7, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85', 'Áo dài truyền thống tơ tằm thêu sen', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(16, 'package', 7, 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=85', 'Cổ phục hoàng cung Việt Nam tôn quý', 0, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(17, 'package', 8, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85', 'Lookbook thời trang high-end phông vô cực', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(18, 'package', 8, 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=85', 'Chi tiết đường may trang phục sắc sảo', 0, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(19, 'package', 9, 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=85', 'Ảnh cưới phong cách cung điện hoàng gia châu Âu', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(20, 'package', 9, 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85', 'Không gian đèn chùm pha lê quý tộc', 0, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(21, 'package', 10, 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=85', 'Khoảnh khắc hẹn hò đôi lãng mạn ngọt ngào', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(22, 'package', 10, 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85', 'Ánh nhìn yêu thương bên khung cửa sổ', 0, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(23, 'package', 11, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=85', 'Cận cảnh layout makeup beauty trong suốt', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(24, 'package', 11, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=85', 'Nụ cười rạng ngời và làn da căng bóng', 0, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(25, 'package', 12, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85', 'Chân dung nghệ sĩ với ánh sáng kịch tính', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(26, 'package', 12, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85', 'Thần thái điện ảnh cuốn hút', 0, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(27, 'package', 13, 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=85', 'Ba mẹ nắm tay mừng kỷ niệm ngày cưới', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(28, 'package', 13, 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=85', 'Hạnh phúc trọn vẹn bên con cháu sum vầy', 0, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(29, 'package', 14, 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=85', 'Nụ cười thiên thần của bé yêu trong nôi', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(30, 'package', 14, 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=85', 'Ba mẹ bế con yêu thương trong studio', 0, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(31, 'package', 15, 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85', 'Toàn cảnh hội nghị và lễ ký kết doanh nghiệp', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(32, 'package', 15, 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=85', 'Không khí vinh danh và tiệc gala trang trọng', 0, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(33, 'package', 16, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85', 'Bộ sưu tập thời trang mùa thu quốc tế', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(34, 'package', 16, 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=85', 'Người mẫu tạo dáng chuyên nghiệp chuẩn Vogue', 0, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(35, 'room', 1, 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1200&q=85', 'Studio Seoul Minimalism Pastel không gian trẻ trung', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(36, 'room', 2, 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85', 'Studio Cung Điện & Cổ Điển Hoàng Gia sang trọng', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(37, 'room', 3, 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=85', 'Studio Ánh Sáng Tự Nhiên đón nắng ban mai', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(38, 'room', 4, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85', 'Studio Gia Đình sofa da cao cấp ấm cúng', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(39, 'room', 5, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85', 'Studio Profile Doanh Nhân set đèn kịch tính', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(40, 'room', 6, 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=85', 'Studio Cyclorama Phông Vô Cực Trắng', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(41, 'room', 7, 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=85', 'Studio Vườn Hoa Địa Đàng rực rỡ', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(42, 'room', 8, 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85', 'Studio Không Gian Indochine hoài niệm Á Đông', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(43, 'room', 9, 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=85', 'Studio Baby & Trẻ Em Ngộ Nghĩnh an toàn', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(44, 'room', 10, 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=85', 'Studio Cyberpunk & Neon Tương Lai', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(45, 'room', 11, 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=85', 'Studio Bohemian Du Mục Hoang Dã', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(46, 'room', 12, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85', 'Studio Tết Cổ Truyền sắc xuân rực rỡ', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(47, 'room', 13, 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85', 'Studio Bàn Tròn Văn Phòng Thương Mại', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(48, 'room', 14, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85', 'Studio Nghệ Thuật Phông Tối High-Contrast', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(49, 'background', 1, 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=85', 'Bối cảnh không gian chụp #1', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(50, 'background', 2, 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=85', 'Bối cảnh không gian chụp #2', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(51, 'background', 3, 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=85', 'Bối cảnh không gian chụp #3', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(52, 'background', 4, 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=85', 'Bối cảnh không gian chụp #4', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(53, 'background', 5, 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=85', 'Bối cảnh không gian chụp #5', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(54, 'background', 6, 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=85', 'Bối cảnh không gian chụp #6', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(55, 'background', 7, 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=85', 'Bối cảnh không gian chụp #7', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(56, 'background', 8, 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=85', 'Bối cảnh không gian chụp #8', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(57, 'background', 9, 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=85', 'Bối cảnh không gian chụp #9', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(58, 'background', 10, 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=85', 'Bối cảnh không gian chụp #10', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(59, 'background', 11, 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=85', 'Bối cảnh không gian chụp #11', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(60, 'background', 12, 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=85', 'Bối cảnh không gian chụp #12', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(61, 'background', 13, 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=85', 'Bối cảnh không gian chụp #13', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(62, 'background', 14, 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=85', 'Bối cảnh không gian chụp #14', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(63, 'clothing', 1, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80', 'Trang phục thời trang #1', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(64, 'clothing', 2, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80', 'Trang phục thời trang #2', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(65, 'clothing', 3, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80', 'Trang phục thời trang #3', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(66, 'clothing', 4, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80', 'Trang phục thời trang #4', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(67, 'clothing', 5, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80', 'Trang phục thời trang #5', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(68, 'clothing', 6, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80', 'Trang phục thời trang #6', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(69, 'clothing', 7, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80', 'Trang phục thời trang #7', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(70, 'clothing', 8, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80', 'Trang phục thời trang #8', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(71, 'clothing', 9, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80', 'Trang phục thời trang #9', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(72, 'clothing', 10, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80', 'Trang phục thời trang #10', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(73, 'clothing', 11, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80', 'Trang phục thời trang #11', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(74, 'clothing', 12, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80', 'Trang phục thời trang #12', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(75, 'clothing', 13, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80', 'Trang phục thời trang #13', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(76, 'clothing', 14, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80', 'Trang phục thời trang #14', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(77, 'clothing', 15, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80', 'Trang phục thời trang #15', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(78, 'clothing', 16, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80', 'Trang phục thời trang #16', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(79, 'clothing', 17, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80', 'Trang phục thời trang #17', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(80, 'clothing', 18, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80', 'Trang phục thời trang #18', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(81, 'accessory', 1, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', 'Phụ kiện chụp ảnh #1', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(82, 'accessory', 2, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', 'Phụ kiện chụp ảnh #2', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(83, 'accessory', 3, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', 'Phụ kiện chụp ảnh #3', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(84, 'accessory', 4, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', 'Phụ kiện chụp ảnh #4', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(85, 'accessory', 5, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', 'Phụ kiện chụp ảnh #5', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(86, 'accessory', 6, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', 'Phụ kiện chụp ảnh #6', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(87, 'accessory', 7, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', 'Phụ kiện chụp ảnh #7', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(88, 'accessory', 8, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', 'Phụ kiện chụp ảnh #8', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(89, 'accessory', 9, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', 'Phụ kiện chụp ảnh #9', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(90, 'accessory', 10, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', 'Phụ kiện chụp ảnh #10', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(91, 'accessory', 11, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', 'Phụ kiện chụp ảnh #11', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(92, 'accessory', 12, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', 'Phụ kiện chụp ảnh #12', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(93, 'accessory', 13, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', 'Phụ kiện chụp ảnh #13', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(94, 'accessory', 14, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', 'Phụ kiện chụp ảnh #14', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(95, 'accessory', 15, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', 'Phụ kiện chụp ảnh #15', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(96, 'accessory', 16, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', 'Phụ kiện chụp ảnh #16', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(97, 'equipment', 1, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', 'Thiết bị máy ảnh và đèn #1', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(98, 'equipment', 2, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', 'Thiết bị máy ảnh và đèn #2', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(99, 'equipment', 3, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', 'Thiết bị máy ảnh và đèn #3', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(100, 'equipment', 4, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', 'Thiết bị máy ảnh và đèn #4', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(101, 'equipment', 5, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', 'Thiết bị máy ảnh và đèn #5', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(102, 'equipment', 6, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', 'Thiết bị máy ảnh và đèn #6', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(103, 'equipment', 7, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', 'Thiết bị máy ảnh và đèn #7', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(104, 'equipment', 8, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', 'Thiết bị máy ảnh và đèn #8', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(105, 'equipment', 9, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', 'Thiết bị máy ảnh và đèn #9', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(106, 'equipment', 10, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', 'Thiết bị máy ảnh và đèn #10', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(107, 'equipment', 11, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', 'Thiết bị máy ảnh và đèn #11', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(108, 'equipment', 12, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', 'Thiết bị máy ảnh và đèn #12', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(109, 'equipment', 13, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', 'Thiết bị máy ảnh và đèn #13', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(110, 'equipment', 14, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', 'Thiết bị máy ảnh và đèn #14', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(111, 'equipment', 15, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', 'Thiết bị máy ảnh và đèn #15', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(112, 'equipment', 16, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', 'Thiết bị máy ảnh và đèn #16', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(113, 'service', 1, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80', 'Dịch vụ studio #1', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(114, 'service', 2, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80', 'Dịch vụ studio #2', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(115, 'service', 3, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80', 'Dịch vụ studio #3', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(116, 'service', 4, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80', 'Dịch vụ studio #4', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(117, 'service', 5, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80', 'Dịch vụ studio #5', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(118, 'service', 6, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80', 'Dịch vụ studio #6', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(119, 'service', 7, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80', 'Dịch vụ studio #7', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(120, 'service', 8, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80', 'Dịch vụ studio #8', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(121, 'service', 9, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80', 'Dịch vụ studio #9', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(122, 'service', 10, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80', 'Dịch vụ studio #10', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(123, 'service', 11, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80', 'Dịch vụ studio #11', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(124, 'service', 12, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80', 'Dịch vụ studio #12', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(125, 'service', 13, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80', 'Dịch vụ studio #13', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(126, 'service', 14, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80', 'Dịch vụ studio #14', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(127, 'service', 15, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80', 'Dịch vụ studio #15', 1, '2026-10-01 08:00:00', '2026-10-01 08:00:00');

-- Dumping structure for table photo_studio.notifications
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính',
  `user_id` bigint NOT NULL COMMENT 'FK - users (Người nhận thông báo)',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tiêu đề thông báo',
  `message` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nội dung thông báo',
  `type` enum('booking','payment','employee_assignment','equipment','system') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Loại thông báo',
  `read_at` datetime DEFAULT NULL COMMENT 'Thời gian người dùng đã đọc thông báo',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo thông báo',
  PRIMARY KEY (`id`),
  KEY `fk_notifications_user` (`user_id`),
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý thông báo gửi đến người dùng';

-- Dumping data for table photo_studio.notifications: ~16 rows (approximately)
REPLACE INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `read_at`, `created_at`) VALUES
	(1, 2, 'Nhiệm vụ ca chụp mới', 'Admin đã phân công bạn vào đơn đặt lịch #31 (Studio Seoul Minimalism Pastel) lúc 15:00 - 17:00 ngày 2026-11-01', 'employee_assignment', '2026-11-01 14:05:00', '2026-11-01 14:04:55'),
	(2, 2, 'Nhiệm vụ ca chụp mới', 'Bạn được phân công vào ca chụp #17 (Studio Cung Điện & Cổ Điển Hoàng Gia) ngày 2026-11-03', 'employee_assignment', NULL, '2026-11-01 10:00:00'),
	(3, 2, 'Phiếu lương tháng 10 đã được duyệt', 'Quản trị viên đã duyệt phiếu lương tháng 10/2026 của bạn với tổng thực nhận 9.000.000 đ', 'system', '2026-11-01 09:15:00', '2026-11-01 09:00:00'),
	(4, 3, 'Đặt lịch thành công', 'Đơn đặt lịch chụp ảnh #31 của bạn đã được xác nhận thành công sau khi đặt cọc', 'booking', '2026-11-01 14:10:00', '2026-11-01 14:02:00'),
	(5, 3, 'Thanh toán đặt cọc thành công', 'Bạn đã thanh toán thành công 1.495.000 đ tiền cọc qua cổng VNPay Sandbox', 'payment', '2026-11-01 14:05:00', '2026-11-01 14:01:15'),
	(6, 1, 'Đơn đặt lịch mới cần duyệt', 'Khách hàng Lê Hoàng Khách Hàng vừa đặt lịch chụp đơn #31 qua cổng trực tuyến', 'booking', '2026-11-01 14:02:00', '2026-11-01 14:01:20'),
	(7, 1, 'Giao dịch thanh toán mới', 'Nhận 1.495.000 đ cọc đơn #31 qua cổng VNPay (Mã GD: #15721512)', 'payment', '2026-11-01 14:02:00', '2026-11-01 14:01:25'),
	(8, 4, 'Nhiệm vụ ca chụp mới', 'Bạn được phân công hỗ trợ buổi chụp lookbook #11 phòng Cyclorama', 'employee_assignment', '2026-10-30 08:00:00', '2026-10-30 07:30:00'),
	(9, 5, 'Lịch trang điểm cô dâu', 'Bạn có ca makeup cô dâu gói Luxury #7 lúc 08:00 ngày 2026-10-25', 'employee_assignment', '2026-10-24 17:00:00', '2026-10-24 16:30:00'),
	(10, 1, 'Cảnh báo bảo trì thiết bị', 'Đèn Godox AD600 Pro (SN-LIGHT-600P-07) cần kiểm tra bóng flash định kỳ', 'equipment', '2026-10-28 10:00:00', '2026-10-28 09:00:00'),
	(11, 16, 'Nhắc lịch chụp ảnh gia đình', 'Lịch chụp của gia đình bạn sẽ diễn ra lúc 09:30 ngày mai tại Studio VIP', 'booking', '2026-10-14 18:00:00', '2026-10-14 17:00:00'),
	(12, 17, 'Đã cập nhật ảnh chỉnh sửa', 'Bộ ảnh Nàng Thơ của bạn đã hoàn thành retouch, mời bạn kiểm tra link Drive', 'system', '2026-10-28 15:00:00', '2026-10-28 14:30:00'),
	(13, 1, 'Đánh giá 5 sao mới từ khách hàng', 'Khách hàng vừa để lại đánh giá 5 sao cho gói chụp ảnh cưới studio', 'system', '2026-10-12 08:30:00', '2026-10-11 16:50:00'),
	(14, 2, 'Đánh giá nhân viên xuất sắc', 'Bạn vừa nhận được đánh giá 5 sao từ khách hàng trong ca chụp cưới #1', 'employee_assignment', '2026-10-12 09:00:00', '2026-10-11 16:55:00'),
	(15, 3, 'Khảo sát dịch vụ PhotoStudio', 'Cảm ơn bạn đã trải nghiệm dịch vụ. Mời bạn để lại đánh giá để nhận voucher 10%', 'system', NULL, '2026-11-01 18:00:00'),
	(16, 1, 'Tin nhắn liên hệ mới từ khách hàng', 'Có 5 tin nhắn tư vấn dịch vụ mới đang chờ quản trị viên phản hồi', 'system', NULL, '2026-11-02 08:30:00');

-- Dumping structure for table photo_studio.packages
CREATE TABLE IF NOT EXISTS `packages` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên gói chụp',
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mô tả gói chụp',
  `duration` int NOT NULL DEFAULT '0' COMMENT 'Thời lượng dự kiến toàn bộ gói chụp (phút)',
  `price` double NOT NULL DEFAULT '0' COMMENT 'Giá gói chụp',
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active' COMMENT 'Trạng thái gói chụp',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo gói chụp',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật gói chụp',
  `deleted_at` datetime DEFAULT NULL COMMENT 'Thời điểm đưa gói chụp vào thùng rác',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý danh mục gói chụp ảnh';

-- Dumping data for table photo_studio.packages: ~16 rows (approximately)
REPLACE INTO `packages` (`id`, `name`, `description`, `duration`, `price`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'Gói Chụp Ảnh Cá Nhân Pastel', 'Chụp studio 60 phút tone Pastel Hàn Quốc, hỗ trợ 1 set trang phục Vintage, makeup cơ bản và retouch 15 ảnh chuyên sâu', 60, 990000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(7, 'Gói Chụp Nàng Thơ & Cổ Trang Áo Dài', 'Chụp 90 phút với bối cảnh phố cổ và vườn hoa, hỗ trợ áo dài tơ tằm thêu tay hoặc cổ phục Việt, làm tóc và trâm cài truyền thống', 90, 1690000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(11, 'Gói Chụp Beauty & Makeup Chân Dung Cá Nhân', 'Tập trung cận cảnh thần thái, layout makeup cao cấp chuẩn beauty queen, hỗ trợ hoa tươi và retouch da đa tầng chuẩn quốc tế', 75, 1390000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(12, 'Gói Chụp Chân Dung Profile Nghệ Sĩ', 'Dành riêng cho ca sĩ, diễn viên, người mẫu với set ánh sáng drama điện ảnh, 2 phong cách tạo hình cá tính và bàn giao file gốc ngay', 80, 1590000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(2, 'Gói Chụp Ảnh Cưới Studio Hàn Quốc', 'Chụp 120 phút với 2 bối cảnh Cung Điện & Cổ Điển, 1 váy cưới ren Pháp, 1 tuxedo nam cao cấp, makeup cô dâu và tặng album mini 15x21', 120, 2990000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(4, 'Gói Chụp Cưới Luxury & Ngoại Cảnh VIP', 'Trải nghiệm đẳng cấp 240 phút kết hợp studio và ngoại cảnh hoàng hôn, 3 bộ trang phục cao cấp, 2 layout makeup, ekip riêng và album photobook 30x30', 240, 5990000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(9, 'Gói Chụp Cưới Hoàng Gia Cổ Điển Châu Âu', 'Không gian vòm hoa lộng lẫy phong cách châu Âu, váy cưới đuôi dài đính pha lê Swarovski, ekip riêng phục vụ tận tình và video hậu trường 4K', 150, 4200000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(10, 'Gói Chụp Couple Lãng Mạn & Hẹn Hò Đôi', 'Chụp 90 phút ghi lại câu chuyện tình yêu ngọt ngào, 2 trang phục tự chọn trẻ trung, đạo cụ hoa tươi và bánh kem lãng mạn', 90, 1890000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(3, 'Gói Chụp Ảnh Gia Đình / Nhóm Bạn', 'Chụp phòng lớn VIP đa năng trong 90 phút cho nhóm 4-8 thành viên, đạo cụ sofa cổ điển, bàn giao toàn bộ file gốc và chỉnh sửa 25 ảnh', 90, 1890000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(5, 'Gói Chụp Kỷ Yếu & Nhóm Bạn Tốt Nghiệp', 'Dành cho học sinh sinh viên cá nhân hoặc nhóm bạn 2-6 người, chụp 90 phút với phông màu tự động, phụ kiện bằng tốt nghiệp và hoa tươi', 90, 1490000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(13, 'Gói Chụp Kỷ Niệm Ngày Cưới Gia Đình', 'Tái hiện khoảnh khắc hạnh phúc cho ba mẹ và con cháu, hỗ trợ vest chú rể, áo cưới mẹ, trang điểm trọn gói và tặng ảnh phóng lớn ép gỗ 60x90', 120, 2490000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(14, 'Gói Chụp Gia Đình Nhỏ & Em Bé Baby', 'Không gian studio ấm cúng khử khuẩn an toàn, đạo cụ nôi và đồ chơi ngộ nghĩnh, kiên nhẫn bắt trọn từng nụ cười ngây thơ của bé', 90, 1790000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(6, 'Gói Chụp Doanh Nhân & Profile Thương Hiệu', 'Chụp ảnh chân dung lãnh đạo, profile doanh nghiệp chuẩn tạp chí Forbes trong 60 phút, set ánh sáng kịch tính Rembrandt và retouch da tự nhiên', 60, 1290000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(8, 'Gói Chụp Lookbook Thời Trang & Sản Phẩm', 'Dành cho nhà thiết kế và shop thời trang, chụp 120 phút không giới hạn số lượng mẫu trang phục, màn hình live-view tức thì và kỹ thuật viên hỗ trợ', 120, 2490000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(15, 'Gói Chụp Sự Kiện Doanh Nghiệp & Event', 'Ghi lại toàn bộ diễn biến hội nghị, tiệc gala, lễ ký kết với 2 góc máy chuyên nghiệp, truyền file ảnh nhanh trong sự kiện phục vụ truyền thông', 180, 3500000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(16, 'Gói Chụp Lookbook BST Thời Trang Cao Cấp', 'Ekip chuyên nghiệp gồm 1 photographer chính, 1 trợ lý ánh sáng, hỗ trợ stylist và hậu kỳ màu sắc chuẩn catalog quốc tế', 180, 4800000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL);

-- Dumping structure for table photo_studio.package_accessories
CREATE TABLE IF NOT EXISTS `package_accessories` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính',
  `package_id` bigint NOT NULL COMMENT 'FK - packages',
  `accessory_id` bigint NOT NULL COMMENT 'FK - accessories',
  `quantity` int NOT NULL DEFAULT '1' COMMENT 'Số lượng phụ kiện trong gói',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_package_accessory` (`package_id`,`accessory_id`),
  KEY `fk_pa_accessory` (`accessory_id`),
  CONSTRAINT `fk_pa_accessory` FOREIGN KEY (`accessory_id`) REFERENCES `accessories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_pa_package` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Phụ kiện được bao gồm trong từng gói chụp';

-- Dumping data for table photo_studio.package_accessories: ~27 rows (approximately)
REPLACE INTO `package_accessories` (`id`, `package_id`, `accessory_id`, `quantity`) VALUES
	(1, 1, 1, 1),
	(2, 2, 2, 1),
	(3, 2, 3, 1),
	(4, 3, 4, 1),
	(5, 4, 2, 1),
	(6, 4, 3, 1),
	(7, 4, 9, 1),
	(8, 5, 4, 1),
	(9, 5, 5, 1),
	(10, 6, 6, 1),
	(11, 7, 7, 1),
	(12, 7, 10, 1),
	(13, 8, 8, 1),
	(14, 8, 14, 1),
	(15, 9, 2, 1),
	(16, 9, 9, 1),
	(17, 10, 1, 1),
	(18, 10, 12, 1),
	(19, 11, 1, 1),
	(20, 11, 15, 1),
	(21, 12, 6, 1),
	(22, 13, 3, 1),
	(23, 14, 4, 1),
	(24, 14, 16, 1),
	(25, 15, 6, 1),
	(26, 16, 8, 1),
	(27, 16, 14, 1);

-- Dumping structure for table photo_studio.package_backgrounds
CREATE TABLE IF NOT EXISTS `package_backgrounds` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính',
  `package_id` bigint NOT NULL COMMENT 'FK - packages',
  `background_id` bigint NOT NULL COMMENT 'FK - backgrounds',
  PRIMARY KEY (`id`),
  KEY `fk_pb_package` (`package_id`),
  KEY `fk_pb_background` (`background_id`),
  CONSTRAINT `fk_pb_background` FOREIGN KEY (`background_id`) REFERENCES `backgrounds` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_pb_package` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chi tiết bối cảnh áp dụng cho gói chụp';

-- Dumping data for table photo_studio.package_backgrounds: ~26 rows (approximately)
REPLACE INTO `package_backgrounds` (`id`, `package_id`, `background_id`) VALUES
	(1, 1, 1),
	(2, 2, 2),
	(3, 2, 3),
	(4, 3, 4),
	(5, 4, 2),
	(6, 4, 3),
	(7, 4, 10),
	(8, 5, 1),
	(9, 5, 6),
	(10, 6, 5),
	(11, 7, 5),
	(12, 7, 7),
	(13, 7, 8),
	(14, 8, 6),
	(15, 9, 3),
	(16, 10, 1),
	(17, 10, 10),
	(18, 11, 1),
	(19, 11, 7),
	(20, 12, 14),
	(21, 13, 4),
	(22, 14, 4),
	(23, 14, 9),
	(24, 15, 13),
	(25, 16, 6),
	(26, 16, 11);

-- Dumping structure for table photo_studio.package_clothes
CREATE TABLE IF NOT EXISTS `package_clothes` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính',
  `package_id` bigint NOT NULL COMMENT 'FK - packages',
  `cloth_id` bigint NOT NULL COMMENT 'FK - clothes',
  `quantity` int NOT NULL DEFAULT '1' COMMENT 'Số lượng trang phục trong gói',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_package_cloth` (`package_id`,`cloth_id`),
  KEY `fk_pc_cloth` (`cloth_id`),
  CONSTRAINT `fk_pc_cloth` FOREIGN KEY (`cloth_id`) REFERENCES `clothes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_pc_package` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Trang phục được bao gồm trong từng gói chụp';

-- Dumping data for table photo_studio.package_clothes: ~27 rows (approximately)
REPLACE INTO `package_clothes` (`id`, `package_id`, `cloth_id`, `quantity`) VALUES
	(1, 1, 1, 1),
	(2, 2, 2, 1),
	(3, 2, 3, 1),
	(4, 3, 4, 1),
	(5, 4, 2, 1),
	(6, 4, 3, 1),
	(7, 4, 10, 1),
	(8, 5, 5, 1),
	(9, 5, 12, 1),
	(10, 6, 6, 1),
	(11, 7, 7, 1),
	(12, 7, 8, 1),
	(13, 8, 9, 1),
	(14, 9, 2, 1),
	(15, 9, 16, 1),
	(16, 10, 1, 1),
	(17, 10, 6, 1),
	(18, 11, 1, 1),
	(19, 12, 7, 1),
	(20, 12, 11, 1),
	(21, 13, 2, 1),
	(22, 13, 3, 1),
	(23, 14, 4, 1),
	(24, 14, 18, 1),
	(25, 15, 6, 1),
	(26, 16, 9, 1),
	(27, 16, 13, 1);

-- Dumping structure for table photo_studio.package_equipments
CREATE TABLE IF NOT EXISTS `package_equipments` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính',
  `package_id` bigint NOT NULL COMMENT 'FK - packages',
  `equipment_type` enum('camera','lens','lighting','tripod','other') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Loại thiết bị yêu cầu cho gói chụp',
  `quantity` int NOT NULL DEFAULT '1' COMMENT 'Số lượng thiết bị trong gói chụp',
  PRIMARY KEY (`id`),
  KEY `fk_pe_package` (`package_id`),
  CONSTRAINT `fk_pe_package` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Yêu cầu thiết bị tối thiểu cho gói chụp';

-- Dumping data for table photo_studio.package_equipments: ~51 rows (approximately)
REPLACE INTO `package_equipments` (`id`, `package_id`, `equipment_type`, `quantity`) VALUES
	(1, 1, 'camera', 1),
	(2, 1, 'lens', 1),
	(3, 1, 'lighting', 2),
	(4, 2, 'camera', 1),
	(5, 2, 'lens', 2),
	(6, 2, 'lighting', 2),
	(7, 3, 'camera', 1),
	(8, 3, 'lens', 1),
	(9, 3, 'lighting', 2),
	(10, 4, 'camera', 2),
	(11, 4, 'lens', 2),
	(12, 4, 'lighting', 3),
	(13, 4, 'tripod', 1),
	(14, 5, 'camera', 1),
	(15, 5, 'lens', 1),
	(16, 5, 'lighting', 2),
	(17, 6, 'camera', 1),
	(18, 6, 'lens', 1),
	(19, 6, 'lighting', 2),
	(20, 7, 'camera', 1),
	(21, 7, 'lens', 1),
	(22, 7, 'lighting', 2),
	(23, 8, 'camera', 1),
	(24, 8, 'lens', 2),
	(25, 8, 'lighting', 3),
	(26, 8, 'other', 1),
	(27, 9, 'camera', 1),
	(28, 9, 'lens', 2),
	(29, 9, 'lighting', 3),
	(30, 10, 'camera', 1),
	(31, 10, 'lens', 1),
	(32, 10, 'lighting', 2),
	(33, 11, 'camera', 1),
	(34, 11, 'lens', 1),
	(35, 11, 'lighting', 3),
	(36, 12, 'camera', 1),
	(37, 12, 'lens', 2),
	(38, 12, 'lighting', 3),
	(39, 13, 'camera', 1),
	(40, 13, 'lens', 1),
	(41, 13, 'lighting', 2),
	(42, 14, 'camera', 1),
	(43, 14, 'lens', 1),
	(44, 14, 'lighting', 2),
	(45, 15, 'camera', 2),
	(46, 15, 'lens', 2),
	(47, 15, 'lighting', 2),
	(48, 15, 'other', 1),
	(49, 16, 'camera', 1),
	(50, 16, 'lens', 2),
	(51, 16, 'lighting', 4);

-- Dumping structure for table photo_studio.package_services
CREATE TABLE IF NOT EXISTS `package_services` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính',
  `package_id` bigint NOT NULL COMMENT 'FK - packages',
  `service_id` bigint NOT NULL COMMENT 'FK - services',
  `quantity` int NOT NULL DEFAULT '1' COMMENT 'Số lượng dịch vụ trong gói chụp',
  PRIMARY KEY (`id`),
  KEY `fk_ps_package` (`package_id`),
  KEY `fk_ps_service` (`service_id`),
  CONSTRAINT `fk_ps_package` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ps_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chi tiết dịch vụ đi kèm trong gói chụp';

-- Dumping data for table photo_studio.package_services: ~31 rows (approximately)
REPLACE INTO `package_services` (`id`, `package_id`, `service_id`, `quantity`) VALUES
	(1, 1, 2, 1),
	(2, 2, 1, 1),
	(3, 2, 3, 1),
	(4, 3, 2, 1),
	(5, 3, 11, 1),
	(6, 4, 1, 1),
	(7, 4, 3, 1),
	(8, 4, 5, 1),
	(9, 5, 2, 1),
	(10, 5, 9, 1),
	(11, 6, 2, 1),
	(12, 6, 15, 1),
	(13, 7, 9, 1),
	(14, 7, 10, 1),
	(15, 8, 2, 1),
	(16, 8, 12, 1),
	(17, 9, 1, 1),
	(18, 9, 3, 1),
	(19, 10, 2, 1),
	(20, 10, 9, 1),
	(21, 11, 1, 1),
	(22, 11, 2, 1),
	(23, 12, 2, 1),
	(24, 12, 13, 1),
	(25, 13, 1, 1),
	(26, 13, 11, 1),
	(27, 14, 2, 1),
	(28, 15, 5, 1),
	(29, 15, 12, 1),
	(30, 16, 2, 1),
	(31, 16, 5, 1);

-- Dumping structure for table photo_studio.payments
CREATE TABLE IF NOT EXISTS `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính',
  `booking_id` bigint NOT NULL COMMENT 'FK - bookings (1 booking có thể có nhiều lần thanh toán/đặt cọc)',
  `payment_method` enum('cash','vnpay','credit_card') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Phương thức thanh toán',
  `amount` double NOT NULL DEFAULT '0' COMMENT 'Số tiền thanh toán',
  `paid_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm thanh toán',
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ghi chú thanh toán',
  `status` enum('pending','deposit_30','deposit_50','paid') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending' COMMENT 'Tiến độ thanh toán',
  PRIMARY KEY (`id`),
  KEY `fk_payments_booking` (`booking_id`),
  CONSTRAINT `fk_payments_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý giao dịch thanh toán của đơn đặt lịch';

-- Dumping data for table photo_studio.payments: ~22 rows (approximately)
REPLACE INTO `payments` (`id`, `booking_id`, `payment_method`, `amount`, `paid_at`, `note`, `status`) VALUES
	(1, 31, 'vnpay', 1495000, '2026-11-01 14:01:11', 'VNPay Sandbox GD #15721512 (Cọc 50%)', 'deposit_50'),
	(2, 32, 'vnpay', 297000, '2026-11-01 14:08:33', 'VNPay Sandbox GD #15721514 (Cọc 30%)', 'deposit_30'),
	(3, 1, 'credit_card', 2990000, '2026-10-10 11:15:00', 'Thanh toán toàn bộ gói chụp cưới qua thẻ Visa', 'paid'),
	(4, 2, 'cash', 990000, '2026-10-12 15:35:00', 'Thanh toán tiền mặt tại quầy thu ngân', 'paid'),
	(5, 3, 'vnpay', 1890000, '2026-10-15 11:40:00', 'VNPay QR hoàn tất đơn chụp gia đình', 'paid'),
	(6, 4, 'credit_card', 1290000, '2026-10-18 11:45:00', 'Thanh toán thẻ Master gói profile doanh nhân', 'paid'),
	(7, 5, 'cash', 1690000, '2026-10-20 16:40:00', 'Thanh toán tiền mặt tại studio', 'paid'),
	(8, 6, 'vnpay', 1490000, '2026-10-22 15:40:00', 'Chuyển khoản thanh toán gói kỷ yếu nhóm', 'paid'),
	(9, 7, 'vnpay', 5990000, '2026-10-25 12:45:00', 'Thanh toán trọn gói cưới Luxury & Ngoại cảnh VIP', 'paid'),
	(10, 8, 'cash', 1390000, '2026-10-26 11:40:00', 'Tiền mặt thanh toán gói beauty cá nhân', 'paid'),
	(11, 9, 'credit_card', 1590000, '2026-10-28 15:40:00', 'Quẹt thẻ gói chân dung profile nghệ sĩ', 'paid'),
	(12, 10, 'vnpay', 2490000, '2026-10-29 11:10:00', 'Thanh toán trực tuyến VNPay gói kỷ niệm ngày cưới', 'paid'),
	(13, 11, 'credit_card', 2490000, '2026-10-30 15:15:00', 'Thanh toán thẻ công ty cho gói lookbook thời trang', 'paid'),
	(14, 12, 'cash', 990000, '2026-10-31 11:10:00', 'Tiền mặt tại quầy', 'paid'),
	(15, 13, 'cash', 1790000, '2026-11-01 10:45:00', 'Thanh toán gói em bé baby', 'paid'),
	(16, 14, 'vnpay', 1890000, '2026-11-01 15:45:00', 'VNPay hoàn tất gói couple đôi', 'paid'),
	(17, 17, 'vnpay', 2100000, '2026-10-31 10:15:00', 'Đặt cọc 50% gói cưới hoàng gia châu Âu', 'deposit_50'),
	(18, 19, 'vnpay', 567000, '2026-11-01 08:30:00', 'Đặt cọc 30% gói chụp gia đình', 'deposit_30'),
	(19, 20, 'credit_card', 2400000, '2026-11-01 09:15:00', 'Đặt cọc 50% gói BST thời trang cao cấp', 'deposit_50'),
	(20, 22, 'credit_card', 1750000, '2026-11-01 11:30:00', 'Đặt cọc 50% sự kiện doanh nghiệp', 'deposit_50'),
	(21, 24, 'vnpay', 897000, '2026-11-01 13:15:00', 'Đặt cọc 30% gói cưới Hàn Quốc', 'deposit_30'),
	(22, 35, 'vnpay', 417000, '2026-11-01 16:30:00', 'Đặt cọc 30% gói beauty chân dung cá nhân', 'deposit_30');

-- Dumping structure for table photo_studio.reviews
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính',
  `booking_id` bigint NOT NULL COMMENT 'FK - bookings (1 booking chỉ có tối đa 1 bài đánh giá)',
  `customer_id` bigint NOT NULL COMMENT 'FK - users (Khách hàng đánh giá)',
  `rating` double NOT NULL DEFAULT '5' COMMENT 'Số sao đánh giá (ví dụ: 1.0 - 5.0)',
  `comment` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Bình luận nhận xét của khách hàng',
  `admin_reply` text COLLATE utf8mb4_unicode_ci COMMENT 'Phản hồi của quản trị viên',
  `admin_replied_at` datetime DEFAULT NULL COMMENT 'Thời điểm quản trị viên phản hồi',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo đánh giá',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày sửa bài đánh giá',
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_id` (`booking_id`),
  KEY `fk_reviews_customer` (`customer_id`),
  CONSTRAINT `fk_reviews_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_reviews_customer` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý đánh giá buổi chụp của khách hàng';

-- Dumping data for table photo_studio.reviews: ~34 rows (approximately)
REPLACE INTO `reviews` (`id`, `booking_id`, `customer_id`, `rating`, `comment`, `admin_reply`, `admin_replied_at`, `created_at`, `updated_at`) VALUES
	(1, 1, 3, 5, 'Ekip chụp ảnh cưới có tâm nhất mình từng trải nghiệm! Bạn photographer hướng dẫn tạo dáng rất tự nhiên, cô dâu không bị gượng gạo. Makeup bạn Tiên làm nhẹ nhàng trong trẻo đúng style Hàn Quốc mình thích. Ảnh nhận về đẹp lung linh!', 'PhotoStudio chân thành cảm ơn bạn đã tin tưởng trao gửi ngày trọng đại!', '2026-10-12 09:00:00', '2026-10-11 16:45:00', '2026-10-12 09:00:00'),
	(2, 2, 3, 5, 'Mình chụp gói Nàng Thơ kỷ niệm sinh nhật. Phòng studio ánh sáng dịu mắt, váy áo sạch sẽ thơm tho. Bộ ảnh nhận về bạn bè ai cũng khen nức nở. Chắc chắn sẽ quay lại ủng hộ studio nhiều lần nữa!', 'Cảm ơn bạn! Chúc bạn tuổi mới luôn rạng ngời và xinh đẹp nhé!', '2026-10-14 10:00:00', '2026-10-13 11:20:00', '2026-10-14 10:00:00'),
	(3, 3, 16, 5, 'Gia đình mình có cả ông bà và 2 bé nhỏ, lúc đầu sợ các cháu quấy khóc nhưng ekip rất kiên nhẫn và vui tính, bắt trọn từng khoảnh khắc cười tươi tự nhiên của cả nhà. Ảnh in ép gỗ treo phòng khách tuyệt đẹp!', 'Studio rất vinh hạnh được lưu giữ kỷ niệm đầm ấm của cả gia đình!', '2026-10-17 08:30:00', '2026-10-16 17:30:00', '2026-10-17 08:30:00'),
	(4, 4, 21, 5, 'Dịch vụ chụp ảnh profile doanh nhân cực kỳ chuyên nghiệp. Photographer hiểu rất rõ về góc mặt và thần thái lãnh đạo, set đèn kịch tính chuẩn Forbes. Khâu retouch tự nhiên không làm mất nét mặt.', NULL, NULL, '2026-10-19 14:15:00', '2026-10-19 14:15:00'),
	(5, 5, 20, 5, 'Bộ ảnh cổ trang vượt ngoài mong đợi! Trang phục áo dài tơ tằm và cổ phục thêu tay rất tỉ mỉ, trâm cài tóc tinh xảo. Góc phố cổ rêu phong tại studio chụp lên như đang ở Hội An thật vậy.', NULL, NULL, '2026-10-21 10:50:00', '2026-10-21 10:50:00'),
	(6, 6, 22, 5, 'Cả nhóm 6 đứa tụi mình đi chụp kỷ yếu quậy tưng bừng. Các anh chị studio hỗ trợ nhiệt tình, phông nền màu sắc trẻ trung. Nhận file ngay trong ngày để đăng Facebook sống ảo siêu thích!', NULL, NULL, '2026-10-23 09:30:00', '2026-10-23 09:30:00'),
	(7, 7, 3, 5, 'Gói Luxury ngoại cảnh và studio xứng đáng từng xu! Ekip riêng phục vụ chu đáo từ xe cộ, nước uống đến chỉnh từng nếp váy. Bộ album cưới 30x30 in màu chuẩn xác, bìa da sang trọng.', 'Cảm ơn hai bạn đã chọn PhotoStudio làm người đồng hành!', '2026-10-26 15:00:00', '2026-10-26 14:00:00', '2026-10-26 15:00:00'),
	(8, 8, 17, 5, 'Layout trang điểm beauty của bạn Tiên quá đỉnh, tôn sống mũi và đôi mắt long lanh. Ảnh chụp cận cảnh không hề vỡ nét.', NULL, NULL, '2026-10-27 10:20:00', '2026-10-27 10:20:00'),
	(9, 9, 18, 5, 'Chụp profile làm hồ sơ nghệ sĩ rất ưng ý. Ánh sáng studio cao cấp bắt trọn chiều sâu đôi mắt.', NULL, NULL, '2026-10-29 11:45:00', '2026-10-29 11:45:00'),
	(10, 10, 19, 5, 'Kỷ niệm 10 năm ngày cưới của ba mẹ mình. Ba mẹ rất vui và khen studio chu đáo, vest và áo cưới mẹ đều vừa vặn.', NULL, NULL, '2026-10-30 16:30:00', '2026-10-30 16:30:00'),
	(11, 11, 23, 5, 'Shop mình chụp bộ sưu tập lookbook mùa đông tại đây. Màn hình live-view kiểm tra màu tức thì giúp duyệt mẫu nhanh.', NULL, NULL, '2026-10-31 16:00:00', '2026-10-31 16:00:00'),
	(12, 12, 24, 5, 'Studio trang trí hoa tươi xinh xắn, bạn photographer kiên nhẫn chỉ từng cách đặt tay, nghiêng đầu.', NULL, NULL, '2026-11-01 10:15:00', '2026-11-01 10:15:00'),
	(13, 13, 25, 5, 'Bé nhà mình 8 tháng tuổi rất nhát người lạ nhưng vào studio chơi đồ chơi vui vẻ, các cô chú hỗ trợ dỗ bé chụp được bao nhiêu khoảnh khắc cười tít mắt.', NULL, NULL, '2026-11-01 12:30:00', '2026-11-01 12:30:00'),
	(14, 14, 26, 5, 'Bộ ảnh couple dễ thương xỉu! Đạo cụ bánh kem và hoa tươi studio chuẩn bị sẵn chu đáo.', NULL, NULL, '2026-11-01 17:00:00', '2026-11-01 17:00:00'),
	(15, 31, 3, 5, 'Đặt lịch online qua web rất tiện, thanh toán cọc VNPay nhanh chóng. Đến chụp đúng giờ không phải chờ đợi lâu.', NULL, NULL, '2026-11-01 18:00:00', '2026-11-01 18:00:00'),
	(16, 32, 17, 5, 'Trải nghiệm chụp ảnh cá nhân tuyệt vời. Màu ảnh trong trẻo đúng ý.', NULL, NULL, '2026-11-01 19:00:00', '2026-11-01 19:00:00'),
	(17, 1, 16, 5, 'Ánh sáng phòng cưới hoàng gia lộng lẫy, váy cưới đính hạt cườm lấp lánh lên ảnh rất sang.', NULL, NULL, '2026-10-11 18:00:00', '2026-10-11 18:00:00'),
	(18, 2, 17, 4, 'Chất lượng ảnh xuất sắc, studio hơi đông vào cuối tuần nên các bạn nên đặt lịch trước 2-3 ngày.', NULL, NULL, '2026-10-13 14:00:00', '2026-10-13 14:00:00'),
	(19, 3, 18, 5, 'Cả nhà mình ai xem ảnh xong cũng tấm tắc khen. Khung ảnh gỗ chắc chắn, màu sắc ấm áp.', NULL, NULL, '2026-10-16 19:00:00', '2026-10-16 19:00:00'),
	(20, 4, 19, 5, 'Ảnh profile dùng làm avatar Linkedin kết nối được bao nhiêu đối tác quốc tế. Rất đáng đồng tiền.', NULL, NULL, '2026-10-19 16:00:00', '2026-10-19 16:00:00'),
	(21, 5, 20, 5, 'Không gian Indochine cổ kính kết hợp áo dài gấm thêu tay cực kỳ ăn ý.', NULL, NULL, '2026-10-21 14:00:00', '2026-10-21 14:00:00'),
	(22, 6, 21, 5, 'Ảnh tốt nghiệp rõ nét từng gương mặt bạn bè trong lớp, màu sắc tươi tắn năng động.', NULL, NULL, '2026-10-23 11:00:00', '2026-10-23 11:00:00'),
	(23, 7, 22, 5, 'Bộ ảnh ngoại cảnh hoàng hôn bãi đá đẹp như tranh vẽ. Ekip nhiệt tình lăn xả vì nghệ thuật.', NULL, NULL, '2026-10-26 17:00:00', '2026-10-26 17:00:00'),
	(24, 8, 23, 5, 'Makeup tự nhiên che hết khuyết điểm mà da vẫn căng bóng tự nhiên.', NULL, NULL, '2026-10-27 12:00:00', '2026-10-27 12:00:00'),
	(25, 9, 24, 4, 'Thời gian chụp đúng hẹn, phòng thay đồ riêng tư và máy lạnh mát rượi.', NULL, NULL, '2026-10-29 14:00:00', '2026-10-29 14:00:00'),
	(26, 10, 25, 5, 'Ba mẹ mình chụp xong về khen suốt, ekip studio nói chuyện lịch thiệp và lễ phép.', NULL, NULL, '2026-10-30 18:00:00', '2026-10-30 18:00:00'),
	(27, 11, 26, 5, 'Phông vô cực trắng tinh sạch sẽ, ánh sáng đèn công suất lớn giúp màu vải chuẩn xác 100%.', NULL, NULL, '2026-10-31 17:30:00', '2026-10-31 17:30:00'),
	(28, 12, 27, 5, 'Concept hoa pastel ngọt ngào, cảm giác như lạc vào khu vườn thần tiên.', NULL, NULL, '2026-11-01 11:00:00', '2026-11-01 11:00:00'),
	(29, 13, 28, 5, 'Đạo cụ cho bé được khử trùng cẩn thận làm ba mẹ rất yên tâm.', NULL, NULL, '2026-11-01 14:00:00', '2026-11-01 14:00:00'),
	(30, 14, 16, 5, 'Hai đứa mình ngại ống kính lắm mà qua tay anh thợ chụp chỉ dẫn một lúc là có ngay rổ ảnh cười xỉu.', NULL, NULL, '2026-11-01 17:45:00', '2026-11-01 17:45:00'),
	(31, 1, 17, 5, 'Nhân viên tư vấn gói cẩn thận, không chèo kéo phát sinh chi phí ngoài hợp đồng.', NULL, NULL, '2026-10-12 10:00:00', '2026-10-12 10:00:00'),
	(32, 2, 18, 5, 'Retouch ảnh kỹ càng, sửa theo yêu cầu của mình rất nhanh trong 24h.', NULL, NULL, '2026-10-14 11:00:00', '2026-10-14 11:00:00'),
	(33, 3, 19, 5, 'Phòng khách gia đình decor ấm cúng, ghế sofa da ngồi êm ái thoải mái.', NULL, NULL, '2026-10-17 09:30:00', '2026-10-17 09:30:00'),
	(34, 4, 20, 5, 'Set đèn studio hiện đại, ảnh gốc chụp ra đã đẹp sẵn không cần chỉnh sửa nhiều.', NULL, NULL, '2026-10-19 17:30:00', '2026-10-19 17:30:00');

-- Dumping structure for table photo_studio.rooms
CREATE TABLE IF NOT EXISTS `rooms` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên phòng chụp',
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mô tả phòng',
  `capacity` int NOT NULL DEFAULT '1' COMMENT 'Sức chứa tối đa của 1 phòng',
  `status` enum('active','inactive','maintenance') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active' COMMENT 'Trạng thái hoạt động',
  `deleted_at` datetime DEFAULT NULL COMMENT 'Thời điểm đưa phòng chụp vào thùng rác',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý phòng chụp';

-- Dumping data for table photo_studio.rooms: ~14 rows (approximately)
REPLACE INTO `rooms` (`id`, `name`, `description`, `capacity`, `status`, `deleted_at`) VALUES
	(1, 'Studio Seoul Minimalism Pastel', 'Phòng chụp phong cách Hàn Quốc trẻ trung, ánh sáng mềm mại tự nhiên và tone màu kem pastel', 4, 'active', NULL),
	(2, 'Studio Cung Điện & Cổ Điển Hoàng Gia', 'Bối cảnh vòm hoa, đèn chùm pha lê và nội thất quý tộc châu Âu dành riêng cho ảnh cưới', 8, 'active', NULL),
	(3, 'Studio Ánh Sáng Tự Nhiên & Ban Công', 'Cửa sổ kính tràn, rèm voan trắng đón nắng ban mai cho concept nàng thơ trong trẻo', 5, 'active', NULL),
	(4, 'Studio Gia Đình & Đoàn Viên VIP', 'Không gian sofa ấm cúng, decor phòng khách hiện đại cho gia đình và nhóm bạn sum vầy', 12, 'active', NULL),
	(5, 'Phòng Chụp Chân Dung Profile Doanh Nhân', 'Phông màu trung tính, set đèn kịch tính Rembrandt chuẩn tạp chí doanh nghiệp', 4, 'active', NULL),
	(6, 'Studio Cyclorama Phông Vô Cực Trắng', 'Phông cong vô cực khổ lớn chuyên dụng cho chụp lookbook thời trang & sản phẩm', 10, 'active', NULL),
	(7, 'Studio Hoa Tươi & Vườn Địa Đàng', 'Không gian ngập tràn hoa tươi nghệ thuật pastel, concept nàng thơ & beauty ngọt ngào', 6, 'active', NULL),
	(8, 'Studio Không Gian Indochine Đông Dương', 'Nội thất gỗ lim, gạch bông cổ điển và đèn lồng truyền thống đậm chất Á Đông', 6, 'active', NULL),
	(9, 'Studio Baby & Trẻ Em Ngộ Nghĩnh', 'Bối cảnh vui nhộn, đồ chơi an toàn nhiều màu sắc cho bé và ba mẹ ghi lại khoảnh khắc đầu đời', 5, 'active', NULL),
	(10, 'Studio Cyberpunk & Neon Tương Lai', 'Hiệu ứng ánh sáng neon đa sắc, khói màu huyền ảo cho concept cá tính & cosplay', 6, 'active', NULL),
	(11, 'Studio Bohemian Du Mục Hoang Dã', 'Thảm họa tiết thổ cẩm, lều canvas và cây xanh nhiệt đới phóng khoáng', 6, 'active', NULL),
	(12, 'Studio Tết Cổ Truyền & Áo Dài Di Sản', 'Mai đào, câu đối đỏ và góc phố xưa rực rỡ sắc xuân dân tộc', 8, 'active', NULL),
	(13, 'Studio Bàn Tròn & Phòng Họp Thương Mại', 'Bối cảnh văn phòng CEO sang trọng, bàn gỗ óc chó cao cấp', 8, 'active', NULL),
	(14, 'Studio Nghệ Thuật Phông Tối High-Contrast', 'Bối cảnh đen tuyền nghệ thuật nhấn mạnh khối cơ thể và chiều sâu cảm xúc', 4, 'active', NULL);

-- Dumping structure for table photo_studio.salaries
CREATE TABLE IF NOT EXISTS `salaries` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Mã phiếu lương',
  `employee_id` bigint NOT NULL COMMENT 'FK - employees (Nhân viên nhận lương)',
  `month` int NOT NULL COMMENT 'Tháng tính lương (1 - 12)',
  `year` int NOT NULL COMMENT 'Năm tính lương (Ví dụ: 2026)',
  `work_days` int NOT NULL DEFAULT '0' COMMENT 'Số ngày làm việc / tác nghiệp trong tháng',
  `daily_rate` decimal(12,2) NOT NULL DEFAULT '250000.00' COMMENT 'Đơn giá lương ngày công (250.000 đ/ngày)',
  `base_salary` decimal(12,2) NOT NULL DEFAULT '0.00' COMMENT 'Tổng lương cơ bản = work_days * daily_rate',
  `total_shoots` int NOT NULL DEFAULT '0' COMMENT 'Tổng số gói chụp hoàn thành trong tháng',
  `commission_rate` decimal(5,2) NOT NULL DEFAULT '0.10' COMMENT 'Tỷ lệ hoa hồng mặc định (0.10 = 10%)',
  `total_commission` decimal(12,2) NOT NULL DEFAULT '0.00' COMMENT 'Tổng tiền hoa hồng nhận được trên các gói chụp',
  `bonus` decimal(12,2) NOT NULL DEFAULT '0.00' COMMENT 'Tiền thưởng KPI / Thưởng chuyên cần',
  `deduction` decimal(12,2) NOT NULL DEFAULT '0.00' COMMENT 'Các khoản phạt / khấu trừ',
  `net_salary` decimal(12,2) NOT NULL DEFAULT '0.00' COMMENT 'Tổng lương thực nhận = base + commission + bonus - deduction',
  `status` enum('pending','approved','paid') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending' COMMENT 'Trạng thái: pending (Chờ duyệt), approved (Đã duyệt), paid (Đã thanh toán)',
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ghi chú của quản trị viên',
  `paid_at` datetime DEFAULT NULL COMMENT 'Ngày chi trả lương',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_employee_period` (`employee_id`,`month`,`year`),
  CONSTRAINT `fk_salaries_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng quản lý lương nhân viên theo tháng';

-- Dumping data for table photo_studio.salaries: ~16 rows (approximately)
REPLACE INTO `salaries` (`id`, `employee_id`, `month`, `year`, `work_days`, `daily_rate`, `base_salary`, `total_shoots`, `commission_rate`, `total_commission`, `bonus`, `deduction`, `net_salary`, `status`, `note`, `paid_at`, `created_at`, `updated_at`) VALUES
	(1, 1, 10, 2026, 24, 250000, 6000000, 10, 0.1, 2400000, 600000, 0, 9000000, 'paid', 'Hoàn thành xuất sắc 10 ca chụp tháng 10, đạt KPI chuyên cần', '2026-11-01 09:00:00', '2026-10-31 18:00:00', '2026-11-01 09:00:00'),
	(2, 1, 9, 2026, 23, 250000, 5750000, 8, 0.1, 1850000, 400000, 0, 8000000, 'paid', 'Lương tháng 9 đã chuyển khoản VCB', '2026-10-05 10:30:00', '2026-09-30 18:00:00', '2026-10-05 10:30:00'),
	(3, 1, 8, 2026, 24, 250000, 6000000, 9, 0.1, 2100000, 500000, 0, 8600000, 'paid', 'Lương tháng 8 đã thanh toán', '2026-09-05 09:15:00', '2026-08-31 18:00:00', '2026-09-05 09:15:00'),
	(4, 1, 7, 2026, 22, 250000, 5500000, 7, 0.1, 1600000, 300000, 0, 7400000, 'paid', 'Lương tháng 7 đã thanh toán', '2026-08-05 11:00:00', '2026-07-31 18:00:00', '2026-08-05 11:00:00'),
	(5, 1, 11, 2026, 25, 250000, 6250000, 12, 0.1, 2800000, 500000, 0, 9550000, 'approved', 'Bảng lương dự kiến kỳ tháng 11', NULL, '2026-11-01 17:00:00', '2026-11-01 17:00:00'),
	(6, 2, 10, 2026, 22, 250000, 5500000, 7, 0.1, 1750000, 350000, 0, 7600000, 'paid', 'Đạt chỉ tiêu tháng 10', '2026-11-01 10:00:00', '2026-10-31 18:00:00', '2026-11-01 10:00:00'),
	(7, 3, 10, 2026, 22, 200000, 4400000, 8, 0.1, 1450000, 300000, 0, 6150000, 'paid', 'Chuyên viên makeup tháng 10', '2026-11-01 10:30:00', '2026-10-31 18:00:00', '2026-11-01 10:30:00'),
	(8, 4, 10, 2026, 24, 200000, 4800000, 6, 0.1, 950000, 250000, 0, 6000000, 'paid', 'Nhân viên hậu cần thiết bị tháng 10', '2026-11-01 11:00:00', '2026-10-31 18:00:00', '2026-11-01 11:00:00'),
	(9, 5, 10, 2026, 21, 250000, 5250000, 6, 0.1, 1350000, 200000, 0, 6800000, 'paid', 'Nhiếp ảnh gia Vũ Việt Dũng tháng 10', '2026-11-01 11:30:00', '2026-10-31 18:00:00', '2026-11-01 11:30:00'),
	(10, 6, 10, 2026, 20, 200000, 4000000, 5, 0.1, 850000, 200000, 0, 5050000, 'paid', 'Makeup Lê Mai Linh tháng 10', '2026-11-01 12:00:00', '2026-10-31 18:00:00', '2026-11-01 12:00:00'),
	(11, 7, 10, 2026, 22, 250000, 5500000, 6, 0.1, 1500000, 300000, 0, 7300000, 'paid', 'Photographer Phạm Quốc Huy', '2026-11-01 13:00:00', '2026-10-31 18:00:00', '2026-11-01 13:00:00'),
	(12, 8, 10, 2026, 20, 200000, 4000000, 5, 0.1, 800000, 200000, 0, 5000000, 'paid', 'Makeup Nguyễn Thu Hà', '2026-11-01 13:30:00', '2026-10-31 18:00:00', '2026-11-01 13:30:00'),
	(13, 9, 10, 2026, 23, 200000, 4600000, 5, 0.1, 750000, 200000, 0, 5550000, 'paid', 'Logistics Bùi Thanh Tùng', '2026-11-01 14:00:00', '2026-10-31 18:00:00', '2026-11-01 14:00:00'),
	(14, 10, 10, 2026, 21, 250000, 5250000, 5, 0.1, 1200000, 250000, 0, 6700000, 'paid', 'Photographer Trần Đức Nam', '2026-11-01 14:30:00', '2026-10-31 18:00:00', '2026-11-01 14:30:00'),
	(15, 11, 10, 2026, 20, 200000, 4000000, 4, 0.1, 650000, 150000, 0, 4800000, 'paid', 'Makeup Hoàng Kim Ngân', '2026-11-01 15:00:00', '2026-10-31 18:00:00', '2026-11-01 15:00:00'),
	(16, 2, 9, 2026, 22, 250000, 5500000, 6, 0.1, 1400000, 300000, 0, 7200000, 'paid', 'Lương tháng 9 Nguyễn Hoàng Anh', '2026-10-05 11:30:00', '2026-09-30 18:00:00', '2026-10-05 11:30:00');

-- Dumping structure for table photo_studio.salary_commission_details
CREATE TABLE IF NOT EXISTS `salary_commission_details` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Mã chi tiết hoa hồng',
  `salary_id` bigint NOT NULL COMMENT 'FK - salaries (Phiếu lương)',
  `booking_id` bigint NOT NULL COMMENT 'FK - bookings (Buổi chụp tương ứng)',
  `package_id` bigint NOT NULL COMMENT 'Mã gói chụp',
  `package_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên gói chụp đã hoàn thành',
  `package_price` decimal(12,2) NOT NULL COMMENT 'Đơn giá gói chụp (VNĐ)',
  `commission_rate` decimal(5,2) NOT NULL DEFAULT '0.10' COMMENT 'Tỷ lệ hoa hồng (0.10 = 10%)',
  `commission_amount` decimal(12,2) NOT NULL COMMENT 'Tiền hoa hồng nhận được = package_price * commission_rate',
  `shoot_date` date NOT NULL COMMENT 'Ngày chụp thực tế',
  `customer_name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Tên khách hàng đặt gói',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_scd_salary` (`salary_id`),
  KEY `fk_scd_booking` (`booking_id`),
  CONSTRAINT `fk_scd_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_scd_salary` FOREIGN KEY (`salary_id`) REFERENCES `salaries` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng kê hoa hồng chi tiết trên từng gói chụp';

-- Dumping data for table photo_studio.salary_commission_details: ~22 rows (approximately)
REPLACE INTO `salary_commission_details` (`id`, `salary_id`, `booking_id`, `package_id`, `package_name`, `package_price`, `commission_rate`, `commission_amount`, `shoot_date`, `customer_name`, `created_at`) VALUES
	(1, 1, 1, 2, 'Gói Chụp Ảnh Cưới Studio Hàn Quốc', 2990000, 0.1, 299000, '2026-10-10', 'Lê Hoàng Khách Hàng', '2026-10-31 18:00:00'),
	(2, 1, 2, 1, 'Gói Chụp Ảnh Cá Nhân Pastel', 990000, 0.1, 99000, '2026-10-12', 'Lê Hoàng Khách Hàng', '2026-10-31 18:00:00'),
	(3, 1, 3, 3, 'Gói Chụp Ảnh Gia Đình / Nhóm Bạn', 1890000, 0.1, 189000, '2026-10-15', 'Lê Minh Tuấn', '2026-10-31 18:00:00'),
	(4, 1, 4, 6, 'Gói Chụp Doanh Nhân & Profile Thương Hiệu', 1290000, 0.1, 129000, '2026-10-18', 'Đặng Quốc Bảo (CEO TechLab)', '2026-10-31 18:00:00'),
	(5, 1, 5, 7, 'Gói Chụp Nàng Thơ & Cổ Trang Áo Dài', 1690000, 0.1, 169000, '2026-10-20', 'Trần Khánh Huyền', '2026-10-31 18:00:00'),
	(6, 1, 6, 5, 'Gói Chụp Kỷ Yếu & Nhóm Bạn Tốt Nghiệp', 1490000, 0.1, 149000, '2026-10-22', 'Vũ Hoàng Mai', '2026-10-31 18:00:00'),
	(7, 1, 7, 4, 'Gói Chụp Cưới Luxury & Ngoại Cảnh VIP', 5990000, 0.1, 599000, '2026-10-25', 'Lê Hoàng Khách Hàng', '2026-10-31 18:00:00'),
	(8, 1, 8, 11, 'Gói Chụp Beauty & Makeup Chân Dung Cá Nhân', 1390000, 0.1, 139000, '2026-10-26', 'Phạm Phương Linh', '2026-10-31 18:00:00'),
	(9, 1, 9, 12, 'Gói Chụp Chân Dung Profile Nghệ Sĩ', 1590000, 0.1, 159000, '2026-10-28', 'Nguyễn Thu Trang', '2026-10-31 18:00:00'),
	(10, 1, 10, 13, 'Gói Chụp Kỷ Niệm Ngày Cưới Gia Đình', 2490000, 0.1, 249000, '2026-10-29', 'Hoàng Nam', '2026-10-31 18:00:00'),
	(11, 2, 1, 2, 'Gói Chụp Ảnh Cưới Studio Hàn Quốc', 2990000, 0.1, 299000, '2026-09-08', 'Nguyễn Thu Trang', '2026-09-30 18:00:00'),
	(12, 2, 3, 3, 'Gói Chụp Ảnh Gia Đình / Nhóm Bạn', 1890000, 0.1, 189000, '2026-09-14', 'Hoàng Nam', '2026-09-30 18:00:00'),
	(13, 2, 7, 4, 'Gói Chụp Cưới Luxury & Ngoại Cảnh VIP', 5990000, 0.1, 599000, '2026-09-22', 'Trần Khánh Huyền', '2026-09-30 18:00:00'),
	(14, 6, 11, 8, 'Gói Chụp Lookbook Thời Trang & Sản Phẩm', 2490000, 0.1, 249000, '2026-10-30', 'Nguyễn Đức Thắng', '2026-10-31 18:00:00'),
	(15, 6, 12, 1, 'Gói Chụp Ảnh Cá Nhân Pastel', 990000, 0.1, 99000, '2026-10-31', 'Trịnh Bảo Ngọc', '2026-10-31 18:00:00'),
	(16, 7, 1, 2, 'Gói Chụp Ảnh Cưới Studio Hàn Quốc', 2990000, 0.1, 299000, '2026-10-10', 'Lê Hoàng Khách Hàng', '2026-10-31 18:00:00'),
	(17, 7, 5, 7, 'Gói Chụp Nàng Thơ & Cổ Trang Áo Dài', 1690000, 0.1, 169000, '2026-10-20', 'Trần Khánh Huyền', '2026-10-31 18:00:00'),
	(18, 7, 7, 4, 'Gói Chụp Cưới Luxury & Ngoại Cảnh VIP', 5990000, 0.1, 599000, '2026-10-25', 'Lê Hoàng Khách Hàng', '2026-10-31 18:00:00'),
	(19, 9, 13, 14, 'Gói Chụp Gia Đình Nhỏ & Em Bé Baby', 1790000, 0.1, 179000, '2026-11-01', 'Hồ Minh Trí', '2026-10-31 18:00:00'),
	(20, 11, 6, 5, 'Gói Chụp Kỷ Yếu & Nhóm Bạn Tốt Nghiệp', 1490000, 0.1, 149000, '2026-10-22', 'Vũ Hoàng Mai', '2026-10-31 18:00:00'),
	(21, 14, 4, 6, 'Gói Chụp Doanh Nhân & Profile Thương Hiệu', 1290000, 0.1, 129000, '2026-10-18', 'Đặng Quốc Bảo', '2026-10-31 18:00:00'),
	(22, 16, 11, 8, 'Gói Chụp Lookbook Thời Trang & Sản Phẩm', 2490000, 0.1, 249000, '2026-09-25', 'Nguyễn Đức Thắng', '2026-09-30 18:00:00');

-- Dumping structure for table photo_studio.services
CREATE TABLE IF NOT EXISTS `services` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên dịch vụ',
  `type` enum('photography','makeup','clothing','accessory','background') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Loại dịch vụ thêm',
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mô tả dịch vụ',
  `duration` int NOT NULL DEFAULT '0' COMMENT 'Thời lượng dự kiến thực hiện (phút)',
  `price` double NOT NULL DEFAULT '0' COMMENT 'Giá dịch vụ',
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active' COMMENT 'Trạng thái dịch vụ',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo dịch vụ',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật dịch vụ',
  `deleted_at` datetime DEFAULT NULL COMMENT 'Thời điểm đưa dịch vụ vào thùng rác',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý danh mục dịch vụ';

-- Dumping data for table photo_studio.services: ~15 rows (approximately)
REPLACE INTO `services` (`id`, `name`, `type`, `description`, `duration`, `price`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'Trang Điểm & Làm Tóc Cô Dâu Cao Cấp', 'makeup', 'Layout makeup cô dâu tone trong trẻo Hàn Quốc, mỹ phẩm High-End giữ nền 12 tiếng', 60, 500000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(2, 'Chỉnh Sửa Retouch Ảnh Chuyên Sâu Từng Tấm', 'photography', 'Hậu kỳ tỉ mỉ từng chi tiết, căn chỉnh khối sáng, làn da tự nhiên và màu sắc độc quyền', 30, 50000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(3, 'In Album Photobook Mở Phẳng 30x30 Cao Cấp', 'photography', 'In trên giấy ảnh Lustre chống nước phủ màng bảo vệ, bìa da cao cấp nhập khẩu', 0, 1500000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(4, 'Thuê Thêm Trang Phục Dạ Hội / Váy Cưới VIP', 'clothing', 'Thêm 01 set váy cưới thiết kế cao cấp hoặc đầm dạ hội lộng lẫy trong buổi chụp', 0, 800000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(5, 'Dịch Vụ Quay Video Highlight Clip 4K', 'photography', 'Ghi hình trọn vẹn hậu trường buổi chụp, dựng clip 60-90 giây chuẩn nhạc Reels/TikTok', 90, 1200000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(6, 'Thiết Kế & Thi Công Bối Cảnh Riêng Biệt', 'background', 'Decor bối cảnh concept theo bản vẽ riêng của khách hàng bằng hoa tươi và đạo cụ độc quyền', 120, 2000000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(7, 'Gói Phụ Kiện Decor Hoa Tươi Tự Nhiên', 'accessory', 'Cung cấp hoa cưới cầm tay tươi nhập khẩu và hoa cài áo chú rể thiết kế riêng', 0, 600000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(8, 'Thêm Thợ Chụp Phụ / Hỗ Trợ Đèn Ekip Riêng', 'photography', 'Tăng cường 01 kỹ thuật viên ánh sáng và trợ lý góc máy phụ giúp buổi chụp mượt mà', 120, 800000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(9, 'Trang Điểm Dự Tiệc & Chân Dung Nàng Thơ', 'makeup', 'Layout makeup nhẹ nhàng trong trẻo tôn đường nét khuôn mặt cho khách chụp profile', 45, 350000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(10, 'Thuê Áo Dài Lụa Thiết Kế Thêu Tay', 'clothing', 'Áo dài lụa truyền thống tơ tằm thêu hoa sen cho ảnh kỷ yếu và cổ trang', 0, 300000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(11, 'Rửa Ảnh Ép Gỗ Tráng Gương Khổ Lớn 60x90', 'photography', 'Ảnh phóng lớn sắc nét bề mặt tráng gương bóng sang trọng treo phòng khách', 0, 650000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(12, 'Dịch Vụ Bàn Giao File Gốc Siêu Tốc Trong Ngày', 'photography', 'Nén và gửi toàn bộ file RAW/JPEG chất lượng cao qua Google Drive trong vòng 4 tiếng', 0, 200000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(13, 'Set Ánh Sáng Nghệ Thuật Đổi Màu RGB', 'background', 'Thiết lập dàn đèn Nanlite RGB tạo hiệu ứng màu sắc điện ảnh độc lạ', 45, 400000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(14, 'Cho Thuê Set Trang Sức Cô Dâu Pha Lê Cao Cấp', 'accessory', 'Bộ dây chuyền, khuyên tai đính đá phong cách quý tộc châu Âu', 0, 250000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL),
	(15, 'Trang Điểm Nhẹ Nhàng & Tạo Kiểu Tóc Nam Doanh Nhân', 'makeup', 'Chăm sóc nền da và tạo phom tóc lịch lãm cho nam giới chụp ảnh profile lãnh đạo', 30, 200000, 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00', NULL);

-- Dumping structure for table photo_studio.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Khóa chính',
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên đăng nhập',
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Email người dùng',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mật khẩu tài khoản (đã mã hóa hash)',
  `fullname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Họ và tên người dùng',
  `date_of_birth` date DEFAULT NULL COMMENT 'Ngày tháng năm sinh',
  `gender` enum('Male','Female') COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Giới tính',
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Địa chỉ',
  `phone` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Số điện thoại liên lạc',
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Đường dẫn ảnh đại diện',
  `role` enum('Customer','Employee','Admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Customer' COMMENT 'Vai trò người dùng',
  `status` enum('active','inactive','banned') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active' COMMENT 'Trạng thái tài khoản',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo tài khoản',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật tài khoản',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý thông tin tài khoản và người dùng';

-- Dumping data for table photo_studio.users: ~28 rows (approximately)
REPLACE INTO `users` (`id`, `username`, `email`, `password`, `fullname`, `date_of_birth`, `gender`, `address`, `phone`, `avatar`, `role`, `status`, `created_at`, `updated_at`) VALUES
	(1, 'admin', 'admin@photostudio.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Quản Trị Viên Hệ Thống', '1990-01-01', 'Male', 'Hà Nội', '0901234567', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'Admin', 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(2, 'employee', 'employee@photostudio.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Nguyễn Văn Nhân Viên', '1995-05-15', 'Male', 'Hà Nội', '0912345678', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 'Employee', 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(3, 'customer', 'customer@photostudio.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Lê Hoàng Khách Hàng', '2000-03-10', 'Male', 'Cầu Giấy, Hà Nội', '0934567890', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80', 'Customer', 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(4, 'photographer1', 'hoanganh@photostudio.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Nguyễn Hoàng Anh', '1994-04-12', 'Male', 'Đống Đa, Hà Nội', '0911223301', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', 'Employee', 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(5, 'makeup1', 'thuytien@photostudio.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Trần Thủy Tiên', '1997-08-20', 'Female', 'Tây Hồ, Hà Nội', '0911223302', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', 'Employee', 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(6, 'logistics1', 'quangminh@photostudio.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Đỗ Quang Minh', '1993-11-05', 'Male', 'Thanh Xuân, Hà Nội', '0911223303', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', 'Employee', 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(7, 'photographer2', 'vietdung@photostudio.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Vũ Việt Dũng', '1996-03-25', 'Male', 'Hai Bà Trưng, Hà Nội', '0911223304', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80', 'Employee', 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(8, 'makeup2', 'mailinh@photostudio.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Lê Mai Linh', '1998-09-14', 'Female', 'Hoàn Kiếm, Hà Nội', '0911223305', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', 'Employee', 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(9, 'photographer3', 'quochuy@photostudio.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Phạm Quốc Huy', '1995-12-30', 'Male', 'Ba Đình, Hà Nội', '0911223306', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', 'Employee', 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(10, 'makeup3', 'thuha@photostudio.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Nguyễn Thu Hà', '1999-02-18', 'Female', 'Cầu Giấy, Hà Nội', '0911223307', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', 'Employee', 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(11, 'logistics2', 'thanhtung@photostudio.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Bùi Thanh Tùng', '1992-06-22', 'Male', 'Nam Từ Liêm, Hà Nội', '0911223308', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80', 'Employee', 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(12, 'photographer4', 'ducnam@photostudio.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Trần Đức Nam', '1997-07-08', 'Male', 'Bắc Từ Liêm, Hà Nội', '0911223309', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'Employee', 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(13, 'makeup4', 'kimngan@photostudio.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Hoàng Kim Ngân', '2000-01-19', 'Female', 'Hoàng Mai, Hà Nội', '0911223310', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', 'Employee', 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(14, 'photographer5', 'trongnghia@photostudio.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Đinh Trọng Nghĩa', '1996-10-10', 'Male', 'Hà Đông, Hà Nội', '0911223311', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 'Employee', 'on_leave', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(15, 'logistics3', 'vanhung@photostudio.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Ngô Văn Hùng', '1991-05-03', 'Male', 'Long Biên, Hà Nội', '0911223312', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', 'Employee', 'inactive', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(16, 'customer1', 'minhtuan@gmail.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Lê Minh Tuấn', '1998-03-15', 'Male', 'Cầu Giấy, Hà Nội', '0945678901', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80', 'Customer', 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(17, 'customer2', 'phuonglinh@gmail.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Phạm Phương Linh', '2001-11-25', 'Female', 'Đống Đa, Hà Nội', '0945678902', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', 'Customer', 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(18, 'customer3', 'thutrang.nguyen@gmail.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Nguyễn Thu Trang', '1998-04-12', 'Female', 'Tây Hồ, Hà Nội', '0945678903', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'Customer', 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(19, 'customer4', 'hoangnam.studio@gmail.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Hoàng Nam', '1996-09-18', 'Male', 'Ba Đình, Hà Nội', '0945678904', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 'Customer', 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(20, 'customer5', 'khanhhuyen.tran@gmail.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Trần Khánh Huyền', '2001-02-14', 'Female', 'Hoàn Kiếm, Hà Nội', '0945678905', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', 'Customer', 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(21, 'customer6', 'quocbao.ceo@techlab.vn', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Đặng Quốc Bảo', '1992-12-05', 'Male', 'Thanh Xuân, Hà Nội', '0945678906', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', 'Customer', 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(22, 'customer7', 'hoangmai.vu@gmail.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Vũ Hoàng Mai', '2002-07-21', 'Female', 'Hai Bà Trưng, Hà Nội', '0945678907', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', 'Customer', 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(23, 'customer8', 'thang.duc@gmail.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Nguyễn Đức Thắng', '1994-06-30', 'Male', 'Nam Từ Liêm, Hà Nội', '0945678908', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', 'Customer', 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(24, 'customer9', 'baongoc.trinh@gmail.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Trịnh Bảo Ngọc', '2000-08-16', 'Female', 'Hà Đông, Hà Nội', '0945678909', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', 'Customer', 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(25, 'customer10', 'minhtri.ho@gmail.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Hồ Minh Trí', '1997-10-24', 'Male', 'Bắc Từ Liêm, Hà Nội', '0945678910', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80', 'Customer', 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(26, 'customer11', 'haiyen.bui@gmail.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Bùi Hải Yến', '2003-01-07', 'Female', 'Tây Hồ, Hà Nội', '0945678911', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', 'Customer', 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(27, 'customer12', 'thanhphong.duong@gmail.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Dương Thanh Phong', '1995-09-09', 'Male', 'Cầu Giấy, Hà Nội', '0945678912', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', 'Customer', 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00'),
	(28, 'customer13', 'myuyen.phan@gmail.com', '$2a$10$jQOE/xLYm4zyAYXC1dWl6uoMac/TgyA9QvHNe1zHyjDAHf9FpOWz.', 'Phan Mỹ Uyên', '1999-12-12', 'Female', 'Thanh Xuân, Hà Nội', '0945678913', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'Customer', 'active', '2026-10-01 08:00:00', '2026-10-01 08:00:00');

