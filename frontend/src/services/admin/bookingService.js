import axiosAdmin from '../../lib/axiosAdmin';

/**
 * Service quản lý Toàn bộ Đơn đặt lịch (Admin)
 */
export const adminBookingService = {
  // Lấy toàn bộ đơn đặt lịch
  getAll: () => axiosAdmin.get('/api/bookings'),

  // Lấy chi tiết đơn đặt lịch
  getById: (id) => axiosAdmin.get(`/api/bookings/${id}`),

  // Cập nhật đơn đặt lịch
  update: (id, data) => axiosAdmin.put(`/api/bookings/${id}`, data),

  // Phân công nhân viên chụp cho đơn đặt lịch
  assignEmployee: (bookingId, employeeId) =>
    axiosAdmin.post('/api/booking-employee-assignments', {
      bookingId,
      employeeId,
    }),

  // Cập nhật trạng thái thanh toán hoặc trạng thái ca chụp
  updateStatus: (id, status) => axiosAdmin.patch(`/api/bookings/${id}/status`, { status }),

  // Xóa đơn đặt lịch
  delete: (id) => axiosAdmin.delete(`/api/bookings/${id}`),

  // Quản lý Thiết bị trong đơn đặt
  getBookingEquipments: (bookingId) =>
    axiosAdmin.get(`/api/booking-equipments/booking/${bookingId}`),
  addEquipmentToBooking: (data) => axiosAdmin.post('/api/booking-equipments', data),
  removeEquipmentFromBooking: (id) => axiosAdmin.delete(`/api/booking-equipments/${id}`),

  // Quản lý Phụ kiện/Trang phục trong đơn đặt
  getBookingAccessories: (bookingId) =>
    axiosAdmin.get(`/api/booking-accessories/booking/${bookingId}`),
  addAccessoryToBooking: (data) => axiosAdmin.post('/api/booking-accessories', data),
  removeAccessoryFromBooking: (id) => axiosAdmin.delete(`/api/booking-accessories/${id}`),
};

export default adminBookingService;
