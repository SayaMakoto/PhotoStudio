import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  Terminal,
  Fingerprint
} from 'lucide-react';
import { ROUTES } from '../../routes/web';

export default function AdminRegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    phone: '',
    masterKey: '',
    password: '',
    confirmPassword: '',
    agreeSecurityPolicy: false,
  });
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
    if (errorMessage) setErrorMessage('');
  };

  const handleFillDemoMasterKey = () => {
    setFormData((prev) => ({
      ...prev,
      masterKey: 'ADMIN-SUPER-2026',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullname.trim()) {
      setErrorMessage('Yêu cầu nhập họ tên Quản trị viên.');
      return;
    }
    if (!formData.username.trim()) {
      setErrorMessage('Yêu cầu chọn tài khoản Root username.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Yêu cầu nhập Email công vụ hợp lệ.');
      return;
    }
    if (!formData.masterKey.trim()) {
      setErrorMessage('Cần cung cấp Master Clearance Key do Ban Giám Đốc cấp.');
      return;
    }
    if (formData.password.length < 8) {
      setErrorMessage('Mật khẩu quản trị yêu cầu tối thiểu 8 ký tự.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (!formData.agreeSecurityPolicy) {
      setErrorMessage('Bạn phải xác nhận cam kết tuân thủ chính sách an ninh dữ liệu.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Hồ sơ Quản trị đã được ghi nhận vào hệ thống. Đang chuyển đến màn hình xác thực...');
      setTimeout(() => {
        navigate(ROUTES.AUTH.ADMIN_LOGIN);
      }, 1200);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white selection:bg-amber-400 selection:text-neutral-950 font-sans relative flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
      {/* Background Matrix/Security Grid & Glows */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[300px] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />
      
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

        <Link
          to={ROUTES.AUTH.ADMIN_LOGIN}
          className="text-xs text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-colors font-mono"
        >
          ← Trở lại Đăng Nhập Admin
        </Link>
      </header>

      {/* Centerpiece: Obsidian Security Vault Box */}
      <main className="relative z-10 w-full max-w-xl mx-auto my-auto py-6">
        <div className="relative rounded-3xl bg-neutral-950/90 border border-amber-500/30 p-7 sm:p-9 shadow-2xl shadow-black/95 backdrop-blur-3xl overflow-hidden">
          
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-900 border border-amber-500/40 shadow-lg shadow-amber-500/15 mb-3">
              <KeyRound className="w-6 h-6 text-amber-400" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono tracking-wider mb-2">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>ADMINISTRATIVE ONBOARDING PROTOCOL</span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">
              Khởi Tạo Quản Trị Viên Cấp Cao
            </h1>
            <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
              Yêu cầu cung cấp Master Security Key được ủy quyền bởi Ban Điều Hành PhotoStudio.
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
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Họ và tên Quản trị viên
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                    <User className="w-3.5 h-3.5 text-amber-400/70" />
                  </div>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="Nguyễn Quản Trị"
                    className="w-full pl-9 pr-3 py-2 bg-neutral-900/90 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Root Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                    <span className="text-[11px] text-amber-400/70 font-mono">@</span>
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="admin_lead"
                    className="w-full pl-8 pr-3 py-2 bg-neutral-900/90 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors font-mono"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Email công vụ
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                    <Mail className="w-3.5 h-3.5 text-amber-400/70" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="lead@photostudio.vn"
                    className="w-full pl-9 pr-3 py-2 bg-neutral-900/90 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Số điện thoại
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                    <Phone className="w-3.5 h-3.5 text-amber-400/70" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0901234567"
                    className="w-full pl-9 pr-3 py-2 bg-neutral-900/90 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Master Key Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-neutral-300">
                  Mã phê duyệt Master Key (Bắt buộc)
                </label>
                <button
                  type="button"
                  onClick={handleFillDemoMasterKey}
                  className="text-[10px] text-amber-400 hover:text-amber-300 underline font-mono cursor-pointer"
                >
                  Nhập mã Demo
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                  <Fingerprint className="w-4 h-4 text-amber-400" />
                </div>
                <input
                  type="text"
                  name="masterKey"
                  value={formData.masterKey}
                  onChange={handleChange}
                  placeholder="ADMIN-SUPER-2026"
                  className="w-full pl-9 pr-3 py-2 bg-neutral-900/90 border border-amber-500/30 rounded-xl text-xs text-amber-300 placeholder-neutral-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors font-mono tracking-wider"
                  required
                />
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Mật khẩu Root
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                    <Lock className="w-3.5 h-3.5 text-amber-400/70" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Tối thiểu 8 ký tự"
                    className="w-full pl-9 pr-9 py-2 bg-neutral-900/90 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                    <Lock className="w-3.5 h-3.5 text-amber-400/70" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full pl-9 pr-9 py-2 bg-neutral-900/90 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="agreeSecurityPolicy"
                  checked={formData.agreeSecurityPolicy}
                  onChange={handleChange}
                  className="w-3.5 h-3.5 mt-0.5 rounded border-neutral-700 bg-neutral-900 text-amber-400 focus:ring-amber-400 accent-amber-400"
                  required
                />
                <span className="text-[11px] text-neutral-400 leading-snug">
                  Tôi cam kết tuân thủ quy chế an toàn dữ liệu và chịu trách nhiệm pháp lý đối với tài khoản Root Admin.
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 font-mono tracking-wider"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>XÁC NHẬN CẤP QUYỀN QUẢN TRỊ</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-neutral-800 text-center text-xs text-neutral-400">
            Đã có tài khoản Quản trị?{' '}
            <Link
              to={ROUTES.AUTH.ADMIN_LOGIN}
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4"
            >
              Đăng nhập Console
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between py-2 text-[11px] text-neutral-400 font-mono border-t border-white/5">
        <span>PhotoStudio Administrative Gateway v2.4</span>
        <span className="text-amber-400/80">Security Level: Strict</span>
      </footer>
    </div>
  );
}
