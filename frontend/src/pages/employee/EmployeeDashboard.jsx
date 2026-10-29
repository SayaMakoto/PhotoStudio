import React, { useState, useEffect } from 'react';
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
  schedule: 'Lịch Chụp',
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
  const [generalReviews, setGeneralReviews] = useState([]);
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

        // Reviews: Lưu danh sách đánh giá chung studio và đánh giá riêng của nhân viên
        const generalList =
          reviewsRes.status === 'fulfilled' && Array.isArray(reviewsRes.value)
            ? reviewsRes.value
            : [];
        if (isMounted) {
          setGeneralReviews(generalList);
        }

        const reviewMap = new Map(generalList.map((r) => [r.id, r]));

        let employeeReviewsList = [];
        if (currentEmployee?.id) {
          try {
            const specificReviews = await employeeReviewService.getByEmployeeId(currentEmployee.id);
            if (Array.isArray(specificReviews) && specificReviews.length > 0) {
              employeeReviewsList = specificReviews.map((sr) => {
                const parent = reviewMap.get(sr.reviewId);
                return {
                  ...sr,
                  isEmployeeReview: true,
                  customerName:
                    parent?.customerName ||
                    sr.customerName ||
                    `Khách hàng (Đơn #${sr.reviewId})`,
                  bookingId: parent?.bookingId || sr.bookingId,
                  createdAt: parent?.createdAt || sr.createdAt,
                };
              });
            }
          } catch (revErr) {
            console.warn('Không tải được đánh giá cá nhân của nhân viên:', revErr);
          }
        }
        if (employeeReviewsList.length === 0 && generalList.length > 0) {
          employeeReviewsList = generalList.map((r) => ({ ...r, isEmployeeReview: false }));
        }
        if (isMounted) {
          setReviews(employeeReviewsList);
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
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

              {/* Khối tổng quan công việc thực tế từ CSDL - Chỉ hiện Ngày/Giờ, Phòng, Tên khách, SĐT */}
              <EmployeeDashboardOverview
                profile={profile}
                onNavigateTab={setActiveTab}
                bookings={bookings}
                equipments={equipments}
                onSelectBooking={setSelectedBookingForDetail}
              />
            </div>
          )}

          {/* TAB 2: CA CHỤP TRONG TUẦN & THEO NGÀY */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-[#261A1E] tracking-tight">
                  Lịch Chụp
                </h1>
              </div>

              <BookingListAndSchedule
                bookings={bookings}
                onSelectBooking={setSelectedBookingForDetail}
                onStatusChange={handleStatusChange}
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
              </div>

              <CustomerReviewsSection
                reviews={reviews}
                generalReviews={generalReviews}
                currentEmployee={employeeDetails}
                onReviewUpdated={(updated) => {
                  setReviews((prev) =>
                    prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r))
                  );
                  setGeneralReviews((prev) =>
                    prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r))
                  );
                }}
              />
            </div>
          )}

          {/* TAB 5: HỒ SƠ CÁ NHÂN & CÀI ĐẶT TÀI KHOẢN */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-[#261A1E] tracking-tight">
                  Hồ Sơ Nhân Viên
                </h1>
              </div>

              <EmployeeProfileSection
                profile={profile}
                onProfileUpdated={handleProfileUpdated}
              />
            </div>
          )}
        </main>
      </div>

      {/* MODAL: Chi Tiết Buổi Chụp Thực Tế (Thiết bị, trang phục, phụ kiện...) */}
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
