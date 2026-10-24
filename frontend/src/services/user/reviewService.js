import axiosCustomer from '../../lib/axiosCustomer';

/**
 * Service xem & gửi đánh giá dành cho Khách hàng
 */
export const customerReviewService = {
  // Xem tất cả đánh giá từ khách hàng
  getAllReviews: () => axiosCustomer.get('/api/reviews'),

  // Xem đánh giá theo ID đơn đặt lịch
  getReviewByBookingId: (bookingId) => axiosCustomer.get(`/api/reviews/booking/${bookingId}`),

  // Gửi đánh giá mới
  createReview: (data) => axiosCustomer.post('/api/reviews', data),
};

export default customerReviewService;
