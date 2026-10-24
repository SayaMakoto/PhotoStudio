import axiosAdmin from '../../lib/axiosAdmin';

/**
 * Service quản lý Phụ kiện & Trang phục (Admin)
 */
export const adminAccessoryService = {
  // Lấy toàn bộ danh sách phụ kiện
  getAll: () => axiosAdmin.get('/api/accessories'),

  // Lấy chi tiết phụ kiện
  getById: (id) => axiosAdmin.get(`/api/accessories/${id}`),

  // Thêm phụ kiện mới
  create: (data) => axiosAdmin.post('/api/accessories', data),

  // Cập nhật phụ kiện
  update: (id, data) => axiosAdmin.put(`/api/accessories/${id}`, data),

  // Xóa phụ kiện
  delete: (id) => axiosAdmin.delete(`/api/accessories/${id}`),
};

export default adminAccessoryService;
