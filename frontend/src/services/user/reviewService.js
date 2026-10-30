import axiosCustomer from '../../lib/axiosCustomer';

/**
 * Service xem & gửi đánh giá dành cho Khách hàng
 */
export const customerReviewService = {
  // Xem tất cả đánh giá từ khách hàng
  getAllReviews: () => axiosCustomer.get('/api/reviews'),

  // Xem đánh giá theo ID đơn đặt lịch
  getReviewByBookingId: (bookingId) => axiosCustomer.get(`/api/reviews/booking/${bookingId}`),

  // Xem chi tiết đánh giá nhân viên theo reviewId (bao gồm cả adminReply và thời gian trả lời)
  getEmployeeReviewsByReviewId: (reviewId) =>
    axiosCustomer.get(`/api/employee-reviews/review/${reviewId}`),

  // Gửi đánh giá mới (bao gồm đánh giá buổi chụp + đánh giá nhân viên)
  createReview: (data) => axiosCustomer.post('/api/reviews', data),

  // Cập nhật đánh giá của bản thân
  updateReview: (id, data) => axiosCustomer.put(`/api/reviews/${id}`, data),

  // Xóa đánh giá của bản thân
  deleteReview: (id) => axiosCustomer.delete(`/api/reviews/${id}`),

  // Gửi đánh giá trực tiếp cho nhân viên
  createEmployeeReview: (data) => axiosCustomer.post('/api/employee-reviews', data),
};

export default customerReviewService;
