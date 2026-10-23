import { http } from './apiClient';

/**
 * Service quản lý Tài khoản Người dùng (Users)
 */
export const userService = {
  // Lấy toàn bộ danh sách người dùng
  getAll: () => http.get('/api/users'),

  // Lấy thông tin người dùng theo ID
  getById: (id) => http.get(`/api/users/${id}`),

  // Lấy người dùng theo username
  getByUsername: (username) => http.get(`/api/users/username/${username}`),

  // Lấy người dùng theo email
  getByEmail: (email) => http.get(`/api/users/email/${email}`),

  // Tạo mới người dùng (Admin)
  create: (data) => http.post('/api/users', data),

  // Cập nhật thông tin người dùng
  update: (id, data) => http.put(`/api/users/${id}`, data),

  // Cập nhật trạng thái người dùng (active, inactive, banned)
  updateStatus: (id, status) => http.patch(`/api/users/${id}/status`, { status }),

  // Xóa người dùng theo ID
  delete: (id) => http.delete(`/api/users/${id}`),

  // Tìm kiếm người dùng theo tên (fullname)
  searchByName: (keyword) => http.get(`/api/users/search?keyword=${encodeURIComponent(keyword || '')}`),

  // Lọc người dùng theo Role (Customer, Employee, Admin)
  getByRole: (role) => http.get(`/api/users/role/${role}`),

  // Lọc người dùng theo Status (active, inactive, banned)
  getByStatus: (status) => http.get(`/api/users/status/${status}`),
};

export default userService;
