import axiosAdmin, { adminAuth } from '../../lib/axiosAdmin';

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
 * Service xác thực dành riêng cho Quản trị viên (Admin)
 */
export const adminAuthService = {
  // Đăng nhập Admin
  login: async (username, password) => {
    const res = await axiosAdmin.post('/api/auth/login', { username, password });
    const token = res.accessToken || res.token;
    const payload = token ? readTokenPayload(token) : null;
    const roles = Array.isArray(payload?.roles) ? payload.roles : [];

    if (!token || !roles.includes('ROLE_ADMIN')) {
      adminAuth.clearAuth();
      throw new Error('Tài khoản này không có quyền truy cập trang quản trị.');
    }

    adminAuth.setToken(token);
    adminAuth.setUser({
      username: payload.sub || username,
      role: 'Admin',
    });
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

  // Chỉ chấp nhận token có quyền quản trị.
  hasAdminAccess: () => {
    const token = adminAuth.getToken();
    const payload = token ? readTokenPayload(token) : null;
    const isNotExpired = Number(payload?.exp) > Date.now() / 1000;
    return isNotExpired && Array.isArray(payload?.roles) && payload.roles.includes('ROLE_ADMIN');
  },
};

export default adminAuthService;
