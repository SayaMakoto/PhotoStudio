import { http } from './apiClient';

/**
 * Service quản lý Phụ kiện Chụp ảnh (Accessories / Categories)
 */
export const accessoryService = {
  // Lấy toàn bộ danh sách phụ kiện
  getAll: () => http.get('/api/accessories'),

  // Lấy chi tiết phụ kiện theo ID
  getById: (id) => http.get(`/api/accessories/${id}`),

  // Thêm mới phụ kiện (yêu cầu quyền ADMIN)
  create: (data) => http.post('/api/accessories', data),

  // Cập nhật phụ kiện (yêu cầu quyền ADMIN)
  update: (id, data) => http.put(`/api/accessories/${id}`, data),

  // Xóa phụ kiện (yêu cầu quyền ADMIN)
  delete: (id) => http.delete(`/api/accessories/${id}`),
};

export default accessoryService;
