import axiosEmployee from '../../lib/axiosEmployee';

/**
 * Service quản lý ca chụp kết nối trực tiếp CSDL thật (Bảng `bookings`)
 */
export const employeeBookingService = {
  // Lấy toàn bộ danh sách đơn đặt lịch từ CSDL
  getAll: () => axiosEmployee.get('/api/bookings'),

  // Xem chi tiết một đơn đặt lịch theo ID
  getById: (id) => axiosEmployee.get(`/api/bookings/${id}`),

  // Cập nhật trạng thái ca chụp trực tiếp vào CSDL (pending, confirmed, in_progress, completed, cancelled)
  updateStatus: (id, status) =>
    axiosEmployee.patch(`/api/bookings/${id}/status`, { status }),

  // Lấy gói chụp của đơn
  getPackages: (bookingId) =>
    axiosEmployee.get(`/api/booking-packages/booking/${bookingId}`),

  // Lấy phân công nhân viên của ca chụp
  getAssignments: (bookingId) =>
    axiosEmployee.get(`/api/booking-employee-assignments/booking/${bookingId}`),
};

export default employeeBookingService;
