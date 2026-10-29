import axiosAdmin from '../../lib/axiosAdmin';
import adminEmployeeService from './employeeService';

/**
 * Chức năng đọc booking và cập nhật trạng thái dành cho giao diện admin.
 */
export const adminBookingService = {
  // Lấy toàn bộ đơn đặt lịch
  getAll: () => axiosAdmin.get('/api/bookings'),

  // Lấy chi tiết đơn đặt lịch
  getById: (id) => axiosAdmin.get(`/api/bookings/${id}`),

  // Admin chỉ cập nhật trạng thái đơn, không sửa thông tin booking.
  updateStatus: async (id, status) => {
    const updated = await axiosAdmin.patch(`/api/bookings/${id}/status`, { status });
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('admin:bookings-updated'));
    return updated;
  },
  getPackages: (bookingId) => axiosAdmin.get(`/api/booking-packages/booking/${bookingId}`),
  getServices: (bookingId) => axiosAdmin.get(`/api/booking-services/booking/${bookingId}`),
  getBackgrounds: (bookingId) => axiosAdmin.get(`/api/booking-backgrounds/booking/${bookingId}`),
  getBookingEquipments: (bookingId) =>
    axiosAdmin.get(`/api/booking-equipments/booking/${bookingId}`),
  getBookingAccessories: (bookingId) =>
    axiosAdmin.get(`/api/booking-accessories/booking/${bookingId}`),
  getBookingClothes: (bookingId) => axiosAdmin.get(`/api/booking-clothing/booking/${bookingId}`),
  getEmployeeAssignments: (bookingId) => axiosAdmin.get(`/api/booking-employee-assignments/booking/${bookingId}`),
  getEmployees: () => adminEmployeeService.getAll(),
  assignEmployee: (bookingId, employeeId) => axiosAdmin.post('/api/booking-employee-assignments', { bookingId, employeeId }),
  updateAssignmentStatus: (assignmentId, status) => axiosAdmin.put(`/api/booking-employee-assignments/${assignmentId}/status`, { status }),
  getPayments: (bookingId) => axiosAdmin.get(`/api/payments/booking/${bookingId}`),
  getReview: (bookingId) => axiosAdmin.get(`/api/reviews/booking/${bookingId}`),
};

export default adminBookingService;
