import axiosEmployee from '../../lib/axiosEmployee';

/**
 * Service quản lý ca chụp dành cho Nhân viên (Employee)
 */
export const employeeBookingService = {
  // Lấy danh sách ca chụp được phân công cho nhân viên này
  getAssignedBookings: () => axiosEmployee.get('/api/employee/bookings'),

  // Xem chi tiết một ca chụp
  getBookingDetail: (id) => axiosEmployee.get(`/api/bookings/${id}`),

  // Cập nhật trạng thái ca chụp (Đang chụp, Hoàn tất chụp, Đang chỉnh sửa...)
  updateBookingStatus: (id, status) =>
    axiosEmployee.patch(`/api/bookings/${id}/status`, { status }),

  // Tải lên ảnh / file sản phẩm cho khách
  uploadPhotos: (bookingId, formData) =>
    axiosEmployee.post(`/api/bookings/${bookingId}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default employeeBookingService;
