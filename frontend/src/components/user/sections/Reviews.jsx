import { useState, useEffect } from 'react';
import {
  StarIcon,
  ChatBubbleBottomCenterTextIcon,
  ShieldCheckIcon,
  HeartIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';
import SpotlightCard from '../../cards/SpotlightCard';
import ScrollReveal from '../../animations/ScrollReveal';
import customerReviewService from '../../../services/user/reviewService';

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void customerReviewService
      .getAllReviews()
      .then((data) => {
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          setReviews([]);
        }
      })
      .catch((err) => {
        console.warn('[Reviews] Lỗi tải đánh giá:', err.message);
        setReviews([]);
      })
      .finally(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('[Reviews] Lỗi không xử lý:', err);
      });
  }, []);

  return (
    <section id="testimonials" className="py-24 bg-neutral-950 border-t border-white/10 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal direction="down">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <StarIcon className="w-4 h-4 text-amber-400 animate-spin" />
              <span>ĐÁNH GIÁ TỪ KHÁCH HÀNG THẬT</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
              Cảm Nhận Của Khách Hàng
            </h2>

            <p className="text-neutral-400 text-base font-light leading-relaxed">
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
                className="rounded-3xl border border-white/10 bg-neutral-900/60 p-7 animate-pulse space-y-4"
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="w-4 h-4 bg-white/10 rounded-full" />
                  ))}
                </div>
                <div className="h-4 w-3/4 bg-white/10 rounded" />
                <div className="h-4 w-full bg-white/10 rounded" />
                <div className="h-4 w-2/3 bg-white/10 rounded" />
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full bg-white/10" />
                  <div className="space-y-1">
                    <div className="h-4 w-24 bg-white/10 rounded" />
                    <div className="h-3 w-16 bg-white/10 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state when 0 reviews in Database */}
        {!isLoading && reviews.length === 0 && (
          <ScrollReveal direction="up">
            <div className="max-w-2xl mx-auto rounded-3xl border border-white/10 bg-neutral-900/40 p-10 text-center mb-16">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
                <ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Chưa có bài đánh giá nào trên hệ thống</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                Hệ thống chưa ghi nhận đánh giá từ khách hàng trong cơ sở dữ liệu. Sau khi hoàn thành buổi chụp, bạn có thể để lại phản hồi để chia sẻ trải nghiệm cùng cộng đồng!
              </p>
              <a
                href="#booking"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-neutral-950 font-bold text-xs shadow-lg hover:from-amber-400 hover:to-amber-300 transition-all hover:scale-105"
              >
                <HeartIcon className="w-4 h-4 text-neutral-950" />
                <span>Trải Nghiệm & Đặt Lịch Ngay</span>
              </a>
            </div>
          </ScrollReveal>
        )}

        {/* Real Reviews List from Database */}
        {!isLoading && reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {reviews.map((rev, idx) => {
              const ratingCount = Math.round(rev.rating || 5);
              return (
                <ScrollReveal
                  key={rev.id || idx}
                  direction="up"
                  delay={idx * 0.1}
                  className="flex"
                >
                  <SpotlightCard
                    className="p-7 rounded-3xl bg-neutral-900/60 border border-white/10 flex flex-col justify-between hover:border-amber-500/50 transition-all duration-300 w-full"
                    spotlightColor="rgba(245, 158, 11, 0.15)"
                  >
                    <div>
                      {/* Rating Stars */}
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < ratingCount ? 'text-amber-400 fill-amber-400' : 'text-neutral-700'
                            }`}
                          />
                        ))}
                        <span className="text-xs font-bold text-amber-400 ml-1.5">
                          {rev.rating ? rev.rating.toFixed(1) : '5.0'}
                        </span>
                      </div>

                      {/* Comment from Database */}
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light mb-6">
                        "{rev.comment || 'Dịch vụ chụp ảnh rất chuyên nghiệp và chu đáo.'}"
                      </p>
                    </div>

                    {/* Customer Info */}
                    <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
                        <UserCircleIcon className="w-6 h-6 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {rev.customerName || `Khách hàng #${rev.customerId || rev.id}`}
                        </h4>
                        <span className="text-[11px] text-neutral-400 block">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('vi-VN') : 'Khách hàng PhotoStudio'}
                        </span>
                      </div>
                    </div>
                  </SpotlightCard>
                </ScrollReveal>
              );
            })}
          </div>
        )}

        {/* Quality Commitment Badges */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10">
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-neutral-900/40 border border-white/5">
              <div className="p-3 rounded-xl bg-amber-500/15 text-amber-400 shrink-0">
                <ShieldCheckIcon className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">100% Ảnh Đạt Chuẩn</h4>
                <p className="text-xs text-neutral-400">Chỉnh sửa cho đến khi khách hàng hoàn toàn hài lòng</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-2xl bg-neutral-900/40 border border-white/5">
              <div className="p-3 rounded-xl bg-rose-500/15 text-rose-400 shrink-0">
                <HeartIcon className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Đội Ngũ Tận Tâm</h4>
                <p className="text-xs text-neutral-400">Nhiếp ảnh gia và stylist luôn lắng nghe ý kiến khách hàng</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-2xl bg-neutral-900/40 border border-white/5">
              <div className="p-3 rounded-xl bg-sky-500/15 text-sky-400 shrink-0">
                <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Tư Vấn Concept Miễn Phí</h4>
                <p className="text-xs text-neutral-400">Hỗ trợ lựa chọn trang phục và phong cách chụp phù hợp</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
