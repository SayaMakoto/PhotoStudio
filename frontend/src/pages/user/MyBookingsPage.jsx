import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarDaysIcon,
  ClockIcon,
  SparklesIcon,
  CheckCircleIcon,
  ReceiptPercentIcon,
  CreditCardIcon,
  UserIcon,
  PhoneIcon,
  PrinterIcon,
  ArrowPathIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/solid';
import { ROUTES } from '../../routes/web';
import { customerAuth } from '../../lib/axiosCustomer';
import customerBookingService from '../../services/user/bookingService';
import customerPaymentService from '../../services/user/paymentService';
import customerRoomService from '../../services/user/roomService';
import {
  FloralBranchCorner,
  FloralCardCorner,
} from '../../components/common/FloralDecorations';

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const isAuthenticated = customerAuth.isAuthenticated();
  const currentUser = customerAuth.getUser();

  const [loading, setLoading] = useState(true);
  const [paidBookings, setPaidBookings] = useState([]);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'deposit' | 'full'

  // Chuyển về login nếu chưa đăng nhập
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.AUTH.LOGIN, {
        replace: true,
        state: {
          from: ROUTES.USER.MY_BOOKINGS,
          message: 'Vui lòng đăng nhập để xem lại lịch đặt và hóa đơn đã thanh toán!',
        },
      });
    }
  }, [isAuthenticated, navigate]);

  // Load danh sách đơn đã thanh toán
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;

    async function loadPaidBookings() {
      try {
        let localPaidOrders = [];
        try {
          const stored = localStorage.getItem('photostudio_paid_orders');
          if (stored) {
            localPaidOrders = JSON.parse(stored);
          }
        } catch {
          // Bỏ qua lỗi đọc localStorage
        }

        const [bookingsRes, paymentsRes, roomsRes] = await Promise.allSettled([
          customerBookingService.getAllBookings(),
          customerPaymentService.getAllPayments ? customerPaymentService.getAllPayments() : Promise.resolve([]),
          customerRoomService.getAllRooms(),
        ]);

        const getList = (res) => {
          if (res.status !== 'fulfilled') return [];
          const v = res.value;
          if (Array.isArray(v)) return v;
          if (Array.isArray(v?.data)) return v.data;
          return [];
        };

        const allBookings = getList(bookingsRes);
        const allPayments = getList(paymentsRes);
        const allRooms = getList(roomsRes);

        const userId = Number(currentUser?.id) || 0;

        const paidBookingIds = new Set();
        allPayments.forEach((p) => {
          const pStatus = (p.status || '').toLowerCase();
          if (pStatus === 'paid' || pStatus === 'success' || pStatus === 'completed') {
            paidBookingIds.add(Number(p.bookingId));
          }
        });

        const matchedPaidFromApi = allBookings
          .filter((b) => {
            const bCustId = Number(b.customerId || b.customer_id);
            const matchesUser = userId > 0 && bCustId === userId;
            const bStatus = (b.status || '').toLowerCase();
            const isConfirmedOrPaid = bStatus === 'confirmed' || bStatus === 'completed' || paidBookingIds.has(Number(b.id));
            return matchesUser && isConfirmedOrPaid;
          })
          .map((b) => {
            const bPay = allPayments.find((p) => Number(p.bookingId) === Number(b.id)) || {};
            const bRoom = allRooms.find((r) => Number(r.id) === Number(b.roomId)) || {};

            const total = Number(bPay.amount || b.totalPrice || b.price || 0);
            const isDeposit = total < 1000000 && total > 0;
            const depPercent = isDeposit ? 30 : 100;
            const fullEst = isDeposit ? Math.round(total / 0.3) : total;
            const remaining = isDeposit ? Math.max(0, fullEst - total) : 0;

            return {
              id: b.id,
              bookingCode: `BK-${b.id}`,
              packageName: b.packageName || 'Gói Chụp Ảnh Studio Chuyên Nghiệp',
              roomName: b.roomName || bRoom.name || 'Phòng Studio',
              bookingDate: b.bookingDate || b.booking_date || '',
              bookingTime: b.bookingTime || b.booking_time || '08:30 – 10:30 (Sáng)',
              paymentType: isDeposit ? 'deposit' : 'full',
              depositPercent: depPercent,
              paidAmount: total,
              remainingAmount: remaining,
              totalAmount: fullEst,
              paymentMethod: bPay.paymentMethod || 'vnpay',
              paymentStatus: 'Đã thanh toán',
              paidAt: bPay.paymentDate || b.createdAt || new Date().toISOString(),
              selectedServices: [],
              servicesTotal: 0,
              customerName: b.customerName || currentUser?.fullname || 'Khách hàng',
              customerPhone: b.customerPhone || currentUser?.phone || '',
            };
          });

        const combined = [...matchedPaidFromApi, ...localPaidOrders];
        const uniqueBookings = [];
        const seenIds = new Set();
        for (const item of combined) {
          const key = item.id || item.bookingCode;
          if (key && !seenIds.has(key)) {
            seenIds.add(key);
            uniqueBookings.push(item);
          }
        }

        if (isMounted) {
          setPaidBookings(uniqueBookings);
        }
      } catch (err) {
        console.error('Lỗi khi tải lịch đã thanh toán:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadPaidBookings();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, currentUser?.id, currentUser?.fullname, currentUser?.phone, refreshTrigger]);

  const handleRefresh = () => {
    setLoading(true);
    setRefreshTrigger((prev) => prev + 1);
  };

  // Bộ lọc
  const filteredBookings = useMemo(() => {
    if (filterType === 'deposit') {
      return paidBookings.filter((b) => b.paymentType === 'deposit');
    }
    if (filterType === 'full') {
      return paidBookings.filter((b) => b.paymentType === 'full');
    }
    return paidBookings;
  }, [paidBookings, filterType]);

  const handlePrint = () => {
    window.print();
  };

  if (!isAuthenticated) return null;

  return (
    <div className="bg-[#FAF5F5] min-h-screen text-[#261A1E] font-sans selection:bg-[#B85064]/20 selection:text-[#B85064] relative overflow-hidden pb-24">
      {/* ========================================================================= */}
      {/* 1. HERO BANNER: Nền studio điện ảnh với breadcrumb và typography sang trọng */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[380px] lg:min-h-[420px] bg-[#141012] overflow-hidden flex items-center pt-24 pb-14 mb-10">
        {/* Background Image & Lighting Studio Effects với độ sáng rõ nét cao */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70 scale-105 pointer-events-none"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141012]/90 via-[#141012]/65 to-[#141012]/35 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-[#FAF5F5] pointer-events-none" />

        {/* Ambient spotlight glow */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[350px] bg-[#E5A8B4]/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Họa tiết cành hoa đào nghệ thuật trên nền Hero */}
        <FloralBranchCorner position="top-left" opacity="opacity-90" />
        <FloralBranchCorner position="top-right" opacity="opacity-80" />

        {/* Chữ script viết tay góc phải */}
        <div className="absolute top-28 right-8 sm:right-16 text-white/50 font-handwriting text-2xl sm:text-3xl select-none pointer-events-none transform rotate-3 hidden sm:block">
          Không gian nghệ thuật của riêng bạn ♡
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
            <div className="max-w-3xl space-y-3.5">
              {/* Breadcrumb Navigation */}
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <Link to={ROUTES.USER.HOME} className="hover:text-[#E899A8] transition-colors">
                  Trang Chủ
                </Link>
                <span>/</span>
                <span className="text-[#E899A8] font-semibold">Lịch Đã Đặt & Hóa Đơn</span>
              </div>

              <span className="inline-block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#E5A8B4]">
                HỒ SƠ LỊCH CHỤP & HÓA ĐƠN ĐÃ THANH TOÁN
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.25] font-serif-luxury">
                Lịch Đặt Chụp &
                <br />
                <span className="italic font-normal text-[#E899A8] font-serif-luxury mr-2">
                  Hóa Đơn
                </span>
                Của Bạn
              </h1>

              <p className="text-[#E2D5D9] text-xs sm:text-sm md:text-base font-light max-w-xl leading-relaxed pt-1">
                Lưu trữ toàn bộ lịch chụp đã hoàn tất thanh toán cọc hoặc thanh toán toàn bộ. Xem lại chi tiết gói, phòng, dịch vụ nâng cao và hóa đơn thanh toán.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRefresh}
                className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs font-semibold text-white hover:bg-white/20 shadow-xs transition-all"
              >
                <ArrowPathIcon className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Làm mới</span>
              </button>

              <Link
                to={ROUTES.USER.BOOKING}
                className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#BE4B5E] via-[#B85064] to-[#A8394C] text-white text-xs font-bold shadow-md shadow-[#B85064]/30 hover:scale-105 active:scale-95 transition-all"
              >
                <CalendarDaysIcon className="w-4 h-4 text-white" />
                <span>Đặt Lịch Mới</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Thanh lọc trạng thái */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-[#F0E4E6] shadow-2xs">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-[#B85064] text-white shadow-xs'
                  : 'text-[#7A6C71] hover:text-[#261A1E]'
              }`}
            >
              Tất cả ({paidBookings.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('deposit')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === 'deposit'
                  ? 'bg-[#B85064] text-white shadow-xs'
                  : 'text-[#7A6C71] hover:text-[#261A1E]'
              }`}
            >
              Đã cọc 30% ({paidBookings.filter((b) => b.paymentType === 'deposit').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('full')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === 'full'
                  ? 'bg-[#B85064] text-white shadow-xs'
                  : 'text-[#7A6C71] hover:text-[#261A1E]'
              }`}
            >
              Thanh toán 100% ({paidBookings.filter((b) => b.paymentType === 'full').length})
            </button>
          </div>

          <div className="text-xs text-[#7A6C71] italic">
            * Chỉ các đơn chụp <strong>đã thanh toán</strong> mới được hiển thị trong mục này.
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="p-16 text-center bg-white rounded-3xl border border-[#F0E4E6] shadow-sm">
            <ArrowPathIcon className="w-8 h-8 mx-auto text-[#B85064] animate-spin mb-3" />
            <p className="text-sm font-semibold text-[#261A1E]">Đang tải danh sách lịch đặt đã thanh toán...</p>
          </div>
        )}

        {/* Empty state: Nếu chưa có đơn thanh toán nào */}
        {!loading && filteredBookings.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#F0E4E6] shadow-sm max-w-xl mx-auto my-8 relative overflow-hidden">
            <FloralCardCorner position="top-right" opacity="opacity-30" />
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#FFF0F2] text-[#B85064] flex items-center justify-center">
              <DocumentTextIcon className="w-8 h-8 text-[#B85064]" />
            </div>
            <h3 className="text-xl font-bold font-serif-luxury text-[#261A1E] mb-2">
              Chưa Có Lịch Đặt Nào Đã Thanh Toán
            </h3>
            <p className="text-xs text-[#7A6C71] mb-6 leading-relaxed">
              Bạn chưa có đơn đặt lịch chụp nào hoàn tất thanh toán (hoặc các đơn hiện tại đang ở trạng thái chờ thanh toán). Hãy chọn cho mình gói chụp ưng ý và đặt lịch ngay hôm nay!
            </p>
            <Link
              to={ROUTES.USER.PACKAGES}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B85064] hover:bg-[#A8394C] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <SparklesIcon className="w-4 h-4 text-white" />
              <span>Khám Phá Gói Chụp Studio</span>
            </Link>
          </div>
        )}

        {/* Danh sách các hóa đơn / lịch đặt đã thanh toán */}
        {!loading && filteredBookings.length > 0 && (
          <div className="space-y-8">
            {filteredBookings.map((booking) => {
              const isDeposit = booking.paymentType === 'deposit';

              return (
                <div
                  key={booking.bookingId || booking.id}
                  className="bg-white rounded-3xl border border-[#F0E4E6] shadow-xl shadow-[#B85064]/5 overflow-hidden transition-all hover:border-[#B85064]/40 relative"
                >
                  <FloralCardCorner position="top-right" opacity="opacity-40" />

                  {/* Header Hóa đơn */}
                  <div className="p-5 sm:p-6 bg-gradient-to-r from-[#FFF5F6] via-white to-[#FAF5F5] border-b border-[#F0E4E6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#BE4B5E] to-[#E295A2] flex items-center justify-center text-white shadow-xs">
                        <ReceiptPercentIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#B85064] bg-[#FFF0F2] px-2.5 py-0.5 rounded-full border border-[#B85064]/20">
                            HÓA ĐƠN #BK-{booking.bookingId}
                          </span>
                          <span className="text-xs text-[#8C7D82]">
                            Ngày lập: {new Date(booking.paidAt || booking.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold font-serif-luxury text-[#261A1E] mt-0.5">
                          Buổi chụp: {booking.packageName}
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                      {isDeposit ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-300 shadow-2xs">
                          <CheckCircleIcon className="w-4 h-4 text-amber-600" />
                          <span>ĐÃ ĐẶT CỌC 30%</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs">
                          <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                          <span>ĐÃ THANH TOÁN 100%</span>
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF5F5] text-[#55464B] border border-[#F0E4E6]">
                        <CreditCardIcon className="w-3.5 h-3.5 text-[#B85064]" />
                        <span className="uppercase">{booking.paymentMethod === 'vnpay' ? 'VNPay Sandbox' : 'Tại Studio'}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handlePrint(booking.bookingId)}
                        className="cursor-pointer p-2 rounded-full border border-[#F0E4E6] text-[#7A6C71] hover:text-[#B85064] hover:bg-[#FFF0F2] transition-colors"
                        title="In biên lai / hóa đơn này"
                      >
                        <PrinterIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Thân Hóa đơn: 3 Cột chi tiết */}
                  <div className="p-6 sm:p-7 grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* CỘT 1: THÔNG TIN PHÒNG & THỜI GIAN CHỤP (4 Cột) */}
                    <div className="md:col-span-4 space-y-4 pr-0 md:pr-4 md:border-r border-[#F0E4E6]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#B85064] block">
                        KHÔNG GIAN STUDIO & THỜI GIAN
                      </span>

                      <div className="rounded-2xl overflow-hidden border border-[#F0E4E6] bg-neutral-900 h-36 relative shadow-xs">
                        <img
                          src={booking.roomImage}
                          alt={booking.roomName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-2.5 left-3 right-3 text-white">
                          <p className="font-bold text-sm leading-tight">{booking.roomName}</p>
                          <p className="text-[11px] text-white/80">Sức chứa: {booking.roomCapacity} người</p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6] space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-[#261A1E]">
                          <CalendarDaysIcon className="w-4 h-4 text-[#B85064] shrink-0" />
                          <span>
                            Ngày chụp: <strong>{booking.bookingDate}</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[#261A1E]">
                          <ClockIcon className="w-4 h-4 text-[#B85064] shrink-0" />
                          <span>
                            Khung giờ: <strong>{booking.time || `${booking.startTime} – ${booking.endTime}`}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Thông tin khách hàng */}
                      <div className="p-3 rounded-xl bg-white border border-[#F0E4E6] text-[11px] space-y-1 text-[#55464B]">
                        <div className="flex items-center gap-1.5 font-bold text-[#261A1E]">
                          <UserIcon className="w-3.5 h-3.5 text-[#B85064]" />
                          <span>{booking.customerName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <PhoneIcon className="w-3.5 h-3.5 text-[#A6979B]" />
                          <span>{booking.customerPhone}</span>
                        </div>
                        {booking.customerNote && (
                          <p className="pt-1 text-[#8C7D82] italic border-t border-[#F0E4E6]">
                            Ghi chú: {booking.customerNote}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* CỘT 2: GÓI CHỤP & DỊCH VỤ NÂNG CAO ĐÍNH KÈM (4 Cột) */}
                    <div className="md:col-span-4 space-y-4 pr-0 md:pr-4 md:border-r border-[#F0E4E6]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#B85064] block">
                        GÓI CHỤP & DỊCH VỤ NÂNG CAO ĐÃ CHỌN
                      </span>

                      {/* Gói chụp chính */}
                      <div className="p-3.5 rounded-2xl border border-[#F0E4E6] bg-white shadow-2xs flex gap-3 items-center">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-900 shrink-0">
                          <img
                            src={booking.packageImage}
                            alt={booking.packageName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <strong className="text-xs sm:text-sm font-bold text-[#261A1E] block truncate">
                            {booking.packageName}
                          </strong>
                          <span className="text-[11px] text-[#7A6C71] block">
                            Thời lượng: {booking.packageDuration}
                          </span>
                          <span className="text-xs font-bold text-[#B85064] block mt-0.5">
                            {Number(booking.packagePrice).toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                      </div>

                      {/* Danh sách dịch vụ nâng cao */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-[#261A1E] flex items-center gap-1.5">
                            <CheckCircleIcon className="w-3.5 h-3.5 text-neutral-800" />
                            <span>Dịch vụ nâng cao đi kèm:</span>
                          </span>
                          <span className="text-[11px] font-bold text-[#B85064]">
                            {booking.selectedServices?.length || 0} dịch vụ
                          </span>
                        </div>

                        {booking.selectedServices && booking.selectedServices.length > 0 ? (
                          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                            {booking.selectedServices.map((srv, idx) => (
                              <div
                                key={srv.id || idx}
                                className="p-2.5 rounded-xl bg-[#FAF5F5] border border-[#F0E4E6] flex items-center justify-between text-xs"
                              >
                                <span className="font-medium text-[#261A1E] truncate pr-2">
                                  {srv.name}
                                </span>
                                <span className="font-bold text-[#B85064] shrink-0">
                                  +{Number(srv.price || 0).toLocaleString('vi-VN')} đ
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl bg-[#FAF5F5]/60 border border-dashed border-[#F0E4E6] text-[11px] text-[#8C7D82] text-center">
                            Không chọn thêm dịch vụ nâng cao (Chỉ chụp theo gói tiêu chuẩn)
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CỘT 3: CHI TIẾT BILL & THÔNG TIN THANH TOÁN (4 Cột) */}
                    <div className="md:col-span-4 flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#B85064] block mb-3">
                          CHI TIẾT HÓA ĐƠN & THANH TOÁN
                        </span>

                        <div className="p-4 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6] space-y-2 text-xs">
                          <div className="flex justify-between text-[#55464B]">
                            <span>Giá gói niêm yết:</span>
                            <span>{Number(booking.packageOriginalPrice || booking.packagePrice).toLocaleString('vi-VN')} đ</span>
                          </div>

                          {booking.discountAmount > 0 && (
                            <div className="flex justify-between text-emerald-600 font-medium">
                              <span>Ưu đãi voucher ({booking.promoCode || 'STUDIO2026'}):</span>
                              <span>-{Number(booking.discountAmount).toLocaleString('vi-VN')} đ</span>
                            </div>
                          )}

                          {booking.servicesTotal > 0 && (
                            <div className="flex justify-between text-[#B85064] font-medium">
                              <span>Tổng tiền dịch vụ nâng cao:</span>
                              <span>+{Number(booking.servicesTotal).toLocaleString('vi-VN')} đ</span>
                            </div>
                          )}

                          <div className="pt-2 border-t border-[#E8DCDE] flex justify-between items-baseline font-bold text-[#2A1D22]">
                            <span className="text-xs">Tổng giá trị đơn:</span>
                            <span className="text-base text-[#261A1E]">
                              {Number(booking.totalOrderPrice || booking.packagePrice).toLocaleString('vi-VN')} đ
                            </span>
                          </div>

                          {/* SỐ TIỀN ĐÃ THANH TOÁN */}
                          <div className="mt-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                            <div className="flex justify-between items-baseline">
                              <span className="text-xs font-bold text-emerald-900">
                                SỐ TIỀN ĐÃ THANH TOÁN:
                              </span>
                              <strong className="text-lg font-extrabold text-emerald-700">
                                {Number(booking.amountPaid).toLocaleString('vi-VN')} đ
                              </strong>
                            </div>
                            <p className="text-[10px] text-emerald-700 mt-0.5">
                              Hình thức: {isDeposit ? `Đặt cọc ${booking.depositPercent}% qua VNPay Sandbox` : 'Thanh toán trọn gói 100%'}
                            </p>
                          </div>

                          {/* SỐ TIỀN CÒN LẠI NẾU CỌC */}
                          {isDeposit && booking.remainingAmount > 0 && (
                            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex justify-between items-center text-xs text-amber-900">
                              <span className="font-semibold">Còn lại thanh toán tại studio:</span>
                              <strong className="text-sm font-bold text-amber-800">
                                {Number(booking.remainingAmount).toLocaleString('vi-VN')} đ
                              </strong>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Chân thẻ: Thông tin đối soát giao dịch */}
                      <div className="pt-2 text-[11px] text-[#7A6C71] flex flex-col gap-1">
                        <div className="flex justify-between">
                          <span>Mã tham chiếu GD:</span>
                          <span className="font-mono text-[#261A1E] font-bold">{booking.transactionNo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cổng thanh toán:</span>
                          <span className="text-[#261A1E] font-medium">{booking.bankCode}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
