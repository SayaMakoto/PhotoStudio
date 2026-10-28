import { useState, useEffect } from 'react';
import { UserGroupIcon, TrophyIcon, CameraIcon, SparklesIcon } from '@heroicons/react/24/solid';
import CountUp from '../../animations/CountUp';
import ScrollReveal from '../../animations/ScrollReveal';
import customerPackageService from '../../../services/user/packageService';
import customerRoomService from '../../../services/user/roomService';
import customerServiceService from '../../../services/user/serviceService';
import customerReviewService from '../../../services/user/reviewService';

export default function Stats() {
  const [counts, setCounts] = useState({
    packages: 0,
    rooms: 0,
    services: 0,
    reviews: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void Promise.allSettled([
      customerPackageService.getAllPackages(),
      customerRoomService.getAllRooms(),
      customerServiceService.getAllServices(),
      customerReviewService.getAllReviews(),
    ])
      .then(([packagesRes, roomsRes, servicesRes, reviewsRes]) => {
        setCounts({
          packages:
            packagesRes.status === 'fulfilled' && Array.isArray(packagesRes.value)
              ? packagesRes.value.length
              : 0,
          rooms:
            roomsRes.status === 'fulfilled' && Array.isArray(roomsRes.value)
              ? roomsRes.value.length
              : 0,
          services:
            servicesRes.status === 'fulfilled' && Array.isArray(servicesRes.value)
              ? servicesRes.value.length
              : 0,
          reviews:
            reviewsRes.status === 'fulfilled' && Array.isArray(reviewsRes.value)
              ? reviewsRes.value.length
              : 0,
        });
      })
      .finally(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('[Stats] Lỗi tải thống kê:', err);
      });
  }, []);

  const statsItems = [
    {
      icon: CameraIcon,
      value: counts.packages,
      suffix: counts.packages > 0 ? ' Gói' : '',
      label: 'Gói Chụp Tiêu Chuẩn',
      description: 'Lưu trữ sẵn sàng trong hệ thống cơ sở dữ liệu',
    },
    {
      icon: TrophyIcon,
      value: counts.rooms,
      suffix: counts.rooms > 0 ? ' Phòng' : '',
      label: 'Phòng Studio Độc Bản',
      description: 'Không gian bối cảnh chuẩn phong cách điện ảnh',
    },
    {
      icon: SparklesIcon,
      value: counts.services,
      suffix: counts.services > 0 ? ' Dịch Vụ' : '',
      label: 'Dịch Vụ & Tiện Ích',
      description: 'Trang điểm, làm tóc, trang phục và phụ kiện',
    },
    {
      icon: UserGroupIcon,
      value: counts.reviews,
      suffix: counts.reviews > 0 ? ' Lượt' : '',
      label: 'Đánh Giá Khách Hàng',
      description: 'Phản hồi thực tế được ghi nhận từ khách hàng',
    },
  ];

  return (
    <section className="relative py-16 bg-[#FAF5F5] border-y border-[#F0E4E6] overflow-hidden">
      {/* Background glow nhẹ */}
      <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-white/40 to-rose-500/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsItems.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <ScrollReveal
                key={idx}
                direction="up"
                delay={idx * 0.1}
                duration={0.7}
              >
                <div className="group relative p-6 sm:p-7 rounded-3xl bg-white border border-[#F0E4E6] hover:border-[#B85064]/60 transition-all duration-300 shadow-[0_4px_20px_rgb(184,80,100,0.04)] hover:shadow-[0_12px_30px_rgb(184,80,100,0.12)] hover:-translate-y-1">
                  
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-[#FDF0F3] border border-[#F5D5DC] text-[#B85064] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#B85064] group-hover:text-white transition-all duration-300 shadow-sm">
                    <Icon className="w-6 h-6 text-[#B85064] group-hover:text-white transition-colors" />
                  </div>

                  {/* Value */}
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl lg:text-5xl font-extrabold text-[#2A1D22] tracking-tight font-sans">
                      {isLoading ? (
                        <span className="animate-pulse opacity-40">--</span>
                      ) : (
                        <CountUp
                          from={0}
                          to={stat.value}
                          separator=","
                          direction="up"
                          duration={1.2}
                          className="count-up-text"
                        />
                      )}
                    </span>
                    <span className="text-xl font-bold text-[#B85064]">
                      {stat.suffix}
                    </span>
                  </div>

                  {/* Label */}
                  <h3 className="text-base font-bold text-[#2A1D22] group-hover:text-[#B85064] transition-colors mb-1">
                    {stat.label}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#7A6C71] font-light leading-relaxed">
                    {stat.description}
                  </p>

                  {/* Bottom Line Glow */}
                  <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#B85064]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
