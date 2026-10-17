import React, { useState } from 'react';
import { AlertTriangle, Send, CheckCircle2, X, Wrench, Camera } from 'lucide-react';
import { EQUIPMENT_ITEMS } from '../employeeData';

export default function IncidentReportModal({ booking, onClose }) {
  const [selectedEq, setSelectedEq] = useState(EQUIPMENT_ITEMS[0]?.name || '');
  const [severity, setSeverity] = useState('medium');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl text-neutral-200">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="text-base font-bold text-white">Báo Cáo Sự Cố & Hư Hỏng Thiết Bị</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1 text-neutral-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">Đã Gửi Báo Cáo Sự Cố</h4>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
              Thông tin hư hỏng đã được chuyển trực tiếp đến Ban Quản Trị và Bộ phận Kỹ thuật để xử lý khẩn cấp.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
            {booking && (
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300">
                Ca chụp liên quan: <strong>{booking.id}</strong> ({booking.customerName})
              </div>
            )}

            <div>
              <label className="text-neutral-400 mb-1 block font-medium">Thiết bị hoặc đạo cụ gặp sự cố</label>
              <select
                value={selectedEq}
                onChange={(e) => setSelectedEq(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-white focus:border-rose-400 focus:outline-none cursor-pointer"
              >
                {EQUIPMENT_ITEMS.map((eq) => (
                  <option key={eq.id} value={eq.name}>
                    {eq.name} ({eq.code})
                  </option>
                ))}
                <option value="khac">Khác (Bối cảnh / Đạo cụ / Phòng chụp)</option>
              </select>
            </div>

            <div>
              <label className="text-neutral-400 mb-1 block font-medium">Mức độ khẩn cấp</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'low', label: 'Nhẹ (Vẫn dùng được)' },
                  { id: 'medium', label: 'Vừa (Cần bảo dưỡng)' },
                  { id: 'high', label: 'Nghiêm trọng (Hỏng hẳn)' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSeverity(s.id)}
                    className={`p-2 rounded-xl border text-center font-semibold transition-all ${
                      severity === s.id
                        ? 'border-rose-500 bg-rose-500/20 text-rose-300'
                        : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-neutral-400 mb-1 block font-medium">Mô tả hiện tượng hư hỏng</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ví dụ: Đèn Godox chập chờn nguồn, rơi vỡ chân ngàm, lens kẹt vòng lấy nét..."
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-white focus:border-rose-400 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-neutral-400 hover:text-white"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold px-4 py-2 transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Gửi Báo Cáo Ngay</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
