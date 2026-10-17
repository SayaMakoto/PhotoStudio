import React, { useState } from 'react';
import { User, Mail, Phone, Shield, Camera, Lock, CheckCircle2, Save } from 'lucide-react';
import { EMPLOYEE_PROFILE } from '../employeeData';

export default function EmployeeProfileSection() {
  const [profile, setProfile] = useState(EMPLOYEE_PROFILE);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-neutral-800">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <User className="h-4.5 w-4.5 text-amber-400" />
          <span>Hồ Sơ Cá Nhân & Trạng Thái Nhân Viên</span>
        </h3>
        <p className="text-xs text-neutral-400 mt-0.5">
          Cập nhật thông tin liên hệ, avatar, đổi mật khẩu và quản lý cấp bậc chuyên môn.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Badge */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-6 flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-28 w-28 rounded-full object-cover border-4 border-amber-400/80 shadow-xl shadow-amber-500/10"
            />
            <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-neutral-950" />
          </div>

          <div>
            <h4 className="text-base font-bold text-white">{profile.name}</h4>
            <p className="text-xs text-amber-300 font-semibold mt-0.5">{profile.role}</p>
            <p className="text-[11px] text-neutral-500">{profile.department}</p>
          </div>

          <div className="w-full pt-4 border-t border-neutral-800/80 space-y-2 text-xs text-left">
            <div className="flex justify-between">
              <span className="text-neutral-500">Mã nhân viên:</span>
              <span className="font-mono font-bold text-white">{profile.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Cấp bậc:</span>
              <span className="text-amber-400 font-semibold">{profile.level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Ngày gia nhập:</span>
              <span className="text-neutral-300">{profile.joinedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Trạng thái:</span>
              <span className="text-emerald-400 font-semibold">{profile.status}</span>
            </div>
          </div>
        </div>

        {/* Right Columns: Edit Info & Password */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveProfile} className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Thông Tin Liên Hệ Cơ Bản
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-neutral-400 mb-1 block">Họ và tên</label>
                <input
                  type="text"
                  value={profile.name}
                  disabled
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-3.5 py-2 text-neutral-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-neutral-400 mb-1 block">Số điện thoại</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-neutral-400 mb-1 block">Email nội bộ</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Đã cập nhật thành công!
                </span>
              ) : <span />}

              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold px-4 py-2 text-xs transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Lưu thông tin</span>
              </button>
            </div>
          </form>

          {/* Change Password */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              <span>Đổi Mật Khẩu Đăng Nhập</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-neutral-400 mb-1 block">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-neutral-400 mb-1 block">Mật khẩu mới</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert('Chức năng mô phỏng: Đổi mật khẩu thành công!')}
              className="rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 px-4 py-2 text-xs font-semibold transition-colors"
            >
              Cập nhật mật khẩu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
