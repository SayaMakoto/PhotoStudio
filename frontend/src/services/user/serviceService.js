import axiosCustomer from '../../lib/axiosCustomer';

/**
 * Service xem các dịch vụ gia tăng (Services) dành cho Khách hàng
 */
export const customerServiceService = {
  // Lấy toàn bộ dịch vụ gia tăng (Makeup, Retouch, Thuê trang phục...)
  getAllServices: () => axiosCustomer.get('/api/services'),

  // Lấy chi tiết dịch vụ
  getServiceById: (id) => axiosCustomer.get(`/api/services/${id}`),
};

export default customerServiceService;
