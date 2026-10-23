import { http } from './apiClient';

/**
 * Service quản lý Gói Chụp (Packages)
 */
export const packageService = {
  // Lấy toàn bộ danh sách gói chụp
  getAll: () => http.get('/api/packages'),

  // Lấy chi tiết gói chụp theo ID
  getById: (id) => http.get(`/api/packages/${id}`),

  // Tạo mới gói chụp
  create: (data) => http.post('/api/packages', data),

  // Cập nhật gói chụp
  update: (id, data) => http.put(`/api/packages/${id}`, data),

  // Xóa gói chụp
  delete: (id) => http.delete(`/api/packages/${id}`),
};

export default packageService;
