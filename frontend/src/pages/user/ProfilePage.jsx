import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {

  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  LockClosedIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  CameraIcon,
  ShieldCheckIcon,
  SparklesIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  ClockIcon,
  ArrowRightIcon,
  ArrowRightOnRectangleIcon,
  CalendarDaysIcon,
  TrophyIcon,
  ArrowPathIcon,
  StarIcon,
} from '@heroicons/react/24/solid';
import customerBookingService from '../../services/user/bookingService';
import BookingSessionDetailModal from '../../components/user/BookingSessionDetailModal';

import { ROUTES } from '../../routes/web';
import { customerAuth } from '../../lib/axiosCustomer';
import customerAuthService from '../../services/user/authService';
import {
  FloralCardCorner,
  FloralBranchCorner,
} from '../../components/common/FloralDecorations';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
];

export default function ProfilePage() {
  // Kiểm tra đăng nhập
  const isAuth = customerAuth.isAuthenticated();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password' | 'bookings'

  // Lịch chụp của khách hàng (Đồng bộ CSDL 2 chiều với Admin / Employee)
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [selectedBookingForDetail, setSelectedBookingForDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Hàm tải danh sách đơn đặt lịch thực tế liên kết với CSDL
  const fetchRealBookings = async (targetUser) => {
    setBookingsLoading(true);
    try {
      let rawList = [];

      // 1. Lấy danh sách đơn của khách hàng này nếu có
      if (targetUser?.id) {
        try {
          const resByCust = await customerBookingService.getBookingsByCustomer(targetUser.id);
          if (Array.isArray(resByCust) && resByCust.length > 0) {
            rawList = resByCust;
          }
        } catch (e) {
          console.warn('Lấy đơn theo customerId chưa có:', e.message);
        }
      }

      // 2. Nếu khách hàng chưa có đơn hoặc tài khoản Admin/Test đang đối soát 2 bên giao diện,
      // tải toàn bộ đơn thực tế từ CSDL để kiểm tra liên kết 2 chiều
      if (!rawList.length) {
        try {
          const allRes = await customerBookingService.getAllBookings();
          if (Array.isArray(allRes) && allRes.length > 0) {
            rawList = allRes;
          }
        } catch (e) {
          console.warn('Lấy toàn bộ đơn:', e.message);
        }
      }

      if (rawList.length > 0) {
        const enriched = await Promise.all(
          rawList.map(async (item) => {
            let pkgName = item.roomName ? `Buổi chụp tại ${item.roomName}` : 'Gói Chụp Ảnh Studio VIP';
            let pkgImg =
              'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80';
            let reviewInfo = null;

            if (item.customerNote && item.customerNote.includes('Gói:')) {
              const notePart = item.customerNote.split('Gói:')[1];
              if (notePart) pkgName = notePart.trim();
            }

            try {
              const pkgs = await customerBookingService.getBookingPackages(item.id);
              if (Array.isArray(pkgs) && pkgs.length > 0 && pkgs[0].packageName) {
                pkgName = pkgs[0].packageName;
              }
            } catch { /* Bỏ qua lỗi đọc dữ liệu lưu trữ */ }

            try {
              const rev = await customerBookingService.getBookingReview(item.id);
              if (rev && rev.id) {
                reviewInfo = rev;
              }
            } catch { /* Bỏ qua lỗi đọc dữ liệu lưu trữ */ }

            const formattedDate = item.bookingDate
              ? new Date(item.bookingDate).toLocaleDateString('vi-VN')
              : 'Chưa xếp ngày';

            return {
              id: item.id,
              customerId: item.customerId,
              customerName: item.customerName,
              packageName: pkgName,
              packageImage: pkgImg,
              bookingDate: formattedDate,
              startTime: item.startTime ? String(item.startTime).slice(0, 5) : '09:00',
              endTime: item.endTime ? String(item.endTime).slice(0, 5) : '11:00',
              roomName: item.roomName || `Phòng Studio #${item.roomId}`,
              status: item.status || 'pending',
              customerNote: item.customerNote || '',
              review: reviewInfo,
            };
          })
        );
        setBookings(enriched);
      }
    } catch (err) {
      console.warn('Lỗi khi tải lịch chụp từ backend:', err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleOpenBookingDetail = (bookingItem) => {
    setSelectedBookingForDetail(bookingItem);
    setIsDetailModalOpen(true);
  };

  const handleReviewSubmitted = (newReview) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === newReview.bookingId ? { ...b, review: newReview } : b))
    );
    if (selectedBookingForDetail && selectedBookingForDetail.id === newReview.bookingId) {
      setSelectedBookingForDetail((prev) => ({ ...prev, review: newReview }));
    }
    setSuccessMessage('Đã gửi đánh giá buổi chụp và ekip nhân viên thành công! Dữ liệu đã đồng bộ sang Quản trị viên (Admin).');
  };
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Dữ liệu người dùng
  const [user, setUser] = useState(() => {
    return (
      customerAuth.getUser() || {
        id: 2,
        username: 'customer1',
        fullname: 'Lê Thị Mai',
        email: 'mai.le@gmail.com',
        phone: '0901234561',
        gender: 'FEMALE',
        dateOfBirth: '1998-05-12',
        address: '45 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
        avatar: PRESET_AVATARS[0],
        role: 'CUSTOMER',
        status: 'ACTIVE',
      }
    );
  });

  // State biểu mẫu chỉnh sửa thông tin
  const [editForm, setEditForm] = useState({
    username: '',
    fullname: '',
    email: '',
    phone: '',
    gender: 'FEMALE',
    dateOfBirth: '',
    address: '',
    avatar: '',
  });

  // State đổi mật khẩu
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Thông báo lỗi / thành công
  const [fieldErrors, setFieldErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Tải thông tin mới nhất từ backend nếu có
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (!isAuth) return;

    customerAuthService
      .getProfile()
      .then((res) => {
        if (res) {
          const normalizedGender =
            res.gender && String(res.gender).toUpperCase() === 'MALE' ? 'MALE' : 'FEMALE';
          const fullUser = { ...res, gender: normalizedGender };
          setUser(fullUser);
          setEditForm({
            username: res.username || '',
            fullname: res.fullname || '',
            email: res.email || '',
            phone: res.phone || '',
            gender: normalizedGender,
            dateOfBirth: res.dateOfBirth || '',
            address: res.address || '',
            avatar: res.avatar || PRESET_AVATARS[0],
          });
          fetchRealBookings(fullUser);
        }
      })
      .catch(() => {
        const local = customerAuth.getUser();
        if (local) {
          setUser(local);
          setEditForm({
            username: local.username || '',
            fullname: local.fullname || '',
            email: local.email || '',
            phone: local.phone || '',
            gender: local.gender || 'FEMALE',
            dateOfBirth: local.dateOfBirth || '',
            address: local.address || '',
            avatar: local.avatar || PRESET_AVATARS[0],
          });
          fetchRealBookings(local);
        } else {
          fetchRealBookings(null);
        }
      });
  }, [isAuth]);

  // Khởi tạo editForm khi bật chỉnh sửa
  const handleStartEdit = () => {
    setEditForm({
      username: user?.username || '',
      fullname: user?.fullname || '',
      email: user?.email || '',
      phone: user?.phone || '',
      gender: user?.gender || 'FEMALE',
      dateOfBirth: user?.dateOfBirth || '',
      address: user?.address || '',
      avatar: user?.avatar || PRESET_AVATARS[0],
    });
    setFieldErrors({});
    setErrorMessage('');
    setSuccessMessage('');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFieldErrors({});
    setErrorMessage('');
    setShowAvatarPicker(false);
  };

  const validateEditForm = () => {
    const errors = {};

    if (!editForm.fullname.trim()) {
      errors.fullname = 'Họ và tên không được để trống.';
    } else if (editForm.fullname.trim().length > 255) {
      errors.fullname = 'Họ và tên tối đa 255 ký tự.';
    }

    const usernameRegex = /^[a-zA-Z0-9._-]{3,50}$/;
    if (!editForm.username.trim()) {
      errors.username = 'Tên đăng nhập không được để trống.';
    } else if (!usernameRegex.test(editForm.username.trim())) {
      errors.username =
        'Tên đăng nhập chỉ chứa chữ cái, chữ số, dấu gạch dưới, gạch ngang (từ 3 đến 50 ký tự).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editForm.email.trim()) {
      errors.email = 'Email không được để trống.';
    } else if (!emailRegex.test(editForm.email.trim())) {
      errors.email = 'Địa chỉ email không hợp lệ (VD: user@photostudio.vn).';
    }

    const phoneDigits = editForm.phone.replace(/\D/g, '');
    if (!editForm.phone.trim()) {
      errors.phone = 'Số điện thoại không được để trống.';
    } else if (phoneDigits.length < 9 || phoneDigits.length > 11) {
      errors.phone = 'Số điện thoại phải chứa 10 đến 11 chữ số.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateEditForm()) {
      setErrorMessage('Vui lòng kiểm tra lại thông tin bị thiếu hoặc không hợp lệ.');
      return;
    }

    setIsLoading(true);

    try {
      const updateData = {
        username: editForm.username.trim(),
        fullname: editForm.fullname.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.replace(/\D/g, ''),
        gender: editForm.gender === 'MALE' ? 'Male' : 'Female',
        dateOfBirth: editForm.dateOfBirth || null,
        address: editForm.address.trim(),
        avatar: editForm.avatar,
      };

      const updated = await customerAuthService.updateProfile(updateData);
      const normalizedGender =
        updated.gender && String(updated.gender).toUpperCase() === 'MALE' ? 'MALE' : 'FEMALE';
      const merged = { ...user, ...updated, gender: normalizedGender };
      setUser(merged);
      customerAuth.setUser(merged);

      setSuccessMessage('Cập nhật hồ sơ cá nhân thành công!');
      setIsEditing(false);
      setShowAvatarPicker(false);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          err.message ||
          'Không thể cập nhật hồ sơ lúc này. Vui lòng thử lại.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordForm.oldPassword) {
      errors.oldPassword = 'Vui lòng nhập mật khẩu hiện tại.';
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = 'Vui lòng nhập mật khẩu mới.';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'Mật khẩu mới phải có tối thiểu 6 ký tự.';
    }
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới.';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không trùng khớp.';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validatePasswordForm()) {
      setErrorMessage('Vui lòng điền đúng và đủ các trường thay đổi mật khẩu.');
      return;
    }

    setIsLoading(true);

    try {
      await customerAuthService.changePassword(
        passwordForm.oldPassword,
        passwordForm.newPassword,
        passwordForm.confirmPassword
      );
      setSuccessMessage('Đổi mật khẩu thành công ! Hãy ghi nhớ mật khẩu mới của bạn.');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordErrors({});
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || err.message || 'Đổi mật khẩu không thành công.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // 1. Xóa toàn bộ dữ liệu đăng nhập ngay lập tức
    customerAuth.clearAuth();
    // 2. Gửi request đăng xuất cho backend (không chặn redirect)
    void customerAuthService.logout();
    // 3. Chuyển hướng trực tiếp về trang chủ với trạng thái làm mới hoàn toàn
    window.location.href = ROUTES.USER.HOME;
  };

  // Nếu người dùng chưa đăng nhập
  if (!isAuth) {
    return (
      <div className="min-h-screen bg-[#FAF5F5] pt-28 pb-16 px-4 flex items-center justify-center">
        <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#F0E4E6] p-8 text-center shadow-xl shadow-[#B85064]/5">
          <FloralCardCorner position="top-right" opacity="opacity-50" />
          <div className="w-16 h-16 rounded-2xl bg-[#FDF5F6] border border-[#F5D5DC] flex items-center justify-center mx-auto mb-4 text-[#B85064]">
            <LockClosedIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-serif-luxury text-[#261A1E] mb-2">
            Yêu Cầu Đăng Nhập
          </h2>
          <p className="text-xs text-[#7A6C71] leading-relaxed mb-6">
            Bạn cần đăng nhập tài khoản để xem và quản lý thông tin hồ sơ cá nhân cũng như lịch chụp của mình.
          </p>
          <div className="space-y-2.5">
            <Link
              to={ROUTES.AUTH.LOGIN}
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#B85064] hover:bg-[#A33D50] text-white text-xs font-semibold shadow-md shadow-[#B85064]/20 transition-all"
            >
              <span>Đăng nhập ngay</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link
              to={ROUTES.AUTH.REGISTER}
              className="inline-flex items-center justify-center w-full py-3 rounded-full border border-[#F0E4E6] text-[#4A3C41] hover:bg-[#FAF5F5] text-xs font-semibold transition-colors"
            >
              Chưa có tài khoản? Đăng ký
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF5F5] text-[#261A1E] font-sans selection:bg-[#B85064]/20 selection:text-[#B85064] relative">
      {/* ========================================================================= */}
      {/* 1. HERO BANNER: Nền studio điện ảnh với cành hoa đào và typography chuẩn đẹp */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[360px] lg:min-h-[400px] bg-[#141012] overflow-hidden flex items-center pt-24 pb-14">
        {/* Background Image & Lighting Studio Effects với độ sáng rõ nét cao */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70 scale-105 pointer-events-none"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141012]/90 via-[#141012]/60 to-[#141012]/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#141012] pointer-events-none" />

        {/* Ambient spotlight glow */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[350px] bg-[#E5A8B4]/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Họa tiết cành hoa đào nghệ thuật trên nền Hero */}
        <FloralBranchCorner position="top-left" opacity="opacity-90" />
        <FloralBranchCorner position="top-right" opacity="opacity-80" />

        {/* Chữ script viết tay góc phải */}
        <div className="absolute top-28 right-8 sm:right-16 text-white/50 font-handwriting text-2xl sm:text-3xl select-none pointer-events-none transform rotate-3 hidden sm:block">
          Không gian nghệ thuật của riêng bạn ♡
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl space-y-3.5 pt-2">
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <Link to={ROUTES.USER.HOME} className="hover:text-[#E899A8] transition-colors">
                Trang Chủ
              </Link>
              <span>/</span>
              <span className="text-[#E899A8] font-semibold">Tài Khoản Khách Hàng</span>
            </div>

            <span className="inline-block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#E5A8B4]">
              HỒ SƠ THÀNH VIÊN PHOTOSTUDIO
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.25] font-serif-luxury">
              Hồ Sơ & Tài Khoản
              <br />
              <span className="italic font-normal text-[#E899A8] font-serif-luxury mr-2">
                Của Bạn
              </span>
              tại Studio
            </h1>

            <p className="text-[#E2D5D9] text-xs sm:text-sm md:text-base font-light max-w-xl leading-relaxed pt-1">
              Quản lý thông tin cá nhân, cập nhật số điện thoại liên hệ, quản lý bảo mật và theo dõi toàn bộ lịch hẹn chụp studio của bạn.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. BODY CONTENT: CỘT BÊN TRÁI + NỘI DUNG TAB BÊN PHẢI */}
      {/* ========================================================================= */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Background Soft Blobs */}
        <div className="absolute top-1/4 left-1/12 w-[500px] h-[500px] bg-[#FCECEF]/60 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-2/3 right-1/12 w-[500px] h-[500px] bg-[#F5D5DC]/50 rounded-full blur-[140px] pointer-events-none" />

        {/* Decorative Floral Branch in page corners */}
        <FloralBranchCorner position="top-left" opacity="opacity-30" />
        <FloralBranchCorner position="bottom-right" opacity="opacity-30" />

        <div className="relative z-10">
          {/* Global Alert Banners */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-[#FFF2F4] border border-[#FCD5DC] text-[#C53030] text-xs flex items-start gap-3 animate-in fade-in duration-200 shadow-xs">
              <ExclamationCircleIcon className="w-4 h-4 text-[#E53E3E] shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
              <button
                onClick={() => setErrorMessage('')}
                className="text-[#E53E3E] hover:text-[#9B2C2C] cursor-pointer"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-[#EBF8F2] border border-[#B4E8D0] text-[#1E7E34] text-xs flex items-center gap-3 animate-in fade-in duration-200 shadow-xs">
              <CheckCircleIcon className="w-4 h-4 text-[#2EA46D] shrink-0" />
              <span className="flex-1 font-medium">{successMessage}</span>
              <button
                onClick={() => setSuccessMessage('')}
                className="text-[#2EA46D] hover:text-[#1E7E34] cursor-pointer"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          {/* Left Column: User Summary Card & Navigation */}
          <div className="lg:col-span-4 space-y-6">
            {/* Identity Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#F0E4E6] shadow-xl shadow-[#B85064]/5 relative overflow-hidden text-center">
              <FloralCardCorner position="top-right" opacity="opacity-40" />

              {/* Avatar Container */}
              <div className="relative w-24 h-24 mx-auto mb-4 group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#B85064] p-0.5 shadow-md">
                  <img
                    src={user.avatar || PRESET_AVATARS[0]}
                    alt={user.fullname || user.username}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                    className="cursor-pointer absolute bottom-0 right-0 p-2 rounded-full bg-[#B85064] text-white shadow-md hover:scale-110 transition-transform"
                    title="Đổi ảnh đại diện"
                  >
                    <CameraIcon className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Avatar Preset Picker Modal/Popout */}
              {isEditing && showAvatarPicker && (
                <div className="mb-4 p-3 rounded-2xl bg-[#FAF5F5] border border-[#E8DCDE]">
                  <p className="text-[11px] font-semibold text-[#4A3C41] mb-2">
                    Chọn ảnh đại diện phong cách studio:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_AVATARS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setEditForm((prev) => ({ ...prev, avatar: url }));
                          setShowAvatarPicker(false);
                        }}
                        className={`cursor-pointer rounded-full overflow-hidden w-12 h-12 border-2 transition-all mx-auto ${
                          editForm.avatar === url
                            ? 'border-[#B85064] scale-105 shadow-md'
                            : 'border-transparent hover:border-[#E8DCDE]'
                        }`}
                      >
                        <img src={url} alt="preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <h3 className="text-lg font-bold font-serif-luxury text-[#261A1E]">
                {user.fullname || user.username || 'Khách Hàng Studio'}
              </h3>
              <p className="text-xs text-[#8C7D82] font-mono mt-0.5">@{user.username}</p>

              {/* Membership Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF5F6] border border-[#F5D5DC] text-[#B85064] text-xs font-semibold mt-3">
                <TrophyIcon className="w-3.5 h-3.5" />
                <span>Thành Viên Thân Thiết</span>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-2 mt-6 pt-5 border-t border-[#F8EFEF] text-left">
                <div className="p-2.5 rounded-xl bg-[#FAF5F5]">
                  <span className="text-[10px] text-[#8C7D82] block">Trạng thái</span>
                  <span className="text-xs font-bold text-[#2EA46D] flex items-center gap-1 mt-0.5">
                    <CheckCircleIcon className="w-3 h-3" />
                    Đang hoạt động
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF5F5]">
                  <span className="text-[10px] text-[#8C7D82] block">Vai trò</span>
                  <span className="text-xs font-bold text-[#261A1E] mt-0.5 block">
                    {user.role === 'ADMIN' ? 'Quản Trị Viên' : 'Khách Hàng'}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white rounded-3xl p-3 border border-[#F0E4E6] shadow-sm space-y-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('profile');
                  setIsEditing(false);
                }}
                className={`cursor-pointer w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all ${
                  activeTab === 'profile'
                    ? 'bg-[#B85064] text-white shadow-sm'
                    : 'text-[#4A3C41] hover:bg-[#FAF5F5]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <UserIcon className="w-4 h-4" />
                  <span>Thông Tin Cá Nhân</span>
                </div>
                <ArrowRightIcon className="w-3.5 h-3.5 opacity-70" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('password');
                  setIsEditing(false);
                }}
                className={`cursor-pointer w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all ${
                  activeTab === 'password'
                    ? 'bg-[#B85064] text-white shadow-sm'
                    : 'text-[#4A3C41] hover:bg-[#FAF5F5]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <KeyIcon className="w-4 h-4" />
                  <span>Đổi Mật Khẩu</span>
                </div>
                <ArrowRightIcon className="w-3.5 h-3.5 opacity-70" />
              </button>

              <Link
                to={ROUTES.USER.MY_BOOKINGS}
                className="w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold text-[#4A3C41] hover:bg-[#FAF5F5] transition-all"
                title="Xem các lịch hẹn và hóa đơn đã thanh toán"
              >
                <div className="flex items-center gap-3">
                  <CalendarDaysIcon className="w-4 h-4 text-[#8C7D82]" />
                  <span>Lịch Đã Đặt & Hóa Đơn</span>
                </div>
                <ArrowRightIcon className="w-3.5 h-3.5 opacity-70" />
              </Link>

              {/* Đường phân cách & Nút Đăng Xuất bên dưới Lịch chụp của tôi */}
              <div className="pt-2 mt-2 border-t border-[#F0E4E6]">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="cursor-pointer w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold text-[#C53030] hover:bg-[#FFF2F4] transition-all group"
                  title="Đăng xuất tài khoản"
                >
                  <div className="flex items-center gap-3">
                    <ArrowRightOnRectangleIcon className="w-4 h-4 text-[#E53E3E] group-hover:translate-x-0.5 transition-transform" />
                    <span>Đăng Xuất</span>
                  </div>
                  <ArrowRightIcon className="w-3.5 h-3.5 opacity-60 text-[#E53E3E]" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Tab Content */}
          <div className="lg:col-span-8">
            {/* TAB 1: THÔNG TIN CÁ NHÂN */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E4E6] shadow-xl shadow-[#B85064]/5 relative">
                <FloralCardCorner position="top-right" opacity="opacity-30" />

                <div className="flex items-center justify-between pb-5 mb-6 border-b border-[#F0E4E6]">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#B85064] block">
                      HỒ SƠ CÁ NHÂN
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#261A1E]">
                      {isEditing ? 'Chỉnh Sửa Thông Tin' : 'Chi Tiết Tài Khoản'}
                    </h2>
                  </div>

                  {!isEditing ? (
                    <div className="flex items-center gap-2.5">
                      <Link
                        to={ROUTES.USER.MY_BOOKINGS}
                        className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#BE4B5E] via-[#B85064] to-[#A8394C] text-white text-xs font-bold shadow-md shadow-[#B85064]/20 hover:scale-105 transition-all"
                        title="Xem toàn bộ hóa đơn và lịch đã thanh toán"
                      >
                        <CalendarDaysIcon className="w-3.5 h-3.5 text-white" />
                        <span>Lịch Đã Đặt</span>
                      </Link>

                      <button
                        type="button"
                        onClick={handleStartEdit}
                        className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#B85064] text-[#B85064] hover:bg-[#FDF5F6] text-xs font-semibold transition-all shadow-2xs"
                      >
                        <PencilSquareIcon className="w-3.5 h-3.5" />
                        <span>Chỉnh sửa</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="cursor-pointer px-3.5 py-1.5 rounded-full border border-[#E8DCDE] text-[#7A6C71] hover:bg-[#FAF5F5] text-xs font-semibold transition-colors"
                      >
                        Hủy
                      </button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  /* Form Chỉnh sửa với bố cục và thẻ thông tin đồng bộ 100% với khung xem */
                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* 1. Họ và tên */}
                      <div className="p-4 rounded-2xl bg-[#FAF5F5] border border-[#F2E8E9]">
                        <label className="text-[11px] text-[#8C7D82] font-medium flex items-center justify-between mb-1.5">
                          <span className="flex items-center gap-1.5">
                            <UserIcon className="w-3.5 h-3.5 text-[#B85064]" />
                            Họ và tên <span className="text-[#B85064]">*</span>
                          </span>
                        </label>
                        <input
                          type="text"
                          value={editForm.fullname}
                          onChange={(e) => {
                            setEditForm({ ...editForm, fullname: e.target.value });
                            if (fieldErrors.fullname)
                              setFieldErrors({ ...fieldErrors, fullname: '' });
                          }}
                          placeholder="Nhập họ và tên"
                          className={`w-full px-3 py-2 rounded-xl text-sm font-bold text-[#261A1E] bg-white border focus:outline-none transition-colors ${
                            fieldErrors.fullname
                              ? 'border-[#E53E3E] focus:border-[#E53E3E]'
                              : 'border-[#E8DCDE] focus:border-[#B85064]'
                          }`}
                        />
                        {fieldErrors.fullname && (
                          <p className="mt-1 text-[11px] text-[#E53E3E]">{fieldErrors.fullname}</p>
                        )}
                      </div>

                      {/* 2. Tên đăng nhập (Cho phép chỉnh sửa) */}
                      <div className="p-4 rounded-2xl bg-[#FAF5F5] border border-[#F2E8E9]">
                        <label className="text-[11px] text-[#8C7D82] font-medium flex items-center justify-between mb-1.5">
                          <span className="flex items-center gap-1.5">
                            <LockClosedIcon className="w-3.5 h-3.5 text-[#B85064]" />
                            Tên đăng nhập <span className="text-[#B85064]">*</span>
                          </span>
                        </label>
                        <input
                          type="text"
                          value={editForm.username}
                          onChange={(e) => {
                            setEditForm({ ...editForm, username: e.target.value });
                            if (fieldErrors.username)
                              setFieldErrors({ ...fieldErrors, username: '' });
                          }}
                          placeholder="VD: user_studio"
                          className={`w-full px-3 py-2 rounded-xl text-sm font-bold text-[#261A1E] bg-white border font-mono focus:outline-none transition-colors ${
                            fieldErrors.username
                              ? 'border-[#E53E3E] focus:border-[#E53E3E]'
                              : 'border-[#E8DCDE] focus:border-[#B85064]'
                          }`}
                        />
                        {fieldErrors.username && (
                          <p className="mt-1 text-[11px] text-[#E53E3E]">{fieldErrors.username}</p>
                        )}
                      </div>

                      {/* 3. Địa chỉ Email */}
                      <div className="p-4 rounded-2xl bg-[#FAF5F5] border border-[#F2E8E9]">
                        <label className="text-[11px] text-[#8C7D82] font-medium flex items-center justify-between mb-1.5">
                          <span className="flex items-center gap-1.5">
                            <EnvelopeIcon className="w-3.5 h-3.5 text-[#B85064]" />
                            Địa chỉ Email <span className="text-[#B85064]">*</span>
                          </span>
                        </label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => {
                            setEditForm({ ...editForm, email: e.target.value });
                            if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                          }}
                          placeholder="example@photostudio.vn"
                          className={`w-full px-3 py-2 rounded-xl text-sm font-bold text-[#261A1E] bg-white border focus:outline-none transition-colors ${
                            fieldErrors.email
                              ? 'border-[#E53E3E] focus:border-[#E53E3E]'
                              : 'border-[#E8DCDE] focus:border-[#B85064]'
                          }`}
                        />
                        {fieldErrors.email && (
                          <p className="mt-1 text-[11px] text-[#E53E3E]">{fieldErrors.email}</p>
                        )}
                      </div>

                      {/* 4. Số điện thoại */}
                      <div className="p-4 rounded-2xl bg-[#FAF5F5] border border-[#F2E8E9]">
                        <label className="text-[11px] text-[#8C7D82] font-medium flex items-center justify-between mb-1.5">
                          <span className="flex items-center gap-1.5">
                            <PhoneIcon className="w-3.5 h-3.5 text-[#B85064]" />
                            Số điện thoại <span className="text-[#B85064]">*</span>
                          </span>
                        </label>
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => {
                            setEditForm({ ...editForm, phone: e.target.value });
                            if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: '' });
                          }}
                          placeholder="VD: 0901234567"
                          className={`w-full px-3 py-2 rounded-xl text-sm font-bold text-[#261A1E] bg-white border focus:outline-none transition-colors ${
                            fieldErrors.phone
                              ? 'border-[#E53E3E] focus:border-[#E53E3E]'
                              : 'border-[#E8DCDE] focus:border-[#B85064]'
                          }`}
                        />
                        {fieldErrors.phone && (
                          <p className="mt-1 text-[11px] text-[#E53E3E]">{fieldErrors.phone}</p>
                        )}
                      </div>

                      {/* 5. Giới tính */}
                      <div className="p-4 rounded-2xl bg-[#FAF5F5] border border-[#F2E8E9]">
                        <span className="text-[11px] text-[#8C7D82] font-medium flex items-center gap-1.5 mb-2">
                          <SparklesIcon className="w-3.5 h-3.5 text-[#B85064]" />
                          Giới tính
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'FEMALE', label: 'Nữ' },
                            { id: 'MALE', label: 'Nam' },
                            { id: 'OTHER', label: 'Khác' },
                          ].map((g) => (
                            <button
                              type="button"
                              key={g.id}
                              onClick={() => setEditForm({ ...editForm, gender: g.id })}
                              className={`cursor-pointer py-1.5 px-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                                editForm.gender === g.id
                                  ? 'bg-[#B85064] text-white border-[#B85064] shadow-xs'
                                  : 'bg-white text-[#55464B] border-[#E8DCDE] hover:border-[#B85064]'
                              }`}
                            >
                              {g.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 6. Ngày sinh */}
                      <div className="p-4 rounded-2xl bg-[#FAF5F5] border border-[#F2E8E9]">
                        <label className="text-[11px] text-[#8C7D82] font-medium flex items-center gap-1.5 mb-1.5">
                          <CalendarIcon className="w-3.5 h-3.5 text-[#B85064]" />
                          Ngày sinh
                        </label>
                        <input
                          type="date"
                          value={editForm.dateOfBirth}
                          onChange={(e) =>
                            setEditForm({ ...editForm, dateOfBirth: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl text-sm font-bold text-[#261A1E] bg-white border border-[#E8DCDE] focus:border-[#B85064] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* 7. Địa chỉ nhận ảnh / hóa đơn */}
                    <div className="p-4 rounded-2xl bg-[#FAF5F5] border border-[#F2E8E9]">
                      <label className="text-[11px] text-[#8C7D82] font-medium flex items-center gap-1.5 mb-1.5">
                        <MapPinIcon className="w-3.5 h-3.5 text-[#B85064]" />
                        Địa chỉ nhận ảnh / hóa đơn
                      </label>
                      <input
                        type="text"
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                        className="w-full px-3 py-2 rounded-xl text-sm font-bold text-[#261A1E] bg-white border border-[#E8DCDE] focus:border-[#B85064] focus:outline-none"
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#F8EFEF]">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="cursor-pointer px-5 py-2.5 rounded-full border border-[#E8DCDE] text-xs font-semibold text-[#7A6C71] hover:bg-[#FAF5F5] transition-colors"
                      >
                        Hủy bỏ
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="cursor-pointer inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#B85064] hover:bg-[#A33D50] text-white text-xs font-semibold shadow-md shadow-[#B85064]/20 transition-all disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <CheckIcon className="w-4 h-4" />
                            <span>Lưu thay đổi</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Chế độ xem chi tiết với hỗ trợ Nhấn Đúp (Double-click) để chỉnh sửa */
                  <div className="space-y-5">
                    {/* Hướng dẫn nhấn đúp chuột */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* 1. Họ và tên */}
                      <div
                        onDoubleClick={handleStartEdit}
                        className="p-4 rounded-2xl bg-[#FAF5F5] border border-[#F2E8E9] hover:border-[#B85064]/40 hover:bg-[#FCF7F7] cursor-pointer transition-all group relative"
                        title="Nhấn đúp chuột để chỉnh sửa"
                      >
                        <span className="text-[11px] text-[#8C7D82] font-medium flex items-center justify-between mb-1.5">
                          <span className="flex items-center gap-1.5">
                            <UserIcon className="w-3.5 h-3.5 text-[#B85064]" />
                            Họ và tên
                          </span>
                          <span className="text-[10px] text-[#B85064] opacity-0 group-hover:opacity-100 transition-opacity">
                            Nhấn đúp để sửa
                          </span>
                        </span>
                        <p className="text-sm font-bold text-[#261A1E]">
                          {user.fullname || 'Chưa cập nhật'}
                        </p>
                      </div>

                      {/* 2. Tên đăng nhập */}
                      <div
                        onDoubleClick={handleStartEdit}
                        className="p-4 rounded-2xl bg-[#FAF5F5] border border-[#F2E8E9] hover:border-[#B85064]/40 hover:bg-[#FCF7F7] cursor-pointer transition-all group relative"
                        title="Nhấn đúp chuột để chỉnh sửa"
                      >
                        <span className="text-[11px] text-[#8C7D82] font-medium flex items-center justify-between mb-1.5">
                          <span className="flex items-center gap-1.5">
                            <LockClosedIcon className="w-3.5 h-3.5 text-[#B85064]" />
                            Tên đăng nhập
                          </span>
                          <span className="text-[10px] text-[#B85064] opacity-0 group-hover:opacity-100 transition-opacity">
                            Nhấn đúp để sửa
                          </span>
                        </span>
                        <p className="text-sm font-bold text-[#261A1E] font-mono">
                          {user.username}
                        </p>
                      </div>

                      {/* 3. Địa chỉ Email */}
                      <div
                        onDoubleClick={handleStartEdit}
                        className="p-4 rounded-2xl bg-[#FAF5F5] border border-[#F2E8E9] hover:border-[#B85064]/40 hover:bg-[#FCF7F7] cursor-pointer transition-all group relative"
                        title="Nhấn đúp chuột để chỉnh sửa"
                      >
                        <span className="text-[11px] text-[#8C7D82] font-medium flex items-center justify-between mb-1.5">
                          <span className="flex items-center gap-1.5">
                            <EnvelopeIcon className="w-3.5 h-3.5 text-[#B85064]" />
                            Địa chỉ Email
                          </span>
                          <span className="text-[10px] text-[#B85064] opacity-0 group-hover:opacity-100 transition-opacity">
                            Nhấn đúp để sửa
                          </span>
                        </span>
                        <p className="text-sm font-bold text-[#261A1E]">
                          {user.email || 'Chưa cập nhật'}
                        </p>
                      </div>

                      {/* 4. Số điện thoại */}
                      <div
                        onDoubleClick={handleStartEdit}
                        className="p-4 rounded-2xl bg-[#FAF5F5] border border-[#F2E8E9] hover:border-[#B85064]/40 hover:bg-[#FCF7F7] cursor-pointer transition-all group relative"
                        title="Nhấn đúp chuột để chỉnh sửa"
                      >
                        <span className="text-[11px] text-[#8C7D82] font-medium flex items-center justify-between mb-1.5">
                          <span className="flex items-center gap-1.5">
                            <PhoneIcon className="w-3.5 h-3.5 text-[#B85064]" />
                            Số điện thoại
                          </span>
                          <span className="text-[10px] text-[#B85064] opacity-0 group-hover:opacity-100 transition-opacity">
                            Nhấn đúp để sửa
                          </span>
                        </span>
                        <p className="text-sm font-bold text-[#261A1E]">
                          {user.phone || 'Chưa cập nhật'}
                        </p>
                      </div>

                      {/* 5. Giới tính */}
                      <div
                        onDoubleClick={handleStartEdit}
                        className="p-4 rounded-2xl bg-[#FAF5F5] border border-[#F2E8E9] hover:border-[#B85064]/40 hover:bg-[#FCF7F7] cursor-pointer transition-all group relative"
                        title="Nhấn đúp chuột để chỉnh sửa"
                      >
                        <span className="text-[11px] text-[#8C7D82] font-medium flex items-center justify-between mb-1.5">
                          <span className="flex items-center gap-1.5">
                            <SparklesIcon className="w-3.5 h-3.5 text-[#B85064]" />
                            Giới tính
                          </span>
                          <span className="text-[10px] text-[#B85064] opacity-0 group-hover:opacity-100 transition-opacity">
                            Nhấn đúp để sửa
                          </span>
                        </span>
                        <p className="text-sm font-bold text-[#261A1E]">
                          {user.gender === 'FEMALE'
                            ? 'Nữ'
                            : user.gender === 'MALE'
                            ? 'Nam'
                            : 'Khác'}
                        </p>
                      </div>

                      {/* 6. Ngày sinh */}
                      <div
                        onDoubleClick={handleStartEdit}
                        className="p-4 rounded-2xl bg-[#FAF5F5] border border-[#F2E8E9] hover:border-[#B85064]/40 hover:bg-[#FCF7F7] cursor-pointer transition-all group relative"
                        title="Nhấn đúp chuột để chỉnh sửa"
                      >
                        <span className="text-[11px] text-[#8C7D82] font-medium flex items-center justify-between mb-1.5">
                          <span className="flex items-center gap-1.5">
                            <CalendarIcon className="w-3.5 h-3.5 text-[#B85064]" />
                            Ngày sinh
                          </span>
                          <span className="text-[10px] text-[#B85064] opacity-0 group-hover:opacity-100 transition-opacity">
                            Nhấn đúp để sửa
                          </span>
                        </span>
                        <p className="text-sm font-bold text-[#261A1E]">
                          {user.dateOfBirth || 'Chưa cập nhật'}
                        </p>
                      </div>
                    </div>

                    {/* 7. Địa chỉ nhận ảnh / hóa đơn */}
                    <div
                      onDoubleClick={handleStartEdit}
                      className="p-4 rounded-2xl bg-[#FAF5F5] border border-[#F2E8E9] hover:border-[#B85064]/40 hover:bg-[#FCF7F7] cursor-pointer transition-all group relative"
                      title="Nhấn đúp chuột để chỉnh sửa"
                    >
                      <span className="text-[11px] text-[#8C7D82] font-medium flex items-center justify-between mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <MapPinIcon className="w-3.5 h-3.5 text-[#B85064]" />
                          Địa chỉ nhận ảnh / hóa đơn
                        </span>
                        <span className="text-[10px] text-[#B85064] opacity-0 group-hover:opacity-100 transition-opacity">
                          Nhấn đúp để sửa
                        </span>
                      </span>
                      <p className="text-sm font-bold text-[#261A1E]">
                        {user.address || 'Chưa cập nhật địa chỉ'}
                      </p>
                    </div>

                    {/* Security Notice */}
                    <div className="p-4 rounded-2xl bg-[#FDF5F6] border border-[#F5D5DC] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white border border-[#F5D5DC] flex items-center justify-center text-[#B85064]">
                          <ShieldCheckIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#261A1E] block">
                            Bảo mật tài khoản 2 lớp
                          </span>
                          <span className="text-[11px] text-[#7A6C71]">
                            Thông tin cá nhân của bạn được mã hóa an toàn trên hệ thống máy chủ
                            PhotoStudio.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ĐỔI MẬT KHẨU */}
            {activeTab === 'password' && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F0E4E6] shadow-xl shadow-[#B85064]/5 relative">
                <FloralCardCorner position="top-right" opacity="opacity-30" />

                <div className="max-w-xl mx-auto">
                  <div className="pb-5 mb-8 border-b border-[#F0E4E6] text-center">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#B85064] block">
                      BẢO MẬT TÀI KHOẢN
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#261A1E]">
                      Thay Đổi Mật Khẩu
                    </h2>
                    <p className="text-xs text-[#7A6C71] mt-1 max-w-md mx-auto leading-relaxed">
                      Để đảm bảo an toàn cho tài khoản, hãy sử dụng mật khẩu mạnh gồm chữ hoa, chữ thường và chữ số.
                    </p>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-[#4A3C41] mb-1.5">
                        Mật khẩu hiện tại <span className="text-[#B85064]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showOldPassword ? 'text' : 'password'}
                          value={passwordForm.oldPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
                          }
                          placeholder="Nhập mật khẩu đang dùng"
                          className={`w-full px-4 pr-11 py-3 rounded-2xl text-xs sm:text-sm bg-[#FAF5F5] border focus:outline-none transition-colors ${
                            passwordErrors.oldPassword
                              ? 'border-[#E53E3E] focus:border-[#E53E3E]'
                              : 'border-[#E8DCDE] focus:border-[#B85064]'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          className="cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9E8E93] hover:text-[#B85064] transition-colors p-1"
                          title={showOldPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                        >
                          {showOldPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                      </div>
                      {passwordErrors.oldPassword && (
                        <p className="mt-1.5 text-[11px] text-[#E53E3E]">
                          {passwordErrors.oldPassword}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A3C41] mb-1.5">
                        Mật khẩu mới <span className="text-[#B85064]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                          }
                          placeholder="Tối thiểu 6 ký tự"
                          className={`w-full px-4 pr-11 py-3 rounded-2xl text-xs sm:text-sm bg-[#FAF5F5] border focus:outline-none transition-colors ${
                            passwordErrors.newPassword
                              ? 'border-[#E53E3E] focus:border-[#E53E3E]'
                              : 'border-[#E8DCDE] focus:border-[#B85064]'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9E8E93] hover:text-[#B85064] transition-colors p-1"
                          title={showNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                        >
                          {showNewPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="mt-1.5 text-[11px] text-[#E53E3E]">
                          {passwordErrors.newPassword}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A3C41] mb-1.5">
                        Xác nhận mật khẩu mới <span className="text-[#B85064]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                          }
                          placeholder="Nhập lại mật khẩu mới"
                          className={`w-full px-4 pr-11 py-3 rounded-2xl text-xs sm:text-sm bg-[#FAF5F5] border focus:outline-none transition-colors ${
                            passwordErrors.confirmPassword
                              ? 'border-[#E53E3E] focus:border-[#E53E3E]'
                              : 'border-[#E8DCDE] focus:border-[#B85064]'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9E8E93] hover:text-[#B85064] transition-colors p-1"
                          title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                        >
                          {showConfirmPassword ? (
                            <EyeSlashIcon className="w-4 h-4" />
                          ) : (
                            <EyeIcon className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className="mt-1.5 text-[11px] text-[#E53E3E]">
                          {passwordErrors.confirmPassword}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 flex justify-center">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="cursor-pointer inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-[#B85064] hover:bg-[#A33D50] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#B85064]/20 transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <KeyIcon className="w-4 h-4" />
                            <span>Cập nhật mật khẩu mới</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 3: LỊCH CHỤP CỦA TÔI */}
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E4E6] shadow-xl shadow-[#B85064]/5 relative">
                <FloralCardCorner position="top-right" opacity="opacity-30" />

                <div className="pb-5 mb-6 border-b border-[#F0E4E6] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#B85064] block">
                      QUẢN LÝ LỊCH HẸN
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#261A1E]">
                      Lịch Chụp Đã Đặt
                    </h2>
                    <p className="text-[11px] text-[#7A6C71] mt-0.5">
                      Dữ liệu kết nối trực tiếp 2 chiều với hệ thống Quản Trị Viên & Nhân Viên
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fetchRealBookings(user)}
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E8DCDE] text-[#4A3C41] hover:bg-[#FAF5F5] text-xs font-semibold transition-all"
                      title="Làm mới danh sách"
                    >
                      <ArrowPathIcon className={`w-3.5 h-3.5 text-[#B85064] ${bookingsLoading ? 'animate-spin' : ''}`} />
                      <span>Đồng bộ</span>
                    </button>
                    <Link
                      to={ROUTES.USER.PACKAGES}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#B85064] hover:underline"
                    >
                      <span>Khám phá thêm gói</span>
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <Link
                    to={ROUTES.USER.MY_BOOKINGS}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#B85064] text-white text-xs font-bold hover:bg-[#A8394C] shadow-xs transition-all"
                  >
                    <span>Xem Hóa Đơn & Lịch Đã Thanh Toán</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </Link>

                </div>

                {/* Danh sách lịch chụp */}
                {bookingsLoading && bookings.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#7A6C71] flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-[#B85064] border-t-transparent rounded-full animate-spin" />
                    <span>Đang đồng bộ dữ liệu buổi chụp...</span>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#7A6C71] bg-[#FAF5F5] rounded-2xl border border-[#F2E8E9] p-6 space-y-2">
                    <p className="font-semibold text-[#261A1E]">Bạn chưa có lịch chụp nào</p>
                    <p className="text-[11px]">Khám phá các gói chụp độc bản tại PhotoStudio và đặt lịch ngay hôm nay.</p>
                    <Link to="/packages" className="inline-block mt-2 px-4 py-2 rounded-full bg-[#B85064] text-white font-bold text-xs">
                      Khám phá gói chụp
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((b) => {
                      const isCompleted = b.status === 'completed' || b.status === 'Đã hoàn thành';
                      const hasReview = Boolean(b.review);

                      return (
                        <div
                          key={b.id}
                          className="p-4 sm:p-5 rounded-2xl bg-[#FAF5F5] border border-[#F2E8E9] hover:border-[#B85064]/30 hover:bg-[#FAF2F4]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#EFEBEB] shrink-0 border border-[#F0E4E6]">
                              <img
                                src={
                                  b.packageImage ||
                                  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80'
                                }
                                alt={b.packageName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                    isCompleted
                                      ? 'bg-[#EBF8F2] text-[#2EA46D]'
                                      : 'bg-[#FEF3C7] text-[#D97706]'
                                  }`}
                                >
                                  {isCompleted ? 'Đã hoàn thành' : 'Đã xác nhận'}
                                </span>

                                {hasReview && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#FDF0F3] text-[#B85064] border border-[#F5D5DC]">
                                    <StarIcon className="w-2.5 h-2.5 fill-[#B85064]" />
                                    Đã đánh giá ({Number(b.review.rating || 5).toFixed(1)})
                                  </span>
                                )}
                              </div>

                              <h4 className="text-sm font-bold text-[#261A1E] mt-1 truncate">
                                {b.packageName}
                              </h4>

                              <div className="flex items-center gap-3 text-xs text-[#7A6C71] mt-1 flex-wrap">
                                <span className="flex items-center gap-1">
                                  <CalendarIcon className="w-3 h-3 text-[#B85064]" />
                                  {b.bookingDate || '10/10/2026'}
                                </span>
                                <span className="flex items-center gap-1">
                                  <ClockIcon className="w-3 h-3 text-[#B85064]" />
                                  {b.startTime ? `${b.startTime} – ${b.endTime}` : '08:30 – 12:30'}
                                </span>
                                {b.roomName && (
                                  <span className="flex items-center gap-1 text-[#8C7D82]">
                                    <MapPinIcon className="w-3 h-3 text-[#B85064]" />
                                    {b.roomName}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                            <button
                              type="button"
                              onClick={() => handleOpenBookingDetail(b)}
                              className="cursor-pointer px-3.5 py-1.5 rounded-full border border-[#E8DCDE] text-[#4A3C41] hover:bg-white hover:border-[#B85064] text-xs font-semibold transition-all flex items-center gap-1"
                            >
                              <EyeIcon className="w-3.5 h-3.5 text-[#B85064]" />
                              <span>Chi tiết buổi chụp</span>
                            </button>

                            {isCompleted ? (
                              <button
                                type="button"
                                onClick={() => handleOpenBookingDetail(b)}
                                className={`cursor-pointer px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                                  hasReview
                                    ? 'border border-[#2EA46D] text-[#2EA46D] hover:bg-[#EBF8F2]'
                                    : 'bg-[#B85064] hover:bg-[#A33D50] text-white shadow-xs'
                                }`}
                              >
                                <StarIcon className="w-3.5 h-3.5" />
                                <span>{hasReview ? 'Xem đánh giá' : 'Đánh giá nhân viên'}</span>
                              </button>
                            ) : (
                              <Link
                                to={`/packages/${b.packageId || 1}`}
                                className="px-3.5 py-1.5 rounded-full bg-[#B85064] hover:bg-[#A33D50] text-white text-xs font-semibold shadow-xs transition-colors"
                              >
                                Xem gói chụp
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Modal Chi tiết buổi chụp & Đánh giá nhân viên */}
      <BookingSessionDetailModal
        booking={selectedBookingForDetail}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        currentUser={user}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </section>
  </div>
);
}