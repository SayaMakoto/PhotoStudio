/**
 * src/routes/web.js
 * Quản lý và khai báo tập trung toàn bộ đường link (URL Routes) cho hệ thống PhotoStudio.
 * Khi cần gọi bất kỳ link nào trong ứng dụng, hãy import ROUTES từ file này:
 * import { ROUTES } from '@/routes/web'; (hoặc from '../../routes/web')
 */

export const ROUTES = {
  // 1. Giao diện Người dùng / Khách hàng (User)
  USER: {
    HOME: '/',
    PACKAGES: '/packages',
    PACKAGE_DETAIL: '/packages/:id',
    BOOKING: '/booking',
    PRICING: '/packages',
    GALLERY: '/gallery',
    STUDIOS: '/studios',
    ABOUT: '/studios',
    REVIEWS: '/reviews',
    PAYMENT: '/payment',
    CHECKOUT: '/checkout',
    VNPAY_RETURN: '/payment/vnpay-return',
    PROFILE: '/profile',
    MY_BOOKINGS: '/my-bookings',
    CONTACT: '/contact',
  },

  // Tuyến đường Xác thực (Authentication)
  AUTH: {
    // Khách hàng (User / Customer)
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',

    // Nhân viên (Employee)
    EMPLOYEE_LOGIN: '/employee/login',
    EMPLOYEE_REGISTER: '/employee/register',

    // Quản trị viên (Admin)
    ADMIN_LOGIN: '/admin/login',
    ADMIN_REGISTER: '/admin/register',
  },

  // 2. Giao diện Nhân viên (Employee)
  EMPLOYEE: {
    DASHBOARD: '/employee',
    SCHEDULE: '/employee/schedule',
    TASKS: '/employee/tasks',
    PROFILE: '/employee/profile',
  },

  // 3. Giao diện Quản trị viên (Admin)
  ADMIN: {
    DASHBOARD: '/admin',

    // Quản lý tài khoản = [ users, employees ]
    ACCOUNTS: {
      ROOT: '/admin/accounts',
      USERS: '/admin/users',
      EMPLOYEES: '/admin/employees',
    },

    // Quản lý tài nguyên = [ equipments, backgrounds, rooms, clothes, accessories ]
    RESOURCES: {
      ROOT: '/admin/resources',
      EQUIPMENTS: '/admin/equipments',
      BACKGROUNDS: '/admin/backgrounds',
      ROOMS: '/admin/rooms',
      CLOTHES: '/admin/clothes',
      ACCESSORIES: '/admin/accessories',
    },

    // Quản lý dịch vụ & gói chụp = [ services, packages ]
    SERVICES_PACKAGES: {
      ROOT: '/admin/services-packages',
      SERVICES: '/admin/services',
      PACKAGES: '/admin/packages',
    },

    // Quản lý đơn đặt lịch & thanh toán
    BOOKINGS: '/admin/bookings',
    PAYMENTS: '/admin/payments',

    // Quản lý đánh giá = [ reviews, employee_reviews ]
    REVIEWS: {
      ROOT: '/admin/reviews-group',
      REVIEWS: '/admin/reviews',
      EMPLOYEE_REVIEWS: '/admin/employee-reviews',
    },

    // Quản lý hệ thống = [ banners, notifications, images, contents ]
    SYSTEM: {
      ROOT: '/admin/system',
      BANNERS: '/admin/banners',
      NOTIFICATIONS: '/admin/notifications',
      IMAGES: '/admin/images',
      CONTENTS: '/admin/contents',
    },

    // Quản lý liên hệ
    CONTACTS: '/admin/contacts',

    // Quản lý lương & hoa hồng
    SALARIES: '/admin/salaries',
  },
};

export default ROUTES;
