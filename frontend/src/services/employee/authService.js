import axiosEmployee, { employeeAuth } from '../../lib/axiosEmployee';

/**
 * Service xác thực dành riêng cho Nhân viên (Employee)
 */
export const employeeAuthService = {
  // Đăng nhập nhân viên
  login: async (username, password) => {
    const res = await axiosEmployee.post('/api/auth/login', { username, password });
    const token = res.accessToken || res.token;
    if (token) {
      employeeAuth.setToken(token);
      if (res.user) employeeAuth.setUser(res.user);
    }
    return res;
  },

  // Đăng xuất nhân viên
  logout: async () => {
    try {
      await axiosEmployee.post('/api/auth/logout');
    } catch {
      // Bỏ qua lỗi server nếu token đã hết hạn
    } finally {
      employeeAuth.clearAuth();
    }
  },

  // Lấy hồ sơ cá nhân và KPI nhân viên
  getProfile: () => axiosEmployee.get('/api/employees/profile'),

  // Kiểm tra trạng thái đăng nhập
  isAuthenticated: () => employeeAuth.isAuthenticated(),

  // Lấy token hiện tại
  getToken: () => employeeAuth.getToken(),

  // Lấy user data
  getUser: () => employeeAuth.getUser(),
};

export default employeeAuthService;
