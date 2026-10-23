import { http } from './apiClient';

/**
 * Service quản lý Phòng Chụp (Rooms)
 */
export const roomService = {
  // Lấy toàn bộ danh sách phòng chụp
  getAll: () => http.get('/api/rooms'),

  // Lấy chi tiết phòng chụp theo ID
  getById: (id) => http.get(`/api/rooms/${id}`),

  // Tạo mới phòng chụp
  create: (data) => http.post('/api/rooms', data),

  // Cập nhật thông tin phòng chụp
  update: (id, data) => http.put(`/api/rooms/${id}`, data),

  // Xóa phòng chụp
  delete: (id) => http.delete(`/api/rooms/${id}`),
};

export default roomService;
