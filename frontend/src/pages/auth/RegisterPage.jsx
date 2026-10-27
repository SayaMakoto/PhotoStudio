import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Camera,
  Sparkles,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Gift,
  UserPlus,
  AlertCircle
} from 'lucide-react';
import { ROUTES } from '../../routes/web';
import customerAuthService from '../../services/user/authService';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Tính toán độ mạnh mật khẩu (0 - 3)
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-neutral-800' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++;

    if (score === 1) return { score: 1, label: 'Mật khẩu yếu', color: 'bg-red-500' };
    if (score === 2) return { score: 2, label: 'Mật khẩu trung bình', color: 'bg-amber-400' };
    return { score: 3, label: 'Mật khẩu rất mạnh', color: 'bg-emerald-400' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullname.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên của bạn.');
      return;
    }
    if (!formData.username.trim()) {
      setErrorMessage('Vui lòng chọn tên đăng nhập.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Vui lòng nhập số điện thoại liên hệ.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage('Mật khẩu cần tối thiểu 6 ký tự.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.');
      return;
    }
    if (!formData.agreeTerms) {
      setErrorMessage('Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.');
      return;
    }

    setIsLoading(true);

    try {
      await customerAuthService.register({
        fullname: formData.fullname.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: 'Customer',
      });

      setSuccessMessage('Đăng ký tài khoản thành công! Đang chuyển đến trang đăng nhập...');
      setTimeout(() => {
        navigate(ROUTES.AUTH.LOGIN);
      }, 1500);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          'Đăng ký không thành công. Vui lòng kiểm tra lại thông tin.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-amber-400 selection:text-neutral-950 font-sans relative flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* Background Lighting & Glows */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Main Glassmorphic Container */}
      <div className="relative z-10 w-full max-w-5xl bg-neutral-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[700px]">
        {/* Left Side: Benefits Showcase */}
        <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-10 overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border-r border-white/10">
          {/* Background Photo with dark gradient */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000 hover:scale-100"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40" />

          {/* Top Brand Tag */}
          <div className="relative z-10">
            <Link to={ROUTES.USER.HOME} className="inline-flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
                <Camera className="w-5 h-5 text-neutral-950 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-wider text-white font-sans flex items-center gap-1.5">
                  PHOTO<span className="text-amber-400 font-extrabold">STUDIO</span>
                </span>
                <p className="text-[10px] text-amber-200/70 tracking-widest uppercase font-medium">
                  Art & Cinematic Photography
                </p>
              </div>
            </Link>
          </div>

          {/* Middle Benefits */}
          <div className="relative z-10 my-auto py-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-4">
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>Ưu Đãi Thành Viên Mới</span>
            </div>

            <h3 className="text-2xl font-bold text-white leading-snug mb-3">
              Gia nhập PhotoStudio & tận hưởng dịch vụ đẳng cấp
            </h3>
            <p className="text-sm text-neutral-400 font-light leading-relaxed mb-6">
              Đăng ký tài khoản ngay hôm nay để nhận voucher giảm <strong className="text-amber-300">15%</strong> cho gói chụp đầu tiên cùng các quyền lợi độc quyền:
            </p>

            {/* List of Perks */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3 h-3" />
                </div>
                <p className="text-xs text-neutral-300">
                  <strong className="text-white">Đặt lịch & chọn concept:</strong> Chọn trang phục, phòng chụp và phong cách ưng ý trong vài thao tác.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3 h-3" />
                </div>
                <p className="text-xs text-neutral-300">
                  <strong className="text-white">Thư viện ảnh trực tuyến:</strong> Xem trước ảnh gốc, chọn ảnh chỉnh sửa và tải về tốc độ cao.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-3 h-3" />
                </div>
                <p className="text-xs text-neutral-300">
                  <strong className="text-white">Tích điểm nâng hạng VIP:</strong> Nhận quà tặng kỷ niệm và ưu đãi tri ân cho các sự kiện tiếp theo.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Back Button */}
          <div className="relative z-10 pt-4">
            <Link
              to={ROUTES.USER.HOME}
              className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-amber-400 transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Quay về Trang Chủ</span>
            </Link>
          </div>
        </div>

        {/* Right Side: Register Form Area */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Header Mobile Brand & Switch Tabs */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
              <Link to={ROUTES.USER.HOME} className="flex lg:hidden items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center">
                  <Camera className="w-4 h-4 text-neutral-950 stroke-[2.2]" />
                </div>
                <span className="text-base font-bold text-white">
                  PHOTO<span className="text-amber-400">STUDIO</span>
                </span>
              </Link>

              {/* Segmented Tab */}
              <div className="inline-flex p-1 bg-neutral-950/80 rounded-xl border border-white/10 ml-auto">
                <Link
                  to={ROUTES.AUTH.LOGIN}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-white transition-colors"
                >
                  Đăng Nhập
                </Link>
                <span className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-400 text-neutral-950 shadow-sm cursor-default">
                  Đăng Ký
                </span>
              </div>
            </div>

            {/* Title */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                Tạo Tài Khoản Mới <span className="text-amber-400">✨</span>
              </h2>
              <p className="text-sm text-neutral-400">
                Gia nhập PhotoStudio để nhận dịch vụ chụp ảnh nghệ thuật đỉnh cao
              </p>
            </div>

            {/* Alert Messages */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Fullname & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950/90 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Tên đăng nhập
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <span className="text-xs font-bold">@</span>
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="username123"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950/90 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Địa chỉ Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950/90 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0901234567"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950/90 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Tối thiểu 6 ký tự"
                      className="w-full pl-10 pr-10 py-2.5 bg-neutral-950/90 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Nhập lại mật khẩu"
                      className="w-full pl-10 pr-10 py-2.5 bg-neutral-950/90 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password strength bar */}
              {formData.password && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-400">Độ bảo mật:</span>
                    <span className="font-medium text-neutral-200">{strength.label}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 h-1.5">
                    <div className={`rounded-full transition-all duration-300 ${strength.score >= 1 ? strength.color : 'bg-neutral-800'}`} />
                    <div className={`rounded-full transition-all duration-300 ${strength.score >= 2 ? strength.color : 'bg-neutral-800'}`} />
                    <div className={`rounded-full transition-all duration-300 ${strength.score >= 3 ? strength.color : 'bg-neutral-800'}`} />
                  </div>
                </div>
              )}

              {/* Terms agreement checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="w-4 h-4 mt-0.5 rounded border-white/20 bg-neutral-950 text-amber-400 focus:ring-amber-400 focus:ring-offset-neutral-900 cursor-pointer accent-amber-400"
                    required
                  />
                  <span className="text-xs text-neutral-300 leading-relaxed">
                    Tôi đồng ý với{' '}
                    <span className="text-amber-400 hover:underline">Điều khoản sử dụng</span>{' '}
                    và{' '}
                    <span className="text-amber-400 hover:underline">Chính sách bảo mật</span>{' '}
                    của PhotoStudio.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 stroke-[2.4]" />
                    <span>Đăng Ký Tài Khoản</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer inside right panel */}
          <div className="pt-5 mt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
            <div>
              Đã có tài khoản?{' '}
              <Link
                to={ROUTES.AUTH.LOGIN}
                className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4"
              >
                Đăng nhập ngay
              </Link>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-neutral-600">|</span>
              <Link to={ROUTES.AUTH.EMPLOYEE_LOGIN} className="hover:text-amber-400 transition-colors">
                Cổng Nhân Viên
              </Link>
              <span className="text-neutral-600">•</span>
              <Link to={ROUTES.AUTH.ADMIN_LOGIN} className="hover:text-amber-400 transition-colors">
                Quản Trị Viên
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
