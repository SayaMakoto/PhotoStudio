import { useState } from 'react';
import { User, Mail, Phone, ShieldCheck, Lock, CheckCircle2, Save, MapPin, AlertCircle } from 'lucide-react';
import employeeAuthService from '../../../services/employee/authService';

export default function EmployeeProfileSection({ profile: initialProfile, onProfileUpdated }) {
  const [profile, setProfile] = useState(initialProfile || {});
  const [fullname, setFullname] = useState(initialProfile?.fullname || '');
  const [phone, setPhone] = useState(initialProfile?.phone || '');
  const [email, setEmail] = useState(initialProfile?.email || '');
  const [address, setAddress] = useState(initialProfile?.address || '');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync state when initialProfile changes from parent during render
  const [prevProfile, setPrevProfile] = useState(initialProfile);
  if (initialProfile !== prevProfile) {
    setPrevProfile(initialProfile);
    setProfile(initialProfile || {});
    setFullname(initialProfile?.fullname || '');
    setPhone(initialProfile?.phone || '');
    setEmail(initialProfile?.email || '');
    setAddress(initialProfile?.address || '');
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPass && newPass.length < 6) {
      setErrorMsg('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }

    if (newPass && newPass !== confirmPass) {
      setErrorMsg('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsSaving(true);

    try {
      const updateData = {
        fullname: fullname.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
      };

      if (newPass) {
        updateData.password = newPass;
      }

      const updated = await employeeAuthService.updateProfile(updateData);
      const merged = { ...profile, ...updated };
      setProfile(merged);
      employeeAuthService.setUser(merged);
      if (onProfileUpdated) onProfileUpdated(merged);

      setSavedSuccess(true);
      setNewPass('');
      setConfirmPass('');
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          'Không thể cập nhật hồ sơ. Vui lòng kiểm tra lại thông tin.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = profile.fullname || profile.username || 'Nhân viên';
  const displayRole = profile.role === 'Employee' ? 'Nhân viên tác nghiệp' : (profile.role || 'Nhân viên');
  const avatarUrl =
    profile.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

  return (
    <div className="rounded-3xl border border-[#F0E4E6] bg-white p-6 shadow-[0_4px_20px_rgb(184,80,100,0.04)] space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#F0E4E6]">
        <h3 className="text-base font-bold text-[#261A1E] flex items-center gap-2">
          <User className="h-4.5 w-4.5 text-[#B85064]" />
          <span>Hồ Sơ Cá Nhân & Tài Khoản Tác Nghiệp</span>
        </h3>
        <p className="text-xs text-[#7A6C71] mt-0.5">
          Dữ liệu tài khoản thực tế từ hệ thống Studio, cập nhật thông tin liên hệ và mật khẩu bảo mật.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Account Metadata */}
        <div className="rounded-2xl border border-[#F0E4E6] bg-[#FAF5F5]/70 p-6 flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <img
              src={avatarUrl}
              alt={displayName}
              className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-[0_8px_20px_rgb(184,80,100,0.15)]"
            />
            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div>
            <h4 className="text-base font-bold text-[#261A1E] flex items-center justify-center gap-1.5">
              <span>{displayName}</span>
              <ShieldCheck className="h-4 w-4 text-[#B85064]" />
            </h4>
            <p className="text-xs text-[#B85064] font-semibold mt-0.5">{displayRole}</p>
            <p className="text-[11px] text-[#7A6C71]">Tài khoản: @{profile.username || 'staff'}</p>
          </div>

          <div className="w-full pt-4 border-t border-[#F0E4E6] space-y-2.5 text-xs text-left">
            <div className="flex justify-between">
              <span className="text-[#7A6C71]">Mã người dùng:</span>
              <span className="font-mono font-bold text-[#261A1E]">#{profile.id || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A6C71]">Vai trò hệ thống:</span>
              <span className="text-[#B85064] font-bold">{profile.role || 'Employee'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A6C71]">Trạng thái:</span>
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {profile.status === 'active' ? 'Đang hoạt động' : (profile.status || 'Active')}
              </span>
            </div>
            {profile.createdAt && (
              <div className="flex justify-between">
                <span className="text-[#7A6C71]">Ngày tạo:</span>
                <span className="text-[#261A1E] font-medium">{profile.createdAt.slice(0, 10)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Columns: Edit Form connected to real API */}
        <div className="lg:col-span-2 rounded-2xl border border-[#F0E4E6] bg-[#FAF5F5]/40 p-6 space-y-5">
          <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
            {savedSuccess && (
              <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold shadow-sm">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>Đã cập nhật dữ liệu tài khoản vào hệ thống thành công!</span>
              </div>
            )}

            {errorMsg && (
              <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 font-bold shadow-sm">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Section 1: Contact Details */}
            <div>
              <h4 className="text-xs font-bold text-[#7A6C71] uppercase tracking-wider mb-3.5">
                1. Thông Tin Cá Nhân & Liên Hệ
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#7A6C71] mb-1.5 block font-semibold">Họ và tên</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E8E93]" />
                    <input
                      type="text"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      placeholder="Nhập họ và tên"
                      className="w-full rounded-2xl border border-[#F0E4E6] bg-white py-2 pl-9 pr-3 text-[#261A1E] font-medium focus:border-[#B85064] focus:outline-none shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#7A6C71] mb-1.5 block font-semibold">Email công vụ</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E8E93]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@photostudio.vn"
                      className="w-full rounded-2xl border border-[#F0E4E6] bg-white py-2 pl-9 pr-3 text-[#261A1E] font-medium focus:border-[#B85064] focus:outline-none shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#7A6C71] mb-1.5 block font-semibold">Số điện thoại</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E8E93]" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912 345 678"
                      className="w-full rounded-2xl border border-[#F0E4E6] bg-white py-2 pl-9 pr-3 text-[#261A1E] font-medium focus:border-[#B85064] focus:outline-none shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#7A6C71] mb-1.5 block font-semibold">Địa chỉ</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E8E93]" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Hà Nội, Việt Nam"
                      className="w-full rounded-2xl border border-[#F0E4E6] bg-white py-2 pl-9 pr-3 text-[#261A1E] font-medium focus:border-[#B85064] focus:outline-none shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Security */}
            <div className="pt-4 border-t border-[#F0E4E6]">
              <h4 className="text-xs font-bold text-[#7A6C71] uppercase tracking-wider mb-3.5">
                2. Đổi Mật Khẩu (Để trống nếu không đổi)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#7A6C71] mb-1.5 block font-semibold">Mật khẩu mới</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E8E93]" />
                    <input
                      type="password"
                      placeholder="Tối thiểu 6 ký tự"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      className="w-full rounded-2xl border border-[#F0E4E6] bg-white py-2 pl-9 pr-3 text-[#261A1E] focus:border-[#B85064] focus:outline-none shadow-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[#7A6C71] mb-1.5 block font-semibold">Xác nhận mật khẩu mới</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E8E93]" />
                    <input
                      type="password"
                      placeholder="Nhập lại mật khẩu mới"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      className="w-full rounded-2xl border border-[#F0E4E6] bg-white py-2 pl-9 pr-3 text-[#261A1E] focus:border-[#B85064] focus:outline-none shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 rounded-2xl bg-[#B85064] hover:bg-[#913B4D] text-white font-bold px-6 py-2.5 text-xs transition-all shadow-md shadow-[#B85064]/20 disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Lưu Dữ Liệu Vào Hệ Thống</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
