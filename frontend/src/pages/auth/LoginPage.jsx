import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Camera,
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  Star,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { ROUTES } from '../../routes/web';
import customerAuthService from '../../services/user/authService';

function readTokenPayload(token) {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
    rememberMe: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

    if (!formData.usernameOrEmail.trim()) {
      setErrorMessage('Vui lòng nhập tên đăng nhập hoặc email.');
      return;
    }
    if (!formData.password) {
      setErrorMessage('Vui lòng nhập mật khẩu.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await customerAuthService.login(formData.usernameOrEmail.trim(), formData.password);
      const token = res.accessToken || res.token;
      const payload = token ? readTokenPayload(token) : null;
      const roles = Array.isArray(payload?.roles) ? payload.roles : [];

      setSuccessMessage('Đăng nhập thành công! Đang chuyển hướng...');
      setTimeout(() => {
        if (roles.includes('ROLE_ADMIN')) {
          navigate(ROUTES.ADMIN.DASHBOARD, { replace: true });
        } else if (roles.includes('ROLE_EMPLOYEE')) {
          navigate(ROUTES.EMPLOYEE.DASHBOARD, { replace: true });
        } else {
          navigate(ROUTES.USER.HOME, { replace: true });
        }
      }, 700);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          'Tên đăng nhập hoặc mật khẩu không chính xác.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Nút đăng nhập nhanh cho các vai trò để trải nghiệm thuận tiện
  const handleQuickDemo = (role) => {
    if (role === 'admin') {
      setFormData({
        usernameOrEmail: 'admin@photostudio.vn',
        password: 'adminPassword123',
        rememberMe: true,
      });
    } else if (role === 'employee') {
      setFormData({
        usernameOrEmail: 'employee@photostudio.vn',
        password: 'empPassword123',
        rememberMe: true,
      });
    } else {
      setFormData({
        usernameOrEmail: 'khachhang@photostudio.vn',
        password: 'userPassword123',
        rememberMe: true,
      });
    }
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-amber-400 selection:text-neutral-950 font-sans relative flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* Background Lighting & Glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Main Glassmorphic Container */}
      <div className="relative z-10 w-full max-w-5xl bg-neutral-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Left Side: Cinematic Studio Visual Showcase (Hidden on small screens) */}
        <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-10 overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border-r border-white/10">
          {/* Background Photo with dark gradient */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000 hover:scale-100"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80')`,
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

          {/* Middle Quote / Highlights */}
          <div className="relative z-10 my-auto py-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Khoảnh Khắc Bất Tử</span>
            </div>
            <h3 className="text-2xl font-bold text-white leading-snug mb-3">
              Lưu giữ từng ánh mắt & xúc cảm trong từng khung hình
            </h3>
            <p className="text-sm text-neutral-400 font-light leading-relaxed">
              Đăng nhập để theo dõi lịch chụp ảnh cưới, xem trước bộ sưu tập gốc và nhận ưu đãi độc quyền dành cho thành viên PhotoStudio.
            </p>

            {/* Micro Stats */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-white/10">
              <div className="bg-neutral-950/60 backdrop-blur-md rounded-2xl p-3 border border-white/5">
                <div className="flex items-center gap-1 text-amber-400 mb-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-white">4.9/5</span>
                </div>
                <p className="text-xs text-neutral-400">10,000+ Khách hài lòng</p>
              </div>
              <div className="bg-neutral-950/60 backdrop-blur-md rounded-2xl p-3 border border-white/5">
                <div className="flex items-center gap-1 text-amber-400 mb-1">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-bold text-white">100%</span>
                </div>
                <p className="text-xs text-neutral-400">Bảo mật tuyệt đối</p>
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

        {/* Right Side: Form Area */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          
          {/* Header Mobile Brand & Switch Tabs */}
          <div>
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
              <Link to={ROUTES.USER.HOME} className="flex lg:hidden items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center">
                  <Camera className="w-4 h-4 text-neutral-950 stroke-[2.2]" />
                </div>
                <span className="text-base font-bold text-white">
                  PHOTO<span className="text-amber-400">STUDIO</span>
                </span>
              </Link>

              {/* Segmented Tab: Đăng Nhập / Đăng Ký */}
              <div className="inline-flex p-1 bg-neutral-950/80 rounded-xl border border-white/10 ml-auto">
                <span className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-400 text-neutral-950 shadow-sm cursor-default">
                  Đăng Nhập
                </span>
                <Link
                  to={ROUTES.AUTH.REGISTER}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-white transition-colors"
                >
                  Đăng Ký
                </Link>
              </div>
            </div>

            {/* Title */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                Chào Mừng Trở Lại <span className="text-amber-400">✦</span>
              </h2>
              <p className="text-sm text-neutral-400">
                Nhập thông tin tài khoản để truy cập hệ thống PhotoStudio
              </p>
            </div>

            {/* Alert Messages */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username or Email Input */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Tên đăng nhập hoặc Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="usernameOrEmail"
                    value={formData.usernameOrEmail}
                    onChange={handleChange}
                    placeholder="VD: user@photostudio.vn hoặc username"
                    className="w-full pl-10 pr-4 py-3 bg-neutral-950/90 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-neutral-300">
                    Mật khẩu
                  </label>
                  <Link
                    to={ROUTES.AUTH.FORGOT_PASSWORD || '#'}
                    onClick={(e) => {
                      if (!ROUTES.AUTH.FORGOT_PASSWORD) e.preventDefault();
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 bg-neutral-950/90 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-white/20 bg-neutral-950 text-amber-400 focus:ring-amber-400 focus:ring-offset-neutral-900 cursor-pointer accent-amber-400"
                  />
                  <span className="text-xs text-neutral-300">Ghi nhớ đăng nhập</span>
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
                    <KeyRound className="w-4 h-4 stroke-[2.4]" />
                    <span>Đăng Nhập</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access */}
            <div className="mt-5 p-3.5 rounded-2xl bg-neutral-950/60 border border-amber-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold tracking-wider text-amber-400/90 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Trải nghiệm nhanh Demo:
                </span>
                <span className="text-[10px] text-neutral-400">Tự động điền</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('customer')}
                  className="py-1.5 px-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 hover:border-amber-400/50 text-[11px] font-medium text-neutral-200 hover:text-white transition-all text-center cursor-pointer"
                >
                  👤 Khách Hàng
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('employee')}
                  className="py-1.5 px-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 hover:border-amber-400/50 text-[11px] font-medium text-neutral-200 hover:text-white transition-all text-center cursor-pointer"
                >
                  📸 Nhân Viên
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  className="py-1.5 px-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 hover:border-amber-400/50 text-[11px] font-medium text-neutral-200 hover:text-white transition-all text-center cursor-pointer"
                >
                  ⚡ Quản Trị
                </button>
              </div>
            </div>

          </div>

          {/* Footer inside right panel */}
          <div className="pt-6 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
            <div>
              Chưa có tài khoản PhotoStudio?{' '}
              <Link
                to={ROUTES.AUTH.REGISTER}
                className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4"
              >
                Đăng ký ngay
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

