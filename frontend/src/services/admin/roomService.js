import axiosAdmin from '../../lib/axiosAdmin';

/**
 * Service quản lý Phòng Studio (Admin)
 */
export const adminRoomService = {
  // Lấy danh sách phòng
  getAll: () => axiosAdmin.get('/api/rooms'),

  // Lấy chi tiết phòng
  getById: (id) => axiosAdmin.get(`/api/rooms/${id}`),

  // Tạo mới phòng studio
  create: (data) => axiosAdmin.post('/api/rooms', data),

  // Cập nhật thông tin phòng studio
  update: (id, data) => axiosAdmin.put(`/api/rooms/${id}`, data),

  // Xóa phòng studio
  delete: (id) => axiosAdmin.delete(`/api/rooms/${id}`),
};

export default adminRoomService;
