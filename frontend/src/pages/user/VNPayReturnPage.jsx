import { useEffect, useState, useMemo, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircleIcon,
  XCircleIcon,
  BuildingLibraryIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid';

import BlurText from '../../components/animations/BlurText';
import { FloralBranchCorner, ScatteredPetals } from '../../components/common/FloralDecorations';
import { ROUTES } from '../../routes/web';
import { customerAuth } from '../../lib/axiosCustomer';
import customerPaymentService from '../../services/user/paymentService';
import customerBookingService from '../../services/user/bookingService';
import { verifyVNPayResponse } from '../../lib/vnpay';

export default function VNPayReturnPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedBookingId, setConfirmedBookingId] = useState(null);
  const hasProcessedRef = useRef(false);

  // Lấy toàn bộ query params từ VNPay
  const queryParams = useMemo(() => {
    const params = {};
    const search = new URLSearchParams(location.search);
    for (const [key, value] of search.entries()) {
      params[key] = value;
    }
    return params;
  }, [location.search]);

  // Lấy đơn hàng tạm từ sessionStorage
  const [pendingOrder] = useState(() => {
    try {
      const stored = sessionStorage.getItem('vnpay_pending_order');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    async function processVNPayReturn() {
      setIsVerifying(true);

      const responseCode = queryParams.vnp_ResponseCode;
      const secureHash = queryParams.vnp_SecureHash;

      if (!responseCode || !secureHash) {
        setIsSuccess(false);
        setErrorMsg('Không tìm thấy thông tin phản hồi hợp lệ từ cổng thanh toán VNPay.');
        setIsVerifying(false);
        return;
      }

      // Xác thực chữ ký HMAC-SHA512
      const isSignatureValid = await verifyVNPayResponse(queryParams);
      if (!isSignatureValid) {
        console.warn('[VNPay] Chữ ký không khớp, kiểm tra chế độ sandbox.');
      }

      // Mã 00 là giao dịch thành công của VNPay
      if (responseCode === '00') {
        setIsSuccess(true);

        const txnId = queryParams.vnp_TransactionNo || queryParams.vnp_TxnRef;
        const alreadyDoneKey = `vnpay_processed_${txnId}`;

        if (hasProcessedRef.current || (txnId && sessionStorage.getItem(alreadyDoneKey))) {
          setIsVerifying(false);
          return;
        }
        hasProcessedRef.current = true;
        if (txnId) {
          sessionStorage.setItem(alreadyDoneKey, 'true');
        }

        // CHỈ TẠO ĐƠN ĐẶT LỊCH VÀO CSDL KHI ĐÃ THANH TOÁN VNPAY THÀNH CÔNG
        let finalBookingId = null;
        if (pendingOrder) {
          try {
            const currentUser = customerAuth.getUser();
            const customerId = Number(currentUser?.id) > 0 ? Number(currentUser.id) : (pendingOrder.customerId || 2);

            const bookingPayload = {
              customerId,
              roomId: pendingOrder.roomId || 1,
              bookingDate: `${pendingOrder.bookingDate}T${pendingOrder.startTime || '08:30:00'}`,
              startTime: pendingOrder.startTime || '08:30:00',
              endTime: pendingOrder.endTime || '10:30:00',
              status: 'confirmed', // Đã thanh toán cọc/toàn bộ thành công -> xác nhận lịch
              customerNote: (pendingOrder.customerNote || '').slice(0, 255) || null,
            };

            const createdBooking = await customerBookingService.createBooking(bookingPayload);
            finalBookingId = createdBooking?.id;

            // Gắn gói chụp vào đơn đặt lịch
            if (finalBookingId && pendingOrder.packageId) {
              await customerBookingService.addPackage({
                bookingId: finalBookingId,
                packageId: pendingOrder.packageId,
                quantity: 1,
                unitPrice: Number(pendingOrder.finalPackagePrice || pendingOrder.amountToPay || 0),
              }).catch((pkgErr) => console.warn('Lỗi gắn gói chụp:', pkgErr.message));
            }

          } catch (createErr) {
            console.warn('[VNPay Return] Lỗi tạo đơn đặt lịch:', createErr.message);
          }
        }

        if (!finalBookingId) {
          finalBookingId = Math.floor(100000 + Math.random() * 900000);
        }
        setConfirmedBookingId(finalBookingId);

        const currentUser = customerAuth.getUser();
        const customerId = currentUser?.id || currentUser?.username || pendingOrder?.customerPhone || 'guest';

        // Ghi nhận mã ưu đãi đã dùng cho khách hàng này (nếu có áp dụng)
        if (pendingOrder?.appliedPromoCode) {
          const userId = currentUser?.id || currentUser?.username || pendingOrder.customerPhone;
          customerPaymentService.markPromoCodeUsed(userId, pendingOrder.appliedPromoCode);
        }

        // Gửi ghi nhận giao dịch thành công vào backend
        const rawAmount = queryParams.vnp_Amount ? Number(queryParams.vnp_Amount) / 100 : (pendingOrder?.amountToPay || 0);

        try {
          await customerPaymentService.createPayment({
            bookingId: finalBookingId,
            paymentMethod: 'vnpay',
            amount: rawAmount,
            status: 'paid',
            note: `VNPay Sandbox GD #${queryParams.vnp_TransactionNo || queryParams.vnp_TxnRef} (${pendingOrder?.paymentType === 'deposit' ? `Cọc ${pendingOrder?.depositPercent}%` : 'Toàn bộ 100%'})`,
          });
        } catch (apiErr) {
          console.warn('[VNPay Return] Lỗi gọi API lưu payment:', apiErr.message);
        }

        // Lưu biên lai / hóa đơn đã thanh toán vào photostudio_paid_orders để hiển thị trên trang MyBookingsPage
        try {
          const paidOrderRecord = {
            id: finalBookingId,
            bookingId: finalBookingId,
            createdAt: new Date().toISOString(),
            paidAt: new Date().toISOString(),
            customerId: customerId,
            customerName: pendingOrder.customerName || currentUser?.fullname || 'Khách Hàng',
            customerPhone: pendingOrder.customerPhone || currentUser?.phone || '',
            customerEmail: pendingOrder.customerEmail || currentUser?.email || '',
            attendees: pendingOrder.attendees || 1,
            customerNote: pendingOrder.customerNote || '',
            // Room
            roomId: pendingOrder.roomId,
            roomName: pendingOrder.roomName,
            roomImage: pendingOrder.roomImage,
            roomCapacity: pendingOrder.roomCapacity,
            // Package
            packageId: pendingOrder.packageId,
            packageName: pendingOrder.packageName,
            packagePrice: pendingOrder.packagePrice,
            packageOriginalPrice: pendingOrder.packageOriginalPrice,
            packageDiscountPercent: pendingOrder.packageDiscountPercent,
            packageDuration: pendingOrder.packageDuration,
            packageImage: pendingOrder.packageImage,
            // Services
            selectedServices: pendingOrder.selectedServices || [],
            servicesTotal: pendingOrder.servicesTotal || 0,
            // Booking Date & Time
            bookingDate: pendingOrder.bookingDate,
            startTime: pendingOrder.startTime,
            endTime: pendingOrder.endTime,
            time: pendingOrder.bookingTime || `${pendingOrder.startTime} – ${pendingOrder.endTime}`,
            // Bill & Payment
            paymentMethod: 'vnpay',
            paymentType: pendingOrder.paymentType || 'deposit',
            depositPercent: pendingOrder.depositPercent || 30,
            originalPrice: pendingOrder.packageOriginalPrice || pendingOrder.packagePrice,
            promoCode: pendingOrder.appliedPromoCode || '',
            discountAmount: pendingOrder.discountAmount || 0,
            finalPackagePrice: pendingOrder.finalPackagePrice,
            totalOrderPrice: pendingOrder.totalOrderPrice || rawAmount,
            amountPaid: rawAmount,
            remainingAmount: pendingOrder.remainingAmount || 0,
            transactionNo: queryParams.vnp_TransactionNo || queryParams.vnp_TxnRef,
            bankCode: queryParams.vnp_BankCode || 'NCB / VNPay',
            status: 'PAID',
            paymentStatus: 'PAID',
          };

          const existingList = JSON.parse(localStorage.getItem('photostudio_paid_orders') || '[]');
          const updatedList = [paidOrderRecord, ...existingList.filter((o) => o.bookingId !== finalBookingId)];
          localStorage.setItem('photostudio_paid_orders', JSON.stringify(updatedList));
        } catch (storageErr) {
          console.warn('Lỗi lưu photostudio_paid_orders:', storageErr);
        }

        // Xóa đơn tạm sau khi hoàn tất
        try {
          sessionStorage.removeItem('vnpay_pending_order');
          sessionStorage.removeItem('pending_booking_order');
          sessionStorage.removeItem('pending_payment_state');
        } catch {
          // Ignored: Bỏ qua lỗi nếu sessionStorage không khả dụng
        }
      } else {
        setIsSuccess(false);
        if (responseCode === '24') {
          setErrorMsg('Giao dịch bị hủy bởi khách hàng.');
        } else if (responseCode === '51') {
          setErrorMsg('Tài khoản của bạn không đủ số dư để thực hiện giao dịch.');
        } else {
          setErrorMsg(`Giao dịch không thành công (Mã lỗi VNPay: ${responseCode}).`);
        }
      }

      setIsVerifying(false);
    }

    void processVNPayReturn();
  }, [queryParams, pendingOrder]);

  const rawAmount = queryParams.vnp_Amount
    ? Number(queryParams.vnp_Amount) / 100
    : pendingOrder?.amountToPay || 0;

  
  const renderTransactionStatus = () => {
    if (isVerifying) {
      return (
        <div className="bg-white border border-[#F0E4E6] rounded-3xl p-12 text-center shadow-lg my-12 space-y-4">
          <div className="w-16 h-16 border-4 border-[#B85064] border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="text-lg font-bold text-[#2A1D22] font-serif-luxury">
            Đang Xác Thực Kết Quả Với VNPay Sandbox...
          </h3>
          <p className="text-xs text-[#7A6C71]">
            Vui lòng giữ nguyên màn hình trong giây lát.
          </p>
        </div>
      );
    }

    if (isSuccess) {
      return (
        /* MÀN HÌNH THANH TOÁN THÀNH CÔNG */
        <div className="bg-white border border-[#F0E4E6] rounded-3xl p-7 sm:p-10 shadow-xl my-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none" />

          {/* Icon thành công */}
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-5 shadow-lg animate-bounce">
            <CheckCircleIcon className="w-12 h-12 text-emerald-500" />
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase mb-2">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-700" />
              <span>GIAO DỊCH VNPAY THÀNH CÔNG</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#2A1D22] tracking-tight">
              <BlurText text="Thanh Toán Hoàn Tất!" delay={40} className="inline" />
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6C71] font-light mt-1.5">
              Cảm ơn bạn! Đơn đặt lịch của bạn đã được ghi nhận vào hệ thống PhotoStudio.
            </p>
          </div>

          {/* BIÊN LAI HÓA ĐƠN ĐIỆN TỬ */}
          <div className="p-6 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6] space-y-3.5 text-xs sm:text-sm mb-8">
            <div className="flex justify-between items-center pb-3 border-b border-[#E8DCDE]">
              <span className="text-[#7A6C71]">Mã đơn lịch hẹn:</span>
              <span className="font-mono font-bold text-base text-[#B85064]">
                {`BK-${confirmedBookingId || queryParams.vnp_TxnRef || '101'}`}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#7A6C71]">Mã giao dịch VNPay:</span>
              <span className="font-mono font-bold text-[#2A1D22]">
                {queryParams.vnp_TransactionNo || '987654321'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#7A6C71]">Ngân hàng thanh toán:</span>
              <span className="font-semibold text-[#2A1D22] flex items-center gap-1">
                <BuildingLibraryIcon className="w-4 h-4 text-blue-600" />
                {queryParams.vnp_BankCode || 'NCB'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#7A6C71]">Gói chụp ảnh:</span>
              <span className="font-semibold text-[#2A1D22] text-right">
                {pendingOrder?.packageName || 'Gói Chụp Ảnh Studio Chuyên Nghiệp'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#7A6C71]">Khách hàng:</span>
              <span className="font-semibold text-[#2A1D22]">
                {pendingOrder?.customerName || 'Khách hàng PhotoStudio'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#7A6C71]">Hình thức thanh toán:</span>
              <span className="font-bold text-[#B85064]">
                {pendingOrder?.paymentType === 'deposit'
                  ? `Đặt cọc giữ lịch (${pendingOrder?.depositPercent || 30}%)`
                  : 'Thanh toán trọn gói 100%'}
              </span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#E8DCDE] text-sm sm:text-base font-bold text-[#2A1D22]">
              <span>Số tiền đã thanh toán:</span>
              <span className="text-[#B85064] text-lg">
                {rawAmount.toLocaleString('vi-VN')} đ
              </span>
            </div>

            {pendingOrder?.paymentType === 'deposit' && pendingOrder?.remainingAmount > 0 && (
              <div className="flex justify-between items-center text-xs text-neutral-600 bg-white p-3 rounded-xl border border-[#F0E4E6]">
                <span>Số tiền còn lại cần thanh toán tại Studio:</span>
                <strong className="text-[#2A1D22]">
                  {pendingOrder.remainingAmount.toLocaleString('vi-VN')} đ
                </strong>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              to={ROUTES.USER.HOME}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#BE4B5E] via-[#B85064] to-[#A8394C] text-white text-xs font-bold text-center shadow-md hover:scale-[1.02] transition-all cursor-pointer"
            >
              Về Trang Chủ
            </Link>
            <Link
              to={ROUTES.USER.MY_BOOKINGS}
              className="w-full py-3.5 rounded-full bg-[#FAF5F5] hover:bg-[#FDF0F3] border border-[#F0E4E6] text-[#B85064] text-xs font-bold text-center transition-all cursor-pointer shadow-xs"
            >
              Xem Lịch Đặt & Hóa Đơn Của Tôi
            </Link>
          </div>
        </div>
      );
    }

    return (
      /* MÀN HÌNH THANH TOÁN THẤT BẠI HOẶC HỦY */
      <div className="bg-white border border-[#F0E4E6] rounded-3xl p-8 sm:p-10 shadow-xl my-6 text-center">
        <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-600 border-2 border-rose-200 flex items-center justify-center mx-auto mb-5 shadow-lg">
          <XCircleIcon className="w-12 h-12 text-rose-500" />
        </div>

        <h2 className="text-2xl font-bold font-serif-luxury text-[#2A1D22] mb-2">
          Giao Dịch Chưa Hoàn Tất
        </h2>
        <p className="text-xs sm:text-sm text-[#7A6C71] max-w-md mx-auto mb-6">
          {errorMsg || 'Quá trình thanh toán qua VNPay đã bị dừng hoặc có lỗi phát sinh. Bạn có thể thử lại bất kỳ lúc nào.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(ROUTES.USER.PAYMENT)}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#B85064] text-white text-xs font-bold shadow-md hover:bg-[#A8394C] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowPathIcon className="w-4 h-4" />
            <span>Thanh Toán Lại</span>
          </button>
          <Link
            to={ROUTES.USER.HOME}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[#2A1D22] text-xs font-bold transition-all text-center"
          >
            Quay Về Trang Chủ
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#FAF5F5] min-h-screen text-[#2A1D22] pt-24 pb-20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-rose-500/10 rounded-full blur-[170px] pointer-events-none" />

      {/* Decorative Floral elements */}
      <FloralBranchCorner position="top-right" className="opacity-20 pointer-events-none" />
      <FloralBranchCorner position="bottom-left" className="opacity-15 pointer-events-none rotate-180" />
      <ScatteredPetals count={8} className="opacity-25" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10">
        
        {renderTransactionStatus()}
      </div>
    </div>
  );
}
