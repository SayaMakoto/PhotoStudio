import axiosCustomer from '../../lib/axiosCustomer';

/**
 * Service xem Gói chụp dành cho Khách hàng
 */
export const customerPackageService = {
  // Xem danh sách toàn bộ gói chụp đang hoạt động
  getAllPackages: () => axiosCustomer.get('/api/packages'),

  // Xem chi tiết một gói chụp
  getPackageById: (id) => axiosCustomer.get(`/api/packages/${id}`),
};

export default customerPackageService;
