import { http } from './apiClient';

/**
 * Service quản lý Thiết bị Studio (Equipments / Products)
 */
export const equipmentService = {
  // Lấy toàn bộ danh sách thiết bị
  getAll: () => http.get('/api/equipments'),

  // Lấy chi tiết thiết bị theo ID
  getById: (id) => http.get(`/api/equipments/${id}`),

  // Thêm thiết bị mới (yêu cầu quyền ADMIN)
  create: (data) => http.post('/api/equipments', data),

  // Cập nhật thông tin thiết bị (yêu cầu quyền ADMIN)
  update: (id, data) => http.put(`/api/equipments/${id}`, data),

  // Xóa thiết bị (yêu cầu quyền ADMIN)
  delete: (id) => http.delete(`/api/equipments/${id}`),

  // Tìm kiếm thiết bị theo tên
  searchByName: (name) => http.get(`/api/equipments/search?name=${encodeURIComponent(name || '')}`),

  // Lọc thiết bị theo loại (camera, lens, lighting, tripod, other)
  getByType: (type) => http.get(`/api/equipments/type?type=${encodeURIComponent(type || '')}`),
};

export default equipmentService;
