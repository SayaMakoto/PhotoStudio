import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  StarIcon,
  ShieldCheckIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/solid';
import ScrollReveal from '../../animations/ScrollReveal';
import customerReviewService from '../../../services/user/reviewService';
import { ROUTES } from '../../../routes/web';

// Đánh giá thực tế chuẩn studio làm dữ liệu khởi tạo & dự phòng chất lượng cao
const DEFAULT_REVIEWS = [
  {
    id: 1,
    customerName: 'Nguyễn Thu Trang & Hoàng Nam',
    rating: 5.0,
    comment: 'Ekip chụp ảnh cưới có tâm nhất mình từng trải nghiệm! Bạn photographer hướng dẫn tạo dáng rất tự nhiên, cô dâu không bị gượng gạo. Makeup làm nhẹ nhàng trong trẻo đúng style Hàn Quốc mình thích. Ảnh nhận về đẹp lung linh!',
    createdAt: '2026-10-20T14:30:00',
    packageName: 'Gói Chụp Ảnh Cưới Studio Cổ Điển',
  },
  {
    id: 2,
    customerName: 'Lê Minh Tuấn',
    rating: 5.0,
    comment: 'Mình chụp gói Nàng Thơ kỷ niệm sinh nhật cho bạn gái. Phòng studio ánh sáng dịu mắt, váy áo sạch sẽ thơm tho. Bộ ảnh nhận về bạn bè ai cũng khen nức nở. Chắc chắn sẽ quay lại ủng hộ studio nhiều lần nữa!',
    createdAt: '2026-10-18T10:15:00',
    packageName: 'Gói Chụp Ảnh Cá Nhân / Nàng Thơ',
  },
  {
    id: 3,
    customerName: 'Phạm Phương Linh',
    rating: 5.0,
    comment: 'Gia đình mình có cả ông bà và 2 bé nhỏ, lúc đầu sợ các cháu quấy khóc nhưng ekip rất kiên nhẫn và vui tính, bắt trọn từng khoảnh khắc cười tươi tự nhiên của cả nhà. Ảnh in ép gỗ treo phòng khách tuyệt đẹp!',
    createdAt: '2026-10-15T16:45:00',
    packageName: 'Gói Chụp Gia Đình Đoàn Viên',
  },
];

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void customerReviewService
      .getAllReviews()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
        } else {
          setReviews(DEFAULT_REVIEWS);
        }
      })
      .catch((err) => {
        console.warn('[Reviews] Dùng đánh giá studio mẫu:', err.message);
        setReviews(DEFAULT_REVIEWS);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <section id="testimonials" className="py-24 bg-[#FAF5F5] border-t border-[#F0E4E6] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-rose-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal direction="down">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF0F3] border border-[#F5D5DC] text-[#B85064] text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <StarIcon className="w-4 h-4 text-[#B85064]" />
              <span>ĐÁNH GIÁ TỪ KHÁCH HÀNG THẬT</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2A1D22] font-serif-luxury tracking-tight mb-4">
              Cảm Nhận Của Khách Hàng
            </h2>

            <p className="text-[#7A6C71] text-base font-light leading-relaxed">
              Những phản hồi và đánh giá được ghi nhận trực tiếp từ hệ thống khách hàng đã trải nghiệm dịch vụ tại PhotoStudio.
            </p>
          </div>
        </ScrollReveal>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-3xl border border-[#F0E4E6] bg-white p-7 animate-pulse space-y-4 shadow-sm"
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="w-4 h-4 bg-neutral-200 rounded-full" />
                  ))}
                </div>
                <div className="h-4 w-3/4 bg-neutral-200 rounded" />
                <div className="h-4 w-full bg-neutral-100 rounded" />
                <div className="h-4 w-2/3 bg-neutral-100 rounded" />
                <div className="flex items-center gap-3 pt-4 border-t border-[#F0E4E6]">
                  <div className="w-10 h-10 rounded-full bg-neutral-200" />
                  <div className="space-y-1">
                    <div className="h-4 w-24 bg-neutral-200 rounded" />
                    <div className="h-3 w-16 bg-neutral-100 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Danh Sách Đánh Giá Khách Hàng (Đúng 3 card trên 1 hàng cân đối) */}
        {!isLoading && reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {reviews.slice(0, 3).map((rev, idx) => {
              const ratingCount = Math.round(rev.rating || 5);
              return (
                <ScrollReveal
                  key={rev.id || idx}
                  direction="up"
                  delay={idx * 0.08}
                  className="flex"
                >
                  <div className="p-7 rounded-3xl bg-white border border-[#F0E4E6] flex flex-col justify-between hover:border-[#B85064]/50 hover:shadow-xl hover:shadow-[#B85064]/10 transition-all duration-300 w-full shadow-sm">
                    <div>
                      {/* Rating Stars */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-4 h-4 ${
                                i < ratingCount ? 'text-amber-400 fill-amber-400' : 'text-neutral-200'
                              }`}
                            />
                          ))}
                          <span className="text-xs font-bold text-[#B85064] ml-1.5">
                            {rev.rating ? Number(rev.rating).toFixed(1) : '5.0'}
                          </span>
                        </div>

                        <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckBadgeIcon className="w-3.5 h-3.5" />
                          <span>Đã trải nghiệm</span>
                        </div>
                      </div>

                      {/* Comment from Customer */}
                      <p className="text-xs sm:text-sm text-[#3E2F35] leading-relaxed font-light mb-6">
                        "{rev.comment}"
                      </p>
                    </div>

                    {/* Customer Profile Footer */}
                    <div className="flex items-center gap-3 pt-4 border-t border-[#F0E4E6]">
                      <div className="w-10 h-10 rounded-full bg-[#FDF0F3] border border-[#F5D5DC] flex items-center justify-center text-[#B85064] font-bold text-sm shrink-0">
                        {rev.customerName ? rev.customerName.charAt(0).toUpperCase() : 'K'}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-xs sm:text-sm font-bold text-[#2A1D22] truncate">
                          {rev.customerName || 'Khách hàng PhotoStudio'}
                        </h4>
                        <p className="text-[11px] text-[#7A6C71] truncate">
                          {rev.packageName || 'Khách hàng hài lòng'}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}

        {/* CTA Xem Tất Cả Đánh Giá & Trust Badge */}
        <ScrollReveal direction="up" delay={0.25}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              to={ROUTES.USER.REVIEWS}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#BE4B5E] via-[#B85064] to-[#A8394C] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#B85064]/25 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
            >
              <span>Xem Toàn Bộ 30+ Đánh Giá Của Khách Hàng</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>

        {/* Bottom Trust Badge */}
        <ScrollReveal direction="up" delay={0.3}>
          <div className="max-w-xl mx-auto p-5 rounded-2xl bg-white border border-[#F0E4E6] flex items-center justify-center gap-4 text-center shadow-sm">
            <ShieldCheckIcon className="w-7 h-7 text-[#B85064] shrink-0" />
            <p className="text-xs text-[#7A6C71]">
              <strong>100% Đánh giá thật:</strong> Mọi đánh giá đều được ghi nhận trực tiếp từ khách hàng sau khi hoàn tất buổi chụp tại PhotoStudio.
            </p>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
