import { Star } from 'lucide-react';
import { CUSTOMER_REVIEWS, EMPLOYEE_PROFILE } from '../employeeData';

export default function CustomerReviewsSection() {
  return (
    <div className="rounded-3xl border border-[#F0E4E6] bg-white p-6 shadow-[0_4px_20px_rgb(184,80,100,0.04)] space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#F0E4E6]">
        <div>
          <h3 className="text-base font-bold text-[#261A1E] flex items-center gap-2">
            <Star className="h-4.5 w-4.5 text-[#B85064] fill-[#B85064]" />
            <span>Đánh Giá & Phản Hồi Từ Khách Hàng</span>
          </h3>
          <p className="text-xs text-[#7A6C71] mt-0.5">
            Điểm số chất lượng và nhận xét thực tế sau các buổi chụp hoàn thành của bạn.
          </p>
        </div>

        <div className="flex items-center gap-2.5 bg-[#FAF5F5] px-3.5 py-1.5 rounded-2xl border border-[#F0E4E6] shrink-0">
          <span className="text-[#B85064] font-extrabold text-sm">★ {EMPLOYEE_PROFILE.avgRating} / 5.0</span>
          <span className="text-[#9E8E93] text-xs">({EMPLOYEE_PROFILE.totalShoots} buổi chụp)</span>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CUSTOMER_REVIEWS.map((rev) => (
          <div
            key={rev.id}
            className="rounded-2xl border border-[#F0E4E6] bg-[#FAF5F5]/70 p-5 space-y-3 flex flex-col justify-between hover:bg-white hover:border-[#F5D5DC] hover:shadow-[0_4px_20px_rgb(184,80,100,0.06)] transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#261A1E]">{rev.customerName}</span>
                <span className="text-[11px] font-mono text-[#9E8E93]">{rev.date}</span>
              </div>

              <div className="flex items-center gap-1 my-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.floor(rev.rating)
                        ? 'text-[#B85064] fill-[#B85064]'
                        : 'text-[#E8D5D8]'
                    }`}
                  />
                ))}
                <span className="text-xs font-bold text-[#B85064] ml-1">{rev.rating}</span>
                <span className="ml-auto text-[10px] bg-white border border-[#F0E4E6] px-2 py-0.5 rounded-full text-[#7A6C71] font-semibold">
                  {rev.tag}
                </span>
              </div>

              <p className="text-xs text-[#7A6C71] italic leading-relaxed">
                "{rev.comment}"
              </p>
            </div>

            {rev.reply && (
              <div className="mt-3 pt-3 border-t border-[#F0E4E6] bg-white p-3 rounded-xl text-[11px] text-[#7A6C71] border border-[#F0E4E6]">
                <span className="font-bold text-[#B85064]">Phản hồi của bạn: </span>
                {rev.reply}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
