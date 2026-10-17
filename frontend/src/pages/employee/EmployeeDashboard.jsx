import React, { useState, useMemo } from 'react';
import EmployeeSidebar from '../../components/employee/layout/EmployeeSidebar';
import EmployeeHeader from '../../components/employee/layout/EmployeeHeader';
import EmployeeKPICards from '../../components/employee/dashboard/EmployeeKPICards';
import BookingListAndSchedule from '../../components/employee/dashboard/BookingListAndSchedule';
import EquipmentAndCostumesSection from '../../components/employee/dashboard/EquipmentAndCostumesSection';
import CustomerReviewsSection from '../../components/employee/dashboard/CustomerReviewsSection';
import AdminInstructionsSection from '../../components/employee/dashboard/AdminInstructionsSection';
import EmployeeProfileSection from '../../components/employee/dashboard/EmployeeProfileSection';
import BookingChatSection from '../../components/employee/dashboard/BookingChatSection';
import ConceptPresetLibrary from '../../components/employee/dashboard/ConceptPresetLibrary';
import ShootDetailModal from '../../components/employee/modals/ShootDetailModal';
import IncidentReportModal from '../../components/employee/modals/IncidentReportModal';

import {
  BOOKING_ASSIGNMENTS,
  EMPLOYEE_KPIS,
  EMPLOYEE_PROFILE
} from '../../components/employee/employeeData';

export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Search & Filter Tool (Module B)
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  // Booking Data state
  const [bookings, setBookings] = useState(BOOKING_ASSIGNMENTS);
  const [selectedBookingForDetail, setSelectedBookingForDetail] = useState(null);
  const [selectedBookingForChat, setSelectedBookingForChat] = useState(null);
  const [incidentModalOpen, setIncidentModalOpen] = useState(false);
  const [bookingForIncident, setBookingForIncident] = useState(null);

  // Filter bookings based on search & date
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.phone.includes(searchTerm);

      if (!matchSearch) return false;

      if (dateFilter === 'today') {
        return b.date === '2026-10-10';
      }
      return true;
    });
  }, [bookings, searchTerm, dateFilter]);

  // Status Change Handler
  const handleStatusChange = (bookingId, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  const handleOpenChat = (booking) => {
    setSelectedBookingForChat(booking);
    setActiveTab('chat');
  };

  const handleOpenIncident = (booking) => {
    setBookingForIncident(booking);
    setIncidentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex font-sans selection:bg-amber-400 selection:text-neutral-950">
      {/* 1. Employee Sidebar */}
      <EmployeeSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* 2. Main Content Container */}
      <div className="flex-1 lg:pl-76 flex flex-col min-w-0">
        {/* Top Header with quick search & filter */}
        <EmployeeHeader
          onOpenMobile={() => setIsMobileOpen(true)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          unreadCount={EMPLOYEE_KPIS.unreadNotifications}
          onNotificationClick={() => setActiveTab('notifications')}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
          {/* TAB 1: DASHBOARD & KPI (Default overview) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* KPIs */}
              <EmployeeKPICards onOpenTab={setActiveTab} />

              {/* Work Schedule & Assignments */}
              <BookingListAndSchedule
                bookings={filteredBookings}
                onSelectBooking={setSelectedBookingForDetail}
                onOpenChat={handleOpenChat}
                onStatusChange={handleStatusChange}
              />

              {/* Quản lý thiết bị & phụ kiện đang giữ */}
              <EquipmentAndCostumesSection onReportIncident={handleOpenIncident} />

              {/* Đánh giá từ khách hàng */}
              <CustomerReviewsSection />
            </div>
          )}

          {/* TAB 2: SCHEDULE */}
          {activeTab === 'schedule' && (
            <BookingListAndSchedule
              bookings={filteredBookings}
              onSelectBooking={setSelectedBookingForDetail}
              onOpenChat={handleOpenChat}
              onStatusChange={handleStatusChange}
            />
          )}

          {/* TAB 3: TASKS MANAGEMENT */}
          {activeTab === 'tasks' && (
            <BookingListAndSchedule
              bookings={filteredBookings}
              onSelectBooking={setSelectedBookingForDetail}
              onOpenChat={handleOpenChat}
              onStatusChange={handleStatusChange}
            />
          )}

          {/* TAB 4: EQUIPMENT & COSTUMES */}
          {activeTab === 'equipment' && (
            <EquipmentAndCostumesSection onReportIncident={handleOpenIncident} />
          )}

          {/* TAB 5: REVIEWS */}
          {activeTab === 'reviews' && <CustomerReviewsSection />}

          {/* TAB 6: NOTIFICATIONS & ADMIN INSTRUCTIONS */}
          {activeTab === 'notifications' && <AdminInstructionsSection />}

          {/* TAB 7: PROFILE */}
          {activeTab === 'profile' && <EmployeeProfileSection />}

          {/* TAB 8: CHAT NỘI BỘ (Module B) */}
          {activeTab === 'chat' && (
            <BookingChatSection selectedBooking={selectedBookingForChat} />
          )}

          {/* TAB 9: CONCEPTS & PRESETS (Module B) */}
          {activeTab === 'presets' && <ConceptPresetLibrary />}

          {/* TAB 10: BÁO CÁO SỰ CỐ (Module B) */}
          {activeTab === 'incident' && (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Báo Cáo Sự Cố & Hư Hỏng Thiết Bị</h3>
                  <p className="text-xs text-neutral-400">Gửi thông báo khẩn cấp đến phòng kỹ thuật và ban quản lý.</p>
                </div>
                <button
                  onClick={() => setIncidentModalOpen(true)}
                  className="rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold px-4 py-2 text-xs transition-colors"
                >
                  + Tạo Báo Cáo Sự Cố Mới
                </button>
              </div>
              <EquipmentAndCostumesSection onReportIncident={handleOpenIncident} />
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
    </div>
  );
}
