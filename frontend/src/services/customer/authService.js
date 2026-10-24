import axiosCustomer, { customerAuth } from '../../lib/axiosCustomer';

/**
 * Service xác thực dành riêng cho Khách hàng (Customer)
 */
export const customerAuthService = {
  // Đăng nhập khách hàng
  login: async (username, password) => {
    const res = await axiosCustomer.post('/api/auth/login', { username, password });
    const token = res.accessToken || res.token;
    if (token) {
      customerAuth.setToken(token);
      if (res.user) customerAuth.setUser(res.user);
    }
    return res;
  },

  // Đăng ký tài khoản khách hàng mới
  register: async (userData) => {
    return axiosCustomer.post('/api/users/register', {
      ...userData,
      role: 'CUSTOMER',
    });
  },

  // Đăng xuất khách hàng
  logout: async () => {
    try {
      await axiosCustomer.post('/api/auth/logout');
    } catch {
      // Bỏ qua lỗi server nếu token đã hết hạn
    } finally {
      customerAuth.clearAuth();
    }
  },

  // Lấy thông tin tài khoản hiện tại
  getProfile: () => axiosCustomer.get('/api/users/profile'),

  // Cập nhật thông tin tài khoản
  updateProfile: (data) => axiosCustomer.put('/api/users/profile', data),

  // Kiểm tra trạng thái đăng nhập
  isAuthenticated: () => customerAuth.isAuthenticated(),

  // Lấy token hiện tại
  getToken: () => customerAuth.getToken(),

  // Lấy user data
  getUser: () => customerAuth.getUser(),
};

export default customerAuthService;
