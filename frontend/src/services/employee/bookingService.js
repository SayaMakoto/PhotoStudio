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

  // Lấy chi tiết thiết bị tác nghiệp của ca chụp
  getEquipments: (bookingId) =>
    axiosEmployee.get(`/api/booking-equipments/booking/${bookingId}`),

  // Lấy chi tiết trang phục của ca chụp
  getClothing: (bookingId) =>
    axiosEmployee.get(`/api/booking-clothing/booking/${bookingId}`),

  // Lấy chi tiết phụ kiện của ca chụp
  getAccessories: (bookingId) =>
    axiosEmployee.get(`/api/booking-accessories/booking/${bookingId}`),

  // Lấy gói chụp của đơn
  getPackages: (bookingId) =>
    axiosEmployee.get(`/api/booking-packages/booking/${bookingId}`),

  // Lấy dịch vụ đi kèm của đơn
  getServices: (bookingId) =>
    axiosEmployee.get(`/api/booking-services/booking/${bookingId}`),

  // Lấy phân công nhân viên của ca chụp
  getAssignments: (bookingId) =>
    axiosEmployee.get(`/api/booking-employee-assignments/booking/${bookingId}`),
};

export default employeeBookingService;
