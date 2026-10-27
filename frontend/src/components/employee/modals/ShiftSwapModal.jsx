import React, { useState } from 'react';
import { Calendar, Clock, Send, CheckCircle2, X, RefreshCw, UserCheck } from 'lucide-react';

export default function ShiftSwapModal({ onClose }) {
  const [requestType, setRequestType] = useState('swap'); // 'swap' | 'leave'
  const [shiftDate, setShiftDate] = useState('2026-10-10');
  const [shiftTime, setShiftTime] = useState('14:00 - 20:00');
  const [targetStaff, setTargetStaff] = useState('Lê Tuấn (Lighting & Photo)');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl shadow-black/80 text-neutral-200">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-amber-400">
            <RefreshCw className="h-5 w-5" />
            <h3 className="text-base font-bold text-white">Đề Xuất Đổi Ca Trực / Báo Bận</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Đã Gửi Đề Xuất Thành Công</h4>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
              Yêu cầu của bạn đã được chuyển đến Ban Quản Trị Studio. Bạn sẽ nhận được thông báo khi được duyệt.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
            {/* Request Type Toggle */}
            <div>
              <label className="text-neutral-400 mb-1.5 block font-medium">Hình thức đề xuất</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRequestType('swap')}
                  className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                    requestType === 'swap'
                      ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  🔄 Đổi ca với đồng nghiệp
                </button>
                <button
                  type="button"
                  onClick={() => setRequestType('leave')}
                  className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                    requestType === 'leave'
                      ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  🏖️ Xin nghỉ phép / Báo bận
                </button>
              </div>
            </div>

            {/* Date & Shift */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-neutral-400 mb-1 block font-medium">Ngày ca trực</label>
                <input
                  type="date"
                  value={shiftDate}
                  onChange={(e) => setShiftDate(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-neutral-400 mb-1 block font-medium">Khung giờ ca</label>
                <select
                  value={shiftTime}
                  onChange={(e) => setShiftTime(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="08:00 - 14:00">Ca sáng (08:00 - 14:00)</option>
                  <option value="14:00 - 20:00">Ca chiều (14:00 - 20:00)</option>
                  <option value="18:00 - 22:00">Ca tối VIP (18:00 - 22:00)</option>
                </select>
              </div>
            </div>

            {/* Target Colleague if swap */}
            {requestType === 'swap' && (
              <div>
                <label className="text-neutral-400 mb-1 block font-medium">
                  Đồng nghiệp dự kiến đổi ca cùng
                </label>
                <select
                  value={targetStaff}
                  onChange={(e) => setTargetStaff(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="Lê Tuấn (Lighting & Photo)">Lê Tuấn (Lighting & Photo)</option>
                  <option value="Nguyễn Hoàng Anh (Senior Photo)">Nguyễn Hoàng Anh (Senior Photo)</option>
                  <option value="Admin Tự Điều Phối">Để Quản Trị Viên tự sắp xếp người thay thế</option>
                </select>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="text-neutral-400 mb-1 block font-medium">Lý do đề xuất</label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="VD: Trùng lịch thi bảo vệ đồ án, việc gia đình đột xuất hoặc đã trao đổi trước với bạn Tuấn..."
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-neutral-800/80">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold transition-colors shadow-sm"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Gửi Đề Xuất</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
