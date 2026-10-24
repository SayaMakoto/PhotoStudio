import axiosAdmin, { adminAuth } from '../../lib/axiosAdmin';

/**
 * Service xác thực dành riêng cho Quản trị viên (Admin)
 */
export const adminAuthService = {
  // Đăng nhập Admin
  login: async (username, password) => {
    const res = await axiosAdmin.post('/api/auth/login', { username, password });
    const token = res.accessToken || res.token;
    if (token) {
      adminAuth.setToken(token);
      if (res.user) adminAuth.setUser(res.user);
    }
    return res;
  },

  // Đăng xuất Admin
  logout: async () => {
    try {
      await axiosAdmin.post('/api/auth/logout');
    } catch {
      // Bỏ qua lỗi server nếu token đã hết hạn
    } finally {
      adminAuth.clearAuth();
    }
  },

  // Kiểm tra trạng thái đăng nhập
  isAuthenticated: () => adminAuth.isAuthenticated(),

  // Lấy token hiện tại
  getToken: () => adminAuth.getToken(),

  // Lấy user data
  getUser: () => adminAuth.getUser(),
};

export default adminAuthService;
