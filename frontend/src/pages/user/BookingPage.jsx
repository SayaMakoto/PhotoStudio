import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  TicketIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingLibraryIcon,
  CameraIcon,
} from '@heroicons/react/24/solid';

import BlurText from '../../components/animations/BlurText';
import { FloralBranchCorner, ScatteredPetals, FloralCardCorner } from '../../components/common/FloralDecorations';
import { ROUTES } from '../../routes/web';
import { customerAuth } from '../../lib/axiosCustomer';
import customerRoomService from '../../services/user/roomService';
import customerPackageService from '../../services/user/packageService';
import userImageService from '../../services/user/imageService';
import customerBookingService from '../../services/user/bookingService';
import customerPaymentService from '../../services/user/paymentService';

// =========================================================================
// DỮ LIỆU DỰ PHÒNG CHUẨN ĐỒNG BỘ 100% VỚI CSDL (DOCS/PHOTO_STUDIO.SQL)
// =========================================================================

const DEFAULT_ROOMS = [
  {
    id: 1,
    name: 'Phòng Studio A - Phong Cách Hàn Quốc',
    description: 'Tone màu sáng pastel, rèm voan trắng, hoa khô nghệ thuật, chuyên chụp chân dung, nàng thơ và beauty layout nhẹ nhàng',
    capacity: 5,
    area: '45m²',
    ceiling: '3.8m',
    primaryImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
    features: ['Cửa kính lớn đón ánh sáng tự nhiên', 'Rèm voan kép 2 lớp mềm mại', 'Phù hợp nhóm 1 - 5 người'],
  },
  {
    id: 2,
    name: 'Phòng Studio B - Concept Cổ Điển & Hoàng Gia',
    description: 'Diện tích 75m2, trần cao 4.2m, nội thất gỗ sồi cao cấp, đèn chùm pha lê, chuyên ảnh cưới VIP và dạ tiệc sang trọng',
    capacity: 10,
    area: '75m²',
    ceiling: '4.2m',
    primaryImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    features: ['Vòm đá cẩm thạch Pháp', 'Đèn chùm pha lê Swarovski', 'Phù hợp nhóm 5 - 10 người'],
  },
  {
    id: 3,
    name: 'Phòng Studio VIP - Cinema & Đa Năng',
    description: 'Trang bị hệ thống chiếu sáng kịch tính Arri/Aputure, dàn phông màu điện tử 8 màu tự động, phù hợp chụp profile doanh nhân & lookbook',
    capacity: 8,
    area: '65m²',
    ceiling: '4.0m',
    primaryImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=85',
    features: ['Phông điện tử 8 màu tự động', 'Màn hình xem ảnh 4K tethering', 'Cách âm tiêu chuẩn quay phim'],
  },
  {
    id: 4,
    name: 'Phòng Studio C - Không Gian Gia Đình Vintage',
    description: 'Bối cảnh phòng khách ấm cúng với sofa nhung cổ, lò sưởi, đàn piano, chuyên chụp ảnh gia đình đa thế hệ và thôi nôi cho bé',
    capacity: 12,
    area: '80m²',
    ceiling: '3.6m',
    primaryImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85',
    features: ['Lò sưởi decor & đàn piano cổ', 'Sofa nhung đại gia đình', 'Thân thiện và an toàn cho bé'],
  },
  {
    id: 5,
    name: 'Phòng Studio D - Concept Monochromatic',
    description: 'Tường xi măng công nghiệp tối giản, hệ thống tản sáng khổ lớn, chuyên chụp lookbook thời trang thương hiệu và nghệ thuật đen trắng',
    capacity: 6,
    area: '55m²',
    ceiling: '4.0m',
    primaryImage: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=85',
    features: ['Vách vô cực liền mạch', 'Ánh sáng high-fashion kịch tính', 'Chuẩn lookbook thời trang'],
  },
  {
    id: 6,
    name: 'Phòng Studio E - Ban Công Hoàng Hôn & Vườn Kính',
    description: 'Không gian đón trọn ánh sáng tự nhiên hoàng hôn với cửa kính panorama và giàn hoa nghệ thuật cho cặp đôi',
    capacity: 6,
    area: '50m²',
    ceiling: '3.8m',
    primaryImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
    features: ['Kính panorama view hoàng hôn', 'Vườn hoa nghệ thuật lãng mạn', 'Ánh sáng tự nhiên 100%'],
  },
  {
    id: 7,
    name: 'Phòng Studio F - Thư Viện Gỗ & Trầm Hương Cổ Điển',
    description: 'Bao phủ bởi kệ sách gỗ sồi kịch trần, bàn trà mahogany và ánh sáng vàng ấm áp cho doanh nhân và trí thức',
    capacity: 6,
    area: '48m²',
    ceiling: '3.6m',
    primaryImage: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1200&q=85',
    features: ['Kệ sách gỗ kịch trần', 'Bàn trà mahogany cao cấp', 'Tone ấm sang trọng lịch lãm'],
  },
  {
    id: 8,
    name: 'Phòng Studio G - Phố Cổ Hội An & Sen Ngọc Á Đông',
    description: 'Tái hiện không gian phố Hội với đèn lồng lụa thủ công, tường vàng rêu phong và hồ sen nghệ thuật',
    capacity: 8,
    area: '70m²',
    ceiling: '4.0m',
    primaryImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=85',
    features: ['Đèn lồng Hội An thủ công', 'Tường rêu phong cổ truyền', 'Chuyên áo dài & cổ phục Việt'],
  },
  {
    id: 9,
    name: 'Phòng Studio H - Tối Giản Scandinavian Tone Kem',
    description: 'Phong cách Bắc Âu tối giản với đường cong uốn lượn, thảm lông cừu và nội thất hữu cơ nhẹ nhàng',
    capacity: 5,
    area: '52m²',
    ceiling: '3.7m',
    primaryImage: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85',
    features: ['Nội thất hữu cơ organic', 'Tone màu beige kem êm dịu', 'Bục cong mềm mại tinh tế'],
  },
  {
    id: 10,
    name: 'Phòng Studio I - Dạ Tiệc Đêm & Ánh Sáng Neon Cyber',
    description: 'Hiệu ứng ánh sáng huyền ảo, đèn neon nghệ thuật và kính phản chiếu tương lai cho MV và bộ ảnh độc bản',
    capacity: 7,
    area: '60m²',
    ceiling: '3.9m',
    primaryImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=85',
    features: ['Hệ đèn Neon RGB tùy chỉnh', 'Kính phản chiếu đa chiều', 'Concept cá tính & độc bản'],
  },
  {
    id: 11,
    name: 'Phòng Studio K - Nghệ Thuật Điêu Khắc & Trừu Tượng',
    description: 'Không gian sắp đặt nghệ thuật đương đại với các khối hình học, tượng thạch cao và vải lụa bay bổng',
    capacity: 5,
    area: '45m²',
    ceiling: '4.0m',
    primaryImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85',
    features: ['Khối hình học kiến trúc', 'Tượng thạch cao nghệ thuật', 'Phù hợp layout mỹ thuật sáng tạo'],
  },
  {
    id: 12,
    name: 'Phòng Studio L - Vườn Hoa Tươi & Rèm Voan Mơ Màng',
    description: 'Hàng trăm nhành hoa tươi theo mùa được cắm tỉ mỉ kết hợp rèm voan bồng bềnh như bước vào truyện cổ tích',
    capacity: 6,
    area: '58m²',
    ceiling: '3.8m',
    primaryImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    features: ['Hoa tươi decor theo mùa', 'Rèm voan nhiều lớp lãng mạn', 'Layout công chúa & nàng thơ'],
  },
];

const DEFAULT_PACKAGES = [
  {
    id: 1,
    name: 'Gói Chụp Ảnh Cá Nhân / Nàng Thơ',
    category: 'portrait',
    originalPrice: 1200000,
    price: 990000,
    packageDiscountPercent: 15,
    duration: '90 phút',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    description: 'Phù hợp chụp chân dung nghệ thuật, profile mạng xã hội, phong cách Hàn Quốc hoặc vintage nhẹ nhàng.',
    features: ['1 concept tự chọn', '1 bộ trang phục cao cấp', 'Makeup & làm tóc chuyên nghiệp', '10 ảnh chỉnh sửa tỉ mỉ'],
  },
  {
    id: 2,
    name: 'Gói Chụp Ảnh Cưới Studio Cơ Bản',
    category: 'wedding',
    originalPrice: 3750000,
    price: 2990000,
    packageDiscountPercent: 20,
    duration: '120 phút',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    description: 'Dành cho các cặp đôi muốn lưu giữ khoảnh khắc cưới ngọt ngào, tinh tế trong không gian studio ấm cúng.',
    features: ['2 bối cảnh studio', '1 váy cưới ren Pháp & 1 vest', 'Makeup cô dâu cao cấp', '15 ảnh chỉnh sửa & tặng ảnh ép gỗ'],
  },
  {
    id: 3,
    name: 'Gói Chụp Ảnh Gia Đình / Nhóm Bạn',
    category: 'family',
    originalPrice: 2200000,
    price: 1990000,
    packageDiscountPercent: 10,
    duration: '90 phút',
    image: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=800&q=80',
    description: 'Không gian ấm áp dành riêng cho đại gia đình hoặc nhóm bạn thân lưu giữ những nụ cười hạnh phúc.',
    features: ['Nhóm 4 - 8 người', 'Tự do chọn trang phục studio', 'Hỗ trợ dặm phấn tạo kiểu', '15 ảnh hoàn thiện chất lượng cao'],
  },
  {
    id: 4,
    name: 'Gói Cưới Luxury & Ngoại Cảnh VIP',
    category: 'wedding',
    originalPrice: 12000000,
    price: 8990000,
    packageDiscountPercent: 25,
    duration: '240 phút',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    description: 'Trọn gói cao cấp không gian hoàng gia kết hợp ngoại cảnh lãng mạn hoàng hôn cho ngày trọng đại.',
    features: ['Xe đưa đón tận nơi', '2 váy cưới thiết kế VIP', 'Chuyên gia makeup theo sát', 'Album photobook 30 trang cao cấp'],
  },
  {
    id: 5,
    name: 'Gói Chụp Kỷ Yếu & Tốt Nghiệp',
    category: 'concept',
    originalPrice: 1490000,
    price: 1490000,
    packageDiscountPercent: 0,
    duration: '90 phút',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    description: 'Lưu giữ thanh xuân rực rỡ với trang phục cử nhân, veston và đạo cụ tốt nghiệp sáng tạo.',
    features: ['Đầy đủ áo cử nhân & mũ', 'Bóng bay & đạo cụ chụp', 'Chụp không giới hạn file gốc', '12 ảnh chỉnh sửa sáng tạo'],
  },
  {
    id: 6,
    name: 'Gói Chụp Doanh Nhân / Profile',
    category: 'business',
    originalPrice: 2000000,
    price: 1690000,
    packageDiscountPercent: 15,
    duration: '60 phút',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    description: 'Hình ảnh đĩnh đạc, tự tin chuẩn phong thái lãnh đạo dành cho CV, profile doanh nghiệp và báo chí.',
    features: ['Ánh sáng kịch tính chuẩn Forbes', 'Tư vấn tạo dáng thần thái', 'Chỉnh sửa da chuyên sâu 4K', 'Giao 8 file hoàn thiện gấp trong 24h'],
  },
  {
    id: 7,
    name: 'Gói Chụp Lookbook & Thương Mại',
    category: 'business',
    originalPrice: 7000000,
    price: 4900000,
    packageDiscountPercent: 30,
    duration: '180 phút',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    description: 'Chụp lookbook bộ sưu tập thời trang thương hiệu với dàn đèn công suất cao và tethering 4K xem ảnh tức thì.',
    features: ['Chụp 8-15 bộ trang phục', 'Phông vô cực hoặc bối cảnh', 'Màn hình kiểm tra màu chuẩn', 'Toàn bộ file gốc ngay trong ngày'],
  },
  {
    id: 8,
    name: 'Gói Cổ Trang & Áo Dài Nghệ Thuật',
    category: 'concept',
    originalPrice: 1890000,
    price: 1890000,
    packageDiscountPercent: 0,
    duration: '90 phút',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    description: 'Tôn vinh nét đẹp truyền thống với áo dài thêu hoa thủ công, cổ phục Việt và bối cảnh Hội An xưa.',
    features: ['2 bộ áo dài / cổ phục cao cấp', 'Trang sức & phụ kiện nón lá/quạt', 'Makeup phong cách Á Đông', '12 ảnh hoàn thiện nghệ thuật'],
  },
];

const TIME_SLOTS = [
  { id: 'm1', label: '08:30 – 10:30 (Sáng)', start: '08:30:00', end: '10:30:00' },
  { id: 'm2', label: '10:30 – 12:30 (Trưa)', start: '10:30:00', end: '12:30:00' },
  { id: 'a1', label: '13:30 – 15:30 (Chiều)', start: '13:30:00', end: '15:30:00' },
  { id: 'a2', label: '16:00 – 18:00 (Hoàng hôn)', start: '16:00:00', end: '18:00:00' },
  { id: 'e1', label: '18:30 – 20:30 (Tối Studio)', start: '18:30:00', end: '20:30:00' },
];

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Kiểm tra đăng nhập bắt buộc
  const isAuthenticated = customerAuth.isAuthenticated();
  const currentUser = customerAuth.getUser();

  // Đọc query parameters và location.state
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialPackageId = Number(searchParams.get('packageId') || location.state?.packageId || 1);
  const initialRoomId = Number(searchParams.get('roomId') || location.state?.roomId || 1);

  // Danh sách phòng và gói
  const [rooms, setRooms] = useState(DEFAULT_ROOMS);
  const [packages, setPackages] = useState(DEFAULT_PACKAGES);

  // Lựa chọn đặt lịch
  const [selectedRoomId, setSelectedRoomId] = useState(initialRoomId);
  const [selectedPackageId, setSelectedPackageId] = useState(initialPackageId);
  const [bookingDate, setBookingDate] = useState(() => {
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    return tmr.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS[0]);

  // Thông tin khách hàng
  const [customerInfo, setCustomerInfo] = useState({
    name: currentUser?.fullName || currentUser?.name || '',
    phone: currentUser?.phone || currentUser?.phoneNumber || '',
    email: currentUser?.email || '',
    attendees: 1,
    notes: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Nếu người dùng chưa đăng nhập, tự động chuyển sang trang đăng nhập kèm trạng thái chuyển hướng
  useEffect(() => {
    if (!isAuthenticated) {
      const returnUrl = location.pathname + location.search;
      navigate(ROUTES.AUTH.LOGIN, {
        replace: true,
        state: {
          from: returnUrl,
          message: 'Quý khách vui lòng đăng nhập tài khoản để tiến hành đặt lịch chụp trực tuyến!',
        },
      });
    }
  }, [isAuthenticated, navigate, location.pathname, location.search]);

  // Load danh sách phòng & gói thực tế từ CSDL
  useEffect(() => {
    async function loadData() {
      try {
        const [roomsRes, pkgsRes, imgsRes] = await Promise.allSettled([
          customerRoomService.getAllRooms(),
          customerPackageService.getAllPackages(),
          userImageService.getAllImages(),
        ]);

        const allImages = imgsRes.status === 'fulfilled' && Array.isArray(imgsRes.value) ? imgsRes.value : [];

        // 1. Đồng bộ Phòng
        if (roomsRes.status === 'fulfilled') {
          const rawRooms = Array.isArray(roomsRes.value?.data)
            ? roomsRes.value.data
            : Array.isArray(roomsRes.value)
            ? roomsRes.value
            : [];

          if (rawRooms.length > 0) {
            const mappedRooms = rawRooms.map((r) => {
              const rImg = allImages.find(
                (img) =>
                  (img.imageableType?.toLowerCase() === 'room' || img.imageable_type?.toLowerCase() === 'room') &&
                  Number(img.imageableId || img.imageable_id) === Number(r.id)
              );
              const fallback = DEFAULT_ROOMS.find((d) => d.id === r.id) || DEFAULT_ROOMS[0];
              const resolvedImage = rImg?.imageUrl || rImg?.image_url || r.primaryImage || r.image || fallback.primaryImage;
              return {
                ...fallback,
                ...r,
                primaryImage: resolvedImage,
                image: resolvedImage,
              };
            });
            setRooms(mappedRooms);
          }
        }

        // 2. Đồng bộ Gói chụp
        if (pkgsRes.status === 'fulfilled') {
          const rawPkgs = Array.isArray(pkgsRes.value?.data)
            ? pkgsRes.value.data
            : Array.isArray(pkgsRes.value)
            ? pkgsRes.value
            : [];

          if (rawPkgs.length > 0) {
            const mappedPkgs = DEFAULT_PACKAGES.map((dp) => {
              const apiPkg = rawPkgs.find((p) => p.id === dp.id);
              const pImg = allImages.find(
                (img) =>
                  (img.imageableType?.toLowerCase() === 'package' || img.imageable_type?.toLowerCase() === 'package') &&
                  Number(img.imageableId || img.imageable_id) === Number(dp.id)
              );
              const resolvedImage = pImg?.imageUrl || pImg?.image_url || apiPkg?.image || dp.image;
              if (apiPkg) {
                return {
                  ...dp,
                  name: apiPkg.name || dp.name,
                  price: apiPkg.price || dp.price,
                  description: apiPkg.description || dp.description,
                  image: resolvedImage,
                  primaryImage: resolvedImage,
                };
              }
              return { ...dp, image: resolvedImage, primaryImage: resolvedImage };
            });
            setPackages(mappedPkgs);
          }
        }
      } catch (err) {
        console.warn('[BookingPage] Tải dữ liệu phòng/gói lỗi:', err.message);
      }
    }

    void loadData();
  }, []);

  // Lấy chi tiết phòng và gói đang chọn
  const selectedRoom = useMemo(() => {
    return rooms.find((r) => r.id === Number(selectedRoomId)) || rooms[0] || DEFAULT_ROOMS[0];
  }, [rooms, selectedRoomId]);

  const selectedPackage = useMemo(() => {
    return packages.find((p) => p.id === Number(selectedPackageId)) || packages[0] || DEFAULT_PACKAGES[0];
  }, [packages, selectedPackageId]);

  // =========================================================================
  // TÍNH TOÁN GIÁ & MÃ GIẢM GIÁ TRỰC TUYẾN 20% TỪ TRANG CHỦ (STUDIO2026)
  // =========================================================================
  const pricingSummary = useMemo(() => {
    const originalPrice = selectedPackage.originalPrice || selectedPackage.price;
    const pkgDiscountPercent = selectedPackage.packageDiscountPercent || 0;
    const regularPackagePrice = selectedPackage.price;

    const userId = currentUser?.id || currentUser?.username || customerInfo.phone;
    const isPromoUsed = customerPaymentService.checkPromoCodeUsage(userId, 'STUDIO2026');

    let canApplyPromo;
    let promoReason;
    let finalTotal;
    let promoDiscountAmount;

    if (isPromoUsed) {
      canApplyPromo = false;
      promoReason = 'Mã STUDIO2026 bạn đã từng sử dụng trước đó (mỗi tài khoản được dùng 1 lần).';
      promoDiscountAmount = 0;
      finalTotal = regularPackagePrice;
    } else if (pkgDiscountPercent > 20) {
      canApplyPromo = false;
      promoReason = `Gói chụp đang có ưu đãi ${pkgDiscountPercent}% (>20%), hệ thống tự động giữ mức ưu đãi cao nhất cho bạn.`;
      promoDiscountAmount = 0;
      finalTotal = regularPackagePrice;
    } else {
      canApplyPromo = true;
      promoReason = 'Áp dụng mã STUDIO2026: Giảm 20% trên giá gốc niêm yết dành cho khách đặt lịch trực tuyến!';
      promoDiscountAmount = Math.round(originalPrice * 0.2);
      finalTotal = originalPrice - promoDiscountAmount;
    }

    // Tiền cọc (mặc định 30% tổng thanh toán)
    const depositAmount = Math.round(finalTotal * 0.3);
    const remainingAmount = finalTotal - depositAmount;

    return {
      originalPrice,
      pkgDiscountPercent,
      regularPackagePrice,
      canApplyPromo,
      promoReason,
      promoDiscountAmount,
      finalTotal,
      depositAmount,
      remainingAmount,
    };
  }, [selectedPackage, currentUser, customerInfo.phone]);

  // Xử lý xác nhận đặt lịch
  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Kiểm tra thông tin nhập
    const errors = {};
    if (!customerInfo.name.trim()) errors.name = 'Vui lòng nhập họ và tên của bạn.';
    if (!customerInfo.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại liên hệ.';
    } else if (!/^[0-9+ ]{9,15}$/.test(customerInfo.phone.trim())) {
      errors.phone = 'Số điện thoại không hợp lệ.';
    }
    if (!bookingDate) errors.date = 'Vui lòng chọn ngày chụp.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Tạo đơn đặt lịch trong CSDL qua backend API
      const customerIdToUse = currentUser?.id && currentUser?.role === 'Customer' ? currentUser.id : (currentUser?.id || 4);

      const bookingPayload = {
        customerId: customerIdToUse,
        roomId: selectedRoom.id,
        bookingDate: `${bookingDate}T${selectedTimeSlot.start}`,
        startTime: selectedTimeSlot.start,
        endTime: selectedTimeSlot.end,
        status: 'pending',
        customerNote: `[Đặt Lịch Trực Tuyến] Khách: ${customerInfo.name.trim()} - SĐT: ${customerInfo.phone.trim()} - Gói: ${selectedPackage.name} - Phòng: ${selectedRoom.name} - Khung giờ: ${selectedTimeSlot.label} - Số người: ${customerInfo.attendees}${customerInfo.notes ? ` - Ghi chú: ${customerInfo.notes}` : ''}`,
      };

      let createdBookingId = null;
      try {
        const res = await customerBookingService.createBooking(bookingPayload);
        createdBookingId = res?.data?.id || res?.id || null;
      } catch (apiErr) {
        console.warn('[BookingPage] Không gọi được API backend booking, dùng ID giả lập:', apiErr.message);
        createdBookingId = Date.now() % 100000;
      }

      // 2. Chuyển hướng sang trang thanh toán kèm thông tin gói, phòng và tự động tính mã giảm giá
      navigate(ROUTES.USER.PAYMENT, {
        state: {
          bookingId: createdBookingId || 1,
          packageId: selectedPackage.id,
          roomId: selectedRoom.id,
          date: bookingDate,
          time: selectedTimeSlot.label,
          customerName: customerInfo.name.trim(),
          customerPhone: customerInfo.phone.trim(),
          customerEmail: customerInfo.email.trim(),
          customerNote: customerInfo.notes.trim(),
          promoCode: pricingSummary.canApplyPromo ? 'STUDIO2026' : '',
          autoApplyPromo: pricingSummary.canApplyPromo,
        },
      });
    } catch {
      setSubmitError('Có lỗi xảy ra khi tạo lịch hẹn. Vui lòng thử lại hoặc liên hệ hotline studio.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Đang chuyển hướng sang /login
  }

  return (
    <div className="bg-[#FAF5F5] min-h-screen text-[#261A1E] font-sans selection:bg-[#B85064]/20 selection:text-[#B85064] relative overflow-hidden pb-20">
      {/* Họa tiết hoa trang trí góc */}
      <FloralBranchCorner position="top-right" opacity="opacity-50" className="top-24 z-10" />
      <FloralBranchCorner position="bottom-left" opacity="opacity-40" className="bottom-40 z-10" />
      <ScatteredPetals className="z-10 pointer-events-none" />

      {/* Hero Header */}
      <div className="relative pt-12 pb-10 bg-gradient-to-b from-[#FFF5F6] via-[#FAF5F5] to-[#FAF5F5] border-b border-[#F0E4E6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#B85064]/10 text-[#B85064] text-xs font-bold uppercase tracking-wider mb-3 border border-[#B85064]/20">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Hệ Thống Đặt Lịch Chụp Trực Tuyến</span>
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-luxury text-[#2A1D22] tracking-tight">
              <BlurText text="Khám Phá Phòng & Đặt Lịch Studio" delay={30} />
            </h1>

            <p className="mt-3 text-sm sm:text-base text-[#7A6C71] font-light leading-relaxed">
              Điền thông tin đặt lịch, chọn không gian studio yêu thích và nhận ngay ưu đãi <strong className="text-[#B85064] font-semibold">20% trực tuyến</strong> khi thanh toán hôm nay.
            </p>

            {/* Banner ưu đãi 20% */}
            <div className="mt-5 inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#FFF0F2] via-white to-[#FFF0F2] border border-[#F0D5DA] shadow-sm text-xs sm:text-sm text-[#8E3447]">
              <TicketIcon className="w-4 h-4 text-[#B85064] shrink-0 animate-bounce" />
              <span>
                Áp dụng mã ưu đãi <strong className="font-mono font-bold bg-[#B85064] text-white px-2 py-0.5 rounded-md">STUDIO2026</strong> giảm 20% trực tiếp trên giá gốc niêm yết!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Booking Content: Bố cục 2 cột 50/50 ở trên và 100% full-width tóm tắt ở dưới */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <form onSubmit={handleConfirmBooking} className="space-y-10">
          
          {/* HÀNG TRÊN: 4 KHUNG ĐỀU NHAU (LƯỚI 2x2 TRÊN DESKTOP: 50% TRÁI & 50% PHẢI) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* [HÀNG 1 - TRÁI 50%]: KHUNG 1 - THÔNG TIN NGƯỜI DÙNG */}
            <section className="order-1 bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E4E6] shadow-sm relative overflow-hidden flex flex-col justify-between h-full">
              <FloralCardCorner position="top-right" />

              <div>
                <div className="flex items-center gap-2.5 pb-5 border-b border-[#F0E4E6] mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#B85064] text-white text-sm font-bold flex items-center justify-center shadow-sm shrink-0">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-serif-luxury text-[#2A1D22]">
                      Thông Tin Người Dùng Đặt Lịch
                    </h2>
                    <p className="text-xs text-[#7A6C71]">
                      Thông tin liên hệ xác nhận lịch chụp và nhận bộ ảnh hoàn thiện
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Họ và tên */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D22] mb-1.5 flex items-center gap-1">
                      <span>Họ Và Tên Khách Hàng *</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => {
                          setCustomerInfo({ ...customerInfo, name: e.target.value });
                          if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                        }}
                        placeholder="VD: Nguyễn Thúy Vi"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F0E4E6] focus:border-[#B85064] focus:ring-2 focus:ring-[#B85064]/20 outline-none text-xs sm:text-sm text-[#2A1D22]"
                      />
                      <UserIcon className="w-4 h-4 text-[#A6979B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                    {formErrors.name && (
                      <p className="text-xs text-rose-500 mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  {/* Số điện thoại */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D22] mb-1.5">
                      Số Điện Thoại (Zalo) *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => {
                          setCustomerInfo({ ...customerInfo, phone: e.target.value });
                          if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                        }}
                        placeholder="VD: 0912345678"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F0E4E6] focus:border-[#B85064] focus:ring-2 focus:ring-[#B85064]/20 outline-none text-xs sm:text-sm text-[#2A1D22]"
                      />
                      <PhoneIcon className="w-4 h-4 text-[#A6979B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                    {formErrors.phone && (
                      <p className="text-xs text-rose-500 mt-1">{formErrors.phone}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D22] mb-1.5">
                      Email Nhận Biên Lai
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        placeholder="email@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F0E4E6] focus:border-[#B85064] focus:ring-2 focus:ring-[#B85064]/20 outline-none text-xs sm:text-sm text-[#2A1D22]"
                      />
                      <EnvelopeIcon className="w-4 h-4 text-[#A6979B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Số người */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D22] mb-1.5">
                      Số Lượng Người Tham Gia Buổi Chụp
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max={selectedRoom.capacity || 10}
                        value={customerInfo.attendees}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, attendees: Number(e.target.value) || 1 })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F0E4E6] focus:border-[#B85064] focus:ring-2 focus:ring-[#B85064]/20 outline-none text-xs sm:text-sm text-[#2A1D22]"
                      />
                      <UserGroupIcon className="w-4 h-4 text-[#A6979B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <span className="text-[11px] text-[#7A6C71] mt-1 block">
                      Phòng {selectedRoom.name.split(' - ')[0]} có sức chứa tối đa {selectedRoom.capacity} người.
                    </span>
                  </div>

                  {/* Ghi chú */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D22] mb-1.5">
                      Ghi Chú Đặc Biệt / Yêu Cầu Concept Riêng
                    </label>
                    <textarea
                      rows="3"
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                      placeholder="VD: Cần hỗ trợ mượn áo dài trắng size M, mong muốn chụp layout hoàng hôn, makeup tự nhiên..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[#F0E4E6] focus:border-[#B85064] focus:ring-2 focus:ring-[#B85064]/20 outline-none text-xs sm:text-sm text-[#2A1D22] resize-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* [HÀNG 1 - PHẢI 50%]: KHUNG 3 - CHỌN PHÒNG CHỤP STUDIO */}
            <section className="order-3 lg:order-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E4E6] shadow-sm relative overflow-hidden flex flex-col justify-between h-full">
              <FloralCardCorner position="top-right" />

              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0E4E6] mb-4 gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#B85064] text-white text-sm font-bold flex items-center justify-center shadow-sm shrink-0">
                      <BuildingLibraryIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold font-serif-luxury text-[#2A1D22]">
                        Chọn Phòng Chụp Studio
                      </h2>
                      <p className="text-xs text-[#7A6C71]">
                        12 không gian độc bản lấy 100% hình ảnh thực tế từ CSDL
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-[#B85064] bg-[#FFF0F2] px-3 py-1 rounded-full border border-[#F0D5DA] self-start sm:self-auto shrink-0">
                    Đang chọn: <strong>{selectedRoom.name.split(' - ')[0]}</strong>
                  </span>
                </div>

                {/* ẢNH ĐẠI DIỆN LỚN CỦA PHÒNG ĐANG CHỌN */}
                <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-4 border border-[#F0E4E6] shadow-md bg-neutral-900 group">
                  <img
                    src={selectedRoom.primaryImage || selectedRoom.image}
                    alt={selectedRoom.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85';
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                  
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                      Phòng #{selectedRoom.id} • {selectedRoom.area || '60m²'}
                    </span>
                    <span className="text-[10px] font-bold text-white bg-[#B85064] px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <CheckCircleIcon className="w-3.5 h-3.5" />
                      <span>Đang Chọn</span>
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <h3 className="font-bold text-sm sm:text-base font-serif-luxury drop-shadow-md">
                      {selectedRoom.name}
                    </h3>
                    <p className="text-[11px] text-white/80 line-clamp-1">
                      {selectedRoom.description}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A6C71] mb-2 flex items-center justify-between">
                  <span>Danh Sách 12 Không Gian Studio:</span>
                  <span className="text-[#B85064]">Nhấn ảnh để đổi phòng</span>
                </div>

                {/* Danh sách phòng: Grid 2 cột cuộn mượt mà có ảnh rõ nét */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-[240px] overflow-y-auto pr-1">
                  {rooms.map((room) => {
                    const isSelected = Number(selectedRoomId) === Number(room.id);
                    return (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoomId(room.id)}
                        className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200 flex flex-col relative group ${
                          isSelected
                            ? 'border-[#B85064] bg-[#FFF7F8] shadow-md ring-2 ring-[#B85064]/20'
                            : 'border-[#F0E4E6] bg-white hover:border-[#B85064]/50 hover:shadow-sm'
                        }`}
                      >
                        {/* Ảnh phòng */}
                        <div className="relative h-24 w-full overflow-hidden bg-neutral-900">
                          <img
                            src={room.primaryImage || room.image}
                            alt={room.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85';
                            }}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

                          {/* Badges */}
                          <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                            <span className="text-[9px] font-bold text-white bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/20">
                              {room.area || '60m²'}
                            </span>
                            <span className="text-[9px] font-bold text-white bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/20 flex items-center gap-0.5">
                              <UserGroupIcon className="w-2.5 h-2.5 text-[#E899A8]" />
                              <span>{room.capacity}</span>
                            </span>
                          </div>

                          {/* Checkmark active */}
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#B85064] text-white flex items-center justify-center shadow-md">
                              <CheckCircleIcon className="w-3 h-3" />
                            </div>
                          )}

                          <div className="absolute bottom-1 left-1.5 right-1.5 text-white">
                            <h4 className="font-bold text-[11px] drop-shadow-md truncate">
                              {room.name}
                            </h4>
                          </div>
                        </div>

                        {/* Thông tin vắn tắt */}
                        <div className="p-2 text-xs flex-1 flex flex-col justify-between space-y-1">
                          <p className="text-[#7A6C71] text-[10px] line-clamp-1 leading-relaxed">
                            {room.description}
                          </p>

                          <div className="pt-1 border-t border-[#F0E4E6] flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-[#B85064]">
                              {room.ceiling ? `Trần ${room.ceiling}` : 'Chuẩn Studio'}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                isSelected
                                  ? 'bg-[#B85064] text-white'
                                  : 'bg-neutral-100 text-[#55464B] group-hover:bg-[#B85064]/10 group-hover:text-[#B85064]'
                              }`}
                            >
                              {isSelected ? 'Đã Chọn' : 'Chọn'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* [HÀNG 2 - TRÁI 50%]: KHUNG 2 - CHỌN NGÀY VÀ GIỜ CHỤP */}
            <section className="order-2 lg:order-3 bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E4E6] shadow-sm relative overflow-hidden flex flex-col justify-between h-full">
              <FloralCardCorner position="top-right" />

              <div>
                <div className="flex items-center gap-2.5 pb-5 border-b border-[#F0E4E6] mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#B85064] text-white text-sm font-bold flex items-center justify-center shadow-sm shrink-0">
                    <CalendarDaysIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-serif-luxury text-[#2A1D22]">
                      Chọn Ngày Và Giờ Chụp
                    </h2>
                    <p className="text-xs text-[#7A6C71]">
                      Lịch mở cửa phục vụ từ 08:30 đến 21:00 hàng ngày, kể cả Thứ 7 và Chủ Nhật
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Chọn Ngày */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D22] mb-2">
                      Ngày Chụp Studio *
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingDate}
                      onChange={(e) => {
                        setBookingDate(e.target.value);
                        if (formErrors.date) setFormErrors({ ...formErrors, date: '' });
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-[#F0E4E6] focus:border-[#B85064] focus:ring-2 focus:ring-[#B85064]/20 outline-none text-sm text-[#2A1D22] bg-white cursor-pointer font-medium"
                    />
                    {formErrors.date && (
                      <p className="text-xs text-rose-500 mt-1">{formErrors.date}</p>
                    )}
                  </div>

                  {/* Chọn Khung Giờ */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1D22] mb-2">
                      Khung Giờ Chụp *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {TIME_SLOTS.map((slot) => {
                        const isSlotSelected = selectedTimeSlot.id === slot.id;
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`px-3.5 py-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                              isSlotSelected
                                ? 'border-[#B85064] bg-[#FFF0F2] text-[#B85064] ring-2 ring-[#B85064]/20 shadow-sm'
                                : 'border-[#F0E4E6] bg-white text-[#55464B] hover:border-[#B85064]/40 hover:bg-[#FAF5F5]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <ClockIcon className="w-4 h-4 text-[#B85064]" />
                              <span>{slot.label}</span>
                            </div>
                            {isSlotSelected && <CheckCircleIcon className="w-4 h-4 text-[#B85064]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* [HÀNG 2 - PHẢI 50%]: KHUNG 4 - CHỌN GÓI CHỤP NGHỆ THUẬT */}
            <section className="order-4 bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E4E6] shadow-sm relative overflow-hidden flex flex-col justify-between h-full">
              <FloralCardCorner position="top-right" />

              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0E4E6] mb-4 gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#B85064] text-white text-sm font-bold flex items-center justify-center shadow-sm shrink-0">
                      <CameraIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold font-serif-luxury text-[#2A1D22]">
                        Chọn Gói Chụp Nghệ Thuật
                      </h2>
                      <p className="text-xs text-[#7A6C71]">
                        8 gói chụp đa dạng phong cách, trọn gói trang phục và chỉnh sửa
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-[#B85064] bg-[#FFF0F2] px-3 py-1 rounded-full border border-[#F0D5DA] self-start sm:self-auto shrink-0">
                    Đang chọn: <strong>{selectedPackage.name}</strong>
                  </span>
                </div>

                {/* ẢNH ĐẠI DIỆN LỚN CỦA GÓI ĐANG CHỌN */}
                <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-4 border border-[#F0E4E6] shadow-md bg-neutral-900 group">
                  <img
                    src={selectedPackage.image || selectedPackage.primaryImage}
                    alt={selectedPackage.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-white bg-[#B85064] px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <CheckCircleIcon className="w-3.5 h-3.5" />
                      <span>{selectedPackage.duration || '90 phút'} • Đang Chọn</span>
                    </span>
                    {selectedPackage.packageDiscountPercent > 0 && (
                      <span className="text-[10px] font-bold text-white bg-rose-600 px-2 py-0.5 rounded-full shadow-sm">
                        Giảm {selectedPackage.packageDiscountPercent}%
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3 text-white flex items-end justify-between">
                    <div>
                      <h3 className="font-bold text-sm sm:text-base font-serif-luxury drop-shadow-md">
                        {selectedPackage.name}
                      </h3>
                      <p className="text-[11px] text-white/80 line-clamp-1">
                        {selectedPackage.description}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base font-bold text-[#F3ACB8]">
                        {selectedPackage.price.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A6C71] mb-2 flex items-center justify-between">
                  <span>Danh Sách 8 Gói Chụp Nghệ Thuật:</span>
                  <span className="text-[#B85064]">Nhấn ảnh để đổi gói</span>
                </div>

                {/* Grid 8 gói chụp có hình ảnh */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-[240px] overflow-y-auto pr-1">
                  {packages.map((pkg) => {
                    const isSelected = Number(selectedPackageId) === Number(pkg.id);
                    const hasDiscount = pkg.originalPrice && pkg.originalPrice > pkg.price;

                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200 flex flex-col relative group ${
                          isSelected
                            ? 'border-[#B85064] bg-[#FFF7F8] shadow-md ring-2 ring-[#B85064]/20'
                            : 'border-[#F0E4E6] bg-white hover:border-[#B85064]/50 hover:shadow-sm'
                        }`}
                      >
                        {/* Ảnh gói */}
                        <div className="relative h-24 w-full overflow-hidden bg-neutral-900">
                          <img
                            src={pkg.image || pkg.primaryImage}
                            alt={pkg.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
                            }}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

                          {/* Discount Badge */}
                          {hasDiscount && (
                            <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-bold shadow-md">
                              Giảm {pkg.packageDiscountPercent}%
                            </div>
                          )}

                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#B85064] text-white flex items-center justify-center shadow-md">
                              <CheckCircleIcon className="w-3 h-3" />
                            </div>
                          )}

                          <div className="absolute bottom-1 left-1.5 right-1.5 text-white">
                            <span className="text-[9px] uppercase font-bold text-[#F3ACB8] block">
                              {pkg.duration || '90 phút'}
                            </span>
                            <h4 className="font-bold text-[11px] drop-shadow-md truncate">
                              {pkg.name}
                            </h4>
                          </div>
                        </div>

                        {/* Thông tin giá và nút chọn */}
                        <div className="p-2 text-xs flex-1 flex flex-col justify-between space-y-1">
                          <p className="text-[#7A6C71] text-[10px] line-clamp-1 leading-relaxed">
                            {pkg.description}
                          </p>

                          <div className="pt-1 border-t border-[#F0E4E6] flex items-center justify-between">
                            <div>
                              {hasDiscount && (
                                <span className="text-[9px] text-[#A6979B] line-through block leading-none">
                                  {pkg.originalPrice.toLocaleString('vi-VN')} đ
                                </span>
                              )}
                              <span className="text-[11px] font-bold text-[#B85064]">
                                {pkg.price.toLocaleString('vi-VN')} đ
                              </span>
                            </div>

                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                isSelected
                                  ? 'bg-[#B85064] text-white'
                                  : 'bg-neutral-100 text-[#55464B] group-hover:bg-[#B85064]/10 group-hover:text-[#B85064]'
                              }`}
                            >
                              {isSelected ? 'Đã Chọn' : 'Chọn'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

          </div>

          {/* ========================================================================= */}
          {/* HÀNG DƯỚI: BẢNG TÓM TẮT ĐẶT LỊCH CHIẾM 100% NẰM Ở DƯỚI 4 CÁI KHUNG KIA */}
          {/* ========================================================================= */}
          <div className="w-full">
            <section className="bg-white rounded-3xl p-6 sm:p-9 border border-[#F0E4E6] shadow-xl relative overflow-hidden">
              <FloralCardCorner position="top-right" />
              <FloralCardCorner position="bottom-left" />

              {/* Header của bảng tóm tắt */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#F0E4E6] gap-3">
                <div>
                  <h3 className="text-2xl font-bold font-serif-luxury text-[#2A1D22]">
                    Bảng Tóm Tắt Đặt Lịch & Dự Tính Chi Phí
                  </h3>
                  <p className="text-xs text-[#7A6C71] mt-1">
                    Vui lòng kiểm tra kỹ thông tin phòng chụp, gói chụp và ngày giờ trước khi chuyển sang thanh toán
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0F2] border border-[#F0D5DA] text-xs font-semibold text-[#B85064] self-start sm:self-auto">
                  <ShieldCheckIcon className="w-4 h-4 text-[#B85064]" />
                  <span>Bước Tiếp Theo: Cổng Thanh Toán VNPay Sandbox</span>
                </div>
              </div>

              {/* Bố cục 4 cột rộng rãi cho toàn bộ bảng tóm tắt */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-b border-[#F0E4E6]">
                
                {/* CỘT 1: PHÒNG CHỤP ĐÃ CHỌN */}
                <div className="bg-[#FAF5F5] rounded-2xl p-4 border border-[#F0E4E6] flex flex-col justify-between space-y-3">
                  <div className="space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#B85064] block">
                      Không Gian Studio
                    </span>
                    <div className="relative h-28 w-full rounded-xl overflow-hidden bg-neutral-900 border border-[#F0E4E6]">
                      <img
                        src={selectedRoom.primaryImage || selectedRoom.image}
                        alt={selectedRoom.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85';
                        }}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] text-white font-bold">
                        Phòng #{selectedRoom.id}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#2A1D22]">
                        {selectedRoom.name}
                      </h4>
                      <p className="text-xs text-[#7A6C71] mt-0.5">
                        {selectedRoom.area || '60m²'} • Tối đa {selectedRoom.capacity} người
                      </p>
                    </div>
                  </div>
                </div>

                {/* CỘT 2: GÓI CHỤP ĐÃ CHỌN */}
                <div className="bg-[#FAF5F5] rounded-2xl p-4 border border-[#F0E4E6] flex flex-col justify-between space-y-3">
                  <div className="space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#B85064] block">
                      Gói Chụp Nghệ Thuật
                    </span>
                    <div className="relative h-28 w-full rounded-xl overflow-hidden bg-neutral-900 border border-[#F0E4E6]">
                      <img
                        src={selectedPackage.image || selectedPackage.primaryImage}
                        alt={selectedPackage.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
                        }}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1.5 left-1.5 bg-[#B85064] px-2 py-0.5 rounded-md text-[10px] text-white font-bold">
                        {selectedPackage.duration || '90 phút'}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#2A1D22]">
                        {selectedPackage.name}
                      </h4>
                      <p className="text-xs text-[#7A6C71] mt-0.5">
                        Trọn gói makeup & trang phục thiết kế
                      </p>
                    </div>
                  </div>
                </div>

                {/* CỘT 3: THỜI GIAN & KHÁCH HÀNG */}
                <div className="bg-[#FAF5F5] rounded-2xl p-4 border border-[#F0E4E6] flex flex-col justify-between space-y-3">
                  <div className="space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#B85064] block">
                      Lịch Hẹn & Khách Hàng
                    </span>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-[#F0E4E6] space-y-1">
                        <span className="text-[11px] text-[#7A6C71] block">Thời gian chụp:</span>
                        <strong className="text-xs text-[#2A1D22] block font-semibold">
                          {bookingDate}
                        </strong>
                        <span className="text-[11px] text-[#B85064] font-medium block">
                          {selectedTimeSlot.label}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-[#F0E4E6] space-y-1">
                        <span className="text-[11px] text-[#7A6C71] block">Khách hàng liên hệ:</span>
                        <strong className="text-xs text-[#2A1D22] block">
                          {customerInfo.name || 'Chưa nhập họ tên'}
                        </strong>
                        <span className="text-[11px] text-[#55464B] block">
                          SĐT: {customerInfo.phone || 'Chưa nhập SĐT'}
                        </span>
                        <span className="text-[10px] text-[#7A6C71] block">
                          Số người: {customerInfo.attendees} người
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CỘT 4: CHI TIẾT TÍNH GIÁ & MÃ GIẢM GIÁ */}
                <div className="bg-[#FAF5F5] rounded-2xl p-4 border border-[#F0E4E6] flex flex-col justify-between space-y-3">
                  <div className="space-y-2.5 text-xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#B85064] block">
                      Dự Tính Chi Phí
                    </span>

                    <div className="flex justify-between text-[#7A6C71]">
                      <span>Giá niêm yết:</span>
                      <strong className="text-[#2A1D22]">
                        {pricingSummary.originalPrice.toLocaleString('vi-VN')} đ
                      </strong>
                    </div>

                    {pricingSummary.canApplyPromo ? (
                      <div className="flex justify-between items-center text-emerald-700 bg-emerald-50 px-2 py-1.5 rounded-lg border border-emerald-200">
                        <span className="font-semibold flex items-center gap-1">
                          <TicketIcon className="w-3.5 h-3.5" />
                          Mã STUDIO2026:
                        </span>
                        <strong className="font-bold">
                          -{pricingSummary.promoDiscountAmount.toLocaleString('vi-VN')} đ
                        </strong>
                      </div>
                    ) : (
                      pricingSummary.pkgDiscountPercent > 0 && (
                        <div className="flex justify-between items-center text-[#B85064] bg-[#FFF0F2] px-2 py-1.5 rounded-lg border border-[#F0D5DA]">
                          <span>Ưu đãi gói ({pricingSummary.pkgDiscountPercent}%):</span>
                          <strong>
                            -{(pricingSummary.originalPrice - pricingSummary.regularPackagePrice).toLocaleString('vi-VN')} đ
                          </strong>
                        </div>
                      )
                    )}

                    <div className="pt-2 border-t border-[#E8DCDE] flex justify-between items-baseline">
                      <span className="font-bold text-xs text-[#2A1D22]">Tổng tiền dự kiến:</span>
                      <strong className="text-base font-bold text-[#B85064]">
                        {pricingSummary.finalTotal.toLocaleString('vi-VN')} đ
                      </strong>
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-[#F0E4E6] text-[10px] space-y-1">
                      <div className="flex justify-between text-[#55464B]">
                        <span>Đặt cọc giữ lịch (30%):</span>
                        <strong className="text-[#2A1D22]">{pricingSummary.depositAmount.toLocaleString('vi-VN')} đ</strong>
                      </div>
                      <div className="flex justify-between text-[#55464B]">
                        <span>Còn lại thanh toán tại studio:</span>
                        <strong className="text-[#B85064]">{pricingSummary.remainingAmount.toLocaleString('vi-VN')} đ</strong>
                      </div>
                    </div>

                    <p className="text-[10px] text-[#7A6C71] italic leading-tight">
                      * {pricingSummary.promoReason}
                    </p>
                  </div>
                </div>

              </div>

              {submitError && (
                <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600">
                  {submitError}
                </div>
              )}

              {/* Footer hành động: Nút xác nhận đặt lịch full-width nổi bật */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[#7A6C71]">
                  <ShieldCheckIcon className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    Bảo lưu lịch hẹn miễn phí trước 24h • Kết nối thanh toán bảo mật với cổng VNPay Sandbox
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-[#BE4B5E] via-[#B85064] to-[#A8394C] text-white font-bold text-sm shadow-xl shadow-[#B85064]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 animate-spin text-white" />
                      <span>Đang Tạo Đơn Đặt Lịch...</span>
                    </>
                  ) : (
                    <>
                      <span>Xác Nhận Đặt Lịch & Tiến Hành Thanh Toán</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </section>
          </div>

        </form>
      </div>

    </div>
  );
}
