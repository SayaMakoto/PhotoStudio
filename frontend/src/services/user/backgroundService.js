import axiosCustomer from '../../lib/axiosCustomer';

/**
 * Service lấy danh sách Bối cảnh chụp (Backgrounds) dành cho Khách hàng
 */
export const customerBackgroundService = {
  // Lấy toàn bộ danh sách bối cảnh studio
  getAllBackgrounds: () => axiosCustomer.get('/api/backgrounds'),

  // Lấy chi tiết một bối cảnh theo ID
  getBackgroundById: (id) => axiosCustomer.get(`/api/backgrounds/${id}`),

  // Tìm kiếm bối cảnh theo tên
  searchByName: (name) => axiosCustomer.get(`/api/backgrounds/search?name=${encodeURIComponent(name)}`),
};

export default customerBackgroundService;
