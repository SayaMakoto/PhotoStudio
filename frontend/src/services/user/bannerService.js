import axiosCustomer from '../../lib/axiosCustomer';

/**
 * Service lấy Banner & Khuyến mãi dành cho Khách hàng
 */
export const userBannerService = {
  // Lấy tất cả banners đang hoạt động
  getAllBanners: () => axiosCustomer.get('/api/banners'),

  // Lấy banner theo trạng thái
  getBannersByStatus: (status = 'active') => axiosCustomer.get(`/api/banners/status?status=${status}`),
};

export default userBannerService;
