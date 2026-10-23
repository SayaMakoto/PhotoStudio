import { http } from './apiClient';

/**
 * Service quản lý Đặt lịch (Bookings) & Các chi tiết đính kèm
 */
export const bookingService = {
  // Lấy danh sách toàn bộ lượt đặt lịch
  getAll: () => http.get('/api/bookings'),

  // Lấy chi tiết đơn đặt lịch theo ID
  getById: (id) => http.get(`/api/bookings/${id}`),

  // Tạo mới đơn đặt lịch
  create: (data) => http.post('/api/bookings', data),

  // Cập nhật đơn đặt lịch
  update: (id, data) => http.put(`/api/bookings/${id}`, data),

  // Xóa đơn đặt lịch
  delete: (id) => http.delete(`/api/bookings/${id}`),

  // --- Quản lý Thiết bị đính kèm đơn đặt lịch ---
  getEquipmentsByBookingId: (bookingId) => http.get(`/api/booking-equipments/booking/${bookingId}`),
  addEquipmentToBooking: (data) => http.post('/api/booking-equipments', data),
  removeEquipmentFromBooking: (id) => http.delete(`/api/booking-equipments/${id}`),

  // --- Quản lý Phụ kiện đính kèm đơn đặt lịch ---
  getAccessoriesByBookingId: (bookingId) => http.get(`/api/booking-accessories/booking/${bookingId}`),
  addAccessoryToBooking: (data) => http.post('/api/booking-accessories', data),
  removeAccessoryFromBooking: (id) => http.delete(`/api/booking-accessories/${id}`),

  // --- Quản lý Gói dịch vụ đính kèm đơn đặt lịch ---
  getPackagesByBookingId: (bookingId) => http.get(`/api/booking-packages/booking/${bookingId}`),
  addPackageToBooking: (data) => http.post('/api/booking-packages', data),
  removePackageFromBooking: (id) => http.delete(`/api/booking-packages/${id}`),
};

export default bookingService;
