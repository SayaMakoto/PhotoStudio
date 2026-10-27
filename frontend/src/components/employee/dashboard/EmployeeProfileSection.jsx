import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, ShieldCheck, Lock, CheckCircle2, Save, Calendar, MapPin, AlertCircle } from 'lucide-react';
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

  // Sync when initialProfile changes from parent
  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
      setFullname(initialProfile.fullname || '');
      setPhone(initialProfile.phone || '');
      setEmail(initialProfile.email || '');
      setAddress(initialProfile.address || '');
    }
  }, [initialProfile]);

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
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-neutral-800">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <User className="h-4.5 w-4.5 text-amber-400" />
          <span>Hồ Sơ Cá Nhân & Tài Khoản Tác Nghiệp</span>
        </h3>
        <p className="text-xs text-neutral-400 mt-0.5">
          Dữ liệu tài khoản thực tế từ hệ thống Studio, cập nhật thông tin liên hệ và mật khẩu bảo mật.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Account Metadata */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-6 flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <img
              src={avatarUrl}
              alt={displayName}
              className="h-24 w-24 rounded-full object-cover border-4 border-amber-400/80 shadow-lg shadow-amber-500/10"
            />
            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-neutral-950" />
          </div>

          <div>
            <h4 className="text-base font-bold text-white flex items-center justify-center gap-1.5">
              <span>{displayName}</span>
              <ShieldCheck className="h-4 w-4 text-amber-400" />
            </h4>
            <p className="text-xs text-amber-300 font-semibold mt-0.5">{displayRole}</p>
            <p className="text-[11px] text-neutral-400">Tài khoản: @{profile.username || 'staff'}</p>
          </div>

          <div className="w-full pt-4 border-t border-neutral-800/80 space-y-2.5 text-xs text-left">
            <div className="flex justify-between">
              <span className="text-neutral-500">Mã người dùng:</span>
              <span className="font-mono font-bold text-white">#{profile.id || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Vai trò hệ thống:</span>
              <span className="text-amber-400 font-semibold">{profile.role || 'Employee'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Trạng thái:</span>
              <span className="text-emerald-400 font-medium">
                {profile.status === 'active' ? 'Đang hoạt động' : (profile.status || 'Active')}
              </span>
            </div>
            {profile.createdAt && (
              <div className="flex justify-between">
                <span className="text-neutral-500">Ngày tạo tài khoản:</span>
                <span className="text-neutral-300">{profile.createdAt.slice(0, 10)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Columns: Edit Form connected to real API */}
        <div className="lg:col-span-2 rounded-xl border border-neutral-800 bg-neutral-950/70 p-6 space-y-5">
          <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
            {savedSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Đã cập nhật dữ liệu tài khoản vào hệ thống thành công!</span>
              </div>
            )}

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-medium">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Section 1: Contact Details */}
            <div>
              <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-3">
                1. Thông Tin Cá Nhân & Liên Hệ
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-neutral-400 mb-1 block">Họ và tên</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <input
                      type="text"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      placeholder="Nhập họ và tên"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-2 pl-9 pr-3 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-400 mb-1 block">Email công vụ</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@photostudio.vn"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-2 pl-9 pr-3 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-400 mb-1 block">Số điện thoại</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912 345 678"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-2 pl-9 pr-3 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-400 mb-1 block">Địa chỉ</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Hà Nội, Việt Nam"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-2 pl-9 pr-3 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Security */}
            <div className="pt-4 border-t border-neutral-800/80">
              <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-3">
                2. Đổi Mật Khẩu (Để trống nếu không đổi)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-neutral-400 mb-1 block">Mật khẩu mới</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <input
                      type="password"
                      placeholder="Tối thiểu 6 ký tự"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-2 pl-9 pr-3 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-neutral-400 mb-1 block">Xác nhận mật khẩu mới</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <input
                      type="password"
                      placeholder="Nhập lại mật khẩu mới"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-2 pl-9 pr-3 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold px-5 py-2 text-xs transition-colors shadow-sm disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="h-4 w-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
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
