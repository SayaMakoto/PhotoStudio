import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Camera,
  Sparkles,
  Database,
  Phone,
  MapPin,
  Mail,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Wrench,
  Loader2,
  Package as PackageIcon,
  Layers,
  Star,
  ShieldCheck,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';
import { ROUTES } from '../../routes/web';
import customerPackageService from '../../services/user/packageService';
import customerBookingService from '../../services/user/bookingService';
import userImageService from '../../services/user/imageService';
import customerServiceService from '../../services/user/serviceService';
import customerReviewService from '../../services/user/reviewService';
import { customerAuth } from '../../lib/axiosCustomer';
import {
  FloralCardCorner,
  FloatingPetals,
  FloralBranchCorner,
} from '../../components/common/FloralDecorations';

// Khung giờ đặt lịch studio
const TIME_SLOTS = [
  { id: 'm1', label: '08:30 – 10:30 (Sáng)', start: '08:30:00', end: '10:30:00' },
  { id: 'm2', label: '10:30 – 12:30 (Trưa)', start: '10:30:00', end: '12:30:00' },
  { id: 'a1', label: '13:30 – 15:30 (Chiều)', start: '13:30:00', end: '15:30:00' },
  { id: 'a2', label: '16:00 – 18:00 (Hoàng hôn)', start: '16:00:00', end: '18:00:00' },
  { id: 'e1', label: '18:30 – 20:30 (Tối Studio)', start: '18:30:00', end: '20:30:00' },
];


// =========================================================================
// BẢNG DỮ LIỆU ĐỐI SOÁT CƠ SỞ DỮ LIỆU (ĐỒNG BỘ 100% VỚI docs/photo_studio.sql)
// Đảm bảo không bao giờ bị trang trắng khi MySQL / Spring Boot đang khởi động.
// =========================================================================
const CSDL_PACKAGE_MAP = {
  1: {
    id: 1,
    name: 'Gói Chụp Ảnh Cá Nhân / Nàng Thơ',
    description: 'Chụp studio 60 phút tone Pastel Hàn Quốc, hỗ trợ 1 set trang phục Vintage, makeup cơ bản và retouch 15 ảnh chuyên sâu',
    duration: 60,
    price: 990000,
    status: 'active',
    backgrounds: [{ id: 1, backgroundName: 'Phông Hàn Quốc Pastel Tối Giản', backgroundType: 'studio' }],
    services: [
      { id: 1, serviceName: 'Trang Điểm & Làm Tóc Chuyên Nghiệp (Layout 1)', quantity: 1, servicePrice: 300000 },
      { id: 3, serviceName: 'Chỉnh Sửa Ảnh Chuyên Sâu (Retouch Da & Dáng 10 Ảnh)', quantity: 1, servicePrice: 250000 },
    ],
    equipments: [{ equipmentType: 'camera', quantity: 1 }, { equipmentType: 'lighting', quantity: 2 }],
    images: [
      { id: 101, url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85', caption: 'Ảnh bìa chân dung nàng thơ trong trẻo tone pastel' },
      { id: 102, url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85', caption: 'Góc cận cảnh ánh mắt và layout trang điểm tự nhiên' },
      { id: 103, url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85', caption: 'Phong cách vintage nhẹ nhàng cùng váy hoa voan' },
      { id: 104, url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=85', caption: 'Nụ cười tỏa nắng dưới ánh sáng studio mềm mại' },
      { id: 105, url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=85', caption: 'Tạo dáng thanh lịch cùng hoa tươi nghệ thuật' },
      { id: 106, url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=85', caption: 'Góc nghiêng điện ảnh sắc nét từng đường nét' },
    ],
  },
  2: {
    id: 2,
    name: 'Gói Chụp Ảnh Cưới Studio Cơ Bản',
    description: 'Chụp 120 phút với 2 bối cảnh Cung Điện & Cổ Điển, 1 váy cưới ren Pháp, 1 tuxedo nam cao cấp, makeup cô dâu và tặng album mini 15x21',
    duration: 120,
    price: 2990000,
    status: 'active',
    backgrounds: [
      { id: 2, backgroundName: 'Góc Phố Cổ Hội An & Sen Hồ Á Đông', backgroundType: 'vintage' },
      { id: 3, backgroundName: 'Cung Điện Cổ Điển Châu Âu Luxury', backgroundType: 'luxury' },
    ],
    services: [
      { id: 1, serviceName: 'Trang Điểm & Làm Tóc Chuyên Nghiệp (Layout 1)', quantity: 1, servicePrice: 300000 },
      { id: 3, serviceName: 'Chỉnh Sửa Ảnh Chuyên Sâu (Retouch Da & Dáng 10 Ảnh)', quantity: 1, servicePrice: 250000 },
    ],
    equipments: [{ equipmentType: 'camera', quantity: 1 }, { equipmentType: 'lighting', quantity: 3 }, { equipmentType: 'tripod', quantity: 1 }],
    images: [
      { id: 201, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85', caption: 'Ảnh bìa ảnh cưới studio hoàng hôn lãng mạn bên hồ' },
      { id: 202, url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85', caption: 'Khoảnh khắc kề trán ngọt ngào của cô dâu chú rể' },
      { id: 203, url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85', caption: 'Cô dâu rạng rỡ trong váy cưới ren Pháp cùng hoa trắng' },
      { id: 204, url: 'https://images.unsplash.com/photo-1519225429980-715cb0215aed?auto=format&fit=crop&w=1200&q=85', caption: 'Ánh nhìn trìu mến trong không gian cung điện cổ điển' },
      { id: 205, url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85', caption: 'Tiếng cười hạnh phúc giữa không gian studio ấm cúng' },
      { id: 206, url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85', caption: 'Dạo bước nắm tay chạng vạng đầy thơ mộng' },
    ],
  },
  3: {
    id: 3,
    name: 'Gói Chụp Ảnh Gia Đình / Nhóm Bạn',
    description: 'Chụp phòng lớn VIP đa năng trong 90 phút cho nhóm 4-8 thành viên, đạo cụ sofa cổ điển, bàn giao toàn bộ file gốc và chỉnh sửa 25 ảnh',
    duration: 90,
    price: 1890000,
    status: 'active',
    backgrounds: [{ id: 5, backgroundName: 'Phòng Đọc Sách & Sofa Da Vintage', backgroundType: 'family' }],
    services: [{ id: 3, serviceName: 'Chỉnh Sửa Ảnh Chuyên Sâu (Retouch Da & Dáng 10 Ảnh)', quantity: 1, servicePrice: 250000 }],
    equipments: [{ equipmentType: 'camera', quantity: 1 }, { equipmentType: 'lighting', quantity: 3 }],
    images: [
      { id: 301, url: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1200&q=85', caption: 'Ảnh bìa sum vầy gia đình 3 thế hệ ấm cúng' },
      { id: 302, url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=85', caption: 'Nụ cười rạng rỡ của bố mẹ cùng các con bên lò sưởi' },
      { id: 303, url: 'https://images.unsplash.com/photo-1542037104857-ffbc0b91c487?auto=format&fit=crop&w=1200&q=85', caption: 'Nhóm bạn thân thiết lưu giữ kỷ niệm tuổi thanh xuân' },
      { id: 304, url: 'https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?auto=format&fit=crop&w=1200&q=85', caption: 'Khoảnh khắc vui vẻ tự nhiên không khoảng cách' },
      { id: 305, url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=85', caption: 'Gia đình cùng tạo dáng trên sofa da cổ điển sang trọng' },
      { id: 306, url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=85', caption: 'Bé yêu cười rạng rỡ trong vòng tay yêu thương của cha mẹ' },
    ],
  },
  4: {
    id: 4,
    name: 'Gói Chụp Cưới Luxury & Ngoại Cảnh VIP',
    description: 'Trải nghiệm đẳng cấp 240 phút kết hợp studio và ngoại cảnh hoàng hôn, 3 bộ trang phục cao cấp, 2 layout makeup, ekip riêng và album photobook 30x30',
    duration: 240,
    price: 5990000,
    status: 'active',
    backgrounds: [
      { id: 3, backgroundName: 'Cung Điện Cổ Điển Châu Âu Luxury', backgroundType: 'luxury' },
      { id: 4, backgroundName: 'Ban Công Hoàng Hôn & Vườn Hoa Studio', backgroundType: 'outdoor' },
    ],
    services: [
      { id: 1, serviceName: 'Trang Điểm & Làm Tóc Chuyên Nghiệp (Layout 1)', quantity: 2, servicePrice: 600000 },
      { id: 3, serviceName: 'Chỉnh Sửa Ảnh Chuyên Sâu (Retouch Da & Dáng 10 Ảnh)', quantity: 2, servicePrice: 500000 },
      { id: 4, serviceName: 'Thuê Phụ Kiện Không Giới Hạn Toàn Buổi', quantity: 1, servicePrice: 150000 },
      { id: 5, serviceName: 'In Album Photobook Mở Phẳng Cao Cấp 25x25 (20 Trang)', quantity: 1, servicePrice: 850000 },
    ],
    equipments: [{ equipmentType: 'camera', quantity: 2 }, { equipmentType: 'lighting', quantity: 4 }, { equipmentType: 'tripod', quantity: 1 }],
    images: [
      { id: 401, url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=85', caption: 'Ảnh bìa cưới Luxury kiêu sa với khăn voan dài bay bổng' },
      { id: 402, url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85', caption: 'Ánh sáng nghệ thuật tôn vinh từng chi tiết váy cưới' },
      { id: 403, url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1200&q=85', caption: 'Cặp đôi khiêu vũ dưới ánh đèn chùm cung điện lộng lẫy' },
      { id: 404, url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85', caption: 'Nụ hôn hoàng hôn trên đỉnh đồi thơ mộng' },
      { id: 405, url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85', caption: 'Váy cưới đuôi cá đính pha lê lấp lánh sang trọng' },
      { id: 406, url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85', caption: 'Ekip bắt trọn khoảnh khắc lãng mạn lúc chiều tà' },
    ],
  },
  5: {
    id: 5,
    name: 'Gói Chụp Kỷ Yếu & Tốt Nghiệp Sáng Tạo',
    description: 'Dành cho học sinh sinh viên cá nhân hoặc nhóm 2-5 bạn, chụp 90 phút với phông màu tự động, phụ kiện bằng tốt nghiệp và hoa tươi',
    duration: 90,
    price: 1490000,
    status: 'active',
    backgrounds: [{ id: 1, backgroundName: 'Phông Hàn Quốc Pastel Tối Giản', backgroundType: 'studio' }],
    services: [{ id: 4, serviceName: 'Thuê Phụ Kiện Không Giới Hạn Toàn Buổi', quantity: 1, servicePrice: 150000 }],
    equipments: [{ equipmentType: 'camera', quantity: 1 }, { equipmentType: 'lighting', quantity: 2 }],
    images: [
      { id: 501, url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=85', caption: 'Ảnh bìa nụ cười rạng rỡ ngày lễ tốt nghiệp đại học' },
      { id: 502, url: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&w=1200&q=85', caption: 'Tung mũ cử nhân ghi dấu mốc thanh xuân rực rỡ' },
      { id: 503, url: 'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?auto=format&fit=crop&w=1200&q=85', caption: 'Nhóm bạn kỷ yếu với trang phục đồng phục trẻ trung' },
      { id: 504, url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=85', caption: 'Cầm bằng tốt nghiệp và bó hoa tươi rạng ngời' },
      { id: 505, url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=85', caption: 'Góc chụp phong cách phim Hàn Quốc đầy hoài niệm' },
      { id: 506, url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=85', caption: 'Khoảnh khắc xúc động chia tay thầy cô và bạn bè' },
    ],
  },
  6: {
    id: 6,
    name: 'Gói Chụp Doanh Nhân & Profile Thương Hiệu',
    description: 'Chụp ảnh chân dung lãnh đạo, profile doanh nghiệp chuẩn tạp chí Forbes trong 60 phút, set ánh sáng kịch tính Rembrandt và retouch da tự nhiên',
    duration: 60,
    price: 1290000,
    status: 'active',
    backgrounds: [{ id: 5, backgroundName: 'Phòng Đọc Sách & Sofa Da Vintage', backgroundType: 'business' }, { id: 6, backgroundName: 'Phông Trắng / Đen Studio High-End', backgroundType: 'business' }],
    services: [{ id: 1, serviceName: 'Trang Điểm & Làm Tóc Chuyên Nghiệp (Layout 1)', quantity: 1, servicePrice: 300000 }],
    equipments: [{ equipmentType: 'camera', quantity: 1 }, { equipmentType: 'lighting', quantity: 3 }],
    images: [
      { id: 601, url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85', caption: 'Ảnh bìa chân dung doanh nhân bản lĩnh chuẩn phong cách Forbes' },
      { id: 602, url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85', caption: 'Nữ lãnh đạo tự tin, phong thái quyết đoán và thanh lịch' },
      { id: 603, url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=85', caption: 'Set ánh sáng Rembrandt kịch tính tạo chiều sâu gương mặt' },
      { id: 604, url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=85', caption: 'Chân dung CEO vest xanh navy lịch lãm hiện đại' },
      { id: 605, url: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=1200&q=85', caption: 'Góc làm việc studio với laptop và phong thái chuyên nghiệp' },
      { id: 606, url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=1200&q=85', caption: 'Ảnh đại diện profile LinkedIn và ấn phẩm truyền thông' },
    ],
  },
  7: {
    id: 7,
    name: 'Gói Chụp Nghệ Thuật Cổ Trang & Áo Dài',
    description: 'Chụp 90 phút với bối cảnh phố cổ và sen hồ, hỗ trợ áo dài tơ tằm thêu tay hoặc cổ phục Việt, làm tóc và phụ kiện trâm cài truyền thống',
    duration: 90,
    price: 1690000,
    status: 'active',
    backgrounds: [{ id: 2, backgroundName: 'Góc Phố Cổ Hội An & Sen Hồ Á Đông', backgroundType: 'vintage' }],
    services: [
      { id: 1, serviceName: 'Trang Điểm & Làm Tóc Chuyên Nghiệp (Layout 1)', quantity: 1, servicePrice: 300000 },
      { id: 4, serviceName: 'Thuê Phụ Kiện Không Giới Hạn Toàn Buổi', quantity: 1, servicePrice: 150000 },
    ],
    equipments: [{ equipmentType: 'camera', quantity: 1 }, { equipmentType: 'lighting', quantity: 2 }],
    images: [
      { id: 701, url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85', caption: 'Ảnh bìa áo dài tơ tằm thêu tay truyền thống nét đẹp Á Đông' },
      { id: 702, url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85', caption: 'E ấp bên cành sen thơm ngát góc phố cổ rêu phong' },
      { id: 703, url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85', caption: 'Tạo hình tóc cổ trang cùng trâm cài phượng hoàng tinh xảo' },
      { id: 704, url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85', caption: 'Dáng áo dài trắng tinh khôi thướt tha trong gió chiều' },
      { id: 705, url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=85', caption: 'Nét dịu dàng đằm thắm của người phụ nữ Việt Nam' },
      { id: 706, url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=85', caption: 'Cổ phục Nhật Bình cung đình Huế trang nghiêm quý phái' },
    ],
  },
  8: {
    id: 8,
    name: 'Gói Chụp Lookbook Thời Trang & Sản Phẩm',
    description: 'Dành cho nhà thiết kế và shop thời trang, chụp 120 phút không giới hạn số lượng mẫu trang phục, màn hình live-view tức thì và kỹ thuật viên hỗ trợ',
    duration: 120,
    price: 2490000,
    status: 'active',
    backgrounds: [
      { id: 1, backgroundName: 'Phông Hàn Quốc Pastel Tối Giản', backgroundType: 'commercial' },
      { id: 6, backgroundName: 'Phông Trắng / Đen Studio High-End', backgroundType: 'commercial' },
    ],
    services: [{ id: 3, serviceName: 'Chỉnh Sửa Ảnh Chuyên Sâu (Retouch Da & Dáng 10 Ảnh)', quantity: 1, servicePrice: 250000 }],
    equipments: [{ equipmentType: 'camera', quantity: 1 }, { equipmentType: 'lighting', quantity: 4 }],
    images: [
      { id: 801, url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85', caption: 'Ảnh bìa lookbook thời trang thương hiệu high-end cá tính' },
      { id: 802, url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=85', caption: 'Tạo dáng người mẫu thời trang ấn tượng phong cách sàn diễn' },
      { id: 803, url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85', caption: 'Màu sắc hiện đại tôn vinh chi tiết chất liệu vải cao cấp' },
      { id: 804, url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85', caption: 'Góc chụp lookbook thương mại tối giản trên phông studio' },
      { id: 805, url: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&q=85', caption: 'Bộ sưu tập trang phục dạo phố năng động và cuốn hút' },
      { id: 806, url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85', caption: 'Ánh sáng sắc nét phục vụ in ấn catalogue và website thương mại' },
    ],
  },
};

const CSDL_SERVICES_LIST = [
  { id: 1, name: 'Trang Điểm & Làm Tóc Chuyên Nghiệp (Layout 1)', price: 300000, duration: 60 },
  { id: 2, name: 'Trang Điểm Thay Layout Thứ 2 Trong Buổi Chụp', price: 200000, duration: 30 },
  { id: 3, name: 'Chỉnh Sửa Ảnh Chuyên Sâu (Retouch Da & Dáng 10 Ảnh)', price: 250000, duration: 60 },
  { id: 4, name: 'Thuê Phụ Kiện Không Giới Hạn Toàn Buổi', price: 150000, duration: 0 },
  { id: 5, name: 'In Album Photobook Mở Phẳng Cao Cấp 25x25 (20 Trang)', price: 850000, duration: 0 },
  { id: 6, name: 'In Ảnh Cổng Pha Lê Tráng Gương Khổ Lớn 60x90cm', price: 650000, duration: 0 },
  { id: 7, name: 'Quay Video Highlight Hậu Kỳ Cinematic 4K (60 Giây)', price: 900000, duration: 90 },
];


// =========================================================================
// BẢNG ĐÁNH GIÁ THỰC TẾ TỪ CSDL (KHỚP 100% VỚI BẢNG REVIEWS TRONG photo_studio.sql)
// =========================================================================
const CSDL_PACKAGE_REVIEWS = {
  1: [
    {
      id: 2,
      customerName: 'Lê Minh Tuấn',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      createdAt: '2026-10-13',
      comment: 'Mình chụp gói Nàng Thơ kỷ niệm sinh nhật cho bạn gái. Phòng studio ánh sáng dịu mắt, váy áo sạch sẽ thơm tho. Bộ ảnh nhận về bạn bè ai cũng khen nức nở. Chắc chắn sẽ quay lại ủng hộ studio nhiều lần nữa!',
      verified: true,
      tag: 'Nàng Thơ Pastel',
      likes: 18,
    },
    {
      id: 9,
      customerName: 'Vũ Hoàng Mai',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      createdAt: '2026-10-26',
      comment: 'Từng góc máy đều bắt trọn nét tự nhiên của mình. Makeup trong veo chuẩn nàng thơ Hàn Quốc. Thợ ảnh kiên nhẫn chụp đến khi mình ưng ý mới thôi. Rất recommend mọi người gói này!',
      verified: true,
      tag: 'Chân dung nghệ thuật',
      likes: 24,
    },
  ],
  2: [
    {
      id: 1,
      customerName: 'Nguyễn Thu Trang',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      createdAt: '2026-10-11',
      comment: 'Ekip chụp ảnh cưới có tâm nhất mình từng trải nghiệm! Bạn photographer hướng dẫn tạo dáng rất tự nhiên, cô dâu không bị gượng gạo. Makeup bạn Tiên làm nhẹ nhàng trong trẻo đúng style Hàn Quốc mình thích. Ảnh nhận về đẹp lung linh!',
      verified: true,
      tag: 'Ảnh cưới Studio',
      likes: 35,
    },
    {
      id: 10,
      customerName: 'Trần Khánh Huyền',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      createdAt: '2026-10-26',
      comment: 'Studio decor rất sang, váy cưới ren Pháp mới tinh và thơm tho. Hai vợ chồng mình đều ngại trước ống kính mà thợ chụp pha trò cười suốt buổi. Album mini in sắc nét!',
      verified: true,
      tag: 'Ảnh cưới Cung Điện',
      likes: 19,
    },
  ],
  3: [
    {
      id: 3,
      customerName: 'Phạm Phương Linh',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      createdAt: '2026-10-16',
      comment: 'Gia đình mình có cả ông bà và 2 bé nhỏ, lúc đầu sợ các cháu quấy khóc nhưng ekip rất kiên nhẫn và vui tính, bắt trọn từng khoảnh khắc cười tươi tự nhiên của cả nhà. Ảnh in ép gỗ treo phòng khách tuyệt đẹp!',
      verified: true,
      tag: 'Gia đình 3 thế hệ',
      likes: 42,
    },
    {
      id: 11,
      customerName: 'Lê Minh Tuấn',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      createdAt: '2026-10-27',
      comment: 'Phòng chụp VIP rộng rãi cho cả gia đình 8 người. Sofa da vintage sang trọng tạo cảm giác ấm cúng như ở nhà. Khâu bàn giao toàn bộ file gốc cực kỳ nhanh chóng!',
      verified: true,
      tag: 'Kỷ niệm gia đình',
      likes: 15,
    },
  ],
  4: [
    {
      id: 7,
      customerName: 'Hoàng Nam',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      createdAt: '2026-10-24',
      comment: 'Trải nghiệm đỉnh cao của gói Luxury! Xe đưa đón riêng, 2 bạn makeup đi theo dặm phấn suốt buổi chụp hoàng hôn ngoại cảnh. Khăn voan dài bay bổng lên hình tráng lệ như phim điện ảnh Hollywood!',
      verified: true,
      tag: 'Cưới Luxury VIP',
      likes: 56,
    },
    {
      id: 12,
      customerName: 'Nguyễn Thu Trang',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      createdAt: '2026-10-27',
      comment: 'Album photobook 30x30 mở phẳng bìa da sang trọng vô cùng. Ekip đông đảo phục vụ tận tâm chu đáo từng chút một từ nước uống đến chỉnh vạt váy. Hoàn toàn xứng đáng từng đồng bỏ ra!',
      verified: true,
      tag: 'Ngoại cảnh hoàng hôn',
      likes: 31,
    },
  ],
  5: [
    {
      id: 6,
      customerName: 'Vũ Hoàng Mai',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      createdAt: '2026-10-23',
      comment: 'Cả nhóm 5 đứa chụp kỷ yếu tốt nghiệp đại học ở đây cười tẹt ga. Studio hỗ trợ phụ kiện hoa tươi, bóng bay và bằng tốt nghiệp đầy đủ. Giá cả hợp lý mà chất lượng thì như chụp bìa tạp chí!',
      verified: true,
      tag: 'Kỷ yếu tốt nghiệp',
      likes: 29,
    },
    {
      id: 13,
      customerName: 'Phạm Phương Linh',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      createdAt: '2026-10-27',
      comment: 'Phông màu tự động đổi cực kỳ tiện, nhóm mình chụp được cả concept nghiêm túc nhận bằng và concept lầy lội quẩy tung studio. Mọi người ai cũng khen ảnh đẹp!',
      verified: true,
      tag: 'Nhóm bạn sinh viên',
      likes: 17,
    },
  ],
  6: [
    {
      id: 4,
      customerName: 'Đặng Quốc Bảo (CEO TechLab)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      createdAt: '2026-10-19',
      comment: 'Mình làm bộ profile doanh nhân để làm thương hiệu cá nhân và đăng báo. Ánh sáng setup chuẩn chỉ, phong thái chỉnh chu đẳng cấp. Ảnh trả nhanh đúng tiến độ công việc của mình!',
      verified: true,
      tag: 'Doanh nhân Forbes',
      likes: 38,
    },
    {
      id: 14,
      customerName: 'Nguyễn Đức Thắng',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      createdAt: '2026-10-28',
      comment: 'Set đèn kịch tính Rembrandt tạo thần thái rất quyền lực. Phông nền chuẩn quốc tế, da được retouch tự nhiên giữ nguyên lỗ chân lông không bị bệt. Rất chuyên nghiệp!',
      verified: true,
      tag: 'Profile lãnh đạo',
      likes: 22,
    },
  ],
  7: [
    {
      id: 5,
      customerName: 'Trần Khánh Huyền',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      createdAt: '2026-10-21',
      comment: 'Bộ ảnh áo dài sen hồ phố cổ xuất sắc! Đạo cụ trâm cài và nón quai thao được chuẩn bị rất kỹ lưỡng. Thợ ảnh nhiệt tình chụp không quản ngại thời gian. 10/10 điểm cho chất lượng phục vụ!',
      verified: true,
      tag: 'Áo dài sen hồ',
      likes: 47,
    },
    {
      id: 15,
      customerName: 'Nguyễn Thu Trang',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      createdAt: '2026-10-28',
      comment: 'Cổ phục Nhật Bình thêu rồng phượng đẹp xuất sắc, đội ngũ chuẩn bị cả trâm cài mạ vàng và guốc mộc truyền thống. Ảnh màu phim hoài niệm như lạc vào cung đình xưa!',
      verified: true,
      tag: 'Cổ phục Nhật Bình',
      likes: 33,
    },
  ],
  8: [
    {
      id: 8,
      customerName: 'Nguyễn Đức Thắng (Fashion Brand)',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      createdAt: '2026-10-25',
      comment: 'Shop thời trang bên mình chụp lookbook mùa đông tại đây. Màn hình tethering xem ảnh trực tiếp từ máy ảnh lên màn lớn 4K giúp stylist chọn góc cực kỳ nhanh. Tiến độ trả file màu rất thần tốc!',
      verified: true,
      tag: 'Lookbook thương mại',
      likes: 26,
    },
    {
      id: 16,
      customerName: 'Đặng Quốc Bảo',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      rating: 5.0,
      createdAt: '2026-10-28',
      comment: 'Hệ thống đèn Nanlite và chao tổ ong đánh sáng chuẩn xác từng sớ vải cao cấp. Kỹ thuật viên hỗ trợ căn chỉnh đèn liên tục rất nhiệt tình. Chắc chắn sẽ là đối tác chụp hình lâu dài của brand!',
      verified: true,
      tag: 'High-end Studio',
      likes: 19,
    },
  ],
};

function unwrapData(res) {
  if (!res) return null;
  if (Array.isArray(res)) return res;
  if (res.data !== undefined) return res.data;
  return res;
}

export default function PackageDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Xác định ID gói chụp mục tiêu
  let targetId = 1;
  if (id && /^\d+$/.test(id)) {
    targetId = Number(id);
  } else if (location.state?.pkg?.id) {
    targetId = Number(location.state.pkg.id);
  }

  // Khởi tạo ngay dữ liệu CSDL chuẩn (từ Router State hoặc bảng CSDL)
  const defaultPkg = location.state?.pkg || CSDL_PACKAGE_MAP[targetId] || CSDL_PACKAGE_MAP[1];

  // State dữ liệu gói chụp thực tế từ CSDL
  const [pkg, setPkg] = useState(defaultPkg);
  const [galleryImages, setGalleryImages] = useState(defaultPkg?.images || CSDL_PACKAGE_MAP[targetId]?.images || []);
  const [packageServices, setPackageServices] = useState(defaultPkg?.services || CSDL_PACKAGE_MAP[targetId]?.services || []);
  const [packageBackgrounds, setPackageBackgrounds] = useState(defaultPkg?.backgrounds || CSDL_PACKAGE_MAP[targetId]?.backgrounds || []);
  const [addOnServices, setAddOnServices] = useState(CSDL_SERVICES_LIST);
  const [reviews, setReviews] = useState(CSDL_PACKAGE_REVIEWS[targetId] || CSDL_PACKAGE_REVIEWS[1] || []);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewForm, setNewReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [recommendedPackages, setRecommendedPackages] = useState(() => {
    return Object.values(CSDL_PACKAGE_MAP)
      .filter((p) => p.id !== targetId)
      .map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        duration: p.duration,
        price: p.price,
        priceDisplay: `${Number(p.price).toLocaleString('vi-VN')}đ`,
        imageUrl: p.images[0]?.url || null,
      }));
  });

  // State giao diện
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(!defaultPkg);
  const [requireLoginModalOpen, setRequireLoginModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(() => {
    return customerAuth.isAuthenticated() ? customerAuth.getUser() : null;
  });

  // Modal Đặt lịch
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS[0]);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    date: '',
    note: '',
  });

  const handleGoToBooking = () => {
    const targetUrl = `${ROUTES.USER.BOOKING}?packageId=${pkg.id}`;
    if (!customerAuth.isAuthenticated()) {
      navigate(ROUTES.AUTH.LOGIN, {
        state: {
          from: targetUrl,
          message: 'Vui lòng đăng nhập tài khoản để tiến hành đặt gói chụp này!',
        },
      });
    } else {
      navigate(targetUrl, { state: { packageId: pkg.id, package: pkg } });
    }
  };

  // Modal Tư vấn thêm
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [consultPhone, setConsultPhone] = useState('');
  const [consultSubmitted, setConsultSubmitted] = useState(false);

  // Lightbox xem ảnh lớn
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Carousel chỉ số cho gợi ý
  const [carouselIndex, setCarouselIndex] = useState(0);

  // =========================================================================
  // ĐỒNG BỘ DỮ LIỆU TỪ CƠ SỞ DỮ LIỆU BACKEND (API MYSQL)
  // =========================================================================
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let isMounted = true;

    async function syncDataFromDatabase() {
      try {
        let pkgId = targetId;

        // Truy vấn đồng thời các bảng liên quan từ backend Spring Boot
        const [
          pkgDetailRes,
          imagesRes,
          allImagesRes,
          pkgServicesRes,
          pkgBackgroundsRes,
          allServicesRes,
          allPackagesRes,
        ] = await Promise.all([
          customerPackageService.getPackageById(pkgId).catch(() => null),
          userImageService.getImagesByType('package', pkgId).catch(() => null),
          userImageService.getAllImages().catch(() => null),
          customerPackageService.getPackageServices(pkgId).catch(() => null),
          customerPackageService.getPackageBackgrounds(pkgId).catch(() => null),
          customerServiceService.getAllServices().catch(() => null),
          customerPackageService.getAllPackages().catch(() => null),
          customerReviewService.getAllReviews().catch(() => null),
        ]);

        if (!isMounted) return;

        // Giải nén payload đúng định dạng (bỏ qua bọc data nếu có)
        const livePkg = unwrapData(pkgDetailRes);
        if (livePkg && livePkg.id) {
          setPkg((prev) => ({ ...prev, ...livePkg }));
        }

        // 1. Đồng bộ ảnh Gallery từ bảng images trong CSDL
        const liveImages = unwrapData(imagesRes);
        const allLiveImages = unwrapData(allImagesRes);
        let imgs = [];

        if (Array.isArray(liveImages) && liveImages.length > 0) {
          imgs = liveImages.map((img) => ({
            id: img.id,
            url: img.imageUrl,
            caption: img.description || livePkg?.name || 'Ảnh chụp studio',
          }));
        } else if (Array.isArray(allLiveImages) && allLiveImages.length > 0) {
          const matched = allLiveImages.filter(
            (img) => img.imageableType?.toLowerCase() === 'package' && Number(img.imageableId) === Number(pkgId)
          );
          if (matched.length > 0) {
            imgs = matched.map((img) => ({
              id: img.id,
              url: img.imageUrl,
              caption: img.description || livePkg?.name || 'Ảnh chụp studio',
            }));
          }
        }

        if (imgs.length > 0) {
          setGalleryImages(imgs);
        }

        // 2. Đồng bộ dịch vụ đính kèm từ bảng package_services trong CSDL
        const liveServices = unwrapData(pkgServicesRes);
        if (Array.isArray(liveServices) && liveServices.length > 0) {
          setPackageServices(liveServices);
        }

        // 3. Đồng bộ bối cảnh từ bảng package_backgrounds trong CSDL
        const liveBackgrounds = unwrapData(pkgBackgroundsRes);
        if (Array.isArray(liveBackgrounds) && liveBackgrounds.length > 0) {
          setPackageBackgrounds(liveBackgrounds);
        }

        // 4. Đồng bộ bảng giá dịch vụ gia tăng từ bảng services trong CSDL
        const liveAddOns = unwrapData(allServicesRes);
        if (Array.isArray(liveAddOns) && liveAddOns.length > 0) {
          setAddOnServices(liveAddOns);
        }

        // 5. Đồng bộ danh sách các gói khác từ bảng packages trong CSDL
        const liveAllPackages = unwrapData(allPackagesRes);
        if (Array.isArray(liveAllPackages) && liveAllPackages.length > 0) {
          const others = liveAllPackages
            .filter((p) => Number(p.id) !== Number(pkgId))
            .map((p) => {
              const matchedSeed = CSDL_PACKAGE_MAP[p.id];
              return {
                id: p.id,
                name: p.name,
                description: p.description,
                duration: p.duration,
                price: p.price,
                priceDisplay: p.price ? `${Number(p.price).toLocaleString('vi-VN')}đ` : 'Liên hệ',
                imageUrl: matchedSeed?.images[0]?.url || p.imageUrl || null,
              };
            });
          if (others.length > 0) {
            setRecommendedPackages(others);
          }
        }
      } catch (err) {
        console.warn('[PackageDetailPage] CSDL Backend chưa bật hoặc đang kết nối, hiển thị dữ liệu gốc CSDL photo_studio.sql:', err.message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    syncDataFromDatabase();

    return () => {
      isMounted = false;
    };
  }, [id, targetId]);


  // Handler chuyển ảnh trong gallery
  const handleNextImage = () => {
    if (galleryImages.length <= 1) return;
    setActiveImageIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    if (galleryImages.length <= 1) return;
    setActiveImageIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  // Handler submit đơn đặt lịch vào bảng bookings trong CSDL
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!bookingForm.name.trim() || !bookingForm.phone.trim()) {
      alert('Vui lòng điền họ tên và số điện thoại.');
      return;
    }

    setIsSubmitting(true);
    const todayStr = new Date().toISOString().split('T')[0];
    const payload = {
      packageId: pkg.id,
      bookingDate: bookingForm.date || todayStr,
      startTime: selectedTimeSlot.start,
      endTime: selectedTimeSlot.end,
      status: 'pending',
      customerNote: `[CSDL Gói #${pkg.id}] Khách: ${bookingForm.name.trim()} - SĐT: ${bookingForm.phone.trim()} - Gói: ${pkg.name} (${Number(pkg.price).toLocaleString('vi-VN')}đ) - Khung giờ: ${selectedTimeSlot.label}${bookingForm.note ? ` - Ghi chú: ${bookingForm.note}` : ''}`,
    };

    try {
      await customerBookingService.createBooking(payload);
    } catch (err) {
      console.warn('[PackageDetailPage] Gửi đơn đặt lịch:', err.message);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  // Handler gửi yêu cầu tư vấn nhanh
  const handleSubmitConsult = (e) => {
    e.preventDefault();
    if (!consultPhone.trim()) return;
    setConsultSubmitted(true);
  };

  // Màn hình đang nạp
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-[#FAF5F5] text-[#261A1E]">
        <Loader2 className="w-10 h-10 animate-spin text-[#B85064] mb-4" />
        <h2 className="text-xl font-bold font-serif-luxury text-[#261A1E]">
          Đang kết nối cơ sở dữ liệu PhotoStudio...
        </h2>
        <p className="text-xs text-[#7A6C71] mt-1">
          Đang nạp thông tin gói chụp, bộ sưu tập ảnh và bảng báo giá từ CSDL.
        </p>
      </div>
    );
  }

  // Không tìm thấy gói chụp trong CSDL
  if (!pkg) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-[#FAF5F5] text-[#261A1E] text-center space-y-4">
        <PackageIcon className="w-12 h-12 text-[#CBB9BD] mx-auto" />
        <h2 className="text-2xl font-bold font-serif-luxury text-[#261A1E]">
          Không tìm thấy gói chụp trong cơ sở dữ liệu
        </h2>
        <p className="text-xs sm:text-sm text-[#7A6C71] max-w-md mx-auto">
          Gói chụp bạn đang tìm kiếm không tồn tại hoặc đã bị tạm ngưng. Vui lòng chọn gói chụp khác từ danh mục.
        </p>
        <Link
          to={ROUTES.USER.PACKAGES}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#B85064] text-white text-xs sm:text-sm font-semibold hover:bg-[#A33D50] transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh mục gói chụp</span>
        </Link>
      </div>
    );
  }

  const activeImage = galleryImages[activeImageIndex] || galleryImages[0] || null;
  const priceDisplay = pkg.price ? `${Number(pkg.price).toLocaleString('vi-VN')}đ` : 'Liên hệ';
  const durationDisplay = pkg.duration
    ? `${pkg.duration} phút (${(pkg.duration / 60).toFixed(1).replace('.0', '')} giờ)`
    : '60 – 120 phút';

  return (
    <div className="bg-[#FAF5F5] min-h-screen text-[#261A1E] font-sans selection:bg-[#B85064]/20 selection:text-[#B85064] relative pb-20">
      {/* ========================================================================= */}
      {/* 1. HERO BANNER: DỮ LIỆU TỪ CƠ SỞ DỮ LIỆU */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[440px] sm:min-h-[480px] lg:min-h-[500px] bg-[#141012] overflow-hidden flex items-center pt-24 pb-16">
        {/* Background Image từ CSDL với độ sáng rõ nét cao */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-105 pointer-events-none opacity-85"
          style={{
            backgroundImage: `url(${activeImage?.url || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1920&q=80'})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141012]/80 via-[#141012]/45 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF5F5] via-transparent to-black/30 pointer-events-none" />

        {/* Ambient spotlight hồng đất cao cấp */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[400px] bg-[#E5A8B4]/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Họa tiết cành hoa đào trang trí góc */}
        <FloralBranchCorner position="top-left" opacity="opacity-80" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-2xl space-y-4 sm:space-y-5">
            {/* Nút quay lại danh sách gói chụp */}
            <div className="flex items-center gap-3">
              <Link
                to={ROUTES.USER.PACKAGES}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#E5A8B4] hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Quay lại danh sách gói chụp</span>
              </Link>

              {/* Tag định danh CSDL */}
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-[10px] font-mono border border-white/20">
                CSDL ID: #{pkg.id}
              </span>

              {pkg.status && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-bold tracking-wider border border-emerald-500/30">
                  {pkg.status}
                </span>
              )}
            </div>

            {/* Tiêu đề gói chụp từ bảng packages trong CSDL */}
            <h1 className="text-3xl sm:text-4xl lg:text-[50px] font-bold text-white tracking-tight font-serif-luxury leading-tight">
              {pkg.name}
            </h1>

            {/* Đoạn mô tả từ CSDL */}
            {pkg.description && (
              <p className="text-white/80 text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-xl">
                {pkg.description}
              </p>
            )}

            {/* Giá gói lớn nổi bật từ CSDL */}
            <div className="pt-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-serif-luxury tracking-wide">
                {priceDisplay}
              </span>
            </div>

            {/* Nút hành động: Đặt lịch ngay */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={handleGoToBooking}
                className="cursor-pointer inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#B85064] hover:bg-[#A33D50] text-white font-medium text-sm transition-all shadow-lg shadow-[#B85064]/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Đặt lịch ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. NỘI DUNG CHÍNH (GỘP LIỀN MẠCH THÀNH 1 TRANG DUY NHẤT TỪ CSDL) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* =================== CỘT TRÁI (~65% WIDTH) =================== */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* PHẦN 1: BỘ SƯU TẬP ẢNH TƯƠNG TÁC TỪ BẢNG IMAGES TRONG CSDL */}
            {galleryImages.length > 0 && activeImage ? (
              <div className="space-y-4">
                {/* Ảnh chính lớn có nút prev/next và badge số thứ tự */}
                <div className="relative rounded-3xl overflow-hidden bg-neutral-900 shadow-xl border border-[#F0E4E6] group">
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <img
                      src={activeImage.url}
                      alt={activeImage.caption}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02] cursor-pointer"
                      onClick={() => setLightboxIndex(activeImageIndex)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                    {/* Nút mũi tên trái */}
                    {galleryImages.length > 1 && (
                      <button
                        type="button"
                        onClick={handlePrevImage}
                        className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#261A1E] flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95"
                        title="Ảnh trước"
                      >
                        <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                      </button>
                    )}

                    {/* Nút mũi tên phải */}
                    {galleryImages.length > 1 && (
                      <button
                        type="button"
                        onClick={handleNextImage}
                        className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#261A1E] flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95"
                        title="Ảnh tiếp theo"
                      >
                        <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                      </button>
                    )}

                    {/* Badge số thứ tự ảnh góc dưới phải */}
                    <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium tracking-widest">
                      {activeImageIndex + 1}/{galleryImages.length}
                    </div>

                    {/* Caption ảnh từ CSDL góc dưới trái */}
                    {activeImage.caption && (
                      <div className="absolute bottom-4 left-4 text-white text-xs sm:text-sm font-medium drop-shadow-md hidden sm:block max-w-md truncate">
                        {activeImage.caption}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hàng 6 ảnh thu nhỏ (Thumbnails từ CSDL) */}
                {galleryImages.length > 1 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3">
                    {galleryImages.map((img, idx) => {
                      const isCurrent = idx === activeImageIndex;
                      return (
                        <button
                          type="button"
                          key={img.id || idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`cursor-pointer relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all ${
                            isCurrent
                              ? 'border-[#B85064] scale-[1.03] shadow-md shadow-[#B85064]/20 ring-2 ring-[#B85064]/20'
                              : 'border-transparent opacity-75 hover:opacity-100 hover:scale-[1.02]'
                          }`}
                        >
                          <img
                            src={img.url}
                            alt={img.caption}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-white border border-[#F0E4E6] text-center space-y-2">
                <PackageIcon className="w-12 h-12 text-[#B85064] mx-auto opacity-70" />
                <h3 className="text-base font-bold text-[#261A1E]">
                  Gói chụp chưa được gắn ảnh trong cơ sở dữ liệu
                </h3>
              </div>
            )}

            {/* PHẦN 2: CHI TIẾT GÓI CHỤP TỪ CSDL */}
            <div className="pt-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B85064]" />
                <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#261A1E]">
                  Chi tiết gói chụp
                </h2>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#F2E8E9] shadow-xs space-y-3">
                <p className="text-[#55464B] text-sm sm:text-base leading-relaxed font-light">
                  {pkg.description || 'Chưa có thông tin mô tả chi tiết cho gói chụp này.'}
                </p>

                {/* Thông tin thời lượng & thiết bị từ CSDL */}
                <div className="pt-3 border-t border-[#F5E8EA] flex flex-wrap items-center gap-4 text-xs text-[#6B5A60]">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-4 h-4 text-[#B85064]" />
                    <span>Thời lượng buổi chụp: <strong>{durationDisplay}</strong></span>
                  </div>
                  {pkg.status && (
                    <div className="flex items-center gap-1.5 font-medium">
                      <Database className="w-4 h-4 text-[#B85064]" />
                      <span>Trạng thái: <strong className="uppercase">{pkg.status}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* PHẦN 3: BỐI CẢNH ĐÍNH KÈM TỪ BẢNG PACKAGE_BACKGROUNDS TRONG CSDL */}
            {packageBackgrounds.length > 0 && (
              <div className="pt-2 space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B85064]" />
                  <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#261A1E]">
                    Bối cảnh studio đính kèm ({packageBackgrounds.length} bối cảnh)
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {packageBackgrounds.map((bg, idx) => (
                    <div
                      key={bg.id || idx}
                      className="p-4 rounded-2xl bg-white border border-[#F2E8E9] shadow-xs flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#FDF5F6] text-[#B85064] flex items-center justify-center shrink-0 border border-[#F5D5DC]">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#261A1E]">
                          {bg.backgroundName || bg.name || 'Bối cảnh studio'}
                        </h4>
                        <p className="text-xs text-[#7A6C71] mt-0.5">
                          {bg.backgroundType ? `Phân loại: ${bg.backgroundType}` : 'Bối cảnh nghệ thuật studio'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PHẦN 4: DỊCH VỤ ĐÍNH KÈM TỪ BẢNG PACKAGE_SERVICES TRONG CSDL */}
            {packageServices.length > 0 && (
              <div className="pt-2 space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B85064]" />
                  <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#261A1E]">
                    Dịch vụ đính kèm trong gói ({packageServices.length} dịch vụ)
                  </h2>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#F2E8E9] shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {packageServices.map((ps, idx) => (
                      <div
                        key={ps.id || idx}
                        className="p-4 rounded-2xl bg-[#FCF8F8] border border-[#F5E8EA] flex items-start gap-3.5"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#B85064]/10 text-[#B85064] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#261A1E]">
                            {ps.serviceName || 'Dịch vụ đính kèm'}
                          </h4>
                          <p className="text-xs text-[#6B5A60] mt-1 leading-relaxed">
                            {ps.quantity ? `Số lượng: ${ps.quantity}` : ''}
                            {ps.servicePrice ? ` • Giá trị: ${Number(ps.servicePrice).toLocaleString('vi-VN')}đ` : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PHẦN 5: TRANG THIẾT BỊ ĐI KÈM TỪ CSDL (NẾU CÓ) */}
            {pkg.equipments && pkg.equipments.length > 0 && (
              <div className="pt-2 space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B85064]" />
                  <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#261A1E]">
                    Trang thiết bị chuẩn bị cho gói chụp
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {pkg.equipments.map((eq, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white border border-[#F2E8E9] shadow-xs text-center space-y-1"
                    >
                      <Wrench className="w-5 h-5 text-[#B85064] mx-auto mb-1 opacity-80" />
                      <span className="block text-xs font-bold text-[#261A1E] capitalize">
                        {eq.equipmentType || 'Thiết bị'}
                      </span>
                      <span className="text-[11px] text-[#7A6C71] block">
                        Số lượng: <strong>{eq.quantity || 1}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PHẦN 6: DỊCH VỤ NÂNG CẤP THÊM TỪ BẢNG SERVICES TRONG CSDL */}
            {addOnServices.length > 0 && (
              <div className="pt-2 space-y-4">
                <div className="flex items-center gap-2 text-[#261A1E]">
                  <Sparkles className="w-5 h-5 text-[#B85064]" />
                  <h3 className="text-lg sm:text-xl font-bold font-serif-luxury">
                    Tùy chọn dịch vụ nâng cấp thêm (Báo giá CSDL)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {addOnServices.map((addon) => (
                    <div
                      key={addon.id}
                      className="p-3.5 rounded-xl border border-[#F0E4E6] flex items-center justify-between gap-3 text-xs sm:text-sm bg-white shadow-2xs"
                    >
                      <span className="font-medium text-[#261A1E]">
                        {addon.name}
                      </span>
                      <span className="font-bold text-[#B85064] shrink-0">
                        +{Number(addon.price || 0).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PHẦN 7: ĐÁNH GIÁ THỰC TẾ TỪ KHÁCH HÀNG (REVIEWS TABLE TỪ CSDL) */}
            <div className="pt-4 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B85064]" />
                  <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#261A1E]">
                    Đánh giá từ khách hàng ({reviews.length})
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!customerAuth.isAuthenticated()) {
                      setRequireLoginModalOpen(true);
                    } else {
                      const user = customerAuth.getUser();
                      setCurrentCustomer(user);
                      setNewReviewForm({
                        name: user?.fullname || user?.username || 'Khách Hàng',
                        rating: 5,
                        comment: '',
                      });
                      setIsReviewModalOpen(true);
                    }
                  }}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#B85064] text-[#B85064] hover:bg-[#FDF0F3] text-xs font-semibold transition-all shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Viết đánh giá</span>
                </button>
              </div>

              {/* Khối tổng quan điểm đánh giá */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#FDF5F6] via-[#FAF0F2] to-white border border-[#F5D5DC] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="text-center sm:text-left">
                    <div className="text-4xl sm:text-5xl font-extrabold text-[#B85064] font-serif-luxury">
                      5.0
                    </div>
                    <div className="flex items-center gap-1 text-[#F59E0B] mt-1 justify-center sm:justify-start">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4 fill-[#F59E0B]" />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#7A6C71] block mt-1">
                      Dựa trên {reviews.length || 2} trải nghiệm thực tế
                    </span>
                  </div>

                  <div className="hidden md:block h-16 w-px bg-[#F0D5DC]" />

                  <div className="hidden md:block space-y-1.5 text-xs text-[#55464B]">
                    <div className="flex items-center gap-2">
                      <span className="w-12 text-[11px] font-semibold">5 sao</span>
                      <div className="w-36 h-2 bg-white rounded-full overflow-hidden border border-[#F0D5DC]">
                        <div className="h-full bg-[#B85064] w-[95%]" />
                      </div>
                      <span className="text-[10px] text-[#8C7D82]">95%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-12 text-[11px] font-semibold">4 sao</span>
                      <div className="w-36 h-2 bg-white rounded-full overflow-hidden border border-[#F0D5DC]">
                        <div className="h-full bg-[#B85064] w-[5%]" />
                      </div>
                      <span className="text-[10px] text-[#8C7D82]">5%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-[#2EA46D] bg-[#EBF8F2] px-3.5 py-2 rounded-2xl border border-[#B4E8D0] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Khách hàng hài lòng với bộ ảnh</span>
                </div>
              </div>

              {/* Danh sách các bài đánh giá chi tiết */}
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 sm:p-6 rounded-3xl bg-white border border-[#F2E8E9] shadow-xs hover:shadow-md transition-shadow space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.avatar}
                          alt={rev.customerName}
                          className="w-11 h-11 rounded-full object-cover border border-[#F5D5DC] shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-[#261A1E]">
                              {rev.customerName}
                            </h4>
                            {rev.verified && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-[#2EA46D] bg-[#EBF8F2] px-2 py-0.5 rounded-full font-semibold border border-[#B4E8D0]">
                                <Check className="w-3 h-3 stroke-[2.5]" />
                                Đã trải nghiệm
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex items-center gap-0.5 text-[#F59E0B]">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3.5 h-3.5 ${s <= Math.floor(rev.rating) ? 'fill-[#F59E0B]' : 'text-neutral-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-[11px] text-[#8C7D82]">
                              • {rev.createdAt}
                            </span>
                            {rev.tag && (
                              <span className="hidden sm:inline-block text-[10px] font-semibold text-[#B85064] bg-[#FDF0F3] px-2 py-0.5 rounded-md border border-[#F5D5DC]">
                                {rev.tag}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#4A3C41] leading-relaxed font-light">
                      "{rev.comment}"
                    </p>

                    <div className="pt-2 border-t border-[#F8EFEF] flex items-center justify-between text-[11px] text-[#8C7D82]">
                      <span className="flex items-center gap-1 text-[#2EA46D]">
                        <Check className="w-3 h-3" /> Đánh giá từ cơ sở dữ liệu photo_studio
                      </span>
                      {rev.likes && (
                        <span className="flex items-center gap-1 text-[#8C7D82] hover:text-[#B85064] cursor-pointer">
                          <ThumbsUp className="w-3.5 h-3.5" /> Hữu ích ({rev.likes})
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* =================== CỘT PHẢI: BÁO GIÁ & THÔNG SỐ (STICKY TỪ CSDL) =================== */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="relative rounded-3xl bg-[#FDF5F6] border border-[#F5D5DC] p-6 sm:p-7 shadow-[0_8px_30px_rgb(184,80,100,0.08)] overflow-hidden">
              <FloralCardCorner position="bottom-right" opacity="opacity-45" />

              {/* Tiêu đề & ID gói trong CSDL */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg sm:text-xl font-bold font-serif-luxury text-[#261A1E]">
                  Thông <span className="text-[#B85064]">tin gói</span>
                </h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-white border border-[#F2C0CA] text-[#B85064]">
                  CSDL #{pkg.id}
                </span>
              </div>

              {/* Danh sách thông số từ CSDL */}
              <div className="space-y-4">
                {/* 1. Thời lượng */}
                <div className="flex items-start gap-3.5 text-xs sm:text-sm text-[#4A3C41]">
                  <div className="w-8 h-8 rounded-full bg-white text-[#B85064] flex items-center justify-center shrink-0 border border-[#F2C0CA] shadow-xs">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="pt-0.5">
                    <span className="block text-[11px] text-[#8C7D82] uppercase tracking-wider font-semibold">
                      Thời lượng chụp
                    </span>
                    <span className="font-semibold text-[#261A1E]">
                      {durationDisplay}
                    </span>
                  </div>
                </div>

                {/* 2. Bối cảnh */}
                <div className="flex items-start gap-3.5 text-xs sm:text-sm text-[#4A3C41]">
                  <div className="w-8 h-8 rounded-full bg-white text-[#B85064] flex items-center justify-center shrink-0 border border-[#F2C0CA] shadow-xs">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div className="pt-0.5">
                    <span className="block text-[11px] text-[#8C7D82] uppercase tracking-wider font-semibold">
                      Bối cảnh studio
                    </span>
                    <span className="font-semibold text-[#261A1E]">
                      {packageBackgrounds.length > 0
                        ? `${packageBackgrounds.length} bối cảnh đính kèm`
                        : 'Bối cảnh nghệ thuật studio'}
                    </span>
                  </div>
                </div>

                {/* 3. Dịch vụ kèm */}
                <div className="flex items-start gap-3.5 text-xs sm:text-sm text-[#4A3C41]">
                  <div className="w-8 h-8 rounded-full bg-white text-[#B85064] flex items-center justify-center shrink-0 border border-[#F2C0CA] shadow-xs">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="pt-0.5">
                    <span className="block text-[11px] text-[#8C7D82] uppercase tracking-wider font-semibold">
                      Dịch vụ đính kèm
                    </span>
                    <span className="font-semibold text-[#261A1E]">
                      {packageServices.length > 0
                        ? `${packageServices.length} dịch vụ trọn gói`
                        : 'Gói chụp tiêu chuẩn studio'}
                    </span>
                  </div>
                </div>

                {/* 4. Trạng thái */}
                <div className="flex items-start gap-3.5 text-xs sm:text-sm text-[#4A3C41]">
                  <div className="w-8 h-8 rounded-full bg-white text-[#B85064] flex items-center justify-center shrink-0 border border-[#F2C0CA] shadow-xs">
                    <Database className="w-4 h-4" />
                  </div>
                  <div className="pt-0.5">
                    <span className="block text-[11px] text-[#8C7D82] uppercase tracking-wider font-semibold">
                      Tình trạng hoạt động
                    </span>
                    <span className="font-semibold text-[#261A1E] uppercase">
                      {pkg.status || 'Active'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Phần hiển thị Giá gói từ CSDL */}
              <div className="mt-7 pt-5 border-t border-[#F2C0CA]/60">
                <span className="text-xs font-semibold text-[#8C7D82] block mb-0.5">
                  Giá <span className="text-[#B85064]">gói</span>
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#B85064] font-serif-luxury">
                  {priceDisplay}
                </div>
              </div>

              {/* Nút Đặt lịch ngay & Tư vấn thêm */}
              <div className="mt-6 space-y-2.5">
                <button
                  type="button"
                  onClick={handleGoToBooking}
                  className="cursor-pointer w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#B85064] to-[#A33D50] hover:from-[#A33D50] hover:to-[#8E3243] text-white font-semibold text-sm shadow-md shadow-[#B85064]/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>Đặt lịch ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsConsultModalOpen(true)}
                  className="cursor-pointer w-full py-3 px-4 rounded-xl bg-white hover:bg-[#FDF0F3] border border-[#F2C0CA] text-[#B85064] font-semibold text-sm transition-all shadow-xs"
                >
                  Tư vấn thêm
                </button>
              </div>

              {/* Ghi chú nhanh dưới nút */}
              <div className="mt-4 text-center">
                <span className="text-[11px] text-[#8C7D82]">
                  Dữ liệu đồng bộ trực tiếp từ CSDL PhotoStudio
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. PHẦN "CÓ THỂ BẠN SẼ THÍCH" (LẤY TỪ BẢNG PACKAGES TRONG CSDL) */}
        {/* ========================================================================= */}
        {recommendedPackages.length > 0 && (
          <div className="mt-14 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B85064]" />
                <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#261A1E]">
                  Các gói chụp khác từ CSDL ({recommendedPackages.length} gói)
                </h2>
              </div>

              {/* Nút điều hướng Carousel */}
              {recommendedPackages.length > 4 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCarouselIndex((prev) => Math.max(0, prev - 1))}
                    disabled={carouselIndex === 0}
                    className="cursor-pointer w-9 h-9 rounded-full bg-white border border-[#F0E4E6] flex items-center justify-center text-[#4A3C41] hover:text-[#B85064] hover:border-[#B85064] disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all"
                    title="Trước"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCarouselIndex((prev) => Math.min(1, prev + 1))}
                    disabled={carouselIndex >= 1}
                    className="cursor-pointer w-9 h-9 rounded-full bg-white border border-[#F0E4E6] flex items-center justify-center text-[#4A3C41] hover:text-[#B85064] hover:border-[#B85064] disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all"
                    title="Sau"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Lưới các thẻ gói chụp gợi ý từ CSDL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recommendedPackages.slice(carouselIndex * 4, carouselIndex * 4 + 4).map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/packages/${p.id}`)}
                  className="cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#F0E4E6] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 flex items-center justify-center">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <PackageIcon className="w-12 h-12 text-[#B85064] opacity-40" />
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-mono tracking-wider uppercase bg-white/95 backdrop-blur-sm text-[#B85064] border border-[#F5D5DC] shadow-xs">
                          Mã #{p.id}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <h3 className="text-sm font-bold text-[#261A1E] group-hover:text-[#B85064] transition-colors line-clamp-1">
                        {p.name}
                      </h3>
                      <p className="text-[11px] text-[#7A6C71] line-clamp-2 leading-relaxed">
                        {p.description || `${p.duration || 60} phút chụp tại studio`}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-[#F8EFEF]">
                    <span className="text-sm sm:text-base font-bold text-[#B85064]">
                      {p.priceDisplay}
                    </span>
                    <span className="text-xs font-semibold text-[#8C7D82] group-hover:text-[#B85064] flex items-center gap-1 transition-colors">
                      Chi tiết <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. BANNER TƯ VẤN THÊM */}
        {/* ========================================================================= */}
        <div className="mt-14 rounded-3xl bg-[#FDF3F5] border border-[#F5D5DC] p-6 sm:p-9 shadow-[0_4px_24px_rgb(184,80,100,0.06)] relative overflow-hidden">
          <FloralCardCorner position="top-right" opacity="opacity-50" />
          <FloatingPetals count={3} opacity="opacity-40" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Cột trái: Tiêu đề & nút Liên hệ ngay */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white text-[#B85064] flex items-center justify-center border border-[#F2C0CA] shadow-sm">
                  <Camera className="w-6 h-6 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#261A1E]">
                    Bạn cần tư vấn thêm về gói chụp này?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#7A6C71] mt-0.5">
                    Đội ngũ tư vấn của PhotoStudio luôn sẵn sàng hỗ trợ giải đáp chi tiết cho bạn!
                  </p>
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsConsultModalOpen(true)}
                  className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B85064] hover:bg-[#A33D50] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#B85064]/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Liên hệ ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cột phải: Thông tin liên lạc (Hotline, Địa chỉ, Email) */}
            <div className="lg:col-span-5 space-y-3 pt-4 lg:pt-0 lg:border-l lg:border-[#F2C0CA]/60 lg:pl-8 text-xs sm:text-sm text-[#4A3C41]">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-white text-[#B85064] flex items-center justify-center shrink-0 border border-[#F2C0CA] shadow-2xs mt-0.5">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-[#261A1E] block">
                    0987 654 321
                  </span>
                  <span className="text-[11px] text-[#8C7D82]">
                    (Từ 8:00 - 21:00, tất cả các ngày)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-white text-[#B85064] flex items-center justify-center shrink-0 border border-[#F2C0CA] shadow-2xs">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium">
                  123 Nguyễn Văn Cừ, Quận 1, TP.HCM
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-white text-[#B85064] flex items-center justify-center shrink-0 border border-[#F2C0CA] shadow-2xs">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium">contact@photostudio.vn</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL VIẾT ĐÁNH GIÁ GÓI CHỤP */}
      {isReviewModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsReviewModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-white border border-[#F2E8E9] shadow-2xl p-6 sm:p-7 overflow-hidden text-[#2A1D22]"
            onClick={(e) => e.stopPropagation()}
          >
            <FloralCardCorner position="top-right" opacity="opacity-60" />
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="cursor-pointer absolute top-4 right-4 p-2 rounded-full text-[#8C7D82] hover:text-[#2A1D22] hover:bg-[#FCECEF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {reviewSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#EBF8F2] text-[#2EA46D] flex items-center justify-center mx-auto border border-[#B4E8D0]">
                  <Check className="w-7 h-7 stroke-[3]" />
                </div>
                <h3 className="text-lg font-bold font-serif-luxury text-[#1F1418]">
                  Cảm Ơn Đánh Giá Của Bạn!
                </h3>
                <p className="text-xs text-[#7A6C71] leading-relaxed max-w-xs mx-auto">
                  Nhận xét của bạn về <strong>{pkg.name}</strong> đã được ghi nhận vào hệ thống CSDL PhotoStudio.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setReviewSubmitted(false);
                    setIsReviewModalOpen(false);
                  }}
                  className="cursor-pointer px-5 py-2 rounded-full bg-[#B85064] text-white text-xs font-semibold hover:bg-[#A33D50] transition-colors shadow-sm"
                >
                  Đóng
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newReviewForm.comment.trim()) {
                    alert('Vui lòng nhập nội dung đánh giá của bạn.');
                    return;
                  }
                  const reviewerName = currentCustomer?.fullname || currentCustomer?.username || 'Khách Hàng PhotoStudio';
                  const added = {
                    id: Date.now(),
                    customerName: reviewerName,
                    avatar: currentCustomer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                    rating: newReviewForm.rating,
                    createdAt: 'Hôm nay',
                    comment: newReviewForm.comment.trim(),
                    verified: true,
                    tag: pkg.name,
                    likes: 1,
                  };
                  setReviews((prev) => [added, ...prev]);
                  setReviewSubmitted(true);
                  setNewReviewForm({ name: '', rating: 5, comment: '' });

                  // Gửi lưu vào backend nếu có API
                  if (customerReviewService?.createReview) {
                    customerReviewService.createReview({
                      packageId: targetId,
                      rating: newReviewForm.rating,
                      comment: newReviewForm.comment.trim(),
                    }).catch(() => {});
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#B85064] block">
                    ĐÁNH GIÁ TRẢI NGHIỆM GÓI CHỤP
                  </span>
                  <h3 className="text-lg font-bold font-serif-luxury text-[#1F1418] mt-0.5">
                    {pkg.name}
                  </h3>
                </div>

                {/* Thông tin tài khoản người dùng đăng nhập */}
                <div className="p-3.5 rounded-2xl bg-[#FDF5F6] border border-[#F5D5DC] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#B85064] to-[#E295A2] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm overflow-hidden">
                    {currentCustomer?.avatar ? (
                      <img
                        src={currentCustomer.avatar}
                        alt={currentCustomer.fullname || currentCustomer.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{(currentCustomer?.fullname || currentCustomer?.username || 'KH').charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] text-[#8C7D82] font-medium uppercase tracking-wider">Tài khoản đánh giá</div>
                    <div className="text-sm font-bold text-[#2A1D22] truncate flex items-center gap-1.5">
                      <span>{currentCustomer?.fullname || currentCustomer?.username || 'Khách Hàng PhotoStudio'}</span>
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#EBF8F2] text-[#2EA46D]">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                        Đã đăng nhập
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3C41] mb-1">
                    Số sao đánh giá
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setNewReviewForm({ ...newReviewForm, rating: s })}
                        className="cursor-pointer p-1 text-[#F59E0B] hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${s <= newReviewForm.rating ? 'fill-[#F59E0B]' : 'text-neutral-300'}`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[#B85064] ml-2">
                      {newReviewForm.rating}.0 / 5.0
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3C41] mb-1">
                    Nhận xét & Trải nghiệm *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Chia sẻ trải nghiệm của bạn về thợ chụp, phòng studio, trang phục, makeup và chất lượng ảnh..."
                    value={newReviewForm.comment}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, comment: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DCDE] text-xs sm:text-sm focus:outline-none focus:border-[#B85064] bg-[#FAF5F5] resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="cursor-pointer w-full py-3 rounded-xl bg-[#B85064] hover:bg-[#A33D50] text-white text-xs font-semibold transition-all shadow-md shadow-[#B85064]/20"
                  >
                    Gửi đánh giá
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL YÊU CẦU ĐĂNG NHẬP KHI VIẾT ĐÁNH GIÁ */}
      {requireLoginModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setRequireLoginModalOpen(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl bg-white border border-[#F2E8E9] shadow-2xl p-6 sm:p-7 text-center overflow-hidden text-[#2A1D22]"
            onClick={(e) => e.stopPropagation()}
          >
            <FloralCardCorner position="top-right" opacity="opacity-50" />
            <button
              onClick={() => setRequireLoginModalOpen(false)}
              className="cursor-pointer absolute top-4 right-4 p-2 rounded-full text-[#8C7D82] hover:text-[#2A1D22] hover:bg-[#FCECEF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-[#FDF5F6] border border-[#F5D5DC] flex items-center justify-center mx-auto mb-4 text-[#B85064] shadow-sm">
              <MessageSquare className="w-7 h-7 stroke-[1.8]" />
            </div>

            <h3 className="text-lg font-bold font-serif-luxury text-[#1F1418] mb-2">
              Yêu Cầu Đăng Nhập
            </h3>
            <p className="text-xs text-[#7A6C71] leading-relaxed mb-6">
              Bạn cần đăng nhập tài khoản khách hàng để viết đánh giá cho gói chụp <strong>{pkg.name}</strong>. Đánh giá sẽ được ghi nhận cùng tên tài khoản của bạn.
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setRequireLoginModalOpen(false);
                  navigate(ROUTES.AUTH.LOGIN, { state: { from: location.pathname } });
                }}
                className="cursor-pointer w-full py-2.5 rounded-full bg-[#B85064] hover:bg-[#A33D50] text-white text-xs font-semibold transition-all shadow-md shadow-[#B85064]/25 flex items-center justify-center gap-1.5"
              >
                <span>Đăng nhập ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setRequireLoginModalOpen(false);
                  navigate(ROUTES.AUTH.REGISTER);
                }}
                className="cursor-pointer w-full py-2.5 rounded-full border border-[#F0E4E6] text-[#4A3C41] hover:bg-[#FAF5F5] text-xs font-semibold transition-colors"
              >
                Chưa có tài khoản? Đăng ký
              </button>

              <button
                type="button"
                onClick={() => setRequireLoginModalOpen(false)}
                className="cursor-pointer text-xs text-[#8C7D82] hover:text-[#2A1D22] pt-1"
              >
                Để sau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL ĐẶT LỊCH NGAY (GỬI TRỰC TIẾP VÀO CSDL BOOKINGS) */}
      {/* ========================================================================= */}
      {isBookingModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsBookingModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl bg-white border border-[#F2E8E9] shadow-2xl p-6 sm:p-8 overflow-hidden text-[#2A1D22]"
            onClick={(e) => e.stopPropagation()}
          >
            <FloralCardCorner position="top-right" opacity="opacity-70" />
            <FloralCardCorner position="bottom-left" opacity="opacity-60" />

            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="cursor-pointer absolute top-4 right-4 p-2 rounded-full text-[#8C7D82] hover:text-[#2A1D22] hover:bg-[#FCECEF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EBF8F2] text-[#2EA46D] flex items-center justify-center mx-auto border border-[#B4E8D0]">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-xl font-bold font-serif-luxury text-[#1F1418]">
                  Đăng Ký Đặt Lịch Thành Công!
                </h3>
                <p className="text-xs sm:text-sm text-[#7A6C71] max-w-sm mx-auto leading-relaxed">
                  Cảm ơn bạn đã lựa chọn <strong>{pkg.name}</strong> (Mã gói #{pkg.id}).
                  Studio sẽ gọi lại qua số <strong>{bookingForm.phone}</strong>{' '}
                  trong vòng 15 phút để chốt giờ chụp và hướng dẫn trang phục.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setIsBookingModalOpen(false);
                    setBookingForm({ name: '', phone: '', date: '', note: '' });
                  }}
                  className="cursor-pointer px-6 py-2.5 rounded-full bg-[#B85064] text-white text-xs font-semibold hover:bg-[#A33D50] transition-colors shadow-md"
                >
                  Hoàn tất
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#B85064] block">
                    ĐẶT LỊCH GÓI CHỤP CSDL #{pkg.id}
                  </span>
                  <h3 className="text-xl font-bold font-serif-luxury text-[#1F1418] mt-0.5">
                    {pkg.name}
                  </h3>
                </div>

                {/* Preview thông tin gói đã chọn từ CSDL */}
                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FDF5F6] border border-[#F5D5DC]">
                  {activeImage && (
                    <img
                      src={activeImage.url}
                      alt={pkg.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-[#B85064] block">
                      {priceDisplay}
                    </span>
                    <span className="text-xs text-[#7A6C71] truncate block">
                      {durationDisplay}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3C41] mb-1">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={bookingForm.name}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, name: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DCDE] text-xs sm:text-sm focus:outline-none focus:border-[#B85064] bg-[#FAF5F5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3C41] mb-1">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0912 345 678"
                      value={bookingForm.phone}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, phone: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DCDE] text-xs sm:text-sm focus:outline-none focus:border-[#B85064] bg-[#FAF5F5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3C41] mb-1">
                    Ngày chụp mong muốn
                  </label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, date: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DCDE] text-xs sm:text-sm focus:outline-none focus:border-[#B85064] bg-[#FAF5F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3C41] mb-1">
                    Khung giờ chụp
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_SLOTS.slice(0, 4).map((slot) => {
                      const isSel = selectedTimeSlot.id === slot.id;
                      return (
                        <button
                          type="button"
                          key={slot.id}
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`cursor-pointer px-2.5 py-2 rounded-xl text-[11px] font-semibold border text-center transition-all ${
                            isSel
                              ? 'bg-[#B85064] text-white border-[#B85064] shadow-xs'
                              : 'bg-white border-[#E8DCDE] text-[#4A3C41] hover:border-[#B85064]'
                          }`}
                        >
                          {slot.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3C41] mb-1">
                    Ghi chú / Yêu cầu thêm (tùy chọn)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ví dụ: Mang theo trang phục riêng, chụp phong cách hoàng hôn..."
                    value={bookingForm.note}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, note: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DCDE] text-xs focus:outline-none focus:border-[#B85064] bg-[#FAF5F5]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer w-full py-3.5 rounded-xl bg-[#B85064] hover:bg-[#A33D50] text-white font-semibold text-sm transition-all shadow-md shadow-[#B85064]/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang gửi thông tin...' : 'Xác nhận đặt lịch ngay'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL TƯ VẤN THÊM NHANH */}
      {/* ========================================================================= */}
      {isConsultModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsConsultModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-white border border-[#F2E8E9] shadow-2xl p-6 sm:p-7 overflow-hidden text-[#2A1D22]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsConsultModalOpen(false)}
              className="cursor-pointer absolute top-4 right-4 p-2 rounded-full text-[#8C7D82] hover:text-[#2A1D22] hover:bg-[#FCECEF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {consultSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#EBF8F2] text-[#2EA46D] flex items-center justify-center mx-auto border border-[#B4E8D0]">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="text-lg font-bold font-serif-luxury text-[#1F1418]">
                  Đã Nhận Yêu Cầu Tư Vấn!
                </h3>
                <p className="text-xs text-[#7A6C71] leading-relaxed">
                  Chuyên viên tư vấn của PhotoStudio sẽ gọi qua số{' '}
                  <strong>{consultPhone}</strong> trong vòng 5 – 10 phút.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setConsultSubmitted(false);
                    setIsConsultModalOpen(false);
                    setConsultPhone('');
                  }}
                  className="cursor-pointer px-5 py-2 rounded-full bg-[#B85064] text-white text-xs font-semibold"
                >
                  Đóng
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitConsult} className="space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-full bg-[#FDF5F6] text-[#B85064] flex items-center justify-center mx-auto mb-2 border border-[#F5D5DC]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold font-serif-luxury text-[#1F1418]">
                    Tư Vấn Miễn Phí {pkg.name}
                  </h3>
                  <p className="text-xs text-[#7A6C71]">
                    Để lại số điện thoại, studio sẽ gọi lại ngay để giải đáp mọi thắc mắc của bạn.
                  </p>
                </div>

                <div>
                  <input
                    type="tel"
                    required
                    placeholder="Nhập số điện thoại của bạn..."
                    value={consultPhone}
                    onChange={(e) => setConsultPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8DCDE] text-sm focus:outline-none focus:border-[#B85064] bg-[#FAF5F5]"
                  />
                </div>

                <button
                  type="submit"
                  className="cursor-pointer w-full py-3 rounded-xl bg-[#B85064] hover:bg-[#A33D50] text-white font-semibold text-xs sm:text-sm transition-all"
                >
                  Gọi lại cho tôi ngay
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. LIGHTBOX XEM ẢNH FULLSCREEN */}
      {/* ========================================================================= */}
      {lightboxIndex !== null && galleryImages[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 select-none"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="cursor-pointer absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>

          <img
            src={galleryImages[lightboxIndex].url}
            alt={galleryImages[lightboxIndex].caption}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {galleryImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) =>
                    prev === 0 ? galleryImages.length - 1 : prev - 1
                  );
                }}
                className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) =>
                    prev === galleryImages.length - 1 ? 0 : prev + 1
                  );
                }}
                className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
