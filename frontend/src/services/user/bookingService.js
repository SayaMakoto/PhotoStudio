import axiosCustomer from '../../lib/axiosCustomer';

/**
 * Service đặt lịch dành cho Khách hàng (Customer)
 */
export const customerBookingService = {
  // Lấy toàn bộ danh sách đơn đặt lịch
  getAllBookings: () => axiosCustomer.get('/api/bookings'),

  // Lấy danh sách lịch hẹn của khách hàng hiện tại
  getMyBookings: (customerId) => {
    if (customerId) {
      return axiosCustomer.get(`/api/bookings/customer/${customerId}`);
    }
    return axiosCustomer.get('/api/bookings');
  },

  // Lấy danh sách lịch hẹn của khách hàng theo customerId
  getBookingsByCustomer: (customerId) => axiosCustomer.get(`/api/bookings/customer/${customerId}`),

  // Lấy tất cả đơn đặt lịch để kiểm tra lịch trống phòng/gói
  getAllBookings: () => axiosCustomer.get('/api/bookings'),

  // Lấy lịch đặt theo phòng
  getByRoomId: (roomId) => axiosCustomer.get(`/api/bookings/room/${roomId}`),

  // Lấy lịch đặt theo ngày
  getByDate: (date) => axiosCustomer.get(`/api/bookings/date?date=${date}`),

  // Lấy chi tiết một đơn đặt lịch theo ID
  getBookingDetail: (id) => axiosCustomer.get(`/api/bookings/${id}`),

  // Lấy nhân viên phụ trách buổi chụp
  getAssignedEmployees: (bookingId) =>
    axiosCustomer.get(`/api/booking-employee-assignments/booking/${bookingId}`),

  // Lấy tất cả nhân viên của studio
  getAllEmployees: () => axiosCustomer.get('/api/employees'),

  // Lấy gói chụp của đơn đặt lịch
  getBookingPackages: (bookingId) =>
    axiosCustomer.get(`/api/booking-packages/booking/${bookingId}`),

  // Lấy bài đánh giá của đơn đặt lịch (nếu có)
  getBookingReview: (bookingId) =>
    axiosCustomer.get(`/api/reviews/booking/${bookingId}`),

  // Tạo mới đơn đặt lịch
  createBooking: (data) => axiosCustomer.post('/api/bookings', data),

  // Gắn gói chụp vào đơn sau khi tạo booking
  addPackage: (data) => axiosCustomer.post('/api/booking-packages', data),

  addService: (data) => axiosCustomer.post('/api/booking-services', data),
  addBackground: (data) => axiosCustomer.post('/api/booking-backgrounds', data),
  addEquipment: (data) => axiosCustomer.post('/api/booking-equipments', data),

  // Hủy đơn đặt lịch
  cancelBooking: (id, reason) => axiosCustomer.patch(`/api/bookings/${id}/cancel`, { reason }),

  // Gửi đánh giá cho buổi chụp (gồm đánh giá buổi chụp + đánh giá nhân viên)
  submitReview: (reviewData) => axiosCustomer.post('/api/reviews', reviewData),
};

export default customerBookingService;
