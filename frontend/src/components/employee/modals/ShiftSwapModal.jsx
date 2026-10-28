import { useState } from 'react';
import { Send, CheckCircle2, X, RefreshCw } from 'lucide-react';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-[#F0E4E6] bg-white p-6 sm:p-7 shadow-[0_20px_60px_rgb(184,80,100,0.15)] text-[#261A1E]">
        <div className="flex items-center justify-between pb-4 border-b border-[#F0E4E6]">
          <div className="flex items-center gap-2 text-[#B85064]">
            <RefreshCw className="h-5 w-5" />
            <h3 className="text-base font-bold text-[#261A1E]">Đề Xuất Đổi Ca Trực / Báo Bận</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-[#7A6C71] hover:bg-[#FAF5F5] hover:text-[#261A1E] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-[#261A1E]">Đã Gửi Đề Xuất Thành Công</h4>
            <p className="text-xs text-[#7A6C71] max-w-xs mx-auto">
              Yêu cầu của bạn đã được chuyển đến Ban Quản Trị Studio. Bạn sẽ nhận được thông báo khi được duyệt.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
            {/* Request Type Toggle */}
            <div>
              <label className="text-[#7A6C71] mb-1.5 block font-semibold">Hình thức đề xuất</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRequestType('swap')}
                  className={`py-2 px-3 rounded-2xl border text-center font-bold transition-all ${
                    requestType === 'swap'
                      ? 'border-[#F5D5DC] bg-[#FDF0F3] text-[#B85064] shadow-sm'
                      : 'border-[#F0E4E6] bg-[#FAF5F5] text-[#7A6C71] hover:text-[#261A1E]'
                  }`}
                >
                  Đổi ca với đồng nghiệp
                </button>
                <button
                  type="button"
                  onClick={() => setRequestType('leave')}
                  className={`py-2 px-3 rounded-2xl border text-center font-bold transition-all ${
                    requestType === 'leave'
                      ? 'border-[#F5D5DC] bg-[#FDF0F3] text-[#B85064] shadow-sm'
                      : 'border-[#F0E4E6] bg-[#FAF5F5] text-[#7A6C71] hover:text-[#261A1E]'
                  }`}
                >
                  Xin nghỉ phép / Báo bận
                </button>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#7A6C71] mb-1 block font-semibold">Ngày ca trực</label>
                <input
                  type="date"
                  value={shiftDate}
                  onChange={(e) => setShiftDate(e.target.value)}
                  className="w-full rounded-2xl border border-[#F0E4E6] bg-[#FAF5F5] px-3 py-2 text-[#261A1E] font-medium focus:border-[#B85064] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#7A6C71] mb-1 block font-semibold">Khung giờ ca</label>
                <input
                  type="text"
                  value={shiftTime}
                  onChange={(e) => setShiftTime(e.target.value)}
                  placeholder="14:00 - 20:00"
                  className="w-full rounded-2xl border border-[#F0E4E6] bg-[#FAF5F5] px-3 py-2 text-[#261A1E] font-medium focus:border-[#B85064] focus:outline-none"
                />
              </div>
            </div>

            {requestType === 'swap' && (
              <div>
                <label className="text-[#7A6C71] mb-1 block font-semibold">Đồng nghiệp muốn đổi ca</label>
                <select
                  value={targetStaff}
                  onChange={(e) => setTargetStaff(e.target.value)}
                  className="w-full rounded-2xl border border-[#F0E4E6] bg-[#FAF5F5] px-3.5 py-2 text-[#261A1E] font-medium focus:border-[#B85064] focus:outline-none cursor-pointer"
                >
                  <option value="Lê Tuấn (Lighting & Photo)">Lê Tuấn (Lighting & Photo)</option>
                  <option value="Ngọc Mai (Makeup Artist)">Ngọc Mai (Makeup Artist)</option>
                  <option value="Khánh Linh (Makeup Artist)">Khánh Linh (Makeup Artist)</option>
                </select>
              </div>
            )}

            <div>
              <label className="text-[#7A6C71] mb-1 block font-semibold">Lý do xin đổi / nghỉ</label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do chi tiết..."
                className="w-full rounded-2xl border border-[#F0E4E6] bg-[#FAF5F5] p-3 text-[#261A1E] placeholder-[#9E8E93] focus:border-[#B85064] focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2.5 border-t border-[#F0E4E6]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-[#F0E4E6] bg-[#FAF5F5] text-[#7A6C71] hover:text-[#261A1E] font-semibold transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#B85064] hover:bg-[#913B4D] text-white font-bold transition-all shadow-sm"
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
