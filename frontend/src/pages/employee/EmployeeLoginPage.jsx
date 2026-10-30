import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Camera,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { ROUTES } from '../../routes/web';
import employeeAuthService from '../../services/employee/authService';

export default function EmployeeLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

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

    const usernameOrEmail = formData.usernameOrEmail.trim();
    if (!usernameOrEmail) {
      setErrorMessage('Vui lòng nhập tên đăng nhập hoặc email nhân viên.');
      return;
    }
    if (!formData.password) {
      setErrorMessage('Vui lòng nhập mật khẩu tài khoản.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    setIsLoading(true);

    try {
      await employeeAuthService.login(usernameOrEmail, formData.password);
      setSuccessMessage('Đăng nhập thành công! Đang chuyển hướng vào bàn làm việc...');
      navigate(location.state?.from || ROUTES.EMPLOYEE.DASHBOARD, {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          'Không thể đăng nhập. Vui lòng kiểm tra lại thông tin tài khoản.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-white selection:bg-[#B85064] selection:text-white font-sans p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden">
      {/* Background Studio Glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[600px] h-[450px] bg-[#B85064]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[400px] bg-[#913B4D]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Top Header Navigation */}
      <header className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between py-2">
        <Link
          to={ROUTES.USER.HOME}
          className="flex items-center gap-2 group text-xs text-neutral-400 hover:text-[#E28E9E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Về Trang Chủ Studio</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.AUTH.LOGIN}
            className="text-xs text-neutral-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/5 bg-neutral-900/60 hover:bg-neutral-800 transition-colors"
          >
            Cổng Khách Hàng
          </Link>
          <Link
            to={ROUTES.AUTH.ADMIN_LOGIN}
            className="text-xs text-neutral-400 hover:text-[#E28E9E] px-3 py-1.5 rounded-lg border border-white/5 bg-neutral-900/60 hover:bg-neutral-800 transition-colors"
          >
            Cổng Quản Trị →
          </Link>
        </div>
      </header>

      {/* Main Employee Login Box */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto py-6">
        <div className="rounded-3xl bg-neutral-950/90 border border-neutral-800/80 p-7 sm:p-9 shadow-2xl shadow-black/90 backdrop-blur-2xl">
          {/* Brand Header */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#B85064] to-[#E28E9E] text-white shadow-lg shadow-[#B85064]/30 mb-3.5">
              <Camera className="w-7 h-7 stroke-[2.2]" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B85064]/15 border border-[#B85064]/30 text-[#F5D5DC] text-[11px] font-semibold tracking-wider uppercase mb-2">
              <Briefcase className="w-3.5 h-3.5 text-[#E28E9E]" />
              <span>PHOTOSTUDIO STAFF</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white">
              Đăng Nhập Nhân Viên
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Cổng tác nghiệp dành cho nhân viên Studio
            </p>
          </div>

          {/* Alert Messages */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username or Email */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Tên đăng nhập hoặc Email nhân viên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Mail className="w-4 h-4 text-[#E28E9E]" />
                </div>
                <input
                  type="text"
                  name="usernameOrEmail"
                  value={formData.usernameOrEmail}
                  onChange={handleChange}
                  placeholder="photographer1 hoặc hoanganh@photostudio.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#B85064] focus:ring-1 focus:ring-[#B85064] transition-colors"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-neutral-300">
                  Mật khẩu
                </label>
                <span className="text-[11px] text-neutral-400">
                  Quên mật khẩu? Liên hệ Admin
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Lock className="w-4 h-4 text-[#E28E9E]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#B85064] focus:ring-1 focus:ring-[#B85064] transition-colors"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-neutral-300">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-[#B85064] focus:ring-[#B85064] accent-[#B85064] cursor-pointer"
                />
                <span>Ghi nhớ phiên làm việc trên máy studio</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B85064] via-[#C86276] to-[#B85064] text-white font-bold text-sm shadow-lg shadow-[#B85064]/30 hover:shadow-[#B85064]/50 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserCheck className="w-4 h-4 stroke-[2.4]" />
                  <span>ĐĂNG NHẬP NHÂN VIÊN</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div className="pt-4 mt-5 border-t border-neutral-800/80 text-center text-[11px] text-neutral-400 leading-relaxed">
            Hệ thống chỉ cho phép tài khoản có quyền <strong className="text-neutral-200">Nhân viên (Employee)</strong> truy cập.
          </div>
        </div>
      </main>

      {/* Footer System Meta */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between py-2 text-[11px] text-neutral-400 border-t border-white/5">
        <span>PhotoStudio Staff Portal</span>
        <span className="text-[#E28E9E]">Nội bộ Studio</span>
      </footer>
    </div>
  );
}
