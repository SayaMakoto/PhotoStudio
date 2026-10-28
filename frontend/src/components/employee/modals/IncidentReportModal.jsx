import React, { useState } from 'react';
import { AlertTriangle, Send, CheckCircle2, X } from 'lucide-react';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-[#F0E4E6] bg-white p-6 sm:p-7 shadow-[0_20px_60px_rgb(184,80,100,0.15)] text-[#261A1E]">
        <div className="flex items-center justify-between pb-4 border-b border-[#F0E4E6]">
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="text-base font-bold text-[#261A1E]">Báo Cáo Sự Cố & Hư Hỏng Thiết Bị</h3>
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
            <h4 className="text-base font-bold text-[#261A1E]">Đã Gửi Báo Cáo Sự Cố</h4>
            <p className="text-xs text-[#7A6C71] max-w-xs mx-auto">
              Thông tin đã được chuyển đến Ban Quản Trị và Bộ phận Kỹ thuật để hỗ trợ ngay lập tức.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
            {booking && (
              <div className="p-3 rounded-2xl bg-[#FDF0F3] border border-[#F5D5DC] text-[11px] text-[#261A1E]">
                Ca chụp liên quan: <strong className="text-[#B85064]">{booking.id}</strong> ({booking.customerName})
              </div>
            )}

            <div>
              <label className="text-[#7A6C71] mb-1.5 block font-semibold">Thiết bị hoặc đạo cụ gặp sự cố</label>
              <select
                value={selectedEq}
                onChange={(e) => setSelectedEq(e.target.value)}
                className="w-full rounded-2xl border border-[#F0E4E6] bg-[#FAF5F5] px-3.5 py-2 text-[#261A1E] font-medium focus:border-[#B85064] focus:outline-none cursor-pointer"
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
              <label className="text-[#7A6C71] mb-1.5 block font-semibold">Mức độ nghiêm trọng</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'low', label: 'Nhẹ (Vẫn dùng được)' },
                  { key: 'medium', label: 'Vừa (Cần sửa sớm)' },
                  { key: 'high', label: 'Khẩn cấp (Hỏng hẳn)' },
                ].map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setSeverity(s.key)}
                    className={`py-2 px-1 text-center rounded-xl border transition-all text-[11px] font-bold ${
                      severity === s.key
                        ? 'border-rose-300 bg-rose-50 text-rose-700 shadow-sm'
                        : 'border-[#F0E4E6] bg-[#FAF5F5] text-[#7A6C71] hover:text-[#261A1E]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[#7A6C71] mb-1.5 block font-semibold">Mô tả hiện tượng hư hỏng</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="VD: Lens bị kẹt vòng lấy nét, đèn chớp tắt liên tục hoặc va đập nứt vỏ..."
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
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all shadow-sm"
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
