import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  Terminal,
  Activity
} from 'lucide-react';
import { ROUTES } from '../../routes/web';

export default function AdminLoginPage() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.usernameOrEmail.trim()) {
      setErrorMessage('Yêu cầu nhập Email hoặc Tài khoản Quản trị.');
      return;
    }
    if (!formData.password) {
      setErrorMessage('Yêu cầu nhập mật khẩu bảo mật.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Xác thực danh tính Root Admin thành công. Đang kết nối Console...');
      setTimeout(() => {
        navigate(ROUTES.ADMIN.DASHBOARD);
      }, 900);
    }, 700);
  };

  const handleQuickAdminDemo = () => {
    setFormData({
      usernameOrEmail: 'admin@photostudio.vn',
      password: 'adminSecurePassword2026',
      rememberMe: true,
    });
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white selection:bg-amber-400 selection:text-neutral-950 font-sans relative flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
      {/* Background Matrix/Security Grid & Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[300px] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />
      
      {/* Precision grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #f59e0b 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Top Bar Navigation */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between py-2">
        <Link to={ROUTES.USER.HOME} className="flex items-center gap-2 group text-xs text-neutral-400 hover:text-amber-400 transition-colors">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Về Trang Chủ Studio</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.AUTH.LOGIN}
            className="text-xs text-neutral-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/5 bg-neutral-900/50 hover:bg-neutral-800 transition-colors"
          >
            Cổng Khách Hàng
          </Link>
          <Link
            to={ROUTES.AUTH.EMPLOYEE_LOGIN}
            className="text-xs text-amber-400/90 hover:text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-colors font-medium"
          >
            Cổng Nhân Viên →
          </Link>
        </div>
      </header>

      {/* Centerpiece: Obsidian Security Vault Box */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto py-6">
        <div className="relative rounded-3xl bg-neutral-950/90 border border-amber-500/30 p-7 sm:p-9 shadow-2xl shadow-black/95 backdrop-blur-3xl overflow-hidden">
          
          {/* Top Amber Laser Scan Line Indicator */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse" />

          {/* Security Badge Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-amber-500/40 shadow-lg shadow-amber-500/20 mb-3.5 relative group">
              <ShieldAlert className="w-7 h-7 text-amber-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-neutral-950 animate-ping" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-neutral-950" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono tracking-wider mb-2">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>PHOTOSTUDIO EXECUTIVE CONSOLE</span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">
              Cổng Quản Trị Hệ Thống
            </h1>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
              Khu vực bảo mật cấp cao. Xác thực danh tính để vào trang điều hành Studio.
            </p>
          </div>

          {/* Alert Messages */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 font-mono">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Admin Email or Username */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
                <span>Tài khoản Admin / Email công vụ</span>
                <span className="text-[10px] text-neutral-400 font-mono">ROOT AUTH</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Mail className="w-4 h-4 text-amber-400/70" />
                </div>
                <input
                  type="text"
                  name="usernameOrEmail"
                  value={formData.usernameOrEmail}
                  onChange={handleChange}
                  placeholder="admin@photostudio.vn"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-900/90 border border-neutral-800 rounded-xl text-sm text-amber-200 placeholder-neutral-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors font-mono"
                  required
                />
              </div>
            </div>

            {/* Admin Password */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
                <span>Mật khẩu quản trị</span>
                <span className="text-[10px] text-neutral-400 font-mono">ENCRYPTED</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Lock className="w-4 h-4 text-amber-400/70" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-2.5 bg-neutral-900/90 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors font-mono"
                  required
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

            {/* Session Stay checkbox */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-300">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-amber-400 focus:ring-amber-400 accent-amber-400 cursor-pointer"
                />
                <span>Duy trì phiên đăng nhập an toàn</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-neutral-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 font-mono tracking-wider"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>XÁC THỰC & MỞ CONSOLE QUẢN TRỊ</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Autofill Bar */}
          <div className="mt-5 p-2.5 rounded-xl bg-neutral-900/60 border border-white/5 flex items-center justify-between">
            <span className="text-[11px] text-neutral-400 font-mono flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              Test nhanh:
            </span>
            <button
              type="button"
              onClick={handleQuickAdminDemo}
              className="px-2.5 py-1 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-mono transition-colors cursor-pointer"
            >
              Điền tài khoản Admin
            </button>
          </div>

          {/* Footer note */}
          <div className="mt-5 pt-4 border-t border-neutral-800/80 text-center text-[11px] text-neutral-400">
            Tài khoản Quản trị viên được phân quyền và quản lý bởi Ban Điều Hành Studio.
          </div>
        </div>

        {/* Security Warning Notice */}
        <div className="mt-4 text-center">
          <p className="text-[10px] text-neutral-400 font-mono leading-relaxed">
            Hệ thống giám sát an ninh 24/7. Mọi nỗ lực truy cập trái phép đều được ghi nhận IP.
          </p>
        </div>
      </main>

      {/* Footer System Meta */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between py-2 text-[11px] text-neutral-400 font-mono border-t border-white/5">
        <span>PhotoStudio Administrative Gateway v2.4</span>
        <span className="text-emerald-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Server Status: Normal
        </span>
      </footer>
    </div>
  );
}
