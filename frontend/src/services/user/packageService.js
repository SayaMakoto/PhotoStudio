import axiosCustomer from '../../lib/axiosCustomer';

/**
 * Service xem Gói chụp dành cho Khách hàng
 */
export const customerPackageService = {
  // Xem danh sách toàn bộ gói chụp đang hoạt động
  getAllPackages: () => axiosCustomer.get('/api/packages'),

  // Xem chi tiết một gói chụp
  getPackageById: (id) => axiosCustomer.get(`/api/packages/${id}`),

  // Lấy dịch vụ đính kèm gói chụp từ CSDL
  getPackageServices: (packageId) => axiosCustomer.get(`/api/package-services/package/${packageId}`),

  // Lấy bối cảnh đính kèm gói chụp từ CSDL
  getPackageBackgrounds: (packageId) => axiosCustomer.get(`/api/package-backgrounds/package/${packageId}`),
};

export default customerPackageService;
