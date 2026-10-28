import axiosEmployee, { employeeAuth } from '../../lib/axiosEmployee';

function readTokenPayload(token) {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
}

/**
 * Service xác thực dành riêng cho Nhân viên (Employee) kết nối CSDL thật
 */
export const employeeAuthService = {
  // Đăng nhập Nhân viên
  login: async (username, password) => {
    const res = await axiosEmployee.post('/api/auth/login', { username, password });
    const token = res.accessToken || res.token;
    const payload = token ? readTokenPayload(token) : null;
    const roles = Array.isArray(payload?.roles) ? payload.roles : [];

    // Chặn quyền nếu tài khoản không có quyền ROLE_EMPLOYEE
    if (!token || !roles.includes('ROLE_EMPLOYEE')) {
      employeeAuth.clearAuth();
      throw new Error('Tài khoản này không có quyền truy cập vào cổng tác nghiệp Nhân viên.');
    }

    employeeAuth.setToken(token);

    // Lấy thông tin tài khoản thật từ CSDL ngay sau khi có token
    try {
      const realProfile = await axiosEmployee.get('/api/users/profile');
      employeeAuth.setUser(realProfile || { username: payload.sub || username, role: 'Employee' });
    } catch {
      employeeAuth.setUser({
        username: payload.sub || username,
        role: 'Employee',
      });
    }

    return res;
  },

  // Đăng xuất Nhân viên
  logout: async () => {
    try {
      await axiosEmployee.post('/api/auth/logout');
    } catch {
      // Bỏ qua lỗi server nếu token đã hết hạn
    } finally {
      employeeAuth.clearAuth();
    }
  },

  // Lấy hồ sơ người dùng thật từ CSDL
  getProfile: () => axiosEmployee.get('/api/users/profile'),

  // Lấy thông tin nhân sự (vị trí, ngày vào làm) theo userId
  getEmployeeByUserId: (userId) => axiosEmployee.get(`/api/employees/user/${userId}`),

  // Cập nhật hồ sơ người dùng thật vào CSDL
  updateProfile: (userData) => axiosEmployee.put('/api/users/profile', userData),

  // Kiểm tra trạng thái đăng nhập
  isAuthenticated: () => employeeAuth.isAuthenticated(),

  // Lấy token hiện tại
  getToken: () => employeeAuth.getToken(),

  // Lấy user data hiện có trong localStorage
  getUser: () => employeeAuth.getUser(),

  // Cập nhật user data vào localStorage
  setUser: (user) => employeeAuth.setUser(user),

  // Chỉ chấp nhận token còn hạn và có quyền ROLE_EMPLOYEE
  hasEmployeeAccess: () => {
    const token = employeeAuth.getToken();
    const payload = token ? readTokenPayload(token) : null;
    const isNotExpired = Number(payload?.exp) > Date.now() / 1000;
    return isNotExpired && Array.isArray(payload?.roles) && payload.roles.includes('ROLE_EMPLOYEE');
  },
};

export default employeeAuthService;
