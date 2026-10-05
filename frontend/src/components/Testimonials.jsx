import {
  StarIcon,
  ChatBubbleBottomCenterTextIcon,
  HandThumbUpIcon,
  ShieldCheckIcon,
  HeartIcon
} from '@heroicons/react/24/solid';
import SpotlightCard from './reactbits/SpotlightCard';
import ScrollReveal from './reactbits/ScrollReveal';

export default function Testimonials() {
  const reviews = [
    {
      name: 'Lê Minh Tuấn & Mai Lan',
      role: 'Khách hàng Gói Cưới Studio B',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      comment:
        'Hai vợ chồng mình cực kỳ hài lòng với bộ ảnh cưới! Ekip rất nhiệt tình, bạn Makeup làm tóc tỉ mỉ từng chi tiết, nhiếp ảnh gia chụp có tâm và bắt trọn từng khoảnh khắc tự nhiên.',
      highlight: '“Ảnh cưới đẹp ngoài mong đợi!”',
    },
    {
      name: 'Phạm Phương Linh',
      role: 'Khách hàng Gói Nàng Thơ',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      comment:
        'Lần đầu chụp cá nhân mà không hề bị gượng gạo nhờ anh photographer hướng dẫn tạo dáng siêu chi tiết. Tone màu Hàn Quốc ngọt ngào, ảnh retouch da mướt mịn tự nhiên lắm!',
      highlight: '“Tone màu Hàn Quốc cực sang”',
    },
    {
      name: 'Gia Đình Anh Hoàng Nam',
      role: 'Khách hàng Gói Gia Đình VIP',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      comment:
        'Phòng VIP của studio rất rộng rãi, thoáng mát, gia đình 6 người chụp rất thoải mái. Bức ảnh in phóng to treo phòng khách ai đến chơi cũng khen hết lời.',
      highlight: '“Cả gia đình đều rất ưng ý”',
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-neutral-950 border-t border-white/10 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header with ScrollReveal */}
        <ScrollReveal direction="down">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <StarIcon className="w-4 h-4 text-amber-400" />
              <span>Cảm Nhận Của Khách Hàng</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
              Hơn 2,500+ Nụ Cười & Kỷ Niệm
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg font-light leading-relaxed">
              Sự hài lòng và hạnh phúc của khách hàng chính là thước đo giá trị lớn nhất cho mỗi tác phẩm nghệ thuật của chúng tôi.
            </p>

            {/* Social Proof Badges with bright colors */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 border border-white/15 text-xs text-neutral-200 shadow-sm">
                <HandThumbUpIcon className="w-4 h-4 text-amber-400" />
                <span>99.8% Khách hàng giới thiệu bạn bè</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 border border-white/15 text-xs text-neutral-200 shadow-sm">
                <ShieldCheckIcon className="w-4 h-4 text-amber-400" />
                <span>100% Cam kết trả file đúng hẹn</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 border border-white/15 text-xs text-neutral-200 shadow-sm">
                <HeartIcon className="w-4 h-4 text-rose-500" />
                <span>5.0 / 5.0 Rating</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Testimonial Cards with dynamic hover & spotlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <ScrollReveal
              key={idx}
              direction="up"
              delay={idx * 0.15}
              duration={0.7}
              className="flex"
            >
              <SpotlightCard
                className="group flex flex-col justify-between bg-neutral-900/60 border-white/10 p-8 rounded-3xl transition-all duration-500 hover:-translate-y-3 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/15 w-full"
                spotlightColor="rgba(245, 158, 11, 0.2)"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform duration-300"
                        />
                      ))}
                    </div>
                    <ChatBubbleBottomCenterTextIcon className="w-7 h-7 text-amber-500/40 group-hover:text-amber-400 transition-colors duration-300" />
                  </div>

                  <p className="text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                    {rev.highlight}
                  </p>

                  <p className="text-neutral-300 text-sm font-light leading-relaxed mb-6 italic group-hover:text-white transition-colors">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3.5 pt-5 border-t border-white/10">
                  <div className="relative">
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/50 group-hover:border-amber-400 group-hover:scale-105 transition-all duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-neutral-950 text-[9px] font-bold">
                      ✓
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {rev.name}
                    </h4>
                    <p className="text-xs text-amber-400 font-medium">{rev.role}</p>
                  </div>
                </div>
              </SpotlightCard>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
