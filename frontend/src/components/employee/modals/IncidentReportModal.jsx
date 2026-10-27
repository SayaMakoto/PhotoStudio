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
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="text-base font-bold text-white">Báo Cáo Sự Cố & Hư Hỏng Thiết Bị</h3>
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
            <h4 className="text-base font-bold text-white">Đã Gửi Báo Cáo Sự Cố</h4>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
              Thông tin đã được chuyển đến Ban Quản Trị và Bộ phận Kỹ thuật để hỗ trợ ngay lập tức.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
            {booking && (
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300">
                Ca chụp liên quan: <strong className="text-white">{booking.id}</strong> ({booking.customerName})
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
                <option value="other">Bối cảnh studio / Đạo cụ khác</option>
              </select>
            </div>

            <div>
              <label className="text-neutral-400 mb-1 block font-medium">Mức độ nghiêm trọng</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'low', label: 'Nhẹ (Vẫn dùng được)', color: 'text-amber-300' },
                  { key: 'medium', label: 'Vừa (Cần sửa sớm)', color: 'text-orange-400' },
                  { key: 'high', label: 'Khẩn cấp (Hỏng hẳn)', color: 'text-rose-400' },
                ].map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setSeverity(s.key)}
                    className={`py-2 px-1 text-center rounded-xl border transition-all text-[11px] font-semibold ${
                      severity === s.key
                        ? 'border-rose-500 bg-rose-500/20 text-white'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
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
                placeholder="VD: Lens bị kẹt vòng lấy nét, đèn chớp tắt liên tục hoặc va đập nứt vỏ..."
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-white placeholder-neutral-500 focus:border-rose-400 focus:outline-none"
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
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold transition-colors shadow-sm"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Gửi Báo Cáo</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
