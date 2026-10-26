import axiosAdmin from '../../lib/axiosAdmin';

/**
 * Service quản lý Tài khoản Người dùng (Admin)
 */
export const adminUserService = {
  // Lấy toàn bộ người dùng
  getAll: () => axiosAdmin.get('/api/users'),

  // Lấy người dùng theo ID
  getById: (id) => axiosAdmin.get(`/api/users/${id}`),

  // Tạo tài khoản mới (Customer, Employee, Admin)
  create: (data) => axiosAdmin.post('/api/users', data),

  // Cập nhật trạng thái người dùng (active, inactive, banned)
  updateStatus: (id, status) => axiosAdmin.patch(`/api/users/${id}/status`, { status }),

  // Tìm kiếm theo tên
  searchByName: (keyword) =>
    axiosAdmin.get(`/api/users/search?keyword=${encodeURIComponent(keyword || '')}`),

  // Lọc theo Role
  getByRole: (role) => axiosAdmin.get(`/api/users/role/${role}`),

  // Lọc theo Status
  getByStatus: (status) => axiosAdmin.get(`/api/users/status/${status}`),
};

export default adminUserService;
