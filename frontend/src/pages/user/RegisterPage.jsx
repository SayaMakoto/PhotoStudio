import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CameraIcon,
  LockClosedIcon,
  EnvelopeIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/solid';
import { ROUTES } from '../../routes/web';
import customerAuthService from '../../services/user/authService';
import { FloralCardCorner } from '../../components/common/FloralDecorations';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (errorMessage) setErrorMessage('');
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullname.trim()) {
      errors.fullname = 'Vui lòng nhập họ và tên của bạn.';
    }

    if (!formData.username.trim()) {
      errors.username = 'Vui lòng nhập tên đăng nhập.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Vui lòng nhập địa chỉ email.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Địa chỉ email không đúng định dạng (VD: example@email.com).';
    }

    if (!formData.password) {
      errors.password = 'Vui lòng nhập mật khẩu.';
    } else if (formData.password.length < 6) {
      errors.password = 'Mật khẩu cần tối thiểu 6 ký tự.';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận lại mật khẩu.';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    }

    if (!formData.agreeTerms) {
      errors.agreeTerms = 'Bạn cần đồng ý với Điều khoản sử dụng và Chính sách bảo mật.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) {
      setErrorMessage('Vui lòng điền đầy đủ và chính xác tất cả thông tin bắt buộc bên dưới.');
      return;
    }

    setIsLoading(true);

    try {
      await customerAuthService.register({
        fullname: formData.fullname.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: 'CUSTOMER',
      });

      setSuccessMessage('Đăng ký tài khoản thành công! Đang chuyển đến trang đăng nhập...');

      setTimeout(() => {
        navigate(ROUTES.AUTH.LOGIN, {
          state: {
            from: null,
            registeredUsername: formData.username.trim(),
          },
        });
      }, 1400);
    } catch (error) {
      const serverMsg =
        error.response?.data?.message ||
        error.message ||
        'Đăng ký không thành công. Email này có thể đã được đăng ký tài khoản.';
      setErrorMessage(serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F171A] font-sans relative flex items-center justify-center p-3 sm:p-6 lg:p-10 selection:bg-[#B85064]/30 selection:text-white">
      {/* Nút quay lại trang chủ góc trên bên trái */}
      <Link
        to={ROUTES.USER.HOME}
        className="fixed top-5 left-5 z-50 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-[#261A1E] hover:text-[#B85064] text-xs font-semibold shadow-lg shadow-black/25 backdrop-blur-md border border-white/50 transition-all hover:scale-105 group"
        title="Quay lại trang chủ PhotoStudio"
      >
        <ArrowLeftIcon className="w-4 h-4 text-[#B85064] group-hover:-translate-x-1 transition-transform" />
        <span>Quay lại trang chủ</span>
      </Link>

      {/* Background Studio Photography with Dark Vignette */}
      <div
        className="fixed inset-0 bg-cover bg-center opacity-55 scale-105 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1920&q=80')`,
        }}
      />
      <div className="fixed inset-0 bg-radial from-[#3D252D]/60 via-[#1C1518]/90 to-[#120D10] pointer-events-none" />

      {/* Floating Petals Decor */}
      <div className="absolute top-12 left-1/4 w-3 h-3 bg-[#EAA5B2]/40 rounded-full blur-[1px] rotate-45 pointer-events-none animate-pulse" />
      <div className="absolute bottom-20 right-1/4 w-4 h-4 bg-[#EAA5B2]/30 rounded-full blur-[1px] -rotate-12 pointer-events-none" />

      {/* Main Split Modal Box (Khớp 100% hình mẫu Image 2 - Cột bên phải Đăng ký) */}
      <div className="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-2xl shadow-black/80 overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[620px] border border-white/10">
        
        {/* ========================================================================= */}
        {/* NỬA TRÁI: KHUNG ẢNH NGHỆ THUẬT CINEMATIC + LOGO + QUOTE VIẾT TAY */}
        {/* ========================================================================= */}
        <div className="relative flex flex-col justify-between p-8 sm:p-10 overflow-hidden bg-[#181114] text-white">
          {/* Ảnh nền studio ống kính & máy ảnh cổ điển - Sáng, ấm áp và rõ nét theo hình mẫu */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-90 scale-100 transition-transform duration-1000 hover:scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80')`,
            }}
          />
          {/* Gradient đen nhẹ chỉ phủ phía dưới chữ để ảnh sáng rõ và chữ vẫn tương phản hoàn hảo */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20 pointer-events-none" />

          {/* Cành hoa anh đào trang trí góc trên bên phải của nửa trái */}
          <FloralCardCorner position="top-right" opacity="opacity-90" />

          {/* Cánh hoa rơi rải rác */}
          <div className="absolute top-20 right-14 w-2.5 h-3.5 bg-rose-200/50 rounded-full blur-[0.5px] rotate-45 pointer-events-none" />
          <div className="absolute top-28 right-8 w-2 h-2.5 bg-rose-300/40 rounded-full blur-[0.5px] -rotate-12 pointer-events-none" />
          <div className="absolute bottom-24 left-8 w-3 h-4 bg-rose-200/45 rounded-full blur-[0.5px] rotate-12 pointer-events-none" />

          {/* Top Brand Logo */}
          <div className="relative z-10">
            <Link to={ROUTES.USER.HOME} className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#BE4B5E] flex items-center justify-center shadow-lg shadow-[#BE4B5E]/30 group-hover:scale-105 transition-transform">
                <CameraIcon className="w-5 h-5 text-white stroke-[2.2]" />
              </div>
              <div>
                <span className="text-base font-bold tracking-wider text-white font-sans flex items-center gap-1">
                  PHOTO<span className="text-[#E899A8] font-extrabold">STUDIO</span>
                </span>
                <p className="text-[9px] text-rose-200/70 tracking-widest uppercase font-medium">
                  ART & CINEMATIC PHOTOGRAPHY
                </p>
              </div>
            </Link>
          </div>

          {/* Middle Cursive Quote & Headline */}
          <div className="relative z-10 my-auto py-8">
            {/* Chữ viết tay mềm mại màu hồng phấn */}
            <div className="font-handwriting text-2xl sm:text-3xl text-[#E899A8] mb-2 select-none">
              Bắt đầu ngay!
            </div>

            {/* Tiêu đề chính Serif */}
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-luxury text-white leading-tight mb-4">
              Đăng Ký
              <br />
              Tài Khoản
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed max-w-xs">
              Tạo tài khoản để đặt lịch chụp, quản lý đơn hàng và nhận nhiều ưu đãi hấp dẫn từ PhotoStudio.
            </p>
          </div>

          {/* Bottom Tagline */}
          <div className="relative z-10 pt-4 border-t border-white/10">
            <p className="text-[11px] text-neutral-400 font-light italic">
              Cùng bạn lưu giữ những khoảnh khắc đẹp nhất —
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* NỬA PHẢI: FORM ĐĂNG KÝ NỀN TRẮNG TINH KHÔI + CÀNH HOA GÓC TRÊN */}
        {/* ========================================================================= */}
        <div className="relative p-8 sm:p-10 flex flex-col justify-between bg-white text-[#261A1E]">
          {/* Cành hoa anh đào nở rộ góc trên bên phải */}
          <FloralCardCorner position="top-right" opacity="opacity-95" />

          <div>
            {/* Tag nhỏ danh mục */}
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B85064] block mb-1">
              ĐĂNG KÝ TÀI KHOẢN
            </span>

            {/* Tiêu đề trang */}
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#261A1E] mb-1.5">
              Tạo Tài Khoản Mới
            </h1>
            <p className="text-xs text-[#7A6C71] mb-5">
              Vui lòng điền đầy đủ thông tin bên dưới để đăng ký tài khoản PhotoStudio.
            </p>

            {/* Alert thông báo lỗi */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-[#FFF2F4] border border-[#FCD5DC] text-[#C53030] text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <ExclamationCircleIcon className="w-4 h-4 text-[#E53E3E] shrink-0 mt-0.5" />
                <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* Alert thông báo thành công */}
            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-[#EBF8F2] border border-[#B4E8D0] text-[#1E7E34] text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircleIcon className="w-4 h-4 text-[#2EA46D] shrink-0" />
                <span className="font-medium">{successMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Field Họ và tên */}
              <div>
                <label className="block text-xs font-semibold text-[#3D2C31] mb-1">
                  Họ và tên <span className="text-[#B85064]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E8E93]">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên của bạn"
                    className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm bg-[#FAF7F8] border transition-colors focus:outline-none text-[#261A1E] placeholder-[#B5A5A9] ${
                      fieldErrors.fullname
                        ? 'border-[#E53E3E] bg-[#FFF5F6]'
                        : 'border-[#EFE8E9] focus:border-[#B85064]'
                    }`}
                  />
                </div>
                {fieldErrors.fullname && (
                  <p className="mt-1 text-[11px] text-[#E53E3E] font-medium flex items-center gap-1">
                    <ExclamationCircleIcon className="w-3 h-3" />
                    <span>{fieldErrors.fullname}</span>
                  </p>
                )}
              </div>

              {/* Field Tên đăng nhập */}
              <div>
                <label className="block text-xs font-semibold text-[#3D2C31] mb-1" htmlFor="register-username">
                  Tên đăng nhập <span className="text-[#B85064]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E8E93]">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    id="register-username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Nhập tên đăng nhập"
                    autoComplete="username"
                    required
                    aria-invalid={Boolean(fieldErrors.username)}
                    className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm bg-[#FAF7F8] border transition-colors focus:outline-none text-[#261A1E] placeholder-[#B5A5A9] ${
                      fieldErrors.username
                        ? 'border-[#E53E3E] bg-[#FFF5F6]'
                        : 'border-[#EFE8E9] focus:border-[#B85064]'
                    }`}
                  />
                </div>
                {fieldErrors.username && (
                  <p className="mt-1 text-[11px] text-[#E53E3E] font-medium flex items-center gap-1">
                    <ExclamationCircleIcon className="w-3 h-3" />
                    <span>{fieldErrors.username}</span>
                  </p>
                )}
              </div>

              {/* Field Email */}
              <div>
                <label className="block text-xs font-semibold text-[#3D2C31] mb-1">
                  Email <span className="text-[#B85064]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E8E93]">
                    <EnvelopeIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập email của bạn"
                    className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm bg-[#FAF7F8] border transition-colors focus:outline-none text-[#261A1E] placeholder-[#B5A5A9] ${
                      fieldErrors.email
                        ? 'border-[#E53E3E] bg-[#FFF5F6]'
                        : 'border-[#EFE8E9] focus:border-[#B85064]'
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-[11px] text-[#E53E3E] font-medium flex items-center gap-1">
                    <ExclamationCircleIcon className="w-3 h-3" />
                    <span>{fieldErrors.email}</span>
                  </p>
                )}
              </div>

              {/* Field Mật khẩu */}
              <div>
                <label className="block text-xs font-semibold text-[#3D2C31] mb-1">
                  Mật khẩu <span className="text-[#B85064]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E8E93]">
                    <LockClosedIcon className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                    className={`w-full pl-10 pr-11 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm bg-[#FAF7F8] border transition-colors focus:outline-none text-[#261A1E] placeholder-[#B5A5A9] ${
                      fieldErrors.password
                        ? 'border-[#E53E3E] bg-[#FFF5F6]'
                        : 'border-[#EFE8E9] focus:border-[#B85064]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9E8E93] hover:text-[#261A1E] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-[11px] text-[#E53E3E] font-medium flex items-center gap-1">
                    <ExclamationCircleIcon className="w-3 h-3" />
                    <span>{fieldErrors.password}</span>
                  </p>
                )}
              </div>

              {/* Field Xác nhận mật khẩu */}
              <div>
                <label className="block text-xs font-semibold text-[#3D2C31] mb-1">
                  Xác nhận mật khẩu <span className="text-[#B85064]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E8E93]">
                    <LockClosedIcon className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Nhập lại mật khẩu"
                    className={`w-full pl-10 pr-11 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm bg-[#FAF7F8] border transition-colors focus:outline-none text-[#261A1E] placeholder-[#B5A5A9] ${
                      fieldErrors.confirmPassword
                        ? 'border-[#E53E3E] bg-[#FFF5F6]'
                        : 'border-[#EFE8E9] focus:border-[#B85064]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9E8E93] hover:text-[#261A1E] transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-[11px] text-[#E53E3E] font-medium flex items-center gap-1">
                    <ExclamationCircleIcon className="w-3 h-3" />
                    <span>{fieldErrors.confirmPassword}</span>
                  </p>
                )}
              </div>

              {/* Checkbox Đồng ý điều khoản */}
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="w-4 h-4 mt-0.5 rounded border-[#E8DCDE] text-[#B85064] focus:ring-[#B85064] accent-[#B85064] cursor-pointer shrink-0"
                  />
                  <span className="text-xs text-[#55464B] leading-relaxed">
                    Tôi đồng ý với{' '}
                    <a
                      href="#terms"
                      onClick={(e) => e.preventDefault()}
                      className="text-[#B85064] hover:underline font-medium"
                    >
                      Điều khoản sử dụng
                    </a>{' '}
                    và{' '}
                    <a
                      href="#privacy"
                      onClick={(e) => e.preventDefault()}
                      className="text-[#B85064] hover:underline font-medium"
                    >
                      Chính sách bảo mật
                    </a>{' '}
                    của PhotoStudio.
                  </span>
                </label>
                {fieldErrors.agreeTerms && (
                  <p className="mt-1 text-[11px] text-[#E53E3E] font-medium pl-6">
                    {fieldErrors.agreeTerms}
                  </p>
                )}
              </div>

              {/* Nút Đăng ký to tròn đúng màu mẫu #B85064 */}
              <button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer w-full py-3 rounded-full bg-gradient-to-r from-[#C0485C] via-[#B85064] to-[#A33D50] hover:from-[#A8394C] hover:to-[#8E3243] text-white font-semibold text-sm shadow-md shadow-[#B85064]/25 hover:shadow-lg hover:shadow-[#B85064]/35 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-3"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Đăng Ký</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Dòng chuyển trang cuối form: Đã có tài khoản? Đăng nhập ngay -> */}
          <div className="pt-4 mt-4 border-t border-[#F0E4E6] text-center text-xs text-[#7A6C71]">
            Đã có tài khoản?{' '}
            <Link
              to={ROUTES.AUTH.LOGIN}
              className="text-[#B85064] hover:underline font-bold inline-flex items-center gap-1 ml-1"
            >
              <span>Đăng nhập ngay</span>
              <ArrowRightIcon className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
