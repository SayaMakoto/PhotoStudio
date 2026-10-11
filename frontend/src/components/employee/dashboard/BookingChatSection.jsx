import React, { useState } from 'react';
import { MessageSquare, Send, Paperclip, AlertTriangle, User, CheckCircle2 } from 'lucide-react';
import { BOOKING_MESSAGES } from '../employeeData';

export default function BookingChatSection({ selectedBooking }) {
  const defaultBookingId = selectedBooking?.id || 'BK-2026-1042';
  const [messages, setMessages] = useState(BOOKING_MESSAGES[defaultBookingId] || []);
  const [inputVal, setInputVal] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const newMsg = {
      sender: 'Trần Minh Đức',
      role: 'Photographer',
      text: isEmergency ? `[KHẨN CẤP] ${inputVal}` : inputVal,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      emergency: isEmergency,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');
    setIsEmergency(false);
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md space-y-4 flex flex-col h-[650px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800 shrink-0">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="h-4.5 w-4.5 text-amber-400" />
            <span>Kênh Trao Đổi Nội Bộ Theo Ca Chụp ({defaultBookingId})</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Trò chuyện với Admin, Makeup Artist, Kỹ thuật ánh sáng và báo sự cố khẩn cấp.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-emerald-400 font-medium">3 thành viên trực tuyến</span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-3 p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 scrollbar-thin scrollbar-thumb-neutral-800">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mb-1">
              <span className="font-semibold text-neutral-300">{msg.sender}</span>
              <span>•</span>
              <span className="text-amber-400/90">{msg.role}</span>
              <span>•</span>
              <span>{msg.time}</span>
            </div>

            <div
              className={`max-w-md rounded-2xl px-4 py-2.5 text-xs ${
                msg.isMe
                  ? msg.emergency
                    ? 'bg-rose-500 text-white font-bold'
                    : 'bg-amber-400 text-neutral-950 font-medium'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-200'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input box */}
      <form onSubmit={handleSend} className="space-y-2 shrink-0">
        <div className="flex items-center justify-between text-xs px-1">
          <label className="flex items-center gap-1.5 text-rose-400 cursor-pointer">
            <input
              type="checkbox"
              checked={isEmergency}
              onChange={(e) => setIsEmergency(e.target.checked)}
              className="accent-rose-500"
            />
            <AlertTriangle className="h-3.5 w-3.5" />
            <span className="font-semibold text-[11px]">Gửi cảnh báo sự cố khẩn cấp</span>
          </label>
          <span className="text-neutral-500 text-[11px]">Enter để gửi</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Nhập nội dung trao đổi hoặc báo tình trạng ca chụp..."
            className="flex-1 rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
          />
          <button
            type="submit"
            className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-colors flex items-center gap-1.5 ${
              isEmergency
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'bg-amber-400 hover:bg-amber-300 text-neutral-950'
            }`}
          >
            <Send className="h-4 w-4" />
            <span>Gửi</span>
          </button>
        </div>
      </form>
    </div>
  );
}
