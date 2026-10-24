import { useState, useEffect } from 'react';
import {
  CheckIcon,
  SparklesIcon,
  ClockIcon,
  PhotoIcon,
  FireIcon,
  ArrowRightIcon,
  TrophyIcon,
  HeartIcon,
  UserGroupIcon,
  PaintBrushIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/solid';
import SpotlightCard from '../../cards/SpotlightCard';
import ScrollReveal from '../../animations/ScrollReveal';
import customerPackageService from '../../../services/user/packageService';
import customerServiceService from '../../../services/user/serviceService';

export default function Services({ onSelectPackage }) {
  const DEFAULT_PACKAGES = [
    {
      id: 1,
      name: 'Gói Chụp Nàng Thơ / Cá Nhân',
      category: 'Portrait & Beauty',
      popular: false,
      price: '990.000',
      duration: '60 phút',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      awardBadge: '🌸 Xu Hướng Giới Trẻ 2026',
      badgeIcon: HeartIcon,
      description: 'Phù hợp chụp ảnh profile, sinh nhật, nghệ thuật cá nhân lưu giữ tuổi trẻ.',
      features: [
        'Chụp 60 phút tại Studio A tone Pastel Hàn Quốc',
        'Miễn phí 1 set trang phục Vintage / Nàng thơ',
        'Hỗ trợ Makeup & Làm tóc cơ bản theo concept',
        'Nhận toàn bộ file gốc sau buổi chụp (100+ ảnh)',
        'Chỉnh sửa Retouch chuyên sâu 15 ảnh yêu thích',
      ],
      tag: 'Phổ Biến',
    },
    {
      id: 2,
      name: 'Gói Chụp Ảnh Cưới Studio',
      category: 'Wedding Luxury',
      popular: true,
      price: '2.990.000',
      duration: '120 phút',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      awardBadge: '🏆 Top 1 Bình Chọn Studio Nghệ Thuật Xuất Sắc',
      badgeIcon: TrophyIcon,
      description: 'Trải nghiệm chụp ảnh cưới đẳng cấp không ngại nắng mưa với bối cảnh điện ảnh.',
      features: [
        'Chụp 120 phút với 2 bối cảnh Cổ Điển & Cung Điện',
        '01 Váy cưới xòe công chúa ren Pháp & 01 Tuxedo cao cấp',
        'Trang điểm cô dâu & tạo kiểu tóc chuyên nghiệp',
        'Toàn bộ phụ kiện: Vương miện, hoa cưới cầm tay',
        'Retouch tỉ mỉ 35 ảnh nghệ thuật + Tặng 01 Album Mini',
      ],
      tag: 'Best Seller',
    },
    {
      id: 3,
      name: 'Gói Chụp Gia Đình & Nhóm Bạn',
      category: 'Family & Group',
      popular: false,
      price: '1.890.000',
      duration: '90 phút',
      image: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=800&q=80',
      awardBadge: '👨‍👩‍👧‍👦 Khoảnh Khắc Đoàn Viên Hạnh Phúc',
      badgeIcon: UserGroupIcon,
      description: 'Không gian ấm cúng, rộng rãi cho gia đình 4-8 thành viên lưu giữ kỷ niệm.',
      features: [
        'Chụp 90 phút tại Phòng VIP đa năng sức chứa lớn',
        'Phù hợp nhóm từ 4 đến 8 người thoải mái tạo dáng',
        'Hỗ trợ đạo cụ bối cảnh: Sofa hoàng gia, quà tặng, bóng bay',
        'Nhận toàn bộ file ảnh gốc chất lượng cao',
        'Chỉnh sửa da và ánh sáng 25 ảnh nhóm hoàn hảo',
      ],
      tag: 'Ấm Cúng',
    },
  ];

  const DEFAULT_ADDITIONAL_SERVICES = [
    {
      title: 'Makeup & Hair Chuyên Nghiệp',
      price: '300.000đ',
      desc: 'Layout cá nhân hóa theo từng gương mặt',
      icon: PaintBrushIcon,
      color: 'text-rose-400',
      bg: 'bg-rose-500/15 border-rose-500/30',
    },
    {
      title: 'Chỉnh Sửa Retouch Chuyên Sâu',
      price: '250.000đ / 10 ảnh',
      desc: 'Chỉnh da, dáng và phối màu điện ảnh độc quyền',
      icon: SparklesIcon,
      color: 'text-amber-400',
      bg: 'bg-amber-500/15 border-amber-500/30',
    },
    {
      title: 'Thuê Váy Cưới & Tuxedo Cao Cấp',
      price: 'từ 300.000đ',
      desc: 'Hơn 50+ mẫu váy mới nhất mùa cưới 2026',
      icon: ShoppingBagIcon,
      color: 'text-sky-400',
      bg: 'bg-sky-500/15 border-sky-500/30',
    },
    {
      title: 'Gia Hạn Giờ Chụp (Mỗi 30p)',
      price: '200.000đ',
      desc: 'Thêm thời gian sáng tạo cùng nhiếp ảnh gia',
      icon: ClockIcon,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/15 border-emerald-500/30',
    },
  ];

  const [packages, setPackages] = useState(DEFAULT_PACKAGES);
  const [additionalServices, setAdditionalServices] = useState(DEFAULT_ADDITIONAL_SERVICES);

  useEffect(() => {
    // 1. Tải danh sách Gói chụp từ backend database
    customerPackageService
      .getAllPackages()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((pkg, idx) => {
            const fallbackPkg = DEFAULT_PACKAGES[idx % DEFAULT_PACKAGES.length];
            return {
              id: pkg.id,
              name: pkg.name || fallbackPkg.name,
              category: pkg.category || fallbackPkg.category || 'Studio Package',
              popular: idx === 1 || pkg.popular || false,
              price: pkg.price ? Number(pkg.price).toLocaleString('vi-VN') : fallbackPkg.price,
              duration: pkg.duration ? `${pkg.duration} phút` : fallbackPkg.duration,
              image: pkg.imageUrl || fallbackPkg.image,
              awardBadge: fallbackPkg.awardBadge,
              badgeIcon: fallbackPkg.badgeIcon,
              description: pkg.description || fallbackPkg.description,
              features: Array.isArray(pkg.features) && pkg.features.length > 0 
                ? pkg.features 
                : fallbackPkg.features,
              tag: fallbackPkg.tag,
            };
          });
          setPackages(mapped);
        }
      })
      .catch((err) => {
        console.warn('[Pricing] Không thể kết nối API gói chụp, dùng dữ liệu mặc định:', err.message);
      });

    // 2. Tải danh sách dịch vụ bổ sung từ backend database
    customerServiceService
      .getAllServices()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const icons = [PaintBrushIcon, SparklesIcon, ShoppingBagIcon, ClockIcon];
          const colors = ['text-rose-400', 'text-amber-400', 'text-sky-400', 'text-emerald-400'];
          const bgs = [
            'bg-rose-500/15 border-rose-500/30',
            'bg-amber-500/15 border-amber-500/30',
            'bg-sky-500/15 border-sky-500/30',
            'bg-emerald-500/15 border-emerald-500/30',
          ];
          const mappedServices = data.map((srv, idx) => ({
            title: srv.name || srv.title,
            price: srv.price ? `${Number(srv.price).toLocaleString('vi-VN')}đ` : 'Liên hệ',
            desc: srv.description || srv.desc || 'Dịch vụ chất lượng cao tại studio',
            icon: icons[idx % icons.length],
            color: colors[idx % colors.length],
            bg: bgs[idx % bgs.length],
          }));
          setAdditionalServices(mappedServices);
        }
      })
      .catch((err) => {
        console.warn('[Pricing] Không thể kết nối API dịch vụ kèm theo:', err.message);
      });
  }, []);

  return (
    <section id="services" className="py-24 bg-neutral-950 relative overflow-hidden">
      {/* Background illumination */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading with 2-way ScrollReveal */}
        <ScrollReveal direction="down">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <SparklesIcon className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Bảng Giá & Gói Dịch Vụ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
              Lựa Chọn Gói Chụp Phù Hợp Với Bạn
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg font-light leading-relaxed">
              Mọi gói chụp đều bao gồm trang thiết bị cao cấp, không phát sinh phụ phí ẩn, cam kết hỗ trợ khách hàng chụp đến khi ưng ý.
            </p>
          </div>
        </ScrollReveal>

        {/* Pricing Cards with dynamic hover & image badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-stretch">
          {packages.map((pkg, idx) => {
            const BadgeIcon = pkg.badgeIcon;
            return (
              <ScrollReveal
                key={pkg.id}
                direction="up"
                delay={idx * 0.15}
                duration={0.7}
                className="flex"
              >
                <SpotlightCard
                  className={`group flex flex-col justify-between relative overflow-hidden rounded-3xl p-0 transition-all duration-500 hover:-translate-y-3.5 hover:shadow-2xl hover:shadow-amber-500/20 cursor-pointer w-full ${
                    pkg.popular
                      ? 'border-amber-500/60 bg-neutral-900/90 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/40 md:-translate-y-2'
                      : 'bg-neutral-900/60 border-white/10 hover:border-amber-500/50'
                  }`}
                  spotlightColor={pkg.popular ? 'rgba(245, 158, 11, 0.28)' : 'rgba(245, 158, 11, 0.18)'}
                >
                  <div>
                    {/* Top Image with Badge */}
                    <div className="relative h-56 w-full overflow-hidden bg-neutral-950">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:brightness-105"
                        loading="lazy"
                      />

                      {/* Gradient overlay on image */}
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />

                      {/* Popular ribbon if applicable */}
                      {pkg.popular && (
                        <div className="absolute top-3.5 right-3.5 bg-gradient-to-r from-amber-500 to-amber-300 text-neutral-950 px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1.5 animate-pulse">
                          <FireIcon className="w-4 h-4 text-white" />
                          <span>Best Seller</span>
                        </div>
                      )}

                      {/* Award Badge on image */}
                      <div className="absolute bottom-3.5 left-3.5 right-3.5 transform transition-transform duration-300 group-hover:-translate-y-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-950/85 backdrop-blur-md border border-amber-500/40 shadow-xl text-amber-300 text-xs font-semibold">
                          <BadgeIcon className="w-4 h-4 text-amber-400 shrink-0" />
                          <span className="truncate">{pkg.awardBadge}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 sm:p-7">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">
                          {pkg.category}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-neutral-300 bg-neutral-800/80 px-2.5 py-1 rounded-md border border-white/10">
                          <ClockIcon className="w-3.5 h-3.5 text-amber-400" />
                          {pkg.duration}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-neutral-400 font-light mb-6 min-h-[34px] leading-relaxed">
                        {pkg.description}
                      </p>

                      {/* Price Display */}
                      <div className="mb-6 pb-6 border-b border-white/10">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-4xl font-extrabold text-white tracking-tight group-hover:scale-105 transition-transform duration-300 inline-block">
                            {pkg.price}
                          </span>
                          <span className="text-base font-bold text-amber-400">VNĐ</span>
                        </div>
                        <span className="text-xs text-neutral-400 mt-1 block">Trọn gói không phụ thu bối cảnh & trang thiết bị</span>
                      </div>

                      {/* Feature Checklist */}
                      <div className="space-y-3 mb-8">
                        {pkg.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2.5">
                            <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-400 group-hover:text-white transition-colors duration-300">
                              <CheckIcon className="w-3 h-3 stroke-[3]" />
                            </div>
                            <span className="text-xs sm:text-sm text-neutral-300 font-light leading-snug">
                              {feat}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Button - Dynamic hover gradient */}
                  <div className="p-6 sm:p-7 pt-0">
                    <button
                      onClick={() => onSelectPackage && onSelectPackage(pkg)}
                      className="cursor-pointer w-full py-4 px-5 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 border border-amber-500/40 bg-neutral-800/80 text-white hover:bg-gradient-to-r hover:from-amber-500 hover:via-amber-400 hover:to-amber-500 hover:text-neutral-950 hover:border-transparent hover:shadow-xl hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>Chọn Gói Này & Đặt Lịch</span>
                      <ArrowRightIcon className="w-4 h-4 text-amber-400 group-hover:text-white transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                </SpotlightCard>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Additional Services with animated hover dynamics */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="rounded-3xl border border-white/10 bg-neutral-900/40 p-8 sm:p-10 backdrop-blur-xl relative overflow-hidden shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-white/10 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-inner">
                  <PhotoIcon className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Dịch Vụ & Tiện Ích Bổ Sung</h3>
                  <p className="text-xs text-neutral-400">Tùy biến linh hoạt theo nhu cầu riêng của từng buổi chụp</p>
                </div>
              </div>
              <span className="text-xs text-amber-400 bg-amber-500/15 px-3.5 py-1.5 rounded-full border border-amber-500/30 w-fit">
                ✨ Hỗ trợ tư vấn miễn phí
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {additionalServices.map((service, idx) => {
                const IconComponent = service.icon;
                return (
                  <div
                    key={idx}
                    className="group relative p-6 rounded-2xl bg-neutral-950/70 border border-white/10 hover:border-amber-400/60 hover:bg-neutral-900/90 hover:shadow-xl hover:shadow-amber-500/15 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
                  >
                    <div className={`w-12 h-12 rounded-2xl ${service.bg} border flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-md`}>
                      <IconComponent className={`w-6 h-6 ${service.color}`} />
                    </div>
                    <h4 className="text-sm font-bold text-neutral-200 group-hover:text-white mb-1.5 transition-colors">
                      {service.title}
                    </h4>
                    <p className="text-xs text-neutral-400 mb-4 font-light leading-relaxed min-h-[36px]">
                      {service.desc}
                    </p>
                    <p className="text-sm font-extrabold text-amber-400 group-hover:text-amber-300 transition-colors">
                      {service.price}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
