import React, { useState, useEffect } from 'react';
import EmployeeSidebar, { EMPLOYEE_NAV_ITEMS } from '../../components/employee/layout/EmployeeSidebar';
import EmployeeHeader from '../../components/employee/layout/EmployeeHeader';
import EmployeeKPICards from '../../components/employee/dashboard/EmployeeKPICards';
import EmployeeDashboardOverview from '../../components/employee/dashboard/EmployeeDashboardOverview';
import BookingListAndSchedule from '../../components/employee/dashboard/BookingListAndSchedule';
import EquipmentAndCostumesSection from '../../components/employee/dashboard/EquipmentAndCostumesSection';
import CustomerReviewsSection from '../../components/employee/dashboard/CustomerReviewsSection';
import EmployeeProfileSection from '../../components/employee/dashboard/EmployeeProfileSection';
import ShootDetailModal from '../../components/employee/modals/ShootDetailModal';
import IncidentReportModal from '../../components/employee/modals/IncidentReportModal';
import ShiftSwapModal from '../../components/employee/modals/ShiftSwapModal';
import BlurText from '../../components/animations/BlurText';

import {
  BOOKING_ASSIGNMENTS,
  EMPLOYEE_PROFILE
} from '../../components/employee/employeeData';
import employeeAuthService from '../../services/employee/authService';

const TAB_TITLES = {
  dashboard: 'Tổng Quan & KPI Tác Nghiệp',
  schedule: 'Lịch Chụp & Ca Phân Công',
  equipment: 'Thiết Bị & Đạo Cụ Tác Nghiệp',
  reviews: 'Đánh Giá Khách Hàng',
  profile: 'Hồ Sơ Cá Nhân & Trạng Thái',
};

export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Real User Profile State
  const [profile, setProfile] = useState(() => {
    return employeeAuthService.getUser() || EMPLOYEE_PROFILE;
  });

  // Fetch fresh real profile from backend
  useEffect(() => {
    let isMounted = true;
    employeeAuthService
      .getProfile()
      .then((data) => {
        if (isMounted && data) {
          setProfile(data);
          employeeAuthService.setUser(data);
        }
      })
      .catch((err) => {
        console.warn('Không thể tải profile từ server:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleProfileUpdated = (updated) => {
    setProfile(updated);
    employeeAuthService.setUser(updated);
  };

  // Bookings Data State
  const [bookings, setBookings] = useState(BOOKING_ASSIGNMENTS);
  const [selectedBookingForDetail, setSelectedBookingForDetail] = useState(null);
  const [incidentModalOpen, setIncidentModalOpen] = useState(false);
  const [bookingForIncident, setBookingForIncident] = useState(null);
  const [shiftSwapOpen, setShiftSwapOpen] = useState(false);

  // Status Change Handler
  const handleStatusChange = (bookingId, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  const handleOpenIncident = (booking) => {
    setBookingForIncident(booking);
    setIncidentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex font-sans selection:bg-amber-400 selection:text-neutral-950">
      {/* 1. Employee Sidebar (Admin-styled & streamlined) */}
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
          {/* TAB 1: DASHBOARD (Chỉ hiển thị tổng quan & dữ liệu mẫu) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Title Section (Matching Admin Dashboard) */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    <BlurText
                      text="Bàn Làm Việc & Tiến Độ Tác Nghiệp"
                      delay={30}
                      animateBy="words"
                      direction="top"
                      className="inline-block"
                    />
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-neutral-400">
                    Chào mừng trở lại, <strong className="text-amber-400">{profile.fullname || profile.username}</strong>! Theo dõi chỉ tiêu ca chụp và tiến độ tác nghiệp studio.
                  </p>
                </div>
              </div>

              {/* 4 Clean Spotlight KPI Cards */}
              <EmployeeKPICards onOpenTab={setActiveTab} />

              {/* Khối tổng quan mẫu (Không kéo bảng từ các mục khác vào đây) */}
              <EmployeeDashboardOverview
                profile={profile}
                onNavigateTab={setActiveTab}
              />
            </div>
          )}

          {/* TAB 2: LỊCH CHỤP & CA TRỰC CHI TIẾT */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  Lịch Chụp & Ca Phân Công
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-neutral-400">
                  Danh sách đầy đủ các buổi chụp được giao, tra cứu phòng chụp và cập nhật trạng thái tác nghiệp.
                </p>
              </div>

              <BookingListAndSchedule
                bookings={bookings}
                onSelectBooking={setSelectedBookingForDetail}
                onOpenIncident={handleOpenIncident}
                onOpenShiftSwap={() => setShiftSwapOpen(true)}
                onStatusChange={handleStatusChange}
                showTitle={false}
              />
            </div>
          )}

          {/* TAB 3: QUẢN LÝ THIẾT BỊ & SỰ CỐ */}
          {activeTab === 'equipment' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  Thiết Bị, Đạo Cụ & Sự Cố
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-neutral-400">
                  Kiểm soát máy ảnh, lens, đèn flash đang mượn và gửi báo cáo sự cố hư hỏng khẩn cấp.
                </p>
              </div>

              <EquipmentAndCostumesSection
                onReportIncident={handleOpenIncident}
                showHeader={false}
              />
            </div>
          )}

          {/* TAB 4: ĐÁNH GIÁ TỪ KHÁCH HÀNG */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  Đánh Giá & Phản Hồi Từ Khách Hàng
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-neutral-400">
                  Nhận xét và điểm số đánh giá thực tế của khách hàng sau các buổi chụp hoàn thành.
                </p>
              </div>

              <CustomerReviewsSection />
            </div>
          )}

          {/* TAB 5: HỒ SƠ CÁ NHÂN & CÀI ĐẶT TÀI KHOẢN */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  Hồ Sơ Nhân Viên
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-neutral-400">
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

      {/* MODAL 1: Chi Tiết Buổi Chụp */}
      {selectedBookingForDetail && (
        <ShootDetailModal
          booking={selectedBookingForDetail}
          onClose={() => setSelectedBookingForDetail(null)}
          onOpenIncidentReport={handleOpenIncident}
        />
      )}

      {/* MODAL 2: Báo Cáo Sự Cố Thiết Bị */}
      {incidentModalOpen && (
        <IncidentReportModal
          booking={bookingForIncident}
          onClose={() => {
            setIncidentModalOpen(false);
            setBookingForIncident(null);
          }}
        />
      )}

      {/* MODAL 3: Đề Xuất Đổi Ca Trực / Báo Bận */}
      {shiftSwapOpen && (
        <ShiftSwapModal onClose={() => setShiftSwapOpen(false)} />
      )}
    </div>
  );
}
