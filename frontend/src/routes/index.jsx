import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './web';

// User Layout & Pages
import UserLayout from '../layouts/UserLayout';
import HomePage from '../pages/user/HomePage';
import PackagesPage from '../pages/user/PackagesPage';
import PackageDetailPage from '../pages/user/PackageDetailPage';
import ProfilePage from '../pages/user/ProfilePage';
import GalleryPage from '../pages/user/GalleryPage';
import StudiosPage from '../pages/user/StudiosPage';
import ReviewsPage from '../pages/user/ReviewsPage';
import BookingPage from '../pages/user/BookingPage';
import PaymentPage from '../pages/user/PaymentPage';
import VNPayReturnPage from '../pages/user/VNPayReturnPage';

// Auth Pages (Đã phân loại vào từng vai trò user, admin, employee)
import LoginPage from '../pages/user/LoginPage';
import RegisterPage from '../pages/user/RegisterPage';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminRegisterPage from '../pages/admin/AdminRegisterPage';
import EmployeeLoginPage from '../pages/employee/EmployeeLoginPage';

// Admin & Employee Layouts & Pages
import AdminLayout from '../layouts/AdminLayout';
import AdminRoute from '../layouts/AdminRoute';
import EmployeeRoute from '../layouts/EmployeeRoute';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminPlaceholderPage from '../pages/admin/AdminPlaceholderPage';
import AdminUsersPage from '../pages/admin/users';
import AdminEmployeesPage from '../pages/admin/employees';
import AdminEquipmentsPage from '../pages/admin/equipments';
import AdminBackgroundsPage from '../pages/admin/backgrounds';
import AdminRoomsPage from '../pages/admin/rooms';
import AdminClothesPage from '../pages/admin/clothes';
import AdminAccessoriesPage from '../pages/admin/accessories';
import AdminServicesPage from '../pages/admin/services';
import AdminPackagesPage from '../pages/admin/packages';
import AdminBookingsPage from '../pages/admin/bookings';
import AdminPaymentsPage from '../pages/admin/payments';
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Tuyến đường Khách hàng (User) - Bọc bởi UserLayout (Header & Footer chung) */}
      <Route element={<UserLayout />}>
        <Route path={ROUTES.USER.HOME} element={<HomePage />} />
        <Route path={ROUTES.USER.PACKAGES} element={<PackagesPage />} />
        <Route path={ROUTES.USER.PACKAGE_DETAIL} element={<PackageDetailPage />} />
        <Route path={ROUTES.USER.GALLERY} element={<GalleryPage />} />
        <Route path={ROUTES.USER.STUDIOS} element={<StudiosPage />} />
        <Route path={ROUTES.USER.REVIEWS} element={<ReviewsPage />} />
        <Route path={ROUTES.USER.BOOKING} element={<BookingPage />} />
        <Route path={ROUTES.USER.PAYMENT} element={<PaymentPage />} />
        <Route path={ROUTES.USER.CHECKOUT} element={<PaymentPage />} />
        <Route path={ROUTES.USER.VNPAY_RETURN} element={<VNPayReturnPage />} />
        <Route path={ROUTES.USER.PROFILE} element={<ProfilePage />} />
      </Route>

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
      <Route element={<EmployeeRoute />}>
        <Route path={ROUTES.EMPLOYEE.DASHBOARD} element={<EmployeeDashboard />} />
      </Route>

      {/* 3. Tuyến đường Quản trị (Admin) */}
      <Route element={<AdminRoute />}>
      <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminLayout />}>
        {/* Trang chủ thống kê Admin */}
        <Route index element={<AdminDashboard />} />

        {/* Quản lý tài khoản */}
        <Route
          path={ROUTES.ADMIN.ACCOUNTS.USERS.replace('/admin/', '')}
          element={<AdminUsersPage />}
        />
        <Route
          path={ROUTES.ADMIN.ACCOUNTS.EMPLOYEES.replace('/admin/', '')}
          element={<AdminEmployeesPage />}
        />

        {/* Quản lý tài nguyên */}
        <Route
          path={ROUTES.ADMIN.RESOURCES.EQUIPMENTS.replace('/admin/', '')}
          element={<AdminEquipmentsPage />}
        />
        <Route
          path={ROUTES.ADMIN.RESOURCES.BACKGROUNDS.replace('/admin/', '')}
          element={<AdminBackgroundsPage />}
        />
        <Route
          path={ROUTES.ADMIN.RESOURCES.ROOMS.replace('/admin/', '')}
          element={<AdminRoomsPage />}
        />
        <Route
          path={ROUTES.ADMIN.RESOURCES.CLOTHES.replace('/admin/', '')}
          element={<AdminClothesPage />}
        />
        <Route
          path={ROUTES.ADMIN.RESOURCES.ACCESSORIES.replace('/admin/', '')}
          element={<AdminAccessoriesPage />}
        />

        {/* Quản lý dịch vụ & gói chụp */}
        <Route
          path={ROUTES.ADMIN.SERVICES_PACKAGES.SERVICES.replace('/admin/', '')}
          element={<AdminServicesPage />}
        />
        <Route
          path={ROUTES.ADMIN.SERVICES_PACKAGES.PACKAGES.replace('/admin/', '')}
          element={<AdminPackagesPage />}
        />

        {/* Vận hành & Thanh toán */}
        <Route
          path={ROUTES.ADMIN.BOOKINGS.replace('/admin/', '')}
          element={<AdminBookingsPage />}
        />
        <Route
          path={ROUTES.ADMIN.PAYMENTS.replace('/admin/', '')}
          element={<AdminPaymentsPage />}
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
      </Route>

      {/* Điều hướng mặc định */}
      <Route path="*" element={<Navigate to={ROUTES.USER.HOME} replace />} />
    </Routes>
  );
}
