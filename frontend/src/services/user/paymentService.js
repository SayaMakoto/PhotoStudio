import axiosCustomer from '../../lib/axiosCustomer';

const PROMO_STORAGE_KEY = 'photostudio_used_promos';

/**
 * Service thanh toán và kiểm tra mã ưu đãi
 */
export const customerPaymentService = {
  // Lấy danh sách giao dịch thanh toán
  getAllPayments: () => axiosCustomer.get('/api/payments'),

  // Lấy giao dịch theo Booking ID
  getPaymentsByBookingId: (bookingId) => axiosCustomer.get(`/api/payments/booking/${bookingId}`),

  // Tạo mới giao dịch thanh toán (tiền mặt / vnpay / thẻ)
  createPayment: (data) => axiosCustomer.post('/api/payments', data),

  // Tạo URL thanh toán VNPay qua backend nếu backend hỗ trợ
  createVNPayUrl: (data) => axiosCustomer.post('/api/payments/vnpay/create-payment', data),

  // Kiểm tra mã ưu đãi đã được người dùng sử dụng chưa
  // Mỗi người dùng chỉ được dùng mã STUDIO2026 đúng 1 lần
  checkPromoCodeUsage: (userId, promoCode) => {
    try {
      const stored = localStorage.getItem(PROMO_STORAGE_KEY);
      const usedPromos = stored ? JSON.parse(stored) : {};
      const userKey = userId ? `user_${userId}` : 'guest';
      const userUsedList = usedPromos[userKey] || [];
      return userUsedList.includes(promoCode.trim().toUpperCase());
    } catch {
      return false;
    }
  },

  // Đánh dấu mã ưu đãi đã được người dùng sử dụng
  markPromoCodeUsed: (userId, promoCode) => {
    try {
      const stored = localStorage.getItem(PROMO_STORAGE_KEY);
      const usedPromos = stored ? JSON.parse(stored) : {};
      const userKey = userId ? `user_${userId}` : 'guest';
      const userUsedList = usedPromos[userKey] || [];
      const codeUpper = promoCode.trim().toUpperCase();

      if (!userUsedList.includes(codeUpper)) {
        userUsedList.push(codeUpper);
        usedPromos[userKey] = userUsedList;
        localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(usedPromos));
      }
    } catch (e) {
      console.warn('Lỗi lưu mã ưu đãi đã dùng:', e);
    }
  },
};

export default customerPaymentService;
