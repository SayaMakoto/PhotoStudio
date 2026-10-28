import React from 'react';
import { Star, MessageSquare } from 'lucide-react';

export default function CustomerReviewsSection({ reviews = [] }) {
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) /
          totalReviews
        ).toFixed(1)
      : '5.0';

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="rounded-3xl border border-[#F0E4E6] bg-white p-6 shadow-[0_4px_20px_rgb(184,80,100,0.04)] space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#F0E4E6]">
        <div>
          <h3 className="text-base font-bold text-[#261A1E] flex items-center gap-2">
            <Star className="h-4.5 w-4.5 text-[#B85064] fill-[#B85064]" />
            <span>Đánh Giá & Phản Hồi Từ Khách Hàng ({totalReviews})</span>
          </h3>
          <p className="text-xs text-[#7A6C71] mt-0.5">
            Dữ liệu đánh giá và nhận xét tay nghề thực tế từ khách hàng trong CSDL.
          </p>
        </div>

        <div className="flex items-center gap-2.5 bg-[#FAF5F5] px-3.5 py-1.5 rounded-2xl border border-[#F0E4E6] shrink-0">
          <span className="text-[#B85064] font-extrabold text-sm">★ {avgRating} / 5.0</span>
          <span className="text-[#9E8E93] text-xs">({totalReviews} lượt đánh giá)</span>
        </div>
      </div>

      {/* Reviews Grid / Empty State */}
      {reviews.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#9E8E93] bg-[#FAF5F5] rounded-2xl border border-[#F0E4E6] flex flex-col items-center justify-center gap-2">
          <MessageSquare className="h-8 w-8 text-[#D4C5C8]" />
          <p>Hiện tại chưa có đánh giá nào từ khách hàng cho nhân viên này trong CSDL.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-2xl border border-[#F0E4E6] bg-[#FAF5F5]/70 p-5 space-y-3 flex flex-col justify-between hover:bg-white hover:border-[#F5D5DC] hover:shadow-[0_4px_20px_rgb(184,80,100,0.06)] transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#261A1E]">
                    {rev.customerName || (rev.reviewId ? `Khách hàng (Đơn #${rev.reviewId})` : `Khách hàng #${rev.id}`)}
                  </span>
                  <span className="text-[11px] font-mono text-[#9E8E93]">
                    {rev.createdAt ? formatDate(rev.createdAt) : `#REV-${rev.id}`}
                  </span>
                </div>

                <div className="flex items-center gap-1 my-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.floor(Number(rev.rating) || 0)
                          ? 'text-[#B85064] fill-[#B85064]'
                          : 'text-[#E8D5D8]'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-[#B85064] ml-1">
                    {Number(rev.rating || 0).toFixed(1)}
                  </span>
                  {(rev.bookingId || rev.reviewId) && (
                    <span className="ml-auto text-[10px] bg-white border border-[#F0E4E6] px-2 py-0.5 rounded-full text-[#7A6C71] font-semibold">
                      {rev.bookingId ? `Ca #${rev.bookingId}` : `Đơn #${rev.reviewId}`}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#7A6C71] italic leading-relaxed">
                  "{rev.comment || 'Không có nhận xét chi tiết'}"
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
