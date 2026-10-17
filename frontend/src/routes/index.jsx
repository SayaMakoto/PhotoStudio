import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './web';

// Pages
import HomePage from '../pages/user/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import AdminLoginPage from '../pages/auth/AdminLoginPage';
import AdminRegisterPage from '../pages/auth/AdminRegisterPage';
import EmployeeLoginPage from '../pages/auth/EmployeeLoginPage';
import EmployeeRegisterPage from '../pages/auth/EmployeeRegisterPage';
import AdminLayout from '../components/admin/layout/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminPlaceholderPage from '../pages/admin/AdminPlaceholderPage';
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Tuyến đường Khách hàng (User) */}
      <Route path={ROUTES.USER.HOME} element={<HomePage />} />

      {/* Tuyến đường Xác thực (Auth) - Khách hàng */}
      <Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.AUTH.REGISTER} element={<RegisterPage />} />

      {/* Tuyến đường Xác thực (Auth) - Nhân viên */}
      <Route path={ROUTES.AUTH.EMPLOYEE_LOGIN} element={<EmployeeLoginPage />} />
      <Route path={ROUTES.AUTH.EMPLOYEE_REGISTER} element={<Navigate to={ROUTES.AUTH.EMPLOYEE_LOGIN} replace />} />

      {/* Tuyến đường Xác thực (Auth) - Quản trị viên */}
      <Route path={ROUTES.AUTH.ADMIN_LOGIN} element={<AdminLoginPage />} />
      <Route path={ROUTES.AUTH.ADMIN_REGISTER} element={<AdminRegisterPage />} />

      {/* 2. Tuyến đường Nhân viên (Employee) */}
      <Route path={ROUTES.EMPLOYEE.DASHBOARD} element={<EmployeeDashboard />} />

      {/* 3. Tuyến đường Quản trị (Admin) */}
      <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminLayout />}>
        {/* Trang chủ thống kê Admin */}
        <Route index element={<AdminDashboard />} />

        {/* Quản lý tài khoản */}
        <Route
          path={ROUTES.ADMIN.ACCOUNTS.USERS.replace('/admin/', '')}
          element={
            <AdminPlaceholderPage
              title="Quản Lý Người Dùng (Users)"
              category="Quản lý tài khoản"
              description="Danh sách tài khoản khách hàng, lịch sử đặt lịch và quyền hạn."
            />
          }
        />
        <Route
          path={ROUTES.ADMIN.ACCOUNTS.EMPLOYEES.replace('/admin/', '')}
          element={
            <AdminPlaceholderPage
              title="Quản Lý Nhân Viên (Employees)"
              category="Quản lý tài khoản"
              description="Danh sách đội ngũ nhiếp ảnh gia, trang điểm, hậu kỳ và phân ca làm việc."
            />
          }
        />

        {/* Quản lý tài nguyên */}
        <Route
          path={ROUTES.ADMIN.RESOURCES.EQUIPMENTS.replace('/admin/', '')}
          element={
            <AdminPlaceholderPage
              title="Quản Lý Thiết Bị (Equipments)"
              category="Quản lý tài nguyên"
              description="Quản lý máy ảnh, ống kính, đèn flash, phụ kiện ánh sáng và lịch bảo trì."
            />
          }
        />
        <Route
          path={ROUTES.ADMIN.RESOURCES.BACKGROUNDS.replace('/admin/', '')}
          element={
            <AdminPlaceholderPage
              title="Quản Lý Bối Cảnh (Backgrounds)"
              category="Quản lý tài nguyên"
              description="Quản lý các concept bối cảnh chụp studio và ngoại cảnh."
            />
          }
        />
        <Route
          path={ROUTES.ADMIN.RESOURCES.ROOMS.replace('/admin/', '')}
          element={
            <AdminPlaceholderPage
              title="Quản Lý Phòng Chụp (Rooms)"
              category="Quản lý tài nguyên"
              description="Quản lý danh sách phòng chụp, tình trạng sẵn sàng và đặt phòng."
            />
          }
        />
        <Route
          path={ROUTES.ADMIN.RESOURCES.CLOTHES.replace('/admin/', '')}
          element={
            <AdminPlaceholderPage
              title="Quản Lý Trang Phục (Clothes)"
              category="Quản lý tài nguyên"
              description="Quản lý kho trang phục cưới, vest, concept chụp, tình trạng giặt sấy."
            />
          }
        />
        <Route
          path={ROUTES.ADMIN.RESOURCES.ACCESSORIES.replace('/admin/', '')}
          element={
            <AdminPlaceholderPage
              title="Quản Lý Phụ Kiện (Accessories)"
              category="Quản lý tài nguyên"
              description="Quản lý đạo cụ, trang sức, hoa cầm tay và phụ kiện chụp ảnh."
            />
          }
        />

        {/* Quản lý dịch vụ & gói chụp */}
        <Route
          path={ROUTES.ADMIN.SERVICES_PACKAGES.SERVICES.replace('/admin/', '')}
          element={
            <AdminPlaceholderPage
              title="Quản Lý Dịch Vụ (Services)"
              category="Quản lý dịch vụ & gói chụp"
              description="Các dịch vụ chụp ảnh chân dung, tiệc cưới, sự kiện, makeup và in ấn."
            />
          }
        />
        <Route
          path={ROUTES.ADMIN.SERVICES_PACKAGES.PACKAGES.replace('/admin/', '')}
          element={
            <AdminPlaceholderPage
              title="Quản Lý Gói Chụp (Packages)"
              category="Quản lý dịch vụ & gói chụp"
              description="Bảng giá và chi tiết các gói chụp Standard, Premium, VIP Studio."
            />
          }
        />

        {/* Vận hành & Thanh toán */}
        <Route
          path={ROUTES.ADMIN.BOOKINGS.replace('/admin/', '')}
          element={
            <AdminPlaceholderPage
              title="Quản Lý Đơn Đặt Lịch (Bookings)"
              category="Vận hành"
              description="Tiếp nhận, xác nhận, điều phối lịch chụp của khách hàng."
            />
          }
        />
        <Route
          path={ROUTES.ADMIN.PAYMENTS.replace('/admin/', '')}
          element={
            <AdminPlaceholderPage
              title="Quản Lý Thanh Toán (Payments)"
              category="Tài chính"
              description="Quản lý hóa đơn, đặt cọc, thanh toán chuyển khoản và đối soát doanh thu."
            />
          }
        />

        {/* Quản lý đánh giá */}
        <Route
          path={ROUTES.ADMIN.REVIEWS.REVIEWS.replace('/admin/', '')}
          element={
            <AdminPlaceholderPage
              title="Đánh Giá Buổi Chụp (Reviews)"
              category="Quản lý đánh giá"
              description="Phản hồi và đánh giá chất lượng bộ ảnh từ khách hàng."
            />
          }
        />
        <Route
          path={ROUTES.ADMIN.REVIEWS.EMPLOYEE_REVIEWS.replace('/admin/', '')}
          element={
            <AdminPlaceholderPage
              title="Đánh Giá Nhân Viên (Employee Reviews)"
              category="Quản lý đánh giá"
              description="Đánh giá thái độ phục vụ và tay nghề của từng nhân viên studio."
            />
          }
        />

        {/* Quản lý hệ thống */}
        <Route
          path={ROUTES.ADMIN.SYSTEM.BANNERS.replace('/admin/', '')}
          element={
            <AdminPlaceholderPage
              title="Quản Lý Banner (Banners)"
              category="Quản lý hệ thống"
              description="Quản lý banner quảng cáo và hình ảnh trình chiếu trang chủ."
            />
          }
        />
        <Route
          path={ROUTES.ADMIN.SYSTEM.NOTIFICATIONS.replace('/admin/', '')}
          element={
            <AdminPlaceholderPage
              title="Quản Lý Thông Báo (Notifications)"
              category="Quản lý hệ thống"
              description="Cấu hình thông báo gửi đến khách hàng và nhân sự."
            />
          }
        />
        <Route
          path={ROUTES.ADMIN.SYSTEM.IMAGES.replace('/admin/', '')}
          element={
            <AdminPlaceholderPage
              title="Quản Lý Hình Ảnh (Images)"
              category="Quản lý hệ thống"
              description="Thư viện Media lưu trữ ảnh tải lên hệ thống."
            />
          }
        />
        <Route
          path={ROUTES.ADMIN.SYSTEM.CONTENTS.replace('/admin/', '')}
          element={
            <AdminPlaceholderPage
              title="Quản Lý Nội Dung (Contents)"
              category="Quản lý hệ thống"
              description="Quản lý bài viết blog, giới thiệu studio và chính sách điều khoản."
            />
          }
        />

        {/* Quản lý liên hệ */}
        <Route
          path={ROUTES.ADMIN.CONTACTS.replace('/admin/', '')}
          element={
            <AdminPlaceholderPage
              title="Quản Lý Liên Hệ (Contacts)"
              category="Chăm sóc khách hàng"
              description="Danh sách tin nhắn liên hệ, khiếu nại và tư vấn từ form website."
            />
          }
        />
      </Route>

      {/* Điều hướng mặc định */}
      <Route path="*" element={<Navigate to={ROUTES.USER.HOME} replace />} />
    </Routes>
  );
}
