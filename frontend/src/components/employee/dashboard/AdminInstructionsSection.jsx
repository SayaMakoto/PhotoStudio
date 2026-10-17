import React, { useState } from 'react';
import { Bell, CheckCheck, AlertCircle, Info, Sparkles, Send } from 'lucide-react';
import { ADMIN_NOTIFICATIONS } from '../employeeData';

export default function AdminInstructionsSection() {
  const [notifications, setNotifications] = useState(ADMIN_NOTIFICATIONS);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bell className="h-4.5 w-4.5 text-amber-400" />
            <span>Thông Báo & Chỉ Đạo Từ Ban Quản Trị Studio</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Nhận phân công ca chụp mới, yêu cầu chỉnh sửa hậu kỳ và thông báo toàn studio.
          </p>
        </div>

        <button
          onClick={markAllAsRead}
          className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white transition-colors"
        >
          <CheckCheck className="h-3.5 w-3.5 text-amber-400" />
          <span>Đánh dấu đã đọc tất cả</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleRead(item.id)}
            className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
              item.unread
                ? 'bg-amber-500/10 border-amber-500/30 text-white'
                : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-400'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${item.unread ? 'bg-amber-400 animate-ping' : 'bg-transparent'}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide">
                      {item.sender}
                    </span>
                    <span className="text-neutral-600">•</span>
                    <span className="text-[11px] text-neutral-500">{item.time}</span>
                  </div>
                  <h4 className={`text-xs font-bold mt-1 ${item.unread ? 'text-white' : 'text-neutral-300'}`}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </div>

              <span className={`text-[10px] px-2 py-0.5 rounded font-medium shrink-0 ${
                item.unread ? 'bg-amber-400 text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-400'
              }`}>
                {item.unread ? 'Chưa đọc' : 'Đã xem'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
