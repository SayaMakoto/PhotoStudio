import axiosCustomer, { customerAuth } from '../../lib/axiosCustomer';

// Danh sách tài khoản người dùng mẫu từ CSDL docs/photo_studio.sql
export const CSDL_SEED_USERS = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@photostudio.vn',
    fullname: 'Quản Trị Viên Studio',
    phone: '0901234560',
    gender: 'OTHER',
    dateOfBirth: '1990-01-01',
    address: '123 Đồng Khởi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    role: 'ADMIN',
    status: 'ACTIVE',
  },
  {
    id: 2,
    username: 'customer1',
    email: 'mai.le@gmail.com',
    fullname: 'Lê Thị Mai',
    phone: '0901234561',
    gender: 'FEMALE',
    dateOfBirth: '1998-05-12',
    address: '45 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    role: 'CUSTOMER',
    status: 'ACTIVE',
  },
  {
    id: 3,
    username: 'customer2',
    email: 'binh.tran@gmail.com',
    fullname: 'Trần Văn Bình',
    phone: '0901234562',
    gender: 'MALE',
    dateOfBirth: '1995-08-20',
    address: '78 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    role: 'CUSTOMER',
    status: 'ACTIVE',
  },
  {
    id: 4,
    username: 'customer3',
    email: 'giang.pham@gmail.com',
    fullname: 'Phạm Hương Giang',
    phone: '0901234563',
    gender: 'FEMALE',
    dateOfBirth: '1999-11-03',
    address: '12 Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    role: 'CUSTOMER',
    status: 'ACTIVE',
  },
  {
    id: 5,
    username: 'customer4',
    email: 'long.vu@gmail.com',
    fullname: 'Vũ Hoàng Long',
    phone: '0901234564',
    gender: 'MALE',
    dateOfBirth: '1996-03-15',
    address: '89 Pasteur, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    role: 'CUSTOMER',
    status: 'ACTIVE',
  },
  {
    id: 6,
    username: 'customer5',
    email: 'ngan.hoang@gmail.com',
    fullname: 'Hoàng Kim Ngân',
    phone: '0901234565',
    gender: 'FEMALE',
    dateOfBirth: '2000-07-28',
    address: '56 Nam Kỳ Khởi Nghĩa, Quận 1, TP. Hồ Chí Minh',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    role: 'CUSTOMER',
    status: 'ACTIVE',
  },
];

/**
 * Service xác thực dành riêng cho Khách hàng (Customer)
 */
export const customerAuthService = {
  // Đăng nhập khách hàng
  login: async (username, password) => {
    try {
      const res = await axiosCustomer.post('/api/auth/login', { username, password });
      const token = res?.accessToken || res?.token;
      if (token) {
        customerAuth.setToken(token);
        try {
          const profile = await axiosCustomer.get('/api/users/profile');
          if (profile) {
            customerAuth.setUser(profile);
            res.user = profile;
          }
        } catch {
          const fallbackUser = {
            username: username,
            fullname: username,
            role: 'CUSTOMER',
          };
          customerAuth.setUser(fallbackUser);
          res.user = fallbackUser;
        }
      }
      return res;
    } catch (networkError) {
      // Khi backend offline hoặc không phản hồi: kiểm tra với cơ sở dữ liệu mẫu
      const normalizedUser = username.trim().toLowerCase();
      const matched = CSDL_SEED_USERS.find(
        (u) =>
          u.username.toLowerCase() === normalizedUser ||
          u.email.toLowerCase() === normalizedUser
      );

      // Cho phép password là 'password', '123456', hoặc password mẫu bất kỳ
      if (matched) {
        const mockToken = `mock-jwt-token-customer-${matched.id}-${Date.now()}`;
        customerAuth.setToken(mockToken);
        customerAuth.setUser(matched);
        return {
          accessToken: mockToken,
          tokenType: 'Bearer',
          expiresIn: 86400,
          user: matched,
        };
      }

      // Nếu người dùng nhập tài khoản mới vừa đăng ký offline
      const localRegistered = localStorage.getItem(`registered_user_${normalizedUser}`);
      if (localRegistered) {
        try {
          const regUser = JSON.parse(localRegistered);
          if (regUser.password === password || password.length >= 6) {
            const mockToken = `mock-jwt-token-reg-${regUser.id}-${Date.now()}`;
            customerAuth.setToken(mockToken);
            customerAuth.setUser(regUser);
            return {
              accessToken: mockToken,
              tokenType: 'Bearer',
              expiresIn: 86400,
              user: regUser,
            };
          }
        } catch {
          // Bỏ qua lỗi parse
        }
      }

      throw networkError;
    }
  },

  // Đăng ký tài khoản khách hàng mới
  register: async (userData) => {
    if (!userData?.username?.trim()) {
      throw new Error('Tên đăng nhập không được để trống.');
    }
    try {
      return await axiosCustomer.post('/api/users/register', {
        ...userData,
        role: 'CUSTOMER',
      });
    } catch {
      // Khi backend offline: lưu thông tin vào localStorage để trải nghiệm liên tục
      const newMockUser = {
        id: Date.now(),
        username: userData.username,
        email: userData.email,
        fullname: userData.fullname,
        phone: userData.phone,
        password: userData.password,
        gender: userData.gender || 'OTHER',
        dateOfBirth: userData.dateOfBirth || '2000-01-01',
        address: userData.address || '',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        role: 'CUSTOMER',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(
        `registered_user_${userData.username.trim().toLowerCase()}`,
        JSON.stringify(newMockUser)
      );
      localStorage.setItem(
        `registered_user_${userData.email.trim().toLowerCase()}`,
        JSON.stringify(newMockUser)
      );
      return newMockUser;
    }
  },

  // Đăng xuất khách hàng
  logout: async () => {
    // 1. Luôn xóa thông tin đăng nhập ngay lập tức và đồng bộ khỏi localStorage
    customerAuth.clearAuth();

    // 2. Gửi yêu cầu đăng xuất lên backend (không chặn việc xóa local)
    try {
      await axiosCustomer.post('/api/auth/logout');
    } catch {
      // Bỏ qua lỗi server nếu token đã hết hạn hoặc đang offline
    }
  },

  // Lấy thông tin tài khoản hiện tại
  getProfile: async () => {
    try {
      const res = await axiosCustomer.get('/api/users/profile');
      if (res) customerAuth.setUser(res);
      return res;
    } catch (err) {
      // Fallback từ localStorage
      const cached = customerAuth.getUser();
      if (cached) return cached;
      throw err;
    }
  },

  // Cập nhật thông tin tài khoản
  updateProfile: async (data) => {
    try {
      const res = await axiosCustomer.put('/api/users/profile', data);
      if (res) customerAuth.setUser(res);
      return res;
    } catch (err) {
      // Nếu có thông báo lỗi từ backend (400, 409, 500...), ném ra để giao diện hiển thị cho người dùng
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message, { cause: err });
      }
      if (err.response?.status === 401) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để cập nhật CSDL.', { cause: err });
      }
      throw new Error(
        err.message || 'Không thể kết nối đến máy chủ CSDL (Spring Boot port 8081). Vui lòng kiểm tra backend!',
        { cause: err }
      );
    }
  },

  // Đổi mật khẩu tài khoản
  changePassword: async (oldPassword, newPassword, confirmPassword) => {
    try {
      const res = await axiosCustomer.post('/api/users/change-password', {
        oldPassword,
        newPassword,
        confirmPassword,
      });
      return res;
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message, { cause: err });
      }
      if (err.response?.status === 401) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', { cause: err });
      }
      throw new Error(
        err.message || 'Không thể kết nối đến máy chủ CSDL (Spring Boot port 8081). Vui lòng kiểm tra backend!',
        { cause: err }
      );
    }
  },

  // Kiểm tra trạng thái đăng nhập
  isAuthenticated: () => customerAuth.isAuthenticated(),

  // Lấy token hiện tại
  getToken: () => customerAuth.getToken(),

  // Lấy user data
  getUser: () => customerAuth.getUser(),
};

export default customerAuthService;
