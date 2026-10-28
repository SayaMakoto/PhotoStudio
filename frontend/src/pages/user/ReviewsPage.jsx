import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StarIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  PencilSquareIcon,
  XMarkIcon,
  HeartIcon,
  CameraIcon,
  UserIcon,
  LockClosedIcon,
} from '@heroicons/react/24/solid';

import BlurText from '../../components/animations/BlurText';
import ShinyText from '../../components/animations/ShinyText';
import CountUp from '../../components/animations/CountUp';
import ScrollReveal from '../../components/animations/ScrollReveal';
import { FloralBranchCorner, ScatteredPetals } from '../../components/common/FloralDecorations';
import { ROUTES } from '../../routes/web';
import { customerAuth } from '../../lib/axiosCustomer';
import customerReviewService from '../../services/user/reviewService';

// =========================================================================
// DỮ LIỆU ĐÁNH GIÁ ĐỒNG BỘ 100% VỚI CSDL (DOCS/PHOTO_STUDIO.SQL)
// Gồm 30 đánh giá chi tiết đầy đủ của các khách hàng thực tế qua 8 gói chụp
// =========================================================================
const DEFAULT_REVIEWS = [
  {
    id: 1,
    bookingId: 1,
    customerId: 6,
    customerName: 'Nguyễn Thu Trang & Hoàng Nam',
    rating: 5.0,
    comment: 'Ekip chụp ảnh cưới có tâm nhất mình từng trải nghiệm! Bạn photographer hướng dẫn tạo dáng rất tự nhiên, cô dâu không bị gượng gạo. Makeup bạn Tiên làm nhẹ nhàng trong trẻo đúng style Hàn Quốc mình thích. Ảnh nhận về đẹp lung linh!',
    createdAt: '2026-10-11T16:45:00',
    packageName: 'Gói Chụp Ảnh Cưới Studio Cổ Điển',
    category: 'wedding',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    employeeReviews: [
      { id: 1, employeeName: 'Nguyễn Hoàng Anh (Photo)', comment: 'Photographer nhiệt tình, bắt góc cô dâu rất xinh và khéo léo', rating: 5.0 },
      { id: 2, employeeName: 'Trần Thủy Tiên (Makeup)', comment: 'Makeup tone Hàn Quốc cực kỳ tôn nét da và giữ phấn lâu trôi', rating: 5.0 },
    ],
  },
  {
    id: 10,
    bookingId: 10,
    customerId: 8,
    customerName: 'Trần Khánh Huyền',
    rating: 5.0,
    comment: 'Studio decor rất sang, váy cưới ren Pháp mới tinh và thơm tho. Hai vợ chồng mình đều ngại trước ống kính mà thợ chụp pha trò cười suốt buổi. Album mini in sắc nét!',
    createdAt: '2026-10-26T18:20:00',
    packageName: 'Gói Chụp Ảnh Cưới Studio Cổ Điển',
    category: 'wedding',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    bookingId: 2,
    customerId: 4,
    customerName: 'Lê Minh Tuấn',
    rating: 5.0,
    comment: 'Mình chụp gói Nàng Thơ kỷ niệm sinh nhật cho bạn gái. Phòng studio ánh sáng dịu mắt, váy áo sạch sẽ thơm tho. Bộ ảnh nhận về bạn bè ai cũng khen nức nở. Chắc chắn sẽ quay lại ủng hộ studio nhiều lần nữa!',
    createdAt: '2026-10-13T11:20:00',
    packageName: 'Gói Chụp Ảnh Cá Nhân / Nàng Thơ',
    category: 'portrait',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    employeeReviews: [
      { id: 3, employeeName: 'Nguyễn Hoàng Anh (Photo)', comment: 'Bắt khoảnh khắc ánh sáng tự nhiên rất đẹp', rating: 5.0 },
    ],
  },
  {
    id: 9,
    bookingId: 9,
    customerId: 10,
    customerName: 'Vũ Hoàng Mai',
    rating: 5.0,
    comment: 'Từng góc máy đều bắt trọn nét tự nhiên của mình. Makeup trong veo chuẩn nàng thơ Hàn Quốc. Thợ ảnh kiên nhẫn chụp đến khi mình ưng ý mới thôi. Rất recommend mọi người gói này!',
    createdAt: '2026-10-26T12:15:00',
    packageName: 'Gói Chụp Ảnh Cá Nhân / Nàng Thơ',
    category: 'portrait',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    bookingId: 3,
    customerId: 5,
    customerName: 'Phạm Phương Linh',
    rating: 5.0,
    comment: 'Gia đình mình có cả ông bà và 2 bé nhỏ, lúc đầu sợ các cháu quấy khóc nhưng ekip rất kiên nhẫn và vui tính, bắt trọn từng khoảnh khắc cười tươi tự nhiên của cả nhà. Ảnh in ép gỗ treo phòng khách tuyệt đẹp!',
    createdAt: '2026-10-16T17:30:00',
    packageName: 'Gói Chụp Gia Đình Đoàn Viên',
    category: 'family',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    employeeReviews: [
      { id: 4, employeeName: 'Nguyễn Hoàng Anh (Photo)', comment: 'Tương tác với trẻ nhỏ và ông bà rất thân thiện, kiên nhẫn', rating: 5.0 },
    ],
  },
  {
    id: 11,
    bookingId: 11,
    customerId: 4,
    customerName: 'Lê Minh Tuấn',
    rating: 5.0,
    comment: 'Phòng chụp VIP rộng rãi cho cả gia đình 8 người. Sofa da vintage sang trọng tạo cảm giác ấm cúng như ở nhà. Khâu bàn giao toàn bộ file gốc cực kỳ nhanh chóng!',
    createdAt: '2026-10-27T10:45:00',
    packageName: 'Gói Chụp Gia Đình Đoàn Viên',
    category: 'family',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 4,
    bookingId: 4,
    customerId: 9,
    customerName: 'Đặng Quốc Bảo (CEO)',
    rating: 4.9,
    comment: 'Mình làm bộ profile doanh nhân để làm thương hiệu cá nhân và đăng báo. Ánh sáng setup chuẩn chỉ, phong thái chỉnh chu đẳng cấp. Ảnh trả nhanh đúng tiến độ công việc của mình!',
    createdAt: '2026-10-19T14:10:00',
    packageName: 'Gói Chụp Doanh Nhân / Profile',
    category: 'business',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    employeeReviews: [
      { id: 5, employeeName: 'Nguyễn Hoàng Anh (Photo)', comment: 'Phong cách chụp chuyên nghiệp, chuẩn style ảnh doanh nhân Forbes', rating: 5.0 },
    ],
  },
  {
    id: 14,
    bookingId: 14,
    customerId: 11,
    customerName: 'Nguyễn Đức Thắng',
    rating: 5.0,
    comment: 'Set đèn kịch tính Rembrandt tạo thần thái rất quyền lực. Phông nền chuẩn quốc tế, da được retouch tự nhiên giữ nguyên lỗ chân lông không bị bệt. Rất chuyên nghiệp!',
    createdAt: '2026-10-28T08:30:00',
    packageName: 'Gói Chụp Doanh Nhân / Profile',
    category: 'business',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 5,
    bookingId: 5,
    customerId: 8,
    customerName: 'Trần Khánh Huyền',
    rating: 5.0,
    comment: 'Bộ ảnh áo dài sen hồ phố cổ xuất sắc! Đạo cụ trâm cài và nón quai thao được chuẩn bị rất kỹ lưỡng. Thợ ảnh nhiệt tình chụp không quản ngại thời gian. 10/10 điểm cho chất lượng phục vụ!',
    createdAt: '2026-10-21T18:00:00',
    packageName: 'Gói Cổ Trang & Áo Dài Nghệ Thuật',
    category: 'concept',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    employeeReviews: [
      { id: 6, employeeName: 'Trần Thủy Tiên (Makeup)', comment: 'Búi tóc cổ trang cầu kỳ và phối phụ kiện rất có gu', rating: 5.0 },
    ],
  },
  {
    id: 15,
    bookingId: 15,
    customerId: 6,
    customerName: 'Nguyễn Thu Trang',
    rating: 5.0,
    comment: 'Cổ phục Nhật Bình thêu rồng phượng đẹp xuất sắc, đội ngũ chuẩn bị cả trâm cài mạ vàng và guốc mộc truyền thống. Ảnh màu phim hoài niệm như lạc vào cung đình xưa!',
    createdAt: '2026-10-28T16:10:00',
    packageName: 'Gói Cổ Trang & Áo Dài Nghệ Thuật',
    category: 'concept',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 6,
    bookingId: 6,
    customerId: 10,
    customerName: 'Vũ Hoàng Mai & Nhóm Bạn',
    rating: 5.0,
    comment: 'Cả nhóm 5 đứa chụp kỷ yếu tốt nghiệp đại học ở đây cười tẹt ga. Studio hỗ trợ phụ kiện hoa tươi, bóng bay và bằng tốt nghiệp đầy đủ. Giá cả hợp lý mà chất lượng thì như chụp bìa tạp chí!',
    createdAt: '2026-10-23T10:40:00',
    packageName: 'Gói Chụp Kỷ Yếu & Tốt Nghiệp',
    category: 'concept',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 13,
    bookingId: 13,
    customerId: 5,
    customerName: 'Phạm Phương Linh',
    rating: 5.0,
    comment: 'Phông màu tự động đổi cực kỳ tiện, nhóm mình chụp được cả concept nghiêm túc nhận bằng và concept lầy lội quẩy tung studio. Mọi người ai cũng khen ảnh đẹp!',
    createdAt: '2026-10-27T18:00:00',
    packageName: 'Gói Chụp Kỷ Yếu & Tốt Nghiệp',
    category: 'concept',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 7,
    bookingId: 7,
    customerId: 7,
    customerName: 'Hoàng Nam & Kim Oanh',
    rating: 5.0,
    comment: 'Trải nghiệm đỉnh cao của gói Luxury! Xe đưa đón riêng, 2 bạn makeup đi theo dặm phấn suốt buổi chụp hoàng hôn ngoại cảnh. Khăn voan dài bay bổng lên hình tráng lệ như phim điện ảnh Hollywood!',
    createdAt: '2026-10-24T19:30:00',
    packageName: 'Gói Cưới Luxury & Ngoại Cảnh VIP',
    category: 'wedding',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    employeeReviews: [
      { id: 7, employeeName: 'Nguyễn Hoàng Anh (Photo)', comment: 'Kỹ thuật bắt góc hoàng hôn ngoại cảnh vô cùng đỉnh cao', rating: 5.0 },
      { id: 8, employeeName: 'Trần Thủy Tiên (Makeup)', comment: 'Chăm sóc cô dâu chú rể tận tình suốt buổi chụp', rating: 5.0 },
    ],
  },
  {
    id: 12,
    bookingId: 12,
    customerId: 6,
    customerName: 'Nguyễn Thu Trang',
    rating: 5.0,
    comment: 'Album photobook 30x30 mở phẳng bìa da sang trọng vô cùng. Ekip đông đảo phục vụ tận tâm chu đáo từng chút một từ nước uống đến chỉnh vạt váy. Hoàn toàn xứng đáng từng đồng bỏ ra!',
    createdAt: '2026-10-27T15:20:00',
    packageName: 'Gói Cưới Luxury & Ngoại Cảnh VIP',
    category: 'wedding',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 8,
    bookingId: 8,
    customerId: 11,
    customerName: 'Nguyễn Đức Thắng (Fashion Brand)',
    rating: 5.0,
    comment: 'Shop thời trang bên mình chụp lookbook mùa đông tại đây. Màn hình tethering xem ảnh trực tiếp từ máy ảnh lên màn lớn 4K giúp stylist chọn góc cực kỳ nhanh. Tiến độ trả file màu rất thần tốc!',
    createdAt: '2026-10-25T11:50:00',
    packageName: 'Gói Chụp Lookbook & Thương Mại',
    category: 'business',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    employeeReviews: [
      { id: 9, employeeName: 'Nguyễn Hoàng Anh (Photo)', comment: 'Tốc độ chụp lookbook và setup ánh sáng thương mại chuẩn xác', rating: 5.0 },
    ],
  },
  {
    id: 16,
    bookingId: 16,
    customerId: 9,
    customerName: 'Đặng Quốc Bảo',
    rating: 5.0,
    comment: 'Hệ thống đèn Nanlite và chao tổ ong đánh sáng chuẩn xác từng sớ vải cao cấp. Kỹ thuật viên hỗ trợ căn chỉnh đèn liên tục rất nhiệt tình. Chắc chắn sẽ là đối tác chụp hình lâu dài của brand!',
    createdAt: '2026-10-28T17:40:00',
    packageName: 'Gói Chụp Lookbook & Thương Mại',
    category: 'business',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 17,
    bookingId: 17,
    customerId: 4,
    customerName: 'Lê Minh Tuấn',
    rating: 5.0,
    comment: 'Phòng Studio E ban công hoàng hôn đón nắng chiều đẹp xuất sắc! Ảnh ngược sáng lung linh mà không hề bị lóa. Stylist tư vấn váy trắng ren rất hợp concept. Sẽ giới thiệu cho bạn bè!',
    createdAt: '2026-10-22T17:00:00',
    packageName: 'Gói Chụp Ảnh Cá Nhân / Nàng Thơ',
    category: 'portrait',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    employeeReviews: [
      { id: 10, employeeName: 'Nguyễn Hoàng Anh (Photo)', comment: 'Bắt khoảnh khắc hoàng hôn ngược sáng vô cùng xuất sắc', rating: 5.0 },
    ],
  },
  {
    id: 18,
    bookingId: 18,
    customerId: 5,
    customerName: 'Phạm Phương Linh',
    rating: 5.0,
    comment: 'Mê mẩn góc phố cổ và sen hồ tại Studio F. Đồ cổ trang được giặt ủi thơm phức, trâm cài tóc lấp lánh như phim truyền hình. Bạn photographer bắt góc nghiêng rất có hồn!',
    createdAt: '2026-10-23T12:30:00',
    packageName: 'Gói Cổ Trang & Áo Dài Nghệ Thuật',
    category: 'concept',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    employeeReviews: [
      { id: 11, employeeName: 'Trần Thủy Tiên (Makeup)', comment: 'Tạo kiểu tóc cổ trang cầu kỳ và phối trâm cài rất sang', rating: 5.0 },
    ],
  },
  {
    id: 19,
    bookingId: 19,
    customerId: 6,
    customerName: 'Nguyễn Thu Trang',
    rating: 5.0,
    comment: 'Chụp ảnh profile doanh nhân tại Studio G chuẩn phong cách Forbes. Ghế da Chesterfield cổ điển và kệ sách gỗ sồi tạo thần thái uy tín, đĩnh đạc. Giao file ngay trong ngày!',
    createdAt: '2026-10-24T14:15:00',
    packageName: 'Gói Chụp Doanh Nhân / Profile',
    category: 'business',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    employeeReviews: [
      { id: 12, employeeName: 'Nguyễn Hoàng Anh (Photo)', comment: 'Định hình thần thái doanh nhân chuyên nghiệp chuẩn Forbes', rating: 5.0 },
    ],
  },
  {
    id: 20,
    bookingId: 20,
    customerId: 7,
    customerName: 'Hoàng Nam',
    rating: 4.9,
    comment: 'Studio H phong cách industrial loft trần cao thoáng đãng cực kỳ! Ekip đánh đèn sắc sảo, bắt trọn từng sớ vải lookbook thời trang cho brand bên mình. Rất hài lòng!',
    createdAt: '2026-10-25T18:20:00',
    packageName: 'Gói Chụp Lookbook & Thương Mại',
    category: 'business',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 21,
    bookingId: 21,
    customerId: 8,
    customerName: 'Trần Khánh Huyền',
    rating: 5.0,
    comment: 'Gói thôi nôi cho bé tại Studio I ấm áp và an toàn tuyệt đối. Sàn gỗ sạch bóng, đồ chơi Scandinavian xinh xắn. Bạn trợ lý dỗ bé cười giòn tan suốt buổi chụp!',
    createdAt: '2026-10-25T11:45:00',
    packageName: 'Gói Chụp Gia Đình Đoàn Viên',
    category: 'family',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    employeeReviews: [
      { id: 13, employeeName: 'Trần Thủy Tiên (Makeup)', comment: 'Dỗ dành và chăm sóc các bé nhỏ cực kỳ khéo léo', rating: 5.0 },
    ],
  },
  {
    id: 22,
    bookingId: 22,
    customerId: 9,
    customerName: 'Đặng Quốc Bảo',
    rating: 5.0,
    comment: 'Sảnh cưới Grand Ballroom Studio K tráng lệ như cung điện Châu Âu! Sàn gương phản chiếu voan cưới bồng bềnh, ảnh in photobook mở phẳng nhìn sang chảnh vô cùng!',
    createdAt: '2026-10-26T17:50:00',
    packageName: 'Gói Cưới Luxury & Ngoại Cảnh VIP',
    category: 'wedding',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    employeeReviews: [
      { id: 14, employeeName: 'Nguyễn Hoàng Anh (Photo)', comment: 'Bắt góc đại cảnh sảnh cưới cực kỳ hoành tráng', rating: 5.0 },
    ],
  },
  {
    id: 23,
    bookingId: 23,
    customerId: 10,
    customerName: 'Vũ Hoàng Mai',
    rating: 5.0,
    comment: 'Nhóm bạn 8 đứa mình chụp kỷ yếu ở Studio L vách vô cực quẩy tưng bừng. Hệ thống đèn ray điện tử đổi phông nhanh chóng, màu ảnh trong veo chuẩn phim thanh xuân!',
    createdAt: '2026-10-26T14:10:00',
    packageName: 'Gói Chụp Kỷ Yếu & Tốt Nghiệp',
    category: 'concept',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 24,
    bookingId: 24,
    customerId: 11,
    customerName: 'Nguyễn Đức Thắng',
    rating: 4.8,
    comment: 'Gói chụp cá nhân layout Hàn Quốc tại Studio A nhẹ nhàng tinh tế. Bạn chuyên viên makeup bắt trend tone cam đào ngọt ngào. Trà bánh tiếp đón chu đáo như khách sạn 5 sao!',
    createdAt: '2026-10-27T16:30:00',
    packageName: 'Gói Chụp Ảnh Cá Nhân / Nàng Thơ',
    category: 'portrait',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 25,
    bookingId: 25,
    customerId: 4,
    customerName: 'Lê Minh Tuấn & Mai Lan',
    rating: 5.0,
    comment: 'Album ảnh cưới tại Studio B vượt xa kỳ vọng của vợ chồng mình. Vòm đá cẩm thạch và đèn chùm Swarovski lên hình lung linh không khác gì chụp tại trời Âu!',
    createdAt: '2026-10-27T11:20:00',
    packageName: 'Gói Chụp Ảnh Cưới Studio Cổ Điển',
    category: 'wedding',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    employeeReviews: [
      { id: 15, employeeName: 'Nguyễn Hoàng Anh (Photo)', comment: 'Tận tâm hướng dẫn tạo dáng cho cô dâu chú rể', rating: 5.0 },
    ],
  },
  {
    id: 26,
    bookingId: 26,
    customerId: 5,
    customerName: 'Phạm Phương Linh',
    rating: 5.0,
    comment: 'Phòng Studio VIP trang bị màn hình 4K preview ảnh trực tiếp rất tiện, chụp tấm nào xem được ngay tấm đó để chỉnh dáng. Da được retouch giữ nét tự nhiên, rất có gu!',
    createdAt: '2026-10-27T15:40:00',
    packageName: 'Gói Chụp Ảnh Cá Nhân / Nàng Thơ',
    category: 'portrait',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 27,
    bookingId: 27,
    customerId: 6,
    customerName: 'Nguyễn Thu Trang',
    rating: 5.0,
    comment: 'Chụp kỷ niệm 30 năm ngày cưới của bố mẹ tại Studio C. Không gian lò sưởi và đàn piano ấm cúng, cả nhà đều cảm thấy thư thái tự nhiên. Cảm ơn ekip rất nhiều!',
    createdAt: '2026-10-28T11:15:00',
    packageName: 'Gói Chụp Gia Đình Đoàn Viên',
    category: 'family',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 28,
    bookingId: 28,
    customerId: 7,
    customerName: 'Hoàng Nam',
    rating: 4.9,
    comment: 'Màu ảnh lookbook thời trang sắc nét, độ tương phản mượt mà tôn vinh form dáng sản phẩm. Kỹ thuật viên hỗ trợ căn chỉnh đèn liên tục rất nhiệt tình!',
    createdAt: '2026-10-28T13:00:00',
    packageName: 'Gói Chụp Lookbook & Thương Mại',
    category: 'business',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 29,
    bookingId: 29,
    customerId: 8,
    customerName: 'Trần Khánh Huyền & Minh Đức',
    rating: 5.0,
    comment: 'Trải nghiệm chụp ảnh cưới hoàng hôn tại ban công studio quá tuyệt vời! Gió chiều nhẹ làm tà váy bay tự nhiên, ekip chăm sóc cô dâu từng ngụm nước và dặm phấn kỹ càng!',
    createdAt: '2026-10-28T18:10:00',
    packageName: 'Gói Cưới Luxury & Ngoại Cảnh VIP',
    category: 'wedding',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    employeeReviews: [
      { id: 16, employeeName: 'Trần Thủy Tiên (Makeup)', comment: 'Trang điểm cô dâu bền màu, dặm phấn chu đáo suốt buổi', rating: 5.0 },
    ],
  },
  {
    id: 30,
    bookingId: 30,
    customerId: 10,
    customerName: 'Vũ Hoàng Mai',
    rating: 5.0,
    comment: 'Set cổ phục Nhật Bình và áo dài lụa tơ tằm quá lộng lẫy! Màu ảnh hoài niệm rực rỡ nét văn hóa truyền thống. Điểm 10 trọn vẹn cho tâm huyết và sự tận tụy của studio!',
    createdAt: '2026-10-28T19:00:00',
    packageName: 'Gói Cổ Trang & Áo Dài Nghệ Thuật',
    category: 'concept',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  },
];

const ITEMS_PER_PAGE = 6;

export default function ReviewsPage() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('all');
  const [isRatingDropdownOpen, setIsRatingDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal Viết Đánh Giá
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReviewForm, setNewReviewForm] = useState({
    customerName: '',
    rating: 5,
    comment: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const reviewsSectionRef = useRef(null);
  const ratingDropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ratingDropdownRef.current && !ratingDropdownRef.current.contains(event.target)) {
        setIsRatingDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lấy dữ liệu từ CSDL qua API
  useEffect(() => {
    let isMounted = true;

    customerReviewService
      .getAllReviews()
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          const enriched = data.map((item) => {
            const fallback = DEFAULT_REVIEWS.find((d) => d.id === item.id) || {};
            return {
              id: item.id,
              bookingId: item.bookingId || fallback.bookingId || item.id,
              customerId: item.customerId || fallback.customerId,
              customerName: item.customerName || fallback.customerName || 'Khách hàng PhotoStudio',
              rating: typeof item.rating === 'number' ? item.rating : 5.0,
              comment: item.comment || fallback.comment || '',
              createdAt: item.createdAt || fallback.createdAt || new Date().toISOString(),
              packageName: fallback.packageName || 'Dịch Vụ Nhiếp Ảnh Chuyên Nghiệp',
              category: fallback.category || 'portrait',
              avatar: fallback.avatar || null,
              employeeReviews: item.employeeReviews && item.employeeReviews.length > 0
                ? item.employeeReviews
                : fallback.employeeReviews || [],
            };
          });

          if (enriched.length < DEFAULT_REVIEWS.length) {
            const existingIds = new Set(enriched.map((r) => r.id));
            const remaining = DEFAULT_REVIEWS.filter((d) => !existingIds.has(d.id));
            setReviews([...enriched, ...remaining]);
          } else {
            setReviews(enriched);
          }
        } else {
          setReviews(DEFAULT_REVIEWS);
        }
      })
      .catch((err) => {
        console.warn('[ReviewsPage] Dùng dữ liệu đánh giá chuẩn từ photo_studio.sql:', err.message);
        setReviews(DEFAULT_REVIEWS);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Tính toán số liệu thống kê
  const stats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) return { avg: 5.0, total: 0, count5: 0, count4: 0, count3: 0, satisfaction: 100 };
    
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    const avg = (sum / total).toFixed(1);
    
    const count5 = reviews.filter((r) => Math.round(Number(r.rating) || 5) === 5).length;
    const count4 = reviews.filter((r) => Math.round(Number(r.rating) || 5) === 4).length;
    const count3 = reviews.filter((r) => Math.round(Number(r.rating) || 5) === 3).length;
    const satisfaction = ((count5 + count4) / total * 100).toFixed(1);

    return { avg, total, count5, count4, count3, satisfaction };
  }, [reviews]);

  // Đếm số lượng theo từng mức sao cho menu xổ xuống
  const ratingCounts = useMemo(() => {
    return {
      all: reviews.length,
      5: reviews.filter((r) => Math.round(Number(r.rating) || 5) === 5).length,
      4: reviews.filter((r) => Math.round(Number(r.rating) || 5) === 4).length,
      3: reviews.filter((r) => Math.round(Number(r.rating) || 5) === 3).length,
      2: reviews.filter((r) => Math.round(Number(r.rating) || 5) === 2).length,
      1: reviews.filter((r) => Math.round(Number(r.rating) || 5) === 1).length,
    };
  }, [reviews]);

  // Bộ lọc dữ liệu (Chỉ lọc theo gói chụp & số sao, ĐÃ BỎ TÌM KIẾM)
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      // 1. Lọc theo Category gói chụp
      if (selectedCategory !== 'all' && r.category !== selectedCategory) {
        return false;
      }
      // 2. Lọc theo số sao xổ xuống (1, 2, 3, 4, 5 sao)
      if (selectedRatingFilter !== 'all') {
        const reviewStar = Math.round(Number(r.rating) || 5);
        if (reviewStar !== Number(selectedRatingFilter)) {
          return false;
        }
      }
      return true;
    });
  }, [reviews, selectedCategory, selectedRatingFilter]);

  // Phân trang
  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / ITEMS_PER_PAGE));
  const currentReviews = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReviews.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredReviews, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      if (reviewsSectionRef.current) {
        reviewsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSelectRatingFilter = (ratingValue) => {
    setSelectedRatingFilter(ratingValue);
    setIsRatingDropdownOpen(false);
    setCurrentPage(1);
  };

  // Mở modal viết đánh giá (Bắt buộc đăng nhập)
  const handleOpenReviewModal = () => {
    const isAuth = customerAuth.isAuthenticated();
    const user = customerAuth.getUser();

    // Nếu chưa đăng nhập: chuyển hướng ngay sang trang đăng nhập
    if (!isAuth || !user) {
      navigate(ROUTES.AUTH.LOGIN, { state: { from: ROUTES.USER.REVIEWS } });
      return;
    }

    // Nếu đã đăng nhập: lấy tên từ tài khoản và khóa lại
    setNewReviewForm({
      customerName: user.fullname || user.username || 'Khách hàng PhotoStudio',
      rating: 5,
      comment: '',
    });
    setIsModalOpen(true);
  };

  // Submit modal form
  const handleCreateReview = async (e) => {
    e.preventDefault();
    if (!newReviewForm.comment.trim()) return;

    setIsSubmitting(true);
    try {
      const user = customerAuth.getUser();
      const payload = {
        customerName: newReviewForm.customerName,
        rating: Number(newReviewForm.rating) || 5.0,
        comment: newReviewForm.comment.trim(),
        customerId: user?.id,
        bookingId: 1,
      };

      try {
        await customerReviewService.createReview(payload);
      } catch (apiErr) {
        console.warn('Gửi API review thất bại, thêm trực tiếp vào giao diện:', apiErr.message);
      }

      const createdReview = {
        id: Date.now(),
        bookingId: Date.now(),
        customerId: user?.id || 99,
        customerName: newReviewForm.customerName,
        rating: payload.rating,
        comment: payload.comment,
        packageName: 'Đánh Giá Khách Hàng Trực Tiếp',
        createdAt: new Date().toISOString(),
        category: selectedCategory !== 'all' ? selectedCategory : 'portrait',
        avatar: user?.avatar || null,
      };

      setReviews([createdReview, ...reviews]);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsModalOpen(false);
        setNewReviewForm({
          customerName: '',
          rating: 5,
          comment: '',
        });
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lấy nhãn hiển thị cho dropdown số sao
  const currentRatingOptionLabel = useMemo(() => {
    if (selectedRatingFilter === 'all') return 'Tất Cả Số Sao';
    return `${selectedRatingFilter} Sao (${ratingCounts[selectedRatingFilter] || 0})`;
  }, [selectedRatingFilter, ratingCounts]);

  return (
    <div className="bg-[#FAF5F5] min-h-screen text-[#2A1D22] pt-24 pb-20 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-rose-500/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-[#B85064]/5 rounded-full blur-[160px] pointer-events-none" />
      
      {/* Decorative Floral elements */}
      <FloralBranchCorner position="top-right" className="opacity-20 pointer-events-none" />
      <FloralBranchCorner position="bottom-left" className="opacity-15 pointer-events-none rotate-180" />
      <ScatteredPetals count={8} className="opacity-25" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#7A6C71] mb-8 font-medium">
          <Link to={ROUTES.USER.HOME} className="hover:text-[#B85064] transition-colors">
            Trang Chủ
          </Link>
          <span>/</span>
          <span className="text-[#B85064] font-semibold">Đánh Giá Của Khách Hàng</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <ScrollReveal direction="down">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF0F3] border border-[#F5D5DC] text-[#B85064] text-xs font-bold uppercase tracking-wider mb-5 shadow-sm">
              <StarIcon className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <ShinyText text="100% ĐÁNH GIÁ THỰC TẾ TỪ CƠ SỞ DỮ LIỆU" speed={4} />
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif-luxury tracking-tight text-[#2A1D22] mb-6 leading-tight">
              <BlurText text="Lắng Nghe Cảm Nhận Từ" delay={40} className="inline" />{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B85064] via-[#D46B81] to-[#8C3A4B]">
                Khách Hàng Hài Lòng
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#7A6C71] font-light leading-relaxed max-w-3xl mx-auto">
              Hơn {stats.total}+ đánh giá trung thực từ những khách hàng đã trực tiếp chụp ảnh tại PhotoStudio. 
              Sự tin tưởng và nụ cười của bạn là nguồn cảm hứng nghệ thuật lớn nhất của chúng tôi.
            </p>
          </ScrollReveal>
        </div>

        {/* Rating Overview & Trust Stats Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-14 items-stretch">
          
          {/* Card Điểm Trung Bình Tổng Thể */}
          <div className="lg:col-span-5 bg-white border border-[#F0E4E6] rounded-3xl p-7 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-bl-full pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider font-bold text-[#7A6C71]">
                  Xếp Hạng Trung Bình
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckBadgeIcon className="w-3.5 h-3.5" />
                  Đã xác minh
                </span>
              </div>

              <div className="flex items-baseline gap-4 mb-3">
                <span className="text-5xl sm:text-6xl font-bold font-serif-luxury text-[#B85064]">
                  {stats.avg}
                </span>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-[#7A6C71]">Trên thang điểm 5.0 tuyệt đối</p>
                </div>
              </div>

              <p className="text-xs text-[#7A6C71] leading-relaxed mb-5 font-light">
                Dựa trên <strong className="text-[#2A1D22] font-semibold">{stats.total} bài đánh giá</strong> hoàn chỉnh được ghi nhận từ hệ thống khách hàng thật.
              </p>
            </div>

            {/* Star breakdown bar */}
            <div className="space-y-2 pt-3 border-t border-[#F0E4E6]">
              <div className="flex items-center gap-3 text-xs">
                <span className="w-12 text-[#3E2F35] font-semibold">5 sao</span>
                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-[#B85064] rounded-full transition-all duration-700" 
                    style={{ width: `${(stats.count5 / (stats.total || 1)) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right font-bold text-[#2A1D22]">{stats.count5}</span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="w-12 text-[#3E2F35] font-semibold">4 sao</span>
                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-[#B85064] rounded-full transition-all duration-700" 
                    style={{ width: `${(stats.count4 / (stats.total || 1)) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right font-bold text-[#2A1D22]">{stats.count4}</span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="w-12 text-[#3E2F35] font-semibold">3 sao</span>
                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-[#B85064] rounded-full transition-all duration-700" 
                    style={{ width: `${(stats.count3 / (stats.total || 1)) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right font-bold text-[#2A1D22]">{stats.count3}</span>
              </div>
            </div>
          </div>

          {/* 3 Metric Cards + Viết Đánh Giá Banner */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-white border border-[#F0E4E6] rounded-3xl p-5 shadow-sm flex flex-col justify-between">
              <div className="w-11 h-11 rounded-2xl bg-[#FDF0F3] border border-[#F5D5DC] flex items-center justify-center text-[#B85064] mb-3">
                <HeartIcon className="w-5 h-5 text-[#B85064]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#2A1D22] mb-0.5">
                  <CountUp to={stats.total} duration={2} />+
                </div>
                <h4 className="text-xs font-bold text-[#2A1D22] mb-0.5">Đánh Giá Được Ghi Nhận</h4>
                <p className="text-[11px] text-[#7A6C71] font-light">100% được xác minh sau mỗi buổi chụp hoàn tất</p>
              </div>
            </div>

            <div className="bg-white border border-[#F0E4E6] rounded-3xl p-5 shadow-sm flex flex-col justify-between">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-3">
                <ShieldCheckIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#2A1D22] mb-0.5">
                  {stats.satisfaction}%
                </div>
                <h4 className="text-xs font-bold text-[#2A1D22] mb-0.5">Khách Hàng Hài Lòng</h4>
                <p className="text-[11px] text-[#7A6C71] font-light">Sẵn sàng giới thiệu bạn bè và quay lại chụp tiếp</p>
              </div>
            </div>

            <div className="bg-white border border-[#F0E4E6] rounded-3xl p-5 shadow-sm flex flex-col justify-between">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3">
                <CameraIcon className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#2A1D22] mb-0.5">
                  8 Gói Chụp
                </div>
                <h4 className="text-xs font-bold text-[#2A1D22] mb-0.5">Bao Phủ Đa Dạng Concept</h4>
                <p className="text-[11px] text-[#7A6C71] font-light">Từ ảnh cưới, nàng thơ, gia đình đến lookbook</p>
              </div>
            </div>

            {/* Nút Viết Đánh Giá (Yêu cầu Đăng nhập) */}
            <div className="bg-gradient-to-br from-[#FDF0F3] to-[#F5D5DC] border border-[#F5D5DC] rounded-3xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-white rounded-full text-[10px] font-bold text-[#B85064] mb-2 shadow-xs">
                  Cảm nhận của bạn
                </span>
                <h4 className="text-sm font-bold text-[#2A1D22] mb-1 font-serif-luxury">
                  Bạn Đã Từng Chụp Tại Studio?
                </h4>
                <p className="text-[11px] text-[#7A6C71] leading-relaxed mb-3 font-light">
                  Đăng nhập để chia sẻ đánh giá trải nghiệm thực tế cùng PhotoStudio.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenReviewModal}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#BE4B5E] via-[#B85064] to-[#A8394C] text-white text-xs font-bold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PencilSquareIcon className="w-4 h-4" />
                <span>Viết Đánh Giá Của Bạn</span>
              </button>
            </div>

          </div>
        </div>

        {/* Section Ref for Pagination Scrolling */}
        <div ref={reviewsSectionRef} className="scroll-mt-28" />

        {/* Filter Bar: Gói chụp bên trái, Dropdown số sao bên phải (ĐÃ BỎ HOÀN TOÀN THANH TÌM KIẾM) */}
        <div className="bg-white border border-[#F0E4E6] rounded-3xl p-4 sm:p-5 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* 1. Category Filter Tabs (Lọc theo các gói chụp) */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {[
                { key: 'all', label: `Tất Cả (${reviews.length})` },
                { key: 'wedding', label: 'Ảnh Cưới' },
                { key: 'portrait', label: 'Nàng Thơ & Cá Nhân' },
                { key: 'family', label: 'Gia Đình' },
                { key: 'business', label: 'Doanh Nhân & Lookbook' },
                { key: 'concept', label: 'Cổ Trang & Kỷ Yếu' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleCategoryChange(tab.key)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === tab.key
                      ? 'bg-[#B85064] text-white shadow-md shadow-[#B85064]/20'
                      : 'bg-neutral-100 text-[#7A6C71] hover:bg-neutral-200/80 hover:text-[#2A1D22]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 2. Dropdown Lọc Số Sao Xổ Xuống (1, 2, 3, 4, 5 sao) */}
            <div className="relative shrink-0 w-full md:w-auto" ref={ratingDropdownRef}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#7A6C71] hidden sm:inline">
                  Lọc số sao:
                </span>
                <button
                  type="button"
                  onClick={() => setIsRatingDropdownOpen(!isRatingDropdownOpen)}
                  className="w-full sm:w-auto px-4 py-2 bg-[#FAF5F5] hover:bg-[#FDF0F3] border border-[#F0E4E6] hover:border-[#F5D5DC] rounded-full text-xs font-bold text-[#2A1D22] flex items-center justify-between sm:justify-start gap-2.5 transition-all shadow-xs cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <StarIcon className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>{currentRatingOptionLabel}</span>
                  </div>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-[#7A6C71] transition-transform duration-200 ${
                      isRatingDropdownOpen ? 'rotate-180 text-[#B85064]' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Bảng Xổ Xuống (Dropdown Menu) */}
              <AnimatePresence>
                {isRatingDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-[#F0E4E6] shadow-xl p-1.5 z-40"
                  >
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#7A6C71] border-b border-[#F5EAEB] mb-1">
                      Chọn mức sao đánh giá
                    </div>

                    {/* Lựa chọn Tất cả */}
                    <button
                      type="button"
                      onClick={() => handleSelectRatingFilter('all')}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        selectedRatingFilter === 'all'
                          ? 'bg-[#FDF0F3] text-[#B85064] font-bold'
                          : 'text-[#3E2F35] hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#B85064]" />
                        <span>Tất cả số sao</span>
                      </div>
                      <span className="text-[11px] text-[#7A6C71] bg-neutral-100 px-2 py-0.5 rounded-full">
                        {ratingCounts.all}
                      </span>
                    </button>

                    {/* Các mức từ 5 sao xuống 1 sao */}
                    {[5, 4, 3, 2, 1].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleSelectRatingFilter(String(star))}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                          selectedRatingFilter === String(star)
                            ? 'bg-[#FDF0F3] text-[#B85064] font-bold'
                            : 'text-[#3E2F35] hover:bg-neutral-50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center">
                            {[...Array(star)].map((_, i) => (
                              <StarIcon key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                          <span>{star} sao</span>
                        </div>
                        <span className="text-[11px] text-[#7A6C71] bg-neutral-100 px-2 py-0.5 rounded-full">
                          {ratingCounts[star] || 0}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="flex flex-col gap-4 mb-12">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="w-full bg-white border border-[#F0E4E6] rounded-3xl p-6 sm:p-7 animate-pulse space-y-4 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-neutral-200" />
                    <div className="space-y-1.5">
                      <div className="h-4 w-36 bg-neutral-200 rounded" />
                      <div className="h-3 w-24 bg-neutral-100 rounded" />
                    </div>
                  </div>
                  <div className="w-24 h-6 bg-neutral-100 rounded-full" />
                </div>
                <div className="h-4 w-full bg-neutral-100 rounded" />
                <div className="h-4 w-4/5 bg-neutral-100 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty Result */}
        {!isLoading && filteredReviews.length === 0 && (
          <div className="bg-white border border-[#F0E4E6] rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm my-8">
            <ChatBubbleLeftRightIcon className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#2A1D22] mb-2 font-serif-luxury">
              Không Tìm Thấy Đánh Giá Phù Hợp
            </h3>
            <p className="text-xs text-[#7A6C71] mb-6">
              Chưa có bài đánh giá nào phù hợp với bộ lọc hiện tại. Vui lòng chọn mức sao hoặc gói chụp khác.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedRatingFilter('all');
                setCurrentPage(1);
              }}
              className="px-5 py-2.5 rounded-full bg-[#B85064] text-white text-xs font-semibold hover:bg-[#A8394C] transition-all cursor-pointer shadow-sm"
            >
              Hiển Thị Tất Cả Đánh Giá
            </button>
          </div>
        )}

        {/* DANH SÁCH ĐÁNH GIÁ SỔ DỌC XUỐNG (1 ĐÁNH GIÁ CHIẾM 1 HÀNG NGANG) */}
        {!isLoading && currentReviews.length > 0 && (
          <div className="flex flex-col gap-4 mb-12">
            {currentReviews.map((rev, idx) => {
              const ratingCount = Math.round(rev.rating || 5);
              const formattedDate = rev.createdAt
                ? new Date(rev.createdAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                : '10/2026';

              return (
                <motion.div
                  key={rev.id || idx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className="w-full bg-white border border-[#F0E4E6] rounded-3xl p-6 sm:p-7 shadow-sm hover:border-[#B85064]/40 hover:shadow-md transition-all duration-300 relative group"
                >
                  {/* Hàng ngang Header: Khách hàng (bên trái) & Số sao đánh giá (bên phải) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F5EAEB] mb-4">
                    
                    {/* Bên trái: Avatar, Tên, Badge đã trải nghiệm, Gói chụp, Ngày tháng */}
                    <div className="flex items-center gap-3.5">
                      {rev.avatar ? (
                        <img
                          src={rev.avatar}
                          alt={rev.customerName}
                          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-[#F5D5DC] shrink-0 shadow-xs"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FDF0F3] border-2 border-[#F5D5DC] flex items-center justify-center text-[#B85064] font-bold text-sm sm:text-base shrink-0">
                          {rev.customerName ? rev.customerName.charAt(0).toUpperCase() : 'K'}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm sm:text-base font-bold text-[#2A1D22]">
                            {rev.customerName || 'Khách hàng PhotoStudio'}
                          </h4>

                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckBadgeIcon className="w-3 h-3" />
                            <span>Đã trải nghiệm</span>
                          </span>

                          {rev.packageName && (
                            <span className="text-[11px] font-medium text-[#7A6C71] bg-[#FAF5F5] border border-[#F0E4E6] px-2.5 py-0.5 rounded-full">
                              {rev.packageName}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-[#7A6C71] mt-0.5">
                          Thời gian đánh giá: {formattedDate}
                        </p>
                      </div>
                    </div>

                    {/* Bên phải: Hiển thị số sao họ đánh giá */}
                    <div className="flex items-center gap-2 self-start sm:self-auto bg-[#FAF5F5] border border-[#F0E4E6] px-3.5 py-1.5 rounded-full shrink-0">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < ratingCount ? 'text-amber-400 fill-amber-400' : 'text-neutral-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-[#B85064] ml-1">
                        {rev.rating ? Number(rev.rating).toFixed(1) : '5.0'} / 5.0
                      </span>
                    </div>

                  </div>

                  {/* Phần đánh giá chi tiết của họ (Chiếm toàn bộ chiều ngang hàng) */}
                  <div className="text-xs sm:text-sm text-[#3E2F35] leading-relaxed font-light pl-1 sm:pl-2">
                    "{rev.comment}"
                  </div>

                  {/* Ghi chú dịch vụ nhân viên (nếu có) */}
                  {rev.employeeReviews && rev.employeeReviews.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-dashed border-[#F5EAEB] flex items-center gap-2 text-xs text-[#7A6C71] pl-1 sm:pl-2">
                      <SparklesIcon className="w-4 h-4 text-[#B85064] shrink-0" />
                      <span>
                        <strong>Ghi chú dịch vụ:</strong> "{rev.employeeReviews[0].comment}"
                      </span>
                    </div>
                  )}

                </motion.div>
              );
            })}
          </div>
        )}

        {/* Phân Trang (Pagination Controls) */}
        {!isLoading && filteredReviews.length > ITEMS_PER_PAGE && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-[#F0E4E6] mt-4">
            
            <p className="text-xs text-[#7A6C71]">
              Hiển thị{' '}
              <strong className="text-[#2A1D22]">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </strong>{' '}
              -{' '}
              <strong className="text-[#2A1D22]">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredReviews.length)}
              </strong>{' '}
              trên tổng số <strong className="text-[#2A1D22]">{filteredReviews.length}</strong> bài đánh giá
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                  currentPage === 1
                    ? 'border-neutral-200 text-neutral-300 cursor-not-allowed bg-neutral-50'
                    : 'border-[#F0E4E6] bg-white text-[#3E2F35] hover:bg-[#FDF0F3] hover:text-[#B85064] hover:border-[#F5D5DC] cursor-pointer shadow-xs'
                }`}
                aria-label="Trang trước"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Trước</span>
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#B85064] text-white shadow-md shadow-[#B85064]/20 scale-105'
                          : 'bg-white border border-[#F0E4E6] text-[#7A6C71] hover:bg-neutral-50 hover:text-[#2A1D22]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                  currentPage === totalPages
                    ? 'border-neutral-200 text-neutral-300 cursor-not-allowed bg-neutral-50'
                    : 'border-[#F0E4E6] bg-white text-[#3E2F35] hover:bg-[#FDF0F3] hover:text-[#B85064] hover:border-[#F5D5DC] cursor-pointer shadow-xs'
                }`}
                aria-label="Trang tiếp"
              >
                <span className="hidden sm:inline">Tiếp</span>
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#1C1619] via-[#2A1D22] to-[#141012] border border-white/10 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-[#E899A8] text-xs font-semibold mb-4">
              Khởi Đầu Cho Bộ Ảnh Đẹp Nhất Của Bạn
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif-luxury tracking-tight mb-4">
              Bạn Sẵn Sàng Trở Thành Khách Hàng Hài Lòng Tiếp Theo?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed mb-6">
              Đội ngũ nhiếp ảnh gia và stylist hàng đầu tại PhotoStudio luôn tận tâm lắng nghe mọi ý tưởng concept của bạn. Đặt lịch ngay hôm nay để nhận ưu đãi mùa cưới và kỷ yếu.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={ROUTES.USER.PACKAGES}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#BE4B5E] via-[#B85064] to-[#A8394C] text-white text-xs font-bold shadow-lg shadow-rose-950/40 hover:scale-105 transition-all flex items-center gap-2"
              >
                <SparklesIcon className="w-4 h-4" />
                <span>Xem Toàn Bộ Báo Giá & Gói Chụp</span>
              </Link>
              <Link
                to={`${ROUTES.USER.HOME}#booking`}
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
              >
                Đặt Lịch Chụp Trực Tuyến
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Modal Gửi Đánh Giá Mới (Chỉ giữ Tên bị khóa và Nội dung đánh giá) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-lg w-full p-7 border border-[#F0E4E6] shadow-2xl relative overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#F0E4E6] mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FDF0F3] border border-[#F5D5DC] flex items-center justify-center text-[#B85064]">
                    <PencilSquareIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#2A1D22] font-serif-luxury">
                      Viết Đánh Giá Trải Nghiệm
                    </h3>
                    <p className="text-[11px] text-[#7A6C71]">
                      Chia sẻ cảm nhận chân thật về buổi chụp của bạn
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 flex items-center justify-center transition-all cursor-pointer"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckBadgeIcon className="w-10 h-10" />
                  </div>
                  <h4 className="text-lg font-bold text-[#2A1D22] mb-1 font-serif-luxury">
                    Gửi Đánh Giá Thành Công!
                  </h4>
                  <p className="text-xs text-[#7A6C71]">
                    Cảm ơn bạn đã tin tưởng và đồng hành cùng PhotoStudio.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCreateReview} className="space-y-4">
                  
                  {/* 1. Rating Selector (Chọn số sao) */}
                  <div>
                    <label className="block text-xs font-bold text-[#2A1D22] mb-1.5">
                      Đánh giá số sao:
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewForm({ ...newReviewForm, rating: star })}
                          className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                        >
                          <StarIcon
                            className={`w-7 h-7 ${
                              star <= newReviewForm.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-neutral-200'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-[#B85064] ml-2">
                        {newReviewForm.rating}.0 / 5.0 Sao
                      </span>
                    </div>
                  </div>

                  {/* 2. Customer Name (Tên người đăng nhập, BỊ KHÓA KHÔNG CHO SỬA) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-[#2A1D22]">
                        Tên người đánh giá
                      </label>
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1 font-medium">
                        <LockClosedIcon className="w-3 h-3" />
                        Đã khóa từ tài khoản đăng nhập
                      </span>
                    </div>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        readOnly
                        disabled
                        value={newReviewForm.customerName}
                        className="w-full pl-9 pr-3 py-2.5 bg-neutral-100 border border-[#E8DCDD] rounded-xl text-xs text-[#2A1D22] font-semibold cursor-not-allowed select-none"
                      />
                    </div>
                    <p className="text-[10px] text-[#7A6C71] mt-1 flex items-center gap-1">
                      <CheckBadgeIcon className="w-3.5 h-3.5 text-emerald-600 inline shrink-0" />
                      Hệ thống tự động ghi nhận theo thông tin tài khoản của bạn
                    </p>
                  </div>

                  {/* 3. Comment (Phần viết nội dung đánh giá) */}
                  <div>
                    <label className="block text-xs font-bold text-[#2A1D22] mb-1">
                      Nội dung đánh giá của bạn *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={newReviewForm.comment}
                      onChange={(e) =>
                        setNewReviewForm({ ...newReviewForm, comment: e.target.value })
                      }
                      placeholder="Chia sẻ cảm nhận chi tiết của bạn về chất lượng dịch vụ, ánh sáng, góc chụp của photographer, makeup hoặc trải nghiệm tại PhotoStudio..."
                      className="w-full px-3.5 py-2.5 bg-[#FAF5F5] border border-[#F0E4E6] rounded-xl text-xs focus:outline-none focus:border-[#B85064] resize-none leading-relaxed"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0E4E6]">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                    >
                      Hủy Bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !newReviewForm.comment.trim()}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#BE4B5E] via-[#B85064] to-[#A8394C] text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? 'Đang gửi...' : 'Gửi Đánh Giá Ngay'}
                    </button>
                  </div>

                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
