import axiosCustomer from '../../lib/axiosCustomer';

/**
 * Service đặt lịch dành cho Khách hàng (Customer)
 */
export const customerBookingService = {
  // Lấy danh sách lịch hẹn của khách hàng hiện tại
  getMyBookings: () => axiosCustomer.get('/api/bookings/my-bookings'),

  // Lấy tất cả đơn đặt lịch để kiểm tra lịch trống phòng/gói
  getAllBookings: () => axiosCustomer.get('/api/bookings'),

  // Lấy lịch đặt theo phòng
  getByRoomId: (roomId) => axiosCustomer.get(`/api/bookings/room/${roomId}`),

  // Lấy lịch đặt theo ngày
  getByDate: (date) => axiosCustomer.get(`/api/bookings/date?date=${date}`),

  // Lấy chi tiết một đơn đặt lịch theo ID
  getBookingDetail: (id) => axiosCustomer.get(`/api/bookings/${id}`),

  // Tạo mới đơn đặt lịch
  createBooking: (data) => axiosCustomer.post('/api/bookings', data),

  // Gắn gói chụp vào đơn sau khi tạo booking
  addPackage: (data) => axiosCustomer.post('/api/booking-packages', data),

  addService: (data) => axiosCustomer.post('/api/booking-services', data),
  addBackground: (data) => axiosCustomer.post('/api/booking-backgrounds', data),
  addEquipment: (data) => axiosCustomer.post('/api/booking-equipments', data),

  // Hủy đơn đặt lịch
  cancelBooking: (id, reason) => axiosCustomer.patch(`/api/bookings/${id}/cancel`, { reason }),

  // Gửi đánh giá cho buổi chụp
  submitReview: (bookingId, reviewData) => axiosCustomer.post(`/api/reviews`, {
    bookingId,
    ...reviewData,
  }),
};

export default customerBookingService;
