import axiosAdmin from '../../lib/axiosAdmin';

/**
 * Service quản lý Gói chụp (Admin)
 */
export const adminPackageService = {
  // Lấy toàn bộ gói chụp
  getAll: () => axiosAdmin.get('/api/packages'),

  // Lấy chi tiết gói chụp
  getById: (id) => axiosAdmin.get(`/api/packages/${id}`),

  // Tạo mới gói chụp
  create: (data) => axiosAdmin.post('/api/packages', data),

  // Cập nhật gói chụp
  update: (id, data) => axiosAdmin.put(`/api/packages/${id}`, data),

  // Xóa gói chụp
  delete: (id) => axiosAdmin.delete(`/api/packages/${id}`),
};

export default adminPackageService;
