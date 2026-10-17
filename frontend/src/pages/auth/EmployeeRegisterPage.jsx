import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Camera,
  Palette,
  Sparkles,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Check,
  Tag,
  Layers
} from 'lucide-react';
import { ROUTES } from '../../routes/web';

export default function EmployeeRegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    phone: '',
    position: 'photographer',
    staffCode: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
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

  const handleFillDemoStaffCode = () => {
    setFormData((prev) => ({
      ...prev,
      staffCode: 'CREW-2026',
    }));
  };

  const handleSubmit = (e) => {
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
      setErrorMessage('Vui lòng nhập số điện thoại.');
      return;
    }
    if (!formData.staffCode.trim()) {
      setErrorMessage('Vui lòng cung cấp mã giới thiệu / mã tuyển dụng nhân sự.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage('Mật khẩu cần tối thiểu 6 ký tự.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (!formData.agreeTerms) {
      setErrorMessage('Vui lòng đồng ý với nội quy làm việc của PhotoStudio.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Đăng ký hồ sơ nhân sự thành công! Đang chuyển đến màn hình check-in ca...');
      setTimeout(() => {
        navigate(ROUTES.AUTH.EMPLOYEE_LOGIN);
      }, 1200);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-white selection:bg-amber-400 selection:text-neutral-950 font-sans p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      {/* Top Header Bar */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2 border-b border-white/10 pb-4">
        <Link to={ROUTES.USER.HOME} className="flex items-center gap-2 group text-xs text-neutral-400 hover:text-amber-400 transition-colors">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Trang Chủ Khách Hàng</span>
        </Link>

        <Link
          to={ROUTES.AUTH.EMPLOYEE_LOGIN}
          className="text-xs text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-colors"
        >
          ← Trở lại Đăng Nhập Ca Làm
        </Link>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-4xl mx-auto my-auto py-6">
        <div className="rounded-3xl bg-neutral-950/90 border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-2">
              <span>STAFF ONBOARDING</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Đăng Ký Hồ Sơ Nhân Sự Ekip Studio
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-md mx-auto">
              Thiết lập tài khoản tác nghiệp dành cho Nhiếp ảnh gia, Chuyên viên makeup và Kỹ thuật viên
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
            {/* Position Picker Badges */}
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-2 uppercase tracking-wider">
                Vị trí chuyên môn tác nghiệp:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, position: 'photographer' })}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    formData.position === 'photographer'
                      ? 'bg-amber-500/15 border-amber-400 text-white shadow-md'
                      : 'bg-neutral-900/60 border-white/5 text-neutral-400 hover:border-white/20'
                  }`}
                >
                  <Camera className="w-5 h-5 text-amber-400 mb-1" />
                  <span className="text-xs font-bold block">Nhiếp Ảnh Gia</span>
                  <span className="text-[10px] text-neutral-400">Photographer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, position: 'makeup' })}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    formData.position === 'makeup'
                      ? 'bg-pink-500/15 border-pink-400 text-white shadow-md'
                      : 'bg-neutral-900/60 border-white/5 text-neutral-400 hover:border-white/20'
                  }`}
                >
                  <Palette className="w-5 h-5 text-pink-400 mb-1" />
                  <span className="text-xs font-bold block">Chuyên Viên Makeup</span>
                  <span className="text-[10px] text-neutral-400">Makeup Artist</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, position: 'logistics' })}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    formData.position === 'logistics'
                      ? 'bg-sky-500/15 border-sky-400 text-white shadow-md'
                      : 'bg-neutral-900/60 border-white/5 text-neutral-400 hover:border-white/20'
                  }`}
                >
                  <Layers className="w-5 h-5 text-sky-400 mb-1" />
                  <span className="text-xs font-bold block">Hậu Kỳ & Hậu Cần</span>
                  <span className="text-[10px] text-neutral-400">Logistics & Tech</span>
                </button>
              </div>
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Họ và tên nhân sự
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
                    className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
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
                    placeholder="crew_name"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Email liên hệ
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
                    placeholder="crew@photostudio.vn"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
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
                    placeholder="0912 345 678"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Staff Invite Code */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-neutral-300">
                  Mã tuyển dụng / Mã nội bộ Studio
                </label>
                <button
                  type="button"
                  onClick={handleFillDemoStaffCode}
                  className="text-xs text-amber-400 hover:text-amber-300 underline cursor-pointer"
                >
                  Điền mã Demo
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Tag className="w-4 h-4 text-amber-400" />
                </div>
                <input
                  type="text"
                  name="staffCode"
                  value={formData.staffCode}
                  onChange={handleChange}
                  placeholder="CREW-2026"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-amber-300 font-mono focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  required
                />
              </div>
            </div>

            {/* Row 4: Password */}
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
                    className="w-full pl-10 pr-10 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
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
                    className="w-full pl-10 pr-10 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
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

            {/* Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 rounded border-neutral-700 bg-neutral-900 text-amber-400 focus:ring-amber-400 accent-amber-400 cursor-pointer"
                  required
                />
                <span className="text-xs text-neutral-300 leading-relaxed">
                  Tôi cam kết giữ gìn trang thiết bị máy ảnh, đèn chiếu và tuân thủ phân công ca chụp của Studio.
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Briefcase className="w-4 h-4 stroke-[2.4]" />
                  <span>NỘP HỒ SƠ TÁC NGHIỆP NHÂN SỰ</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="pt-5 mt-6 border-t border-white/10 text-center text-xs text-neutral-400">
            Đã có tài khoản nhân sự?{' '}
            <Link
              to={ROUTES.AUTH.EMPLOYEE_LOGIN}
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4"
            >
              Đăng nhập ca làm
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto flex items-center justify-between py-2 text-[11px] text-neutral-400 border-t border-white/10 pt-3">
        <span>PhotoStudio Crew Dispatch System • Phiên bản 2026.1</span>
        <Link to={ROUTES.AUTH.LOGIN} className="hover:text-amber-400 transition-colors">
          Cổng Khách Hàng
        </Link>
      </footer>
    </div>
  );
}
