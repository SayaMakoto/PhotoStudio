import React from 'react';
import { Star, MessageSquareQuote, CheckCircle2, UserCheck, Calendar } from 'lucide-react';
import { CUSTOMER_REVIEWS, EMPLOYEE_PROFILE } from '../employeeData';

export default function CustomerReviewsSection() {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Star className="h-4.5 w-4.5 text-amber-400 fill-amber-400" />
            <span>Đánh Giá & Phản Hồi Từ Khách Hàng</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Điểm số chất lượng và nhận xét thực tế sau các buổi chụp hoàn thành của bạn.
          </p>
        </div>

        <div className="flex items-center gap-2.5 bg-neutral-950 px-3.5 py-1.5 rounded-xl border border-neutral-800 shrink-0">
          <span className="text-amber-400 font-extrabold text-sm">★ {EMPLOYEE_PROFILE.avgRating} / 5.0</span>
          <span className="text-neutral-500 text-xs">({EMPLOYEE_PROFILE.totalShoots} buổi chụp)</span>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CUSTOMER_REVIEWS.map((rev) => (
          <div
            key={rev.id}
            className="rounded-xl border border-neutral-800/90 bg-neutral-950/70 p-4 space-y-3 flex flex-col justify-between hover:border-neutral-700 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{rev.customerName}</span>
                <span className="text-[11px] font-mono text-neutral-500">{rev.date}</span>
              </div>

              <div className="flex items-center gap-1 my-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.floor(rev.rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-neutral-700'
                    }`}
                  />
                ))}
                <span className="text-xs font-bold text-amber-400 ml-1">{rev.rating}</span>
                <span className="ml-auto text-[10px] bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-neutral-400 font-medium">
                  {rev.tag}
                </span>
              </div>

              <p className="text-xs text-neutral-300 italic leading-relaxed">
                "{rev.comment}"
              </p>
            </div>

            {rev.reply && (
              <div className="mt-3 pt-3 border-t border-neutral-800/80 bg-neutral-900/40 p-2.5 rounded-lg text-[11px] text-neutral-400">
                <span className="font-semibold text-amber-400/90">Phản hồi của bạn: </span>
                {rev.reply}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
