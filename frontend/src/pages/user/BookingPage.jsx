import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SquaresPlusIcon } from '@heroicons/react/24/solid';
import {
  Calendar,
  Clock,
  Users,
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Camera,
  ShieldCheck,
  HelpCircle,
  Phone,
  Mail,
  User,
  Tag,
  Receipt,
  RotateCcw,
  AlertCircle,
  Lock,
  X,
  CreditCard,
} from 'lucide-react';
import {
  FloralBranchCorner,
  FloralCardCorner,
} from '../../components/common/FloralDecorations';
import { ROUTES } from '../../routes/web';
import { customerAuth } from '../../lib/axiosCustomer';
import customerAuthService, { CSDL_SEED_USERS } from '../../services/user/authService';
import customerRoomService from '../../services/user/roomService';
import customerPackageService from '../../services/user/packageService';
import customerServiceService from '../../services/user/serviceService';
import customerBookingService from '../../services/user/bookingService';
import customerPaymentService from '../../services/user/paymentService';
import { createVNPayPaymentUrl } from '../../lib/vnpay';
import { validateVietnamesePhone } from '../../utils/phoneValidator';

// =========================================================================
// TIỆN ÍCH NGÀY THÁNG CHUẨN VIỆT NAM (KHÔNG BỊ LỆCH MÚI GIỜ UTC)
// =========================================================================
export function getVietnamLocalDate(d = new Date()) {
  const dateObj = d instanceof Date ? d : new Date(d);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// =========================================================================
// DỮ LIỆU CHUẨN TRÍCH XUẤT TỪ CSDL DOCS/PHOTO_STUDIO.SQL
// =========================================================================

// 1. CSDL PACKAGES (8 GÓI CHỤP THỰC TẾ TRONG DATABASE)
const CSDL_PACKAGES = [
  {
    id: 1,
    name: 'Gói Chụp Ảnh Cá Nhân',
    isPopular: true,
    description: 'Chụp studio 60 phút tone Pastel Hàn Quốc, hỗ trợ 1 set trang phục Vintage, makeup cơ bản và retouch 15 ảnh chuyên sâu.',
    durationText: '1–2 giờ (60 phút)',
    durationMinutes: 60,
    maxPeople: 3,
    capacityText: '1–3 người',
    price: 990000,
    originalPrice: 1290000,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    name: 'Gói Chụp Ảnh Cưới',
    isPopular: false,
    description: 'Chụp 120 phút với 2 bối cảnh Cung Điện & Cổ Điển, 1 váy cưới ren Pháp, 1 tuxedo nam cao cấp, makeup cô dâu và tặng album mini 15x21.',
    durationText: '2–3 giờ (120 phút)',
    durationMinutes: 120,
    maxPeople: 2,
    capacityText: '2 người (Cặp đôi)',
    price: 2990000,
    originalPrice: 3800000,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    name: 'Gói Chụp Ảnh Gia Đình / Nhóm Bạn',
    isPopular: false,
    description: 'Chụp phòng lớn VIP đa năng trong 90 phút cho nhóm 4-8 thành viên, đạo cụ sofa cổ điển, bàn giao toàn bộ file gốc và chỉnh sửa 25 ảnh.',
    durationText: '1.5–2 giờ (90 phút)',
    durationMinutes: 90,
    maxPeople: 8,
    capacityText: '4–8 người',
    price: 1890000,
    originalPrice: 2400000,
    image: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    name: 'Gói Chụp Cưới Luxury & Ngoại Cảnh VIP',
    isPopular: false,
    description: 'Trải nghiệm đẳng cấp 240 phút kết hợp studio và ngoại cảnh hoàng hôn, 3 bộ trang phục cao cấp, 2 layout makeup, ekip riêng và album photobook 30x30.',
    durationText: '4–5 giờ (240 phút)',
    durationMinutes: 240,
    maxPeople: 6,
    capacityText: '2–6 người',
    price: 5990000,
    originalPrice: 7500000,
    image: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 5,
    name: 'Gói Chụp Kỷ Yếu & Tốt Nghiệp',
    isPopular: false,
    description: 'Dành cho học sinh sinh viên cá nhân hoặc nhóm 2-5 bạn, chụp 90 phút với phông màu tự động, phụ kiện bằng tốt nghiệp và hoa tươi.',
    durationText: '1.5–2 giờ (90 phút)',
    durationMinutes: 90,
    maxPeople: 5,
    capacityText: '2–5 người',
    price: 1490000,
    originalPrice: 1900000,
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 6,
    name: 'Gói Chụp Doanh Nhân & Profile Thương Hiệu',
    isPopular: false,
    description: 'Chụp ảnh chân dung lãnh đạo, profile doanh nghiệp chuẩn tạp chí Forbes trong 60 phút, set ánh sáng kịch tính Rembrandt và retouch da tự nhiên.',
    durationText: '1–1.5 giờ (60 phút)',
    durationMinutes: 60,
    maxPeople: 2,
    capacityText: '1–2 người',
    price: 1290000,
    originalPrice: 1600000,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 7,
    name: 'Gói Chụp Nghệ Thuật Cổ Trang & Áo Dài',
    isPopular: false,
    description: 'Chụp 90 phút với bối cảnh phố cổ và sen hồ, hỗ trợ áo dài tơ tằm thêu tay hoặc cổ phục Việt, làm tóc và phụ kiện trâm cài truyền thống.',
    durationText: '1.5–2 giờ (90 phút)',
    durationMinutes: 90,
    maxPeople: 4,
    capacityText: '1–4 người',
    price: 1690000,
    originalPrice: 2100000,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 8,
    name: 'Gói Chụp Lookbook Thời Trang & Sản Phẩm',
    isPopular: false,
    description: 'Chụp 120 phút trên phông Cyclorama vô cực, hệ thống thanh treo ray điện, hỗ trợ stylist và tản sáng chuẩn studio quốc tế.',
    durationText: '2–3 giờ (120 phút)',
    durationMinutes: 120,
    maxPeople: 6,
    capacityText: '2–6 người',
    price: 2490000,
    originalPrice: 3200000,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
  },
];

// 2. CSDL ROOMS (12 KHÔNG GIAN PHÒNG CHỤP TRONG DATABASE)
const CSDL_ROOMS = [
  {
    id: 1,
    name: 'Phòng Studio A - Phong Cách Hàn Quốc',
    isSuitable: true,
    capacity: 5,
    capacityText: '3–5 người',
    surcharge: 0,
    description: 'Tone màu sáng pastel, rèm voan trắng, hoa khô nghệ thuật, chuyên chân dung, nàng thơ và layout nhẹ nhàng.',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    name: 'Phòng Studio B - Concept Cổ Điển & Hoàng Gia',
    isSuitable: false,
    capacity: 10,
    capacityText: '5–10 người',
    surcharge: 200000,
    description: 'Diện tích 75m2, trần cao 4.2m, nội thất gỗ sồi cao cấp, đèn chùm pha lê, chuyên ảnh cưới VIP và dạ tiệc sang trọng.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    name: 'Phòng Studio VIP - Cinema & Đa Năng',
    isSuitable: false,
    capacity: 8,
    capacityText: '4–8 người',
    surcharge: 300000,
    description: 'Trang bị hệ thống chiếu sáng kịch tính Arri/Aputure, dàn phông màu điện tử 8 màu tự động, phù hợp profile doanh nhân & lookbook.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    name: 'Phòng Studio C - Không Gian Gia Đình Vintage',
    isSuitable: false,
    capacity: 12,
    capacityText: '6–12 người',
    surcharge: 250000,
    description: 'Bối cảnh phòng khách ấm cúng với sofa nhung cổ, lò sưởi, đàn piano cơ, chuyên ảnh gia đình đa thế hệ và thôi nôi.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 5,
    name: 'Phòng Studio D - Concept Monochromatic',
    isSuitable: false,
    capacity: 6,
    capacityText: '2–6 người',
    surcharge: 150000,
    description: 'Tường xi măng công nghiệp tối giản, hệ thống tản sáng khổ lớn, chuyên lookbook thời trang thương hiệu và nghệ thuật đen trắng.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 6,
    name: 'Phòng Studio E - Ban Công Hoàng Hôn & Vườn Kính',
    isSuitable: false,
    capacity: 6,
    capacityText: '2–6 người',
    surcharge: 200000,
    description: 'Không gian đón trọn ánh sáng tự nhiên hoàng hôn với cửa kính panorama và giàn hoa nghệ thuật cho cặp đôi.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 7,
    name: 'Phòng Studio F - Phong Cách Á Đông & Cổ Phục',
    isSuitable: false,
    capacity: 8,
    capacityText: '4–8 người',
    surcharge: 200000,
    description: 'Tường vàng rêu phong hoài niệm, hồ sen tiểu cảnh và đèn lồng lụa chuyên chụp áo dài truyền thống và cổ phục.',
    image: 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 8,
    name: 'Phòng Studio G - Thư Viện Quý Tộc & Gỗ Trầm',
    isSuitable: false,
    capacity: 6,
    capacityText: '2–6 người',
    surcharge: 250000,
    description: 'Kệ sách gỗ sồi kịch trần, sofa da bò Chesterfield cổ điển chuyên chụp profile chuyên gia và gia đình cao cấp.',
    image: 'https://images.unsplash.com/photo-1507842229450-79989d4d989f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 9,
    name: 'Phòng Studio H - Industrial Loft Sáng Tạo',
    isSuitable: false,
    capacity: 8,
    capacityText: '4–8 người',
    surcharge: 200000,
    description: 'Trần cao bê tông mộc nghệ thuật, khung thép phong cách New York loft chuyên chụp lookbook street-style và nghệ thuật.',
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 10,
    name: 'Phòng Studio I - Không Gian Em Bé & Thôi Nôi',
    isSuitable: false,
    capacity: 5,
    capacityText: '2–5 người',
    surcharge: 100000,
    description: 'Không gian an toàn decor tone pastel ngọt ngào, đồ chơi gỗ Scandinavian chuyên chụp cho bé và mẹ bầu.',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 11,
    name: 'Phòng Studio K - Sảnh Cưới Grand Ballroom',
    isSuitable: false,
    capacity: 12,
    capacityText: '6–12 người',
    surcharge: 500000,
    description: 'Sàn gương bóng bẩy, vòm hoa cưới khổng lồ và đèn chùm pha lê lộng lẫy chuyên ảnh cưới dạ hội sang trọng.',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 12,
    name: 'Phòng Studio L - High-End Cyclorama Vô Cực',
    isSuitable: false,
    capacity: 10,
    capacityText: '4–10 người',
    surcharge: 350000,
    description: 'Vách cong vô cực 3D 180 độ tiêu chuẩn quốc tế, hệ thống thanh treo ray điện chuyên nghiệp cho thương mại điện tử.',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80',
  },
];

// 3. CSDL SERVICES (8 DỊCH VỤ GIA TĂNG THỰC TẾ TRONG DATABASE)
const CSDL_SERVICES = [
  {
    id: 1,
    name: 'Trang Điểm & Làm Tóc Chuyên Nghiệp (Layout 1)',
    price: 300000,
    description: 'Layout makeup cá nhân phù hợp từng đường nét gương mặt và concept chụp.',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    name: 'Trang Điểm Thay Layout Thứ 2 Trong Buổi Chụp',
    price: 200000,
    description: 'Dặm phấn, thay đổi màu son và kiểu tóc sang concept trang phục mới.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    name: 'Chỉnh Sửa Ảnh Chuyên Sâu (Retouch Da & Dáng 10 Ảnh)',
    price: 250000,
    description: 'Kỹ thuật Frequency Separation giữ vân da thật, cân chỉnh màu sắc điện ảnh.',
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 4,
    name: 'Thuê Phụ Kiện Không Giới Hạn Toàn Buổi',
    price: 150000,
    description: 'Sử dụng toàn bộ vương miện, hoa cưới, đạo cụ trong studio suốt buổi chụp.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 5,
    name: 'In Album Photobook Mở Phẳng Cao Cấp 25x25 (20 Trang)',
    price: 850000,
    description: 'In giấy mỹ thuật phủ màng UV chống ẩm mốc, bìa bọc da sang trọng.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 6,
    name: 'In Ảnh Cổng Pha Lê Tráng Gương Khổ Lớn 60x90cm',
    price: 650000,
    description: 'Khung viền mạ vàng, bề mặt tráng gương chống lóa sắc nét sang trọng.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 7,
    name: 'Quay Video Highlight Hậu Kỳ Cinematic 4K (60 Giây)',
    price: 900000,
    description: 'Video dọc định dạng Reels/TikTok/Shorts ghi lại hậu trường lung linh.',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 8,
    name: 'Thuê Thêm Trang Phục Thiết Kế (1 Bộ / Concept)',
    price: 200000,
    description: 'Tự chọn váy cưới ren Pháp, áo dài hoặc vest cao cấp kèm hỗ trợ là ủi hơi nước.',
    image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=400&q=80',
  },
];

const TIME_SLOTS_DATA = {
  morning: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00'],
  afternoon: ['13:00', '14:00', '15:00', '16:00', '17:00'],
  evening: ['18:00', '19:00', '20:00', '21:00', '22:00'],
};

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Xác thực đăng nhập
  const [currentUser, setCurrentUser] = useState(() => customerAuth.getUser());
  const isAuthenticated = Boolean(currentUser && (currentUser.id || currentUser.username));

  // STEP WIZARD: 1 = Chọn dịch vụ, 2 = Ngày & giờ, 3 = Xác nhận
  const [currentStep, setCurrentStep] = useState(1);

  // Dữ liệu API / CSDL
  const [packages, setPackages] = useState(CSDL_PACKAGES);
  const [rooms, setRooms] = useState(CSDL_ROOMS);
  const [servicesList, setServicesList] = useState(CSDL_SERVICES);
  const [existingBookings, setExistingBookings] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // BƯỚC 1: LỰA CHỌN THEO TIẾN TRÌNH TUẦN TỰ (CHỌN GÓI XONG MỚI HIỆN PHÒNG, CHỌN PHÒNG XONG MỚI HIỆN DỊCH VỤ)
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isPackageCollapsed, setIsPackageCollapsed] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isRoomCollapsed, setIsRoomCollapsed] = useState(false);

  const [selectedServices, setSelectedServices] = useState([]);
  const [isServiceOptOut, setIsServiceOptOut] = useState(false); // Xác nhận KHÔNG dùng dịch vụ bổ sung
  const [isServicesCollapsed, setIsServicesCollapsed] = useState(false);

  // BƯỚC 2: NGÀY & GIỜ (CHUẨN HÓA LỊCH VIỆT NAM & LOẠI BỎ GIỜ ĐÃ QUA)
  const [weekOffset, setWeekOffset] = useState(0); // 0 = tuần này, tối đa 8 tuần (~60 ngày)
  const [selectedDate, setSelectedDate] = useState(() => getVietnamLocalDate(new Date()));
  const [selectedSlot, setSelectedSlot] = useState('');

  // BƯỚC 3: THÔNG TIN KHÁCH HÀNG & MÃ GIẢM GIÁ
  const [fullName, setFullName] = useState(currentUser?.fullname || currentUser?.username || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const [email, setEmail] = useState(currentUser?.email || '');
  const [attendees, setAttendees] = useState(1);
  const [customerNote, setCustomerNote] = useState('');

  // TÙY CHỌN MỨC ĐẶT CỌC / THANH TOÁN: 30% | 50% | 100%
  const [depositPercent, setDepositPercent] = useState(30);

  // Mã giảm giá
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Trạng thái nộp đơn
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Modal đăng nhập lồng trực tiếp trên trang khi khách chưa đăng nhập
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Cập nhật thông tin khách hàng nếu tài khoản đăng nhập thay đổi
  useEffect(() => {
    if (currentUser) {
      if (!fullName) setFullName(currentUser.fullname || currentUser.username || '');
      if (!phone) setPhone(currentUser.phone || '');
      if (!email) setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  // Kiểm tra số điện thoại mỗi khi người dùng thay đổi
  const handlePhoneChange = (e) => {
    // Chỉ cho phép nhập ký tự số và tối đa đúng 10 số
    const cleanDigits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(cleanDigits);

    if (phoneTouched) {
      const check = validateVietnamesePhone(cleanDigits);
      setPhoneError(check.isValid ? '' : check.message);
    }
  };

  const handlePhoneBlur = () => {
    setPhoneTouched(true);
    const check = validateVietnamesePhone(phone);
    setPhoneError(check.isValid ? '' : check.message);
  };

  // Tải dữ liệu Gói, Phòng, Dịch vụ và Bookings từ Backend (nếu backend đang chạy)
  useEffect(() => {
    let isMounted = true;
    setLoadingData(true);

    const fetchData = async () => {
      try {
        const [pkgRes, roomRes, srvRes, bkgRes] = await Promise.allSettled([
          customerPackageService.getAllPackages(),
          customerRoomService.getAllRooms(),
          customerServiceService.getAllServices(),
          customerBookingService.getAllBookings(),
        ]);

        if (!isMounted) return;

        // Xử lý Gói chụp từ CSDL
        if (pkgRes.status === 'fulfilled' && Array.isArray(pkgRes.value?.data) && pkgRes.value.data.length > 0) {
          const mappedPackages = pkgRes.value.data
            .filter((p) => p.status === 'active' || !p.status)
            .map((p, idx) => ({
              id: p.id,
              name: p.name || `Gói chụp #${p.id}`,
              isPopular: idx === 0,
              description: p.description || 'Chụp ảnh chuyên nghiệp tại PhotoStudio.',
              durationText: `${Math.round((p.duration || 60) / 60)}–${Math.round((p.duration || 60) / 60) + 1} giờ (${p.duration || 60} phút)`,
              durationMinutes: p.duration || 60,
              maxPeople: p.id === 4 ? 6 : p.id === 3 ? 8 : p.id === 2 ? 2 : 3,
              capacityText: `${p.id === 2 ? '2 người' : `1–${p.id === 4 ? 6 : p.id === 3 ? 8 : 3} người`}`,
              price: Number(p.price || 990000),
              originalPrice: Math.round(Number(p.price || 990000) * 1.25),
              image: p.image || CSDL_PACKAGES[(p.id - 1) % CSDL_PACKAGES.length]?.image || CSDL_PACKAGES[0].image,
            }));
          if (mappedPackages.length > 0) setPackages(mappedPackages);
        }

        // Xử lý Phòng chụp từ CSDL
        if (roomRes.status === 'fulfilled' && Array.isArray(roomRes.value?.data) && roomRes.value.data.length > 0) {
          const mappedRooms = roomRes.value.data
            .filter((r) => r.status === 'active' || !r.status)
            .map((r, idx) => ({
              id: r.id,
              name: r.name || `Studio ${idx + 1}`,
              isSuitable: idx === 0,
              capacity: r.capacity || 5,
              capacityText: `${Math.max(1, (r.capacity || 5) - 2)}–${r.capacity || 5} người`,
              surcharge: idx === 0 ? 0 : idx === 1 ? 200000 : idx === 2 ? 300000 : idx === 10 ? 500000 : 200000,
              description: r.description || 'Không gian studio sang trọng chuẩn Cinematic.',
              image: r.thumbnail || r.image || CSDL_ROOMS[(r.id - 1) % CSDL_ROOMS.length]?.image || CSDL_ROOMS[0].image,
            }));
          if (mappedRooms.length > 0) setRooms(mappedRooms);
        }

        // Xử lý Dịch vụ bổ sung từ CSDL
        if (srvRes.status === 'fulfilled' && Array.isArray(srvRes.value?.data) && srvRes.value.data.length > 0) {
          const mappedServices = srvRes.value.data
            .filter((s) => s.status === 'active' || !s.status)
            .map((s, idx) => ({
              id: s.id,
              name: s.name || `Dịch vụ #${s.id}`,
              price: Number(s.price || 300000),
              description: s.description || 'Dịch vụ nâng cao tăng trải nghiệm chụp ảnh.',
              image: s.image || CSDL_SERVICES[(s.id - 1) % CSDL_SERVICES.length]?.image || CSDL_SERVICES[0].image,
            }));
          if (mappedServices.length > 0) setServicesList(mappedServices);
        }

        // Xử lý Booking hiện có để kiểm tra trùng giờ
        if (bkgRes.status === 'fulfilled' && Array.isArray(bkgRes.value?.data)) {
          setExistingBookings(bkgRes.value.data);
        }
      } catch (err) {
        console.warn('Dùng dữ liệu CSDL chuẩn do backend offline:', err.message);
      } finally {
        if (isMounted) setLoadingData(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Phục hồi toàn bộ trạng thái đặt lịch khi thanh toán lại (từ VNPay Return hoặc retry)
  useEffect(() => {
    const retryOrder = location.state?.retryOrder || (location.state?.step === 3 ? JSON.parse(sessionStorage.getItem('vnpay_pending_order') || sessionStorage.getItem('pending_booking_order') || 'null') : null);

    if (retryOrder) {
      if (retryOrder.packageId && packages.length > 0) {
        const foundPkg = packages.find((p) => p.id === retryOrder.packageId);
        if (foundPkg) {
          setSelectedPackage(foundPkg);
          setIsPackageCollapsed(true);
        }
      }
      if (retryOrder.roomId && rooms.length > 0) {
        const foundRoom = rooms.find((r) => r.id === retryOrder.roomId);
        if (foundRoom) {
          setSelectedRoom(foundRoom);
          setIsRoomCollapsed(true);
        }
      }
      if (Array.isArray(retryOrder.services)) {
        setSelectedServices(retryOrder.services);
        setIsServicesCollapsed(true);
      }
      if (retryOrder.isServiceOptOut !== undefined) {
        setIsServiceOptOut(Boolean(retryOrder.isServiceOptOut));
      }
      if (retryOrder.bookingDate) {
        setSelectedDate(retryOrder.bookingDate);
      }
      if (retryOrder.startTime) {
        setSelectedSlot(retryOrder.startTime.slice(0, 5));
      }
      if (retryOrder.customerName) setFullName(retryOrder.customerName);
      if (retryOrder.customerPhone) setPhone(retryOrder.customerPhone);
      if (retryOrder.customerEmail) setEmail(retryOrder.customerEmail);
      if (retryOrder.attendees) setAttendees(retryOrder.attendees);
      if (retryOrder.customerNote) setCustomerNote(retryOrder.customerNote);
      if (retryOrder.depositPercent) setDepositPercent(Number(retryOrder.depositPercent) || 30);

      // Chuyển thẳng tới bước 3 thanh toán
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [packages, rooms, location.state]);

  // Phục hồi lựa chọn nếu người dùng chuyển từ trang chi tiết gói đến
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paramPkgId = Number(params.get('packageId') || location.state?.packageId);
    const paramRoomId = Number(params.get('roomId') || location.state?.roomId);

    if (paramPkgId && packages.length > 0) {
      const foundPkg = packages.find((p) => p.id === paramPkgId);
      if (foundPkg) {
        setSelectedPackage(foundPkg);
        setIsPackageCollapsed(true);
      }
    }

    if (paramRoomId && rooms.length > 0) {
      const foundRoom = rooms.find((r) => r.id === paramRoomId);
      if (foundRoom) {
        setSelectedRoom(foundRoom);
        setIsRoomCollapsed(true);
      }
    }
  }, [packages, rooms, location]);

  // =========================================================================
  // TÍNH TOÁN CHI PHÍ THỜI GIAN THỰC
  // =========================================================================
  const calculation = useMemo(() => {
    const pkgPrice = selectedPackage ? Number(selectedPackage.price || 0) : 0;
    const roomSurcharge = selectedRoom ? Number(selectedRoom.surcharge || 0) : 0;
    const servicesTotal = isServiceOptOut
      ? 0
      : selectedServices.reduce((sum, s) => sum + Number(s.price || 0), 0);

    const subTotal = pkgPrice + roomSurcharge + servicesTotal;

    let discount = 0;
    if (appliedPromo) {
      if (appliedPromo.type === 'percent') {
        discount = Math.round(subTotal * (appliedPromo.value / 100));
      } else {
        discount = Math.min(subTotal, appliedPromo.value || 0);
      }
    }

    const totalOrder = Math.max(0, subTotal - discount);

    // Tính toán số tiền thanh toán ngay dựa theo mức cọc linh hoạt (30%, 50% hoặc 100%)
    let amountToPay = 0;
    if (depositPercent === 100) {
      amountToPay = totalOrder;
    } else if (depositPercent === 50) {
      amountToPay = Math.round(totalOrder * 0.5);
    } else {
      amountToPay = Math.round(totalOrder * 0.3); // Mặc định cọc 30%
    }
    const remainingAmount = Math.max(0, totalOrder - amountToPay);

    return {
      pkgPrice,
      roomSurcharge,
      servicesTotal,
      subTotal,
      discount,
      totalOrder,
      depositPercent,
      amountToPay,
      depositAmount: amountToPay, // Alias giữ tương thích
      remainingAmount,
      remainingPercent: 100 - depositPercent,
    };
  }, [selectedPackage, selectedRoom, selectedServices, isServiceOptOut, appliedPromo, depositPercent]);

  // =========================================================================
  // XỬ LÝ LỰA CHỌN BƯỚC 1: TIẾN TRÌNH TUẦN TỰ
  // =========================================================================
  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setIsPackageCollapsed(true);
    // Khi đổi gói, nếu đã chọn phòng trước đó thì giữ nguyên, nhưng reset giờ nếu cần
  };

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setIsRoomCollapsed(true);
    // Khi đổi phòng, reset lại slot giờ đã chọn ở Bước 2 để tránh trùng giờ
    setSelectedSlot('');
  };

  const handleToggleService = (service) => {
    // Nếu trước đó đang chọn "Không sử dụng", tự động hủy bỏ
    if (isServiceOptOut) {
      setIsServiceOptOut(false);
    }

    setSelectedServices((prev) => {
      const exists = prev.some((s) => s.id === service.id);
      if (exists) {
        return prev.filter((s) => s.id !== service.id);
      }
      return [...prev, service];
    });
  };

  const handleToggleOptOutServices = () => {
    if (!isServiceOptOut) {
      setIsServiceOptOut(true);
      setSelectedServices([]); // Xóa các dịch vụ đã tick
      setIsServicesCollapsed(true);
    } else {
      setIsServiceOptOut(false);
    }
  };

  // Kiểm tra điều kiện hoàn thành Bước 1
  const isStep1Valid = useMemo(() => {
    if (!selectedPackage) return false;
    if (!selectedRoom) return false;
    if (selectedServices.length === 0 && !isServiceOptOut) return false;
    return true;
  }, [selectedPackage, selectedRoom, selectedServices, isServiceOptOut]);

  // =========================================================================
  // XỬ LÝ LỊCH TUẦN & KHUNG GIỜ (BƯỚC 2) - CHUẨN GIỜ VIỆT NAM
  // =========================================================================
  const weekDays = useMemo(() => {
    const days = [];
    const now = new Date();
    const todayStr = getVietnamLocalDate(now);

    // Tính thứ hiện tại (0 = CN, 1 = T2, 2 = T3...)
    const currentDay = now.getDay();
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;

    // Thứ 2 của tuần mục tiêu (dùng constructor local an toàn tuyệt đối)
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday + weekOffset * 7);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
      const dateStr = getVietnamLocalDate(d);
      const dayNum = d.getDate();
      const monthNum = d.getMonth() + 1;
      const yearNum = d.getFullYear();

      const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const dayLabel = dayNames[d.getDay()];

      // Ngày quá khứ: so sánh trực tiếp chuỗi YYYY-MM-DD
      const isPast = dateStr < todayStr;
      const isToday = dateStr === todayStr;

      // Giới hạn 60 ngày
      const maxDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 60);
      const maxDateStr = getVietnamLocalDate(maxDate);
      const isOver60Days = dateStr > maxDateStr;

      const isSelectable = !isPast && !isOver60Days;

      days.push({
        dateStr,
        dayNum,
        monthNum,
        yearNum,
        dayLabel,
        isPast,
        isToday,
        isSelectable,
        statusText: isPast ? 'Đã qua' : isToday ? 'Hôm nay' : 'Còn trống',
      });
    }

    return days;
  }, [weekOffset]);

  // Tiêu đề tháng hiển thị cho tuần hiện tại
  const currentWeekMonthTitle = useMemo(() => {
    if (weekDays.length === 0) return '';
    const midDay = weekDays[3]; // Ngày giữa tuần
    return `Tháng ${midDay.monthNum}, ${midDay.yearNum}`;
  }, [weekDays]);

  // KIỂM TRA KHUNG GIỜ CÓ BỊ VÔ HIỆU HÓA KHÔNG (ĐÃ QUA TRONG NGÀY HOẶC ĐÃ ĐẶT)
  const isSlotDisabled = useCallback(
    (slotTime) => {
      if (!selectedDate) return true;

      const todayStr = getVietnamLocalDate(new Date());

      // 1. Ngày trong quá khứ -> toàn bộ giờ bị vô hiệu hóa
      if (selectedDate < todayStr) return true;

      // 2. Nếu ngày chọn là HÔM NAY -> không cho phép chọn giờ đã trôi qua
      if (selectedDate === todayStr) {
        const [slotHour, slotMin] = slotTime.split(':').map(Number);
        const now = new Date();
        const currentHour = now.getHours();
        const currentMin = now.getMinutes();

        // Nếu giờ slot < giờ hiện tại, hoặc cùng giờ mà phút đã qua -> VÔ HIỆU HÓA
        if (slotHour < currentHour || (slotHour === currentHour && slotMin <= currentMin)) {
          return true;
        }
      }

      // 3. Kiểm tra trùng lịch với existing bookings từ DB
      if (selectedRoom && existingBookings.length > 0) {
        const conflict = existingBookings.some((b) => {
          if (b.status === 'cancelled') return false;
          if (Number(b.roomId) !== Number(selectedRoom.id)) return false;

          const bDate = b.bookingDate ? b.bookingDate.split('T')[0] : '';
          if (bDate !== selectedDate) return false;

          const bStart = (b.startTime || '').slice(0, 5);
          return bStart === slotTime;
        });

        if (conflict) return true;
      }

      return false;
    },
    [selectedDate, selectedRoom, existingBookings]
  );

  // Tự động hủy chọn giờ nếu giờ đó bị vô hiệu hóa do đổi ngày
  useEffect(() => {
    if (selectedSlot && isSlotDisabled(selectedSlot)) {
      setSelectedSlot('');
    }
  }, [selectedDate, selectedSlot, isSlotDisabled]);

  // Điều kiện hoàn thành Bước 2
  const isStep2Valid = useMemo(() => {
    if (!selectedDate) return false;
    if (!selectedSlot) return false;
    if (isSlotDisabled(selectedSlot)) return false;
    return true;
  }, [selectedDate, selectedSlot, isSlotDisabled]);

  // =========================================================================
  // XỬ LÝ MÃ GIẢM GIÁ (BƯỚC 3)
  // =========================================================================
  const handleApplyPromoCode = () => {
    setPromoError('');
    setPromoSuccess('');

    const code = promoCodeInput.trim().toUpperCase();
    if (!code) {
      setPromoError('Vui lòng nhập mã giảm giá.');
      return;
    }

    const userId = currentUser?.id || currentUser?.username || phone || 'guest';
    if (customerPaymentService.checkPromoCodeUsage(userId, code)) {
      setPromoError(`Mã ${code} đã được bạn sử dụng trước đó.`);
      return;
    }

    if (code === 'STUDIO2026') {
      const discountVal = 20; // Giảm 20%
      setAppliedPromo({
        code,
        type: 'percent',
        value: discountVal,
        label: 'Ưu đãi Đặc Biệt 2026 (Giảm 20%)',
      });
      setPromoSuccess('Áp dụng mã ưu đãi STUDIO2026 thành công! Đã giảm 20% tổng đơn.');
    } else if (code === 'VIP500' || code === 'WELCOME500') {
      const discountVal = 500000;
      setAppliedPromo({
        code,
        type: 'fixed',
        value: discountVal,
        label: 'Voucher Khách Hàng Mới (Giảm 500.000₫)',
      });
      setPromoSuccess('Áp dụng voucher thành công! Đã giảm 500.000₫.');
    } else {
      setPromoError('Mã giảm giá không tồn tại hoặc đã hết hạn.');
    }
  };

  // =========================================================================
  // ĐĂNG NHẬP NHANH LỒNG TRÊN TRANG (INLINE AUTH MODAL)
  // =========================================================================
  const handleInlineLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!authUsername.trim() || !authPassword.trim()) {
      setAuthError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    setAuthLoading(true);
    try {
      const res = await customerAuthService.login(authUsername.trim(), authPassword.trim());
      const user = res.user || customerAuth.getUser();
      setCurrentUser(user);
      if (user) {
        setFullName(user.fullname || user.username || '');
        if (user.phone) {
          setPhone(user.phone);
          setPhoneError('');
          setPhoneTouched(true);
        }
        if (user.email) setEmail(user.email);
      }
      setIsAuthModalOpen(false);
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại mật khẩu.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleQuickSeedLogin = async (seedUser) => {
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await customerAuthService.login(seedUser.username, '123456');
      const user = res.user || seedUser;
      setCurrentUser(user);
      setFullName(user.fullname || user.username || '');
      if (user.phone) {
        setPhone(user.phone);
        setPhoneError('');
        setPhoneTouched(true);
      }
      if (user.email) setEmail(user.email);
      setIsAuthModalOpen(false);
    } catch {
      customerAuth.setUser(seedUser);
      customerAuth.setToken(`mock-token-${seedUser.id}`);
      setCurrentUser(seedUser);
      setFullName(seedUser.fullname || seedUser.username || '');
      if (seedUser.phone) {
        setPhone(seedUser.phone);
        setPhoneError('');
        setPhoneTouched(true);
      }
      if (seedUser.email) setEmail(seedUser.email);
      setIsAuthModalOpen(false);
    } finally {
      setAuthLoading(false);
    }
  };

  // =========================================================================
  // NỘP ĐƠN & THANH TOÁN VNPAY (BƯỚC 3)
  // =========================================================================
  const handleProceedToPayment = async () => {
    setSubmitError('');

    // 1. Kiểm tra đăng nhập
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    // 2. Kiểm tra họ tên
    if (!fullName.trim()) {
      setSubmitError('Vui lòng nhập họ và tên của bạn.');
      return;
    }

    // 3. KIỂM TRA ĐỊNH DẠNG SỐ ĐIỆN THOẠI CHẶT CHẼ
    setPhoneTouched(true);
    const phoneCheck = validateVietnamesePhone(phone);
    if (!phoneCheck.isValid) {
      setPhoneError(phoneCheck.message);
      setSubmitError(phoneCheck.message);
      return;
    }

    // 4. Kiểm tra email
    if (!email.trim() || !email.includes('@')) {
      setSubmitError('Vui lòng nhập địa chỉ email hợp lệ để nhận vé & hóa đơn.');
      return;
    }

    setSubmitting(true);

    try {
      const txnRef = Math.floor(100000 + Math.random() * 900000).toString();
      const amountToPay = calculation.amountToPay;
      const paymentType = depositPercent === 100 ? 'full' : 'deposit';

      const orderPayload = {
        customerId: currentUser?.id || 4,
        customerName: fullName.trim(),
        customerPhone: phoneCheck.normalizedPhone,
        customerEmail: email.trim(),
        attendees: Number(attendees) || 1,
        customerNote: customerNote.trim() || 'Không có ghi chú',
        // Gói chụp
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        packagePrice: calculation.pkgPrice,
        packageDuration: selectedPackage.durationMinutes,
        packageImage: selectedPackage.image,
        // Phòng chụp
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        roomSurcharge: calculation.roomSurcharge,
        roomImage: selectedRoom.image,
        roomCapacity: selectedRoom.capacity,
        // Dịch vụ bổ sung
        services: isServiceOptOut ? [] : selectedServices,
        isServiceOptOut,
        servicesTotal: calculation.servicesTotal,
        // Thời gian chụp
        bookingDate: selectedDate,
        startTime: `${selectedSlot}:00`,
        endTime: `${String(Number(selectedSlot.split(':')[0]) + Math.round(selectedPackage.durationMinutes / 60)).padStart(2, '0')}:00:00`,
        // Tài chính & Hình thức đặt cọc
        totalPrice: calculation.totalOrder,
        amountToPay: amountToPay,
        paymentType,
        depositPercent,
        remainingAmount: calculation.remainingAmount,
        status: 'pending', // Luôn đưa trạng thái ban đầu là pending (chờ xác nhận)
        appliedPromoCode: appliedPromo?.code || null,
        discountAmount: calculation.discount,
      };

      // Lưu thông tin đơn chờ vào sessionStorage cho VNPay callback
      sessionStorage.setItem('vnpay_pending_order', JSON.stringify(orderPayload));
      sessionStorage.setItem('pending_booking_order', JSON.stringify(orderPayload));

      // Tạo URL thanh toán VNPay Sandbox
      const orderInfo = `PhotoStudio ${depositPercent === 100 ? 'Thanh toan 100%' : `Dat coc ${depositPercent}%`} #${txnRef} - ${selectedPackage.name}`;
      const vnpUrl = await createVNPayPaymentUrl({
        amount: amountToPay,
        orderInfo,
        txnRef,
        returnUrl: `${window.location.origin}/payment/vnpay-return`,
      });

      // Chuyển hướng sang VNPay Sandbox
      window.location.href = vnpUrl;
    } catch (err) {
      console.error('Lỗi khởi tạo thanh toán VNPay:', err);
      setSubmitError(err.message || 'Không thể tạo liên kết thanh toán VNPay lúc này.');
      setSubmitting(false);
    }
  };

  // Điều hướng quay lại
  const handleGoBack = () => {
    if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      navigate(ROUTES.USER.HOME);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F8] text-[#261A1E] relative pb-20 font-sans pt-20 sm:pt-24">
      {/* CÀNH HOA ĐÀO TRANG TRÍ GÓC MÀN HÌNH */}
      <div className="fixed top-0 right-0 w-80 h-72 pointer-events-none opacity-40 select-none overflow-hidden z-0">
        <FloralBranchCorner position="top-right" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        {/* THANH TOP BAR: NÚT QUAY LẠI & TIẾN TRÌNH 3 BƯỚC */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#F0E4E6]">
          {/* Nút Quay lại */}
          <button
            type="button"
            onClick={handleGoBack}
            className="cursor-pointer inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 hover:text-[#BE4B5E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>

          {/* Thanh tiến trình 3 bước (Stepper) */}
          <div className="flex items-center gap-3 sm:gap-6 self-center sm:self-auto text-xs sm:text-sm font-medium">
            {/* Bước 1 */}
            <div
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-2 cursor-pointer transition-all ${
                currentStep === 1
                  ? 'text-[#BE4B5E] font-bold'
                  : currentStep > 1
                  ? 'text-gray-700 font-semibold'
                  : 'text-gray-400'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  currentStep === 1
                    ? 'bg-[#BE4B5E] text-white shadow-xs'
                    : currentStep > 1
                    ? 'bg-rose-100 text-[#BE4B5E]'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '1'}
              </span>
              <span>Chọn dịch vụ</span>
            </div>

            <div className={`w-8 sm:w-12 h-0.5 ${currentStep >= 2 ? 'bg-[#BE4B5E]' : 'bg-gray-200'}`} />

            {/* Bước 2 */}
            <div
              onClick={() => isStep1Valid && setCurrentStep(2)}
              className={`flex items-center gap-2 transition-all ${
                isStep1Valid ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
              } ${
                currentStep === 2
                  ? 'text-[#BE4B5E] font-bold'
                  : currentStep > 2
                  ? 'text-gray-700 font-semibold'
                  : 'text-gray-400'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  currentStep === 2
                    ? 'bg-[#BE4B5E] text-white shadow-xs'
                    : currentStep > 2
                    ? 'bg-rose-100 text-[#BE4B5E]'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > 2 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '2'}
              </span>
              <span>Chọn ngày & giờ</span>
            </div>

            <div className={`w-8 sm:w-12 h-0.5 ${currentStep === 3 ? 'bg-[#BE4B5E]' : 'bg-gray-200'}`} />

            {/* Bước 3 */}
            <div
              onClick={() => isStep1Valid && isStep2Valid && setCurrentStep(3)}
              className={`flex items-center gap-2 transition-all ${
                isStep1Valid && isStep2Valid ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
              } ${currentStep === 3 ? 'text-[#BE4B5E] font-bold' : 'text-gray-400'}`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  currentStep === 3 ? 'bg-[#BE4B5E] text-white shadow-xs' : 'bg-gray-200 text-gray-500'
                }`}
              >
                3
              </span>
              <span>Xác nhận</span>
            </div>
          </div>
        </div>

        {/* TIÊU ĐỀ BƯỚC HIỆN TẠI (ĐẶT PHÍA TRÊN ĐỂ CẢ 2 CỘT LUÔN BẰNG NHAU) */}
        <div className="mt-8 mb-4">
          {currentStep === 1 && (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#261A1E]">
                Đặt lịch chụp ảnh
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Chọn gói chụp, không gian phòng chụp và dịch vụ bổ sung từ cơ sở dữ liệu
              </p>
            </div>
          )}
          {currentStep === 2 && (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#261A1E]">
                Chọn thời gian chụp
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Chọn ngày và giờ phù hợp với lịch trống của studio
              </p>
            </div>
          )}
          {currentStep === 3 && (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#261A1E]">
                Xác nhận thông tin đặt lịch
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Vui lòng kiểm tra lại thông tin trước khi thanh toán
              </p>
            </div>
          )}
        </div>

        {/* ===================================================================
            BỐ CỤC 2 CỘT: CỘT TRÁI (WIZARD) + CỘT PHẢI (TÓM TẮT DỰ TOÁN)
           =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CỘT TRÁI: NỘI DUNG WIZARD */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* ---------------------------------------------------------------
                BƯỚC 1: TIẾN TRÌNH TUẦN TỰ (GÓI -> PHÒNG -> DỊCH VỤ)
               --------------------------------------------------------------- */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-fade-in">
                {/* 1. CHỌN GÓI CHỤP (LUÔN HIỆN ĐẦU TIÊN) */}
                <div className="p-6 rounded-3xl bg-white border border-[#F0E4E6] shadow-sm relative overflow-hidden transition-all">
                  <div className="flex items-center justify-between pb-4 border-b border-[#F5EBEB]">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-[#261A1E] flex items-center gap-2">
                        <span>1. Chọn gói chụp</span>
                        {selectedPackage && (
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                            ✓
                          </span>
                        )}
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5">Khám phá các gói chụp trong CSDL phù hợp với nhu cầu của bạn</p>
                    </div>

                    {isPackageCollapsed && selectedPackage && (
                      <button
                        type="button"
                        onClick={() => setIsPackageCollapsed(false)}
                        className="cursor-pointer text-xs font-semibold text-[#BE4B5E] hover:underline flex items-center gap-1"
                      >
                        <span>Thay đổi</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Khi đã thu gọn gói chụp */}
                  {isPackageCollapsed && selectedPackage ? (
                    <div className="pt-4 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                        <img src={selectedPackage.image} alt={selectedPackage.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm sm:text-base text-[#261A1E] truncate">{selectedPackage.name}</h4>
                        <p className="text-xs text-gray-500 flex items-center gap-3 mt-1">
                          <span>🕒 {selectedPackage.durationText}</span>
                          <span>👥 {selectedPackage.capacityText}</span>
                          <span className="font-bold text-[#BE4B5E]">{selectedPackage.price.toLocaleString('vi-VN')}₫</span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Danh sách 8 gói chụp từ CSDL */
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pt-4">
                      {packages.map((pkg) => {
                        const isSelected = selectedPackage?.id === pkg.id;
                        return (
                          <div
                            key={pkg.id}
                            className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden relative ${
                              isSelected
                                ? 'border-[#BE4B5E] bg-[#FFF5F6] shadow-md ring-1 ring-[#BE4B5E]'
                                : 'border-[#F0E4E6] bg-white hover:border-[#BE4B5E]/50 hover:shadow-xs'
                            }`}
                          >
                            {pkg.isPopular && (
                              <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#BE4B5E] text-white shadow-xs">
                                Phổ biến
                              </span>
                            )}

                            <div>
                              <div className="h-36 w-full overflow-hidden bg-gray-100">
                                <img
                                  src={pkg.image}
                                  alt={pkg.name}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                              </div>

                              <div className="p-3.5 space-y-2">
                                <h3 className="font-bold text-sm text-[#261A1E] truncate" title={pkg.name}>
                                  {pkg.name}
                                </h3>
                                <div className="text-[11px] text-gray-500 flex items-center gap-2">
                                  <span>🕒 {pkg.durationText}</span>
                                  <span>•</span>
                                  <span>👥 {pkg.capacityText}</span>
                                </div>
                                <div className="flex items-baseline gap-2 pt-1">
                                  <span className="font-extrabold text-[#BE4B5E] text-sm">
                                    {pkg.price.toLocaleString('vi-VN')}₫
                                  </span>
                                  {pkg.originalPrice && (
                                    <span className="text-[11px] text-gray-400 line-through">
                                      {pkg.originalPrice.toLocaleString('vi-VN')}₫
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="p-3.5 pt-0">
                              <button
                                type="button"
                                onClick={() => handleSelectPackage(pkg)}
                                className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#BE4B5E] text-white shadow-xs'
                                    : 'border border-[#BE4B5E] text-[#BE4B5E] hover:bg-[#BE4B5E] hover:text-white'
                                }`}
                              >
                                {isSelected ? 'Đã chọn' : 'Chọn gói'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. CHỌN PHÒNG CHỤP: CHỈ XUẤT HIỆN KHI ĐÃ CHỌN XONG GÓI */}
                {selectedPackage && (
                  <div className="p-6 rounded-3xl bg-white border border-[#F0E4E6] shadow-sm relative overflow-hidden transition-all animate-fade-in">
                    <div className="flex items-center justify-between pb-4 border-b border-[#F5EBEB]">
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-[#261A1E] flex items-center gap-2">
                          <span>2. Chọn không gian phòng chụp</span>
                          {selectedRoom && (
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                              ✓
                            </span>
                          )}
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">Lựa chọn phòng chụp từ cơ sở dữ liệu phù hợp với phong cách của bạn</p>
                      </div>

                      {isRoomCollapsed && selectedRoom && (
                        <button
                          type="button"
                          onClick={() => setIsRoomCollapsed(false)}
                          className="cursor-pointer text-xs font-semibold text-[#BE4B5E] hover:underline flex items-center gap-1"
                        >
                          <span>Thay đổi</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Khi đã thu gọn phòng chụp */}
                    {isRoomCollapsed && selectedRoom ? (
                      <div className="pt-4 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                          <img src={selectedRoom.image} alt={selectedRoom.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm sm:text-base text-[#261A1E] truncate">{selectedRoom.name}</h4>
                          <p className="text-xs text-gray-500 flex items-center gap-3 mt-1">
                            <span>Sức chứa: {selectedRoom.capacityText}</span>
                            <span>Phụ thu: {selectedRoom.surcharge > 0 ? `+${selectedRoom.surcharge.toLocaleString('vi-VN')}₫` : '+0₫'}</span>
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Danh sách 12 phòng studio từ CSDL */
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pt-4">
                        {rooms.map((room) => {
                          const isSelected = selectedRoom?.id === room.id;
                          return (
                            <div
                              key={room.id}
                              className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden relative ${
                                isSelected
                                  ? 'border-[#BE4B5E] bg-[#FFF5F6] shadow-md ring-1 ring-[#BE4B5E]'
                                  : 'border-[#F0E4E6] bg-white hover:border-[#BE4B5E]/50 hover:shadow-xs'
                              }`}
                            >
                              {room.isSuitable && (
                                <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                                  Phù hợp
                                </span>
                              )}

                              <div>
                                <div className="h-32 w-full overflow-hidden bg-gray-100">
                                  <img
                                    src={room.image}
                                    alt={room.name}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                  />
                                </div>

                                <div className="p-3.5 space-y-1.5">
                                  <h3 className="font-bold text-xs sm:text-sm text-[#261A1E] truncate" title={room.name}>
                                    {room.name}
                                  </h3>
                                  <p className="text-[11px] text-gray-500">Sức chứa: {room.capacityText}</p>
                                  <p className="text-[11px] font-semibold text-[#BE4B5E]">
                                    {room.surcharge > 0 ? `+ ${room.surcharge.toLocaleString('vi-VN')}₫` : '+ 0₫'}
                                  </p>
                                </div>
                              </div>

                              <div className="p-3.5 pt-0">
                                <button
                                  type="button"
                                  onClick={() => handleSelectRoom(room)}
                                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-[#BE4B5E] text-white shadow-xs'
                                      : 'border border-gray-300 text-gray-700 hover:border-[#BE4B5E] hover:text-[#BE4B5E]'
                                  }`}
                                >
                                  {isSelected ? 'Đã chọn' : 'Chọn phòng'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. CHỌN DỊCH VỤ BỔ SUNG: CHỈ XUẤT HIỆN KHI ĐÃ CHỌN XONG PHÒNG */}
                {selectedRoom && (
                  <div className="p-6 rounded-3xl bg-white border border-[#F0E4E6] shadow-sm relative overflow-hidden transition-all animate-fade-in">
                    <div className="flex items-center justify-between pb-4 border-b border-[#F5EBEB]">
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-[#261A1E] flex items-center gap-2">
                          <span>3. Chọn dịch vụ bổ sung</span>
                          {(selectedServices.length > 0 || isServiceOptOut) && (
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                              ✓
                            </span>
                          )}
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">Tăng thêm trải nghiệm cho buổi chụp của bạn từ danh mục dịch vụ</p>
                      </div>

                      {isServicesCollapsed && (selectedServices.length > 0 || isServiceOptOut) && (
                        <button
                          type="button"
                          onClick={() => setIsServicesCollapsed(false)}
                          className="cursor-pointer text-xs font-semibold text-[#BE4B5E] hover:underline flex items-center gap-1"
                        >
                          <span>Thay đổi</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Khi đã thu gọn phần dịch vụ */}
                    {isServicesCollapsed && (selectedServices.length > 0 || isServiceOptOut) ? (
                      <div className="pt-4 text-xs text-gray-700">
                        {isServiceOptOut ? (
                          <p className="italic text-gray-500 font-medium">✓ Bạn đã xác nhận: Không sử dụng thêm dịch vụ bổ sung.</p>
                        ) : (
                          <p className="font-semibold text-emerald-800">
                            ✓ Đã chọn {selectedServices.length} dịch vụ ({calculation.servicesTotal.toLocaleString('vi-VN')}₫):{' '}
                            {selectedServices.map((s) => s.name).join(', ')}
                          </p>
                        )}
                      </div>
                    ) : (
                      /* Khi mở rộng danh sách dịch vụ */
                      <div className="space-y-4 pt-4">
                        {/* Checkbox riêng: Tôi không sử dụng dịch vụ bổ sung */}
                        <div
                          onClick={handleToggleOptOutServices}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            isServiceOptOut
                              ? 'border-[#BE4B5E] bg-[#FFF5F6] shadow-xs'
                              : 'border-dashed border-gray-300 hover:border-[#BE4B5E]/50 bg-gray-50/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isServiceOptOut}
                              onChange={() => {}}
                              className="w-4 h-4 text-[#BE4B5E] rounded border-gray-300 focus:ring-[#BE4B5E] cursor-pointer"
                            />
                            <div>
                              <span className="text-xs sm:text-sm font-bold text-[#261A1E] block">
                                Không sử dụng dịch vụ bổ sung
                              </span>
                              <span className="text-[11px] text-gray-400">
                                (Chỉ sử dụng các dịch vụ và quyền lợi tiêu chuẩn đã có trong gói chụp)
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-gray-500">+0₫</span>
                        </div>

                        {/* Lưới các thẻ dịch vụ bổ sung từ CSDL */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                          {servicesList.map((srv) => {
                            const isChecked = selectedServices.some((s) => s.id === srv.id);
                            return (
                              <div
                                key={srv.id}
                                onClick={() => handleToggleService(srv)}
                                className={`rounded-2xl border p-3.5 transition-all cursor-pointer flex flex-col justify-between ${
                                  isChecked
                                    ? 'border-[#BE4B5E] bg-[#FFF5F6] shadow-sm ring-1 ring-[#BE4B5E]'
                                    : 'border-[#F0E4E6] bg-white hover:border-[#BE4B5E]/50 hover:shadow-xs'
                                } ${isServiceOptOut ? 'opacity-40' : ''}`}
                              >
                                <div className="space-y-2">
                                  <div className="h-28 w-full rounded-xl overflow-hidden bg-gray-100">
                                    <img src={srv.image} alt={srv.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex items-start gap-2 pt-1">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => {}}
                                      disabled={isServiceOptOut}
                                      className="w-4 h-4 text-[#BE4B5E] rounded border-gray-300 focus:ring-[#BE4B5E] mt-0.5 cursor-pointer"
                                    />
                                    <div className="min-w-0">
                                      <h4 className="font-bold text-xs sm:text-sm text-[#261A1E] leading-snug line-clamp-2" title={srv.name}>
                                        {srv.name}
                                      </h4>
                                      <p className="text-[11px] font-bold text-[#BE4B5E] mt-1">
                                        {srv.price.toLocaleString('vi-VN')}₫
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* BANNER TƯ VẤN Ở ĐÁY BƯỚC 1 */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FDF0F2] to-[#FAF5F5] border border-[#F5D5DC] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-[#F0E4E6] flex items-center justify-center text-[#BE4B5E] shrink-0">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-gray-800 text-sm block">Bạn cần tư vấn chi tiết hơn?</strong>
                      <span className="text-gray-500">Đội ngũ chuyên viên tư vấn luôn sẵn sàng hỗ trợ bạn.</span>
                    </div>
                  </div>
                  <a
                    href="tel:0987654321"
                    className="cursor-pointer px-4 py-2 rounded-xl bg-white hover:bg-rose-50 text-[#BE4B5E] font-bold border border-[#F0E4E6] shadow-2xs transition-colors shrink-0"
                  >
                    Liên hệ ngay
                  </a>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------
                BƯỚC 2: CHỌN NGÀY VÀ GIỜ
               --------------------------------------------------------------- */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-fade-in">
                {/* 1. CHỌN NGÀY CHỤP (LỊCH TUẦN ĐỊNH DẠNG CHUẨN VIỆT NAM) */}
                <div className="p-6 rounded-3xl bg-white border border-[#F0E4E6] shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F5EBEB]">
                    <h2 className="text-base sm:text-lg font-bold text-[#261A1E]">1. Chọn ngày chụp</h2>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={weekOffset <= 0}
                        onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
                        className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Tuần trước"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs sm:text-sm font-bold text-gray-700 px-2 min-w-[120px] text-center">
                        {currentWeekMonthTitle}
                      </span>
                      <button
                        type="button"
                        disabled={weekOffset >= 8}
                        onClick={() => setWeekOffset((w) => Math.min(8, w + 1))}
                        className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Tuần tiếp theo"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Lưới 7 ngày trong tuần */}
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {weekDays.map((d) => {
                      const isSelected = selectedDate === d.dateStr;
                      return (
                        <div
                          key={d.dateStr}
                          onClick={() => {
                            if (d.isSelectable) {
                              setSelectedDate(d.dateStr);
                              setSelectedSlot('');
                            }
                          }}
                          className={`p-2.5 sm:p-3.5 rounded-2xl border transition-all ${
                            !d.isSelectable
                              ? 'bg-gray-50 border-gray-200 text-gray-300 opacity-60 cursor-not-allowed'
                              : isSelected
                              ? 'bg-[#BE4B5E] border-[#BE4B5E] text-white shadow-md cursor-pointer'
                              : 'bg-white border-[#F0E4E6] hover:border-[#BE4B5E]/50 text-[#261A1E] cursor-pointer'
                          }`}
                        >
                          <span className={`text-[10px] sm:text-xs font-bold block ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                            {d.dayLabel}
                          </span>
                          <span className="text-base sm:text-lg font-extrabold block my-0.5">
                            {d.dayNum}
                          </span>
                          <span
                            className={`text-[9px] sm:text-[10px] font-semibold block rounded-full py-0.5 px-1 truncate ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : d.isToday
                                ? 'bg-rose-100 text-[#BE4B5E]'
                                : d.isPast
                                ? 'text-gray-400'
                                : 'text-emerald-600'
                            }`}
                          >
                            {d.statusText}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-[11px] text-gray-400 flex items-center gap-1.5 pt-1">
                    <span className="w-2 h-2 rounded-full bg-[#BE4B5E]" />
                    <span>Các ngày màu xám là ngày đã qua hoặc không còn lịch trống. Bạn có thể chọn ngày từ hôm nay trở đi.</span>
                  </p>
                </div>

                {/* 2. CHỌN GIỜ CHỤP (KHÔNG CHO PHÉP CHỌN GIỜ ĐÃ TRÔI QUA TRONG NGÀY) */}
                <div className="p-6 rounded-3xl bg-white border border-[#F0E4E6] shadow-sm space-y-5">
                  <div className="pb-3 border-b border-[#F5EBEB]">
                    <h2 className="text-base sm:text-lg font-bold text-[#261A1E]">
                      2. Chọn giờ chụp
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Thời gian có thể đặt trong ngày{' '}
                      <strong className="text-[#BE4B5E]">
                        {selectedDate ? new Date(selectedDate.replace(/-/g, '/')).toLocaleDateString('vi-VN') : ''}
                      </strong>
                    </p>
                  </div>

                  {/* Buổi sáng */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Buổi sáng</span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                      {TIME_SLOTS_DATA.morning.map((slot) => {
                        const disabled = isSlotDisabled(slot);
                        const isSelected = selectedSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={disabled}
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                              disabled
                                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed line-through opacity-50 select-none'
                                : isSelected
                                ? 'bg-[#BE4B5E] border-[#BE4B5E] text-white shadow-xs cursor-pointer'
                                : 'bg-white border-[#F0E4E6] text-gray-800 hover:border-[#BE4B5E] hover:text-[#BE4B5E] cursor-pointer'
                            }`}
                            title={disabled ? 'Giờ này đã trôi qua hoặc đã có lịch đặt' : `Chọn lúc ${slot}`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Buổi chiều */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Buổi chiều</span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                      {TIME_SLOTS_DATA.afternoon.map((slot) => {
                        const disabled = isSlotDisabled(slot);
                        const isSelected = selectedSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={disabled}
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                              disabled
                                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed line-through opacity-50 select-none'
                                : isSelected
                                ? 'bg-[#BE4B5E] border-[#BE4B5E] text-white shadow-xs cursor-pointer'
                                : 'bg-white border-[#F0E4E6] text-gray-800 hover:border-[#BE4B5E] hover:text-[#BE4B5E] cursor-pointer'
                            }`}
                            title={disabled ? 'Giờ này đã trôi qua hoặc đã có lịch đặt' : `Chọn lúc ${slot}`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Buổi tối */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Buổi tối</span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                      {TIME_SLOTS_DATA.evening.map((slot) => {
                        const disabled = isSlotDisabled(slot);
                        const isSelected = selectedSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={disabled}
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                              disabled
                                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed line-through opacity-50 select-none'
                                : isSelected
                                ? 'bg-[#BE4B5E] border-[#BE4B5E] text-white shadow-xs cursor-pointer'
                                : 'bg-white border-[#F0E4E6] text-gray-800 hover:border-[#BE4B5E] hover:text-[#BE4B5E] cursor-pointer'
                            }`}
                            title={disabled ? 'Giờ này đã trôi qua hoặc đã có lịch đặt' : `Chọn lúc ${slot}`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------
                BƯỚC 3: XÁC NHẬN THÔNG TIN ĐẶT LỊCH & THANH TOÁN
               --------------------------------------------------------------- */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-fade-in">
                {submitError && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* 1. KHUNG NHẬP THÔNG TIN CÁ NHÂN KÈM VALIDATE SĐT CHẶT CHẼ */}
                <div className="p-6 rounded-3xl bg-white border border-[#F0E4E6] shadow-sm space-y-4">
                  <div className="pb-3 border-b border-[#F5EBEB]">
                    <h2 className="text-base sm:text-lg font-bold text-[#261A1E]">Thông tin cá nhân</h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Nếu bạn đã có tài khoản, thông tin sẽ được tự động điền
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Họ và tên */}
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1.5">
                        Họ và tên <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nhập họ và tên đầy đủ"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#BE4B5E]"
                      />
                    </div>

                    {/* SỐ ĐIỆN THOẠI (KIỂM TRA ĐỊNH DẠNG CHẶT CHẼ) */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block font-semibold text-gray-700">
                          Số điện thoại <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] text-gray-400">Đúng 10 số, bắt đầu 03/05/07/08/09</span>
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={handlePhoneChange}
                        onBlur={handlePhoneBlur}
                        placeholder="0987654321"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                          phoneTouched && phoneError
                            ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                            : phoneTouched && !phoneError && phone.length === 10
                            ? 'border-emerald-400 bg-emerald-50/30 focus:border-emerald-500'
                            : 'border-gray-200 focus:border-[#BE4B5E]'
                        }`}
                      />
                      {phoneTouched && phoneError ? (
                        <p className="text-[11px] font-medium text-rose-500 mt-1 flex items-center gap-1 animate-fade-in">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{phoneError}</span>
                        </p>
                      ) : phoneTouched && !phoneError && phone.length === 10 ? (
                        <p className="text-[11px] font-medium text-emerald-600 mt-1 flex items-center gap-1 animate-fade-in">
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          <span>Số điện thoại hợp lệ</span>
                        </p>
                      ) : (
                        <p className="text-[10px] text-gray-400 mt-1">
                          Ví dụ: 0901234567, 0325178029, 0868123456
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1.5">
                        Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#BE4B5E]"
                      />
                    </div>

                    {/* Số lượng người */}
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1.5">
                        Số lượng người tham gia <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={attendees}
                        onChange={(e) => setAttendees(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#BE4B5E] bg-white cursor-pointer"
                      >
                        {[...Array(selectedRoom?.capacity || 8)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} người
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Ghi chú */}
                    <div className="sm:col-span-2">
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block font-semibold text-gray-700">Ghi chú (tùy chọn)</label>
                        <span className="text-[10px] text-gray-400">{customerNote.length}/200</span>
                      </div>
                      <textarea
                        rows={3}
                        maxLength={200}
                        value={customerNote}
                        onChange={(e) => setCustomerNote(e.target.value)}
                        placeholder="Ví dụ: Ưu tiên chụp vào buổi sáng, cần hỗ trợ thêm đạo cụ..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#BE4B5E]"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. CHỌN MỨC THANH TOÁN (30% | 50% | 100%) */}
                <div className="p-6 rounded-3xl bg-white border border-[#F0E4E6] shadow-sm space-y-4">
                  <div className="pb-3 border-b border-[#F5EBEB] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-[#261A1E]">Chọn mức đặt cọc & thanh toán</h2>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Linh hoạt chọn đặt cọc trước hoặc thanh toán trọn gói 100% qua VNPay
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-[#BE4B5E] border border-rose-100 self-start sm:self-auto">
                      Đang chọn: {depositPercent === 100 ? 'Thanh toán 100%' : `Đặt cọc ${depositPercent}%`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Mức 1: 30% */}
                    <div
                      onClick={() => setDepositPercent(30)}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all relative ${
                        depositPercent === 30
                          ? 'border-[#BE4B5E] bg-[#FFF5F6] shadow-xs ring-1 ring-[#BE4B5E]'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-800">Đặt cọc 30%</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            depositPercent === 30
                              ? 'border-[#BE4B5E] bg-[#BE4B5E]'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {depositPercent === 30 && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                        </div>
                      </div>
                      <div className="text-base font-extrabold text-[#BE4B5E]">
                        {Math.round(calculation.totalOrder * 0.3).toLocaleString('vi-VN')}₫
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Còn lại tại studio (70%):{' '}
                        <strong>{(calculation.totalOrder - Math.round(calculation.totalOrder * 0.3)).toLocaleString('vi-VN')}₫</strong>
                      </p>
                      <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Phổ biến nhất
                      </span>
                    </div>

                    {/* Mức 2: 50% */}
                    <div
                      onClick={() => setDepositPercent(50)}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all relative ${
                        depositPercent === 50
                          ? 'border-[#BE4B5E] bg-[#FFF5F6] shadow-xs ring-1 ring-[#BE4B5E]'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-800">Đặt cọc 50%</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            depositPercent === 50
                              ? 'border-[#BE4B5E] bg-[#BE4B5E]'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {depositPercent === 50 && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                        </div>
                      </div>
                      <div className="text-base font-extrabold text-[#BE4B5E]">
                        {Math.round(calculation.totalOrder * 0.5).toLocaleString('vi-VN')}₫
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Còn lại tại studio (50%):{' '}
                        <strong>{(calculation.totalOrder - Math.round(calculation.totalOrder * 0.5)).toLocaleString('vi-VN')}₫</strong>
                      </p>
                      <span className="inline-block mt-2 text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                        Cân bằng chi phí
                      </span>
                    </div>

                    {/* Mức 3: 100% */}
                    <div
                      onClick={() => setDepositPercent(100)}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all relative ${
                        depositPercent === 100
                          ? 'border-[#BE4B5E] bg-[#FFF5F6] shadow-xs ring-1 ring-[#BE4B5E]'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-800">Thanh toán 100%</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            depositPercent === 100
                              ? 'border-[#BE4B5E] bg-[#BE4B5E]'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {depositPercent === 100 && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                        </div>
                      </div>
                      <div className="text-base font-extrabold text-[#BE4B5E]">
                        {calculation.totalOrder.toLocaleString('vi-VN')}₫
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Còn lại tại studio: <strong>0₫</strong>
                      </p>
                      <span className="inline-block mt-2 text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                        Trọn gói tiện lợi
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. KHUNG NHẬP MÃ GIẢM GIÁ */}
                <div className="p-6 rounded-3xl bg-white border border-[#F0E4E6] shadow-sm space-y-3">
                  <h3 className="text-sm font-bold text-[#261A1E]">Mã giảm giá</h3>
                  <div className="flex gap-2.5">
                    <input
                      type="text"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      placeholder="Nhập mã ưu đãi (Ví dụ: STUDIO2026)"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#BE4B5E] uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromoCode}
                      className="cursor-pointer px-5 py-2.5 rounded-xl bg-[#BE4B5E] hover:bg-[#a53b4d] text-white font-bold text-xs transition-colors shrink-0 shadow-2xs"
                    >
                      Áp dụng
                    </button>
                  </div>

                  {promoSuccess && (
                    <p className="text-xs font-semibold text-emerald-600 animate-fade-in">{promoSuccess}</p>
                  )}
                  {promoError && (
                    <p className="text-xs font-semibold text-rose-500 animate-fade-in">{promoError}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* =================================================================
              CỘT PHẢI: TÓM TẮT LỰA CHỌN & DỰ TOÁN CHI PHÍ (STICKY BƯỚC 1 & 2, ĐỨNG YÊN BƯỚC 3)
             ================================================================= */}
          <div
            className={`lg:col-span-4 space-y-6 ${
              currentStep === 3 ? 'relative' : 'lg:sticky lg:top-24'
            }`}
          >
            <div className="p-6 rounded-3xl bg-white border border-[#F0E4E6] shadow-xl relative overflow-hidden space-y-5">
              <FloralCardCorner position="top-right" opacity="opacity-25" />

              <h3 className="text-base font-bold text-[#261A1E] pb-3 border-b border-[#F5EBEB]">
                {currentStep === 3 ? 'Tóm tắt đặt lịch' : 'Tóm tắt lựa chọn'}
              </h3>

              {!selectedPackage && !selectedRoom && currentStep === 1 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[#FAF5F5] border border-[#F5D5DC] mx-auto flex items-center justify-center text-gray-300">
                    <Camera className="w-8 h-8 text-[#BE4B5E]/40" />
                  </div>
                  <p className="text-xs text-gray-400 max-w-[200px] mx-auto leading-relaxed">
                    Bạn chưa chọn gói chụp, phòng chụp và dịch vụ
                  </p>
                  <button
                    type="button"
                    disabled
                    className="w-full py-3 rounded-2xl bg-gray-100 text-gray-400 font-bold text-xs cursor-not-allowed"
                  >
                    Tiếp theo →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Gói chụp */}
                  {selectedPackage && (
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                        <img src={selectedPackage.image} alt={selectedPackage.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 text-xs">
                        <span className="text-[10px] text-gray-400 block">Gói chụp:</span>
                        <strong className="text-gray-800 truncate block">{selectedPackage.name}</strong>
                        <span className="text-[#BE4B5E] font-bold">{selectedPackage.price.toLocaleString('vi-VN')}₫</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStep(1);
                          setIsPackageCollapsed(false);
                        }}
                        className="cursor-pointer text-[11px] text-gray-400 hover:text-[#BE4B5E]"
                      >
                        Thay đổi
                      </button>
                    </div>
                  )}

                  {/* Phòng chụp */}
                  {selectedRoom && (
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                        <img src={selectedRoom.image} alt={selectedRoom.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 text-xs">
                        <span className="text-[10px] text-gray-400 block">Phòng chụp:</span>
                        <strong className="text-gray-800 truncate block">{selectedRoom.name}</strong>
                        <span className="text-gray-600 font-medium">
                          {selectedRoom.surcharge > 0 ? `+${selectedRoom.surcharge.toLocaleString('vi-VN')}₫` : '+ 0₫'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStep(1);
                          setIsRoomCollapsed(false);
                        }}
                        className="cursor-pointer text-[11px] text-gray-400 hover:text-[#BE4B5E]"
                      >
                        Thay đổi
                      </button>
                    </div>
                  )}

                  {/* Dịch vụ bổ sung */}
                  {(selectedServices.length > 0 || isServiceOptOut) && (
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100 text-xs">
                      <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#BE4B5E] shrink-0 overflow-hidden">
                        {selectedServices.length === 1 && selectedServices[0].image ? (
                          <img src={selectedServices[0].image} alt={selectedServices[0].name} className="w-full h-full object-cover" />
                        ) : (
                          <SquaresPlusIcon className="w-5 h-5 text-[#BE4B5E]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-gray-400 block">Dịch vụ:</span>
                        <strong className="text-gray-800 truncate block">
                          {isServiceOptOut
                            ? 'Không dùng dịch vụ'
                            : `${selectedServices.length} dịch vụ chọn thêm`}
                        </strong>
                        <span className="text-gray-600 font-medium">
                          +{calculation.servicesTotal.toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStep(1);
                          setIsServicesCollapsed(false);
                        }}
                        className="cursor-pointer text-[11px] text-gray-400 hover:text-[#BE4B5E]"
                      >
                        Thay đổi
                      </button>
                    </div>
                  )}

                  {/* Ngày & giờ */}
                  {selectedDate && selectedSlot && (
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100 text-xs">
                      <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-gray-400 block">Ngày & giờ:</span>
                        <strong className="text-gray-800 block">
                          {new Date(selectedDate.replace(/-/g, '/')).toLocaleDateString('vi-VN')}
                        </strong>
                        <span className="text-purple-700 font-bold">{selectedSlot}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="cursor-pointer text-[11px] text-gray-400 hover:text-[#BE4B5E]"
                      >
                        Thay đổi
                      </button>
                    </div>
                  )}

                  {/* BẢNG TÍNH TOÁN CHI TIẾT */}
                  {currentStep === 3 ? (
                    <div className="space-y-2 pt-2 text-xs">
                      <div className="flex justify-between text-gray-500">
                        <span>Giá gói chụp:</span>
                        <span className="font-semibold text-gray-800">{calculation.pkgPrice.toLocaleString('vi-VN')}₫</span>
                      </div>
                      {calculation.roomSurcharge > 0 && (
                        <div className="flex justify-between text-gray-500">
                          <span>Phụ thu phòng:</span>
                          <span className="font-semibold text-gray-800">+{calculation.roomSurcharge.toLocaleString('vi-VN')}₫</span>
                        </div>
                      )}
                      {calculation.servicesTotal > 0 && (
                        <div className="flex justify-between text-gray-500">
                          <span>Giá dịch vụ:</span>
                          <span className="font-semibold text-gray-800">+{calculation.servicesTotal.toLocaleString('vi-VN')}₫</span>
                        </div>
                      )}
                      {calculation.discount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-medium">
                          <span>Giảm giá ({appliedPromo?.code}):</span>
                          <span>-{calculation.discount.toLocaleString('vi-VN')}₫</span>
                        </div>
                      )}

                      <div className="flex justify-between items-baseline pt-2 border-t border-gray-200">
                        <span className="text-xs font-bold text-gray-800 uppercase">Tổng đơn đặt lịch:</span>
                        <span className="text-base font-extrabold text-[#261A1E]">
                          {calculation.totalOrder.toLocaleString('vi-VN')}₫
                        </span>
                      </div>

                      {/* Tùy chọn mức thanh toán / đặt cọc 30% | 50% | 100% */}
                      <div className="pt-2">
                        <div className="text-[11px] font-bold text-gray-700 uppercase tracking-wide mb-1.5 flex justify-between items-center">
                          <span>Mức thanh toán:</span>
                          <span className="text-[10px] text-gray-400 font-normal">30% · 50% · 100%</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F9F5F6] rounded-xl border border-[#F0E4E6]">
                          {[30, 50, 100].map((pct) => (
                            <button
                              key={pct}
                              type="button"
                              onClick={() => setDepositPercent(pct)}
                              className={`cursor-pointer py-1.5 px-1 rounded-lg text-xs font-bold transition-all text-center ${
                                depositPercent === pct
                                  ? 'bg-[#BE4B5E] text-white shadow-xs'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
                              }`}
                            >
                              {pct === 100 ? '100% (Hết)' : `Cọc ${pct}%`}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Thẻ tiền cọc / thanh toán theo đúng thiết kế tham khảo */}
                      <div className="p-3.5 rounded-2xl bg-[#FFF5F6] border border-[#F5D5DC] space-y-1 mt-3">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs font-bold text-[#BE4B5E] uppercase tracking-wide">
                            {depositPercent === 100 ? 'THANH TOÁN (100%):' : `TIỀN CỌC (${depositPercent}%):`}
                          </span>
                          <span className="text-lg font-extrabold text-[#BE4B5E]">
                            {calculation.amountToPay.toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400">
                          {depositPercent === 100
                            ? 'Thanh toán trọn gói toàn bộ đơn chụp'
                            : 'Thanh toán để xác nhận đặt lịch'}
                        </p>
                        <p className="text-[11px] text-gray-600 pt-1 border-t border-pink-100 flex justify-between">
                          <span>
                            {depositPercent === 100
                              ? 'Còn lại tại Studio (0%):'
                              : `Còn lại tại Studio (${100 - depositPercent}%):`}
                          </span>
                          <strong>{calculation.remainingAmount.toLocaleString('vi-VN')}₫</strong>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs font-bold text-gray-600">Tổng tạm tính:</span>
                        <span className="text-lg font-extrabold text-[#BE4B5E]">
                          {calculation.subTotal.toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    </div>
                  )}

                  {/* NÚT TIẾP TỤC HOẶC THANH TOÁN */}
                  <div className="pt-2">
                    {currentStep === 1 && (
                      <button
                        type="button"
                        disabled={!isStep1Valid}
                        onClick={() => setCurrentStep(2)}
                        className="cursor-pointer w-full py-3 rounded-2xl bg-[#BE4B5E] hover:bg-[#a53b4d] text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#BE4B5E]/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <span>Tiếp tục chọn ngày & giờ</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}

                    {currentStep === 2 && (
                      <button
                        type="button"
                        disabled={!isStep2Valid}
                        onClick={() => setCurrentStep(3)}
                        className="cursor-pointer w-full py-3 rounded-2xl bg-[#BE4B5E] hover:bg-[#a53b4d] text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#BE4B5E]/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <span>Tiếp tục xác nhận</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}

                    {currentStep === 3 && (
                      <div>
                        {isAuthenticated ? (
                          <button
                            type="button"
                            disabled={submitting}
                            onClick={handleProceedToPayment}
                            className="cursor-pointer w-full py-3.5 rounded-2xl bg-[#BE4B5E] hover:bg-[#a53b4d] text-white font-bold text-sm transition-all shadow-md shadow-[#BE4B5E]/30 disabled:opacity-50 flex flex-col items-center justify-center"
                          >
                            <span className="flex items-center gap-2">
                              <span>Xác nhận & Thanh toán</span>
                              <ArrowRight className="w-4 h-4" />
                            </span>
                            <span className="text-[10px] text-white/80 font-normal mt-0.5">
                              Thanh toán qua VNPAY ({calculation.amountToPay.toLocaleString('vi-VN')}₫)
                            </span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setIsAuthModalOpen(true)}
                            className="cursor-pointer w-full py-3 rounded-2xl bg-[#BE4B5E] hover:bg-[#a53b4d] text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#BE4B5E]/30 flex items-center justify-center gap-2"
                          >
                            <Lock className="w-4 h-4" />
                            <span>Đăng nhập để thanh toán</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* THÔNG BÁO ĐĂNG NHẬP (BƯỚC 3) */}
            {currentStep === 3 && !isAuthenticated && (
              <div className="p-6 rounded-3xl bg-white border border-[#F0E4E6] shadow-md text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 mx-auto flex items-center justify-center text-[#BE4B5E]">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-[#261A1E]">Vui lòng đăng nhập để thanh toán</h4>
                <p className="text-xs text-gray-500 leading-relaxed max-w-[240px] mx-auto">
                  Bạn cần đăng nhập tài khoản để tiếp tục xác nhận và thanh toán đơn đặt lịch.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="cursor-pointer w-full py-2.5 rounded-xl bg-[#BE4B5E] text-white font-bold text-xs hover:bg-[#a53b4d] transition-all shadow-xs"
                >
                  Đăng nhập ngay
                </button>
                <p className="text-[11px] text-gray-400">
                  Chưa có tài khoản?{' '}
                  <Link to={ROUTES.AUTH.REGISTER} className="text-[#BE4B5E] font-semibold hover:underline">
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================================
          MODAL ĐĂNG NHẬP LỒNG TRỰC TIẾP TRÊN TRANG (INLINE AUTH MODAL)
         ===================================================================== */}
      {isAuthModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in"
          onClick={() => setIsAuthModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl border border-[#F0E4E6] shadow-2xl p-6 sm:p-8 relative text-[#261A1E]"
            onClick={(e) => e.stopPropagation()}
          >
            <FloralCardCorner position="top-right" opacity="opacity-25" />

            <button
              type="button"
              onClick={() => setIsAuthModalOpen(false)}
              className="cursor-pointer absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#BE4B5E]">PHOTOSTUDIO</span>
              <h3 className="text-xl font-bold font-serif-luxury">Đăng nhập tài khoản</h3>
              <p className="text-xs text-gray-500">Đăng nhập để lưu đơn đặt lịch và tiến hành thanh toán</p>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {authError}
              </div>
            )}

            <form onSubmit={handleInlineLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Tên đăng nhập / Email:</label>
                <input
                  type="text"
                  required
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  placeholder="admin hoặc customer1..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#BE4B5E]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Mật khẩu:</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Mật khẩu của bạn..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#BE4B5E]"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="cursor-pointer w-full py-3 rounded-xl bg-[#BE4B5E] hover:bg-[#a53b4d] text-white font-bold transition-all shadow-xs"
              >
                {authLoading ? 'Đang đăng nhập...' : 'Đăng nhập ngay'}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 block mb-2 text-center uppercase">
                Hoặc chọn nhanh tài khoản mẫu:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {CSDL_SEED_USERS.slice(1, 3).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickSeedLogin(u)}
                    className="cursor-pointer p-2 rounded-xl border border-gray-200 hover:border-[#BE4B5E] text-left transition-all hover:bg-rose-50/50"
                  >
                    <strong className="block text-gray-800 truncate">{u.fullname}</strong>
                    <span className="text-gray-400 text-[10px]">{u.username}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
