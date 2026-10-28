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
};

export default employeeReviewService;
