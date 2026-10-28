import axiosEmployee from '../../lib/axiosEmployee';

/**
 * Service quản lý đánh giá kết nối trực tiếp CSDL thật (Bảng `reviews` & `employee_reviews`)
 */
export const employeeReviewService = {
  // Lấy toàn bộ đánh giá từ CSDL
  getAll: () => axiosEmployee.get('/api/reviews'),

  // Lấy đánh giá của nhân viên theo employeeId
  getByEmployeeId: (employeeId) => axiosEmployee.get(`/api/employee-reviews/employee/${employeeId}`),

  // Lấy tóm tắt điểm số đánh giá của nhân viên theo employeeId
  getEmployeeSummary: (employeeId) => axiosEmployee.get(`/api/employee-reviews/employee/${employeeId}/summary`),

  // Phản hồi / cảm ơn đánh giá cá nhân nhân viên
  replyEmployeeReview: (id, reply) => axiosEmployee.patch(`/api/employee-reviews/${id}/reply`, { reply }),

  // Phản hồi / cảm ơn đánh giá đơn ca chụp chung
  replyReview: (id, reply) => axiosEmployee.patch(`/api/reviews/${id}/reply`, { reply }),
};

export default employeeReviewService;
