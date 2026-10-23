import { http, tokenManager } from './apiClient';

/**
 * Service xử lý Xác thực (Đăng nhập, Đăng ký, Đăng xuất)
 */
export const authService = {
  /**
   * Đăng nhập hệ thống (nhận về JWT token)
   * @param {string} username Tên đăng nhập
   * @param {string} password Mật khẩu
   */
  login: async (username, password) => {
    const res = await http.post('/api/auth/login', { username, password });
    const token = res.accessToken || res.token;
    if (token) {
      tokenManager.setToken(token);
    }
    return res;
  },

  /**
   * Đăng ký tài khoản người dùng mới
   * @param {Object} userData Thông tin đăng ký (username, email, password, role, fullname...)
   */
  register: async (userData) => {
    return http.post('/api/users/register', userData);
  },

  /**
   * Đăng xuất hệ thống (xóa session trên server và dọn sạch token ở local)
   */
  logout: async () => {
    try {
      await http.post('/api/auth/logout');
    } catch {
      // Bỏ qua lỗi nếu token đã hết hạn trước đó
    } finally {
      tokenManager.clearAuth();
    }
  },

  /**
   * Kiểm tra xem người dùng hiện tại đã đăng nhập hay chưa
   */
  isAuthenticated: () => tokenManager.isAuthenticated(),

  /**
   * Lấy token hiện tại
   */
  getToken: () => tokenManager.getToken(),
};

export default authService;
