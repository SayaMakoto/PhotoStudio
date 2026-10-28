<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import { useState, useEffect } from 'react';
>>>>>>> origin/main
import EmployeeSidebar from '../../components/employee/layout/EmployeeSidebar';
import EmployeeHeader from '../../components/employee/layout/EmployeeHeader';
import EmployeeKPICards from '../../components/employee/dashboard/EmployeeKPICards';
import EmployeeDashboardOverview from '../../components/employee/dashboard/EmployeeDashboardOverview';
import BookingListAndSchedule from '../../components/employee/dashboard/BookingListAndSchedule';
import EquipmentAndCostumesSection from '../../components/employee/dashboard/EquipmentAndCostumesSection';
import CustomerReviewsSection from '../../components/employee/dashboard/CustomerReviewsSection';
import EmployeeProfileSection from '../../components/employee/dashboard/EmployeeProfileSection';
import ShootDetailModal from '../../components/employee/modals/ShootDetailModal';
import BlurText from '../../components/animations/BlurText';

import employeeAuthService from '../../services/employee/authService';
import employeeBookingService from '../../services/employee/bookingService';
import employeeEquipmentService from '../../services/employee/equipmentService';
import employeeReviewService from '../../services/employee/reviewService';

const TAB_TITLES = {
  dashboard: 'Tổng Quan & KPI Tác Nghiệp',
  schedule: 'Lịch Chụp & Ca Phân Công',
  equipment: 'Thiết Bị Tác Nghiệp Studio',
  reviews: 'Đánh Giá Khách Hàng',
  profile: 'Hồ Sơ Cá Nhân & Trạng Thái',
};

const DEFAULT_PROFILE = {
  fullname: 'Nhân viên tác nghiệp',
  username: 'employee',
  role: 'Employee',
  status: 'active',
};

export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 1. Real User Profile & Employee Details
  const [profile, setProfile] = useState(() => {
    return employeeAuthService.getUser() || DEFAULT_PROFILE;
  });
  const [employeeDetails, setEmployeeDetails] = useState(null);

  // 2. Real Database Collections
  const [bookings, setBookings] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 3. Modal State
  const [selectedBookingForDetail, setSelectedBookingForDetail] = useState(null);

  // Fetch all real database data on mount
  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        // Run requests in parallel
        const [profileRes, bookingsRes, equipmentsRes, reviewsRes] = await Promise.allSettled([
          employeeAuthService.getProfile(),
          employeeBookingService.getAll(),
          employeeEquipmentService.getAll(),
          employeeReviewService.getAll(),
        ]);

        if (!isMounted) return;

        // Profile
        let userProfile = profile;
        if (profileRes.status === 'fulfilled' && profileRes.value) {
          userProfile = profileRes.value;
          setProfile(userProfile);
          employeeAuthService.setUser(userProfile);
        }

        // Employee Details (position, hireDate)
        let currentEmployee = null;
        if (userProfile?.id) {
          try {
            const empRes = await employeeAuthService.getEmployeeByUserId(userProfile.id);
            if (isMounted && empRes) {
              currentEmployee = empRes;
              setEmployeeDetails(empRes);
            }
          } catch (empErr) {
            console.warn('Chưa có bản ghi chi tiết employee cho user này:', empErr);
          }
        }

        // Bookings
        if (bookingsRes.status === 'fulfilled' && Array.isArray(bookingsRes.value)) {
          setBookings(bookingsRes.value);
        }

        // Equipments
        if (equipmentsRes.status === 'fulfilled' && Array.isArray(equipmentsRes.value)) {
          setEquipments(equipmentsRes.value);
        }

        // Reviews: Ưu tiên lấy đánh giá riêng của nhân viên từ /api/employee-reviews
        let employeeReviewsList = [];
        if (currentEmployee?.id) {
          try {
            const specificReviews = await employeeReviewService.getByEmployeeId(currentEmployee.id);
            if (Array.isArray(specificReviews) && specificReviews.length > 0) {
              employeeReviewsList = specificReviews;
            }
          } catch (revErr) {
            console.warn('Không tải được đánh giá cá nhân của nhân viên:', revErr);
          }
        }
        if (employeeReviewsList.length === 0 && reviewsRes.status === 'fulfilled' && Array.isArray(reviewsRes.value)) {
          employeeReviewsList = reviewsRes.value;
        }
        if (isMounted) {
          setReviews(employeeReviewsList);
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu từ CSDL:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleProfileUpdated = (updated) => {
    setProfile(updated);
    employeeAuthService.setUser(updated);
  };

  // Status Change Handler connected to real backend PATCH /api/bookings/{id}/status
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await employeeBookingService.updateStatus(bookingId, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
      if (selectedBookingForDetail?.id === bookingId) {
        setSelectedBookingForDetail((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      console.error('Không thể cập nhật trạng thái đơn đặt lịch:', err);
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5F5] text-[#261A1E] flex font-sans selection:bg-[#B85064]/20 selection:text-[#B85064]">
      {/* 1. Employee Sidebar */}
      <EmployeeSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        profile={profile}
      />

      {/* 2. Main Content Container */}
      <div className="flex-1 lg:pl-76 flex flex-col min-w-0">
        {/* Sleek Top Header with Duty Status & Notification Popover */}
        <EmployeeHeader
          activeTabTitle={TAB_TITLES[activeTab] || 'Cổng Tác Nghiệp'}
          onOpenMobile={() => setIsMobileOpen(true)}
          onOpenProfile={() => setActiveTab('profile')}
          profile={profile}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Title Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#261A1E] tracking-tight">
                    <BlurText
                      text="Bàn Làm Việc & Tiến Độ Tác Nghiệp"
                      delay={30}
                      animateBy="words"
                      direction="top"
                      className="inline-block"
                    />
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-[#7A6C71]">
                    Chào mừng trở lại, <strong className="text-[#B85064] font-semibold">{profile.fullname || profile.username}</strong>! Theo dõi ca chụp và quản lý tác nghiệp thực tế từ CSDL.
                  </p>
                </div>
              </div>

              {/* 4 Clean Studio KPI Cards with 100% Real DB Data */}
              <EmployeeKPICards
                onOpenTab={setActiveTab}
                bookings={bookings}
                equipments={equipments}
                reviews={reviews}
                employeeDetails={employeeDetails}
              />

              {/* Khối tổng quan công việc thực tế từ CSDL */}
              <EmployeeDashboardOverview
                profile={profile}
                onNavigateTab={setActiveTab}
                bookings={bookings}
                equipments={equipments}
                onSelectBooking={setSelectedBookingForDetail}
              />
            </div>
          )}

          {/* TAB 2: LỊCH CHỤP & CA PHÂN CÔNG */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-[#261A1E] tracking-tight">
                  Lịch Chụp & Ca Phân Công
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-[#7A6C71]">
                  Danh sách đơn đặt lịch thực tế từ bảng bookings. Bấm vào ca chụp để xem chi tiết hoặc cập nhật trạng thái trực tiếp vào CSDL.
                </p>
              </div>

              <BookingListAndSchedule
                bookings={bookings}
                onSelectBooking={setSelectedBookingForDetail}
                onStatusChange={handleStatusChange}
                showTitle={false}
              />
            </div>
          )}

          {/* TAB 3: QUẢN LÝ THIẾT BỊ */}
          {activeTab === 'equipment' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-[#261A1E] tracking-tight">
                  Thiết Bị Tác Nghiệp Studio
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-[#7A6C71]">
                  Dữ liệu thực tế từ bảng equipments. Tra cứu thông tin máy ảnh, ống kính, đèn flash và tình trạng sử dụng.
                </p>
              </div>

              <EquipmentAndCostumesSection
                equipments={equipments}
                showHeader={false}
              />
            </div>
          )}

          {/* TAB 4: ĐÁNH GIÁ TỪ KHÁCH HÀNG */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-[#261A1E] tracking-tight">
                  Đánh Giá & Phản Hồi Từ Khách Hàng
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-[#7A6C71]">
                  Dữ liệu đánh giá thực tế từ bảng reviews của khách hàng sau các buổi chụp hoàn thành.
                </p>
              </div>

              <CustomerReviewsSection reviews={reviews} />
            </div>
          )}

          {/* TAB 5: HỒ SƠ CÁ NHÂN & CÀI ĐẶT TÀI KHOẢN */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-[#261A1E] tracking-tight">
                  Hồ Sơ Nhân Viên
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-[#7A6C71]">
                  Dữ liệu tài khoản thực tế từ CSDL, cập nhật thông tin cá nhân và bảo mật tài khoản.
                </p>
              </div>

              <EmployeeProfileSection
                profile={profile}
                onProfileUpdated={handleProfileUpdated}
              />
            </div>
          )}
        </main>
      </div>

      {/* MODAL: Chi Tiết Buổi Chụp Thực Tế */}
      {selectedBookingForDetail && (
        <ShootDetailModal
          booking={selectedBookingForDetail}
          onClose={() => setSelectedBookingForDetail(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
