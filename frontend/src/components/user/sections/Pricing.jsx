import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckIcon,
  SparklesIcon,
  ClockIcon,
  ArrowRightIcon,
  WrenchScrewdriverIcon,
  StarIcon,
} from '@heroicons/react/24/solid';
import SpotlightCard from '../../cards/SpotlightCard';
import ScrollReveal from '../../animations/ScrollReveal';
import customerPackageService from '../../../services/user/packageService';
import customerServiceService from '../../../services/user/serviceService';
import userImageService from '../../../services/user/imageService';
import { ROUTES } from '../../../routes/web';

const CURATED_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85', // Nàng thơ
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85', // Cưới studio
  'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1200&q=85', // Gia đình
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85', // Cưới luxury
];

const EQUIPMENT_LABELS = {
  camera: 'Máy ảnh',
  lighting: 'Đèn studio',
  tripod: 'Chân máy',
  backdrop: 'Phông nền',
  lens: 'Ống kính',
  reflector: 'Tấm hắt sáng',
  softbox: 'Softbox',
};

export default function Services({ onSelectPackage }) {
  const [packages, setPackages] = useState([]);
  const [additionalServices, setAdditionalServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void Promise.allSettled([
      customerPackageService.getAllPackages(),
      customerServiceService.getAllServices(),
      userImageService.getAllImages(),
    ])
      .then(([pkgRes, srvRes, imgRes]) => {
        const allImages =
          imgRes.status === 'fulfilled' && Array.isArray(imgRes.value) ? imgRes.value : [];

        if (pkgRes.status === 'fulfilled' && Array.isArray(pkgRes.value)) {
          const active = pkgRes.value.filter((p) => !p.status || p.status === 'active');
          const mapped = active.map((pkg, idx) => {
            // ĐK: Tìm ảnh trong bảng images nếu có, không có thì lấy ảnh mẫu chất lượng cao
            const matchedImg = allImages.find(
              (img) =>
                img.imageableType?.toLowerCase() === 'package' &&
                Number(img.imageableId) === Number(pkg.id)
            );
            const displayImage =
              matchedImg?.imageUrl ||
              pkg.imageUrl ||
              CURATED_FALLBACK_IMAGES[idx % CURATED_FALLBACK_IMAGES.length];

            const nameLower = (pkg.name || '').toLowerCase();
            let badgeTag = 'Hot Concept';
            if (nameLower.includes('cưới')) badgeTag = idx === 1 ? 'Best Seller' : 'Luxury Wedding';
            else if (nameLower.includes('cá nhân') || nameLower.includes('nàng thơ')) badgeTag = 'Xu Hướng 2026';
            else if (nameLower.includes('gia đình')) badgeTag = 'Ấm Cúng & Gắn Kết';

            return {
              ...pkg,
              displayImage,
              badgeTag,
            };
          });
          setPackages(mapped);
        } else {
          setPackages([]);
        }

        if (srvRes.status === 'fulfilled' && Array.isArray(srvRes.value)) {
          const activeSrvs = srvRes.value.filter((s) => !s.status || s.status === 'active');
          setAdditionalServices(activeSrvs);
        } else {
          setAdditionalServices([]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('[Pricing] Lỗi tải dữ liệu:', err);
      });
  }, []);

  const getPackageFeatures = (pkg) => {
    const list = [];
    if (pkg.description) {
      const parts = pkg.description
        .split(/[,;\n]/)
        .map((p) => p.trim())
        .filter(Boolean);
      list.push(...parts);
    }
    if (Array.isArray(pkg.equipments) && pkg.equipments.length > 0) {
      pkg.equipments.forEach((eq) => {
        const label = EQUIPMENT_LABELS[eq.equipmentType] || eq.equipmentType;
        list.push(`${eq.quantity}x ${label}`);
      });
    }
    return list.length > 0 ? list : ['Bao gồm trọn gói dịch vụ và không gian phòng chụp'];
  };

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-neutral-950">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal direction="down">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <SparklesIcon className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>TRƯNG BÀY BỘ SƯU TẬP GÓI CHỤP</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
              Bảng Giá & Gói Dịch Vụ
            </h2>

            <p className="text-neutral-300 text-base font-light leading-relaxed">
              Các gói chụp nổi bật được lấy trực tiếp từ CSDL kết hợp hình ảnh concept đặc sắc từ PhotoStudio.
            </p>
          </div>
        </ScrollReveal>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-3xl border border-white/10 bg-neutral-900/60 overflow-hidden animate-pulse"
              >
                <div className="h-56 bg-white/10 w-full" />
                <div className="p-7 space-y-4">
                  <div className="h-6 w-24 bg-white/10 rounded-full" />
                  <div className="h-8 w-3/4 bg-white/10 rounded-lg" />
                  <div className="h-4 w-full bg-white/10 rounded" />
                  <div className="h-10 w-1/2 bg-amber-500/20 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Real Packages Grid from Database */}
        {!isLoading && packages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {packages.map((pkg, idx) => {
              const features = getPackageFeatures(pkg);
              const formattedPrice = pkg.price
                ? Number(pkg.price).toLocaleString('vi-VN')
                : 'Liên hệ';
              const isHighlighted = idx === 1;

              return (
                <ScrollReveal
                  key={pkg.id}
                  direction="up"
                  delay={idx * 0.1}
                  duration={0.6}
                  className="flex"
                >
                  <SpotlightCard
                    className={`group flex flex-col justify-between relative overflow-hidden rounded-3xl p-0 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/20 w-full ${
                      isHighlighted
                        ? 'border-amber-500/60 bg-neutral-900/90 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/40 md:-translate-y-2'
                        : 'bg-neutral-900/60 border-white/10 hover:border-amber-500/50'
                    }`}
                    spotlightColor={isHighlighted ? 'rgba(245, 158, 11, 0.28)' : 'rgba(245, 158, 11, 0.18)'}
                  >
                    <div>
                      {/* Product Image Cover */}
                      <div className="relative h-56 w-full overflow-hidden bg-neutral-950">
                        <img
                          src={pkg.displayImage}
                          alt={pkg.name}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent" />

                        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-400 text-neutral-950 shadow-md">
                            {pkg.badgeTag}
                          </span>
                          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-950/80 backdrop-blur-md border border-white/10 text-white text-xs">
                            <StarIcon className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="font-bold">5.0</span>
                          </div>
                        </div>

                        {pkg.duration && (
                          <div className="absolute bottom-3 left-3">
                            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-neutral-950/80 px-2.5 py-1 rounded-md border border-amber-500/30">
                              <ClockIcon className="w-3 h-3 text-amber-400" />
                              <span>{pkg.duration} phút</span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Body */}
                      <div className="p-6 sm:p-7">
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                          {pkg.name}
                        </h3>

                        <p className="text-xs text-neutral-300 font-light mb-6 min-h-[38px] leading-relaxed line-clamp-2">
                          {pkg.description || 'Dịch vụ chụp ảnh nghệ thuật tại Studio.'}
                        </p>

                        {/* Price from Database */}
                        <div className="mb-6 pb-6 border-b border-white/10">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
                              {formattedPrice}
                            </span>
                            <span className="text-base font-bold text-amber-400">VNĐ</span>
                          </div>
                          <span className="text-xs text-neutral-400 mt-1 block">
                            Trọn gói thiết bị & không gian phòng chụp
                          </span>
                        </div>

                        {/* Features */}
                        <div className="space-y-2.5 mb-6">
                          {features.slice(0, 3).map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-2.5">
                              <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                                <CheckIcon className="w-3 h-3 stroke-[3]" />
                              </div>
                              <span className="text-xs text-neutral-300 font-light leading-snug truncate">
                                {feat}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Booking Action */}
                    <div className="p-6 sm:p-7 pt-0 grid grid-cols-2 gap-3">
                      <Link
                        to={ROUTES.USER.PACKAGES}
                        className="cursor-pointer py-3 px-3 rounded-2xl font-bold text-xs tracking-wide transition-all border border-white/15 bg-neutral-800/80 text-white hover:bg-neutral-750 hover:border-amber-400 text-center flex items-center justify-center"
                      >
                        Xem Chi Tiết
                      </Link>

                      <button
                        onClick={() => (onSelectPackage ? onSelectPackage(pkg.id) : null)}
                        className="cursor-pointer py-3 px-3 rounded-2xl font-bold text-xs tracking-wide transition-all duration-300 flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-400 text-neutral-950 hover:from-amber-400 hover:to-amber-300 shadow-lg shadow-amber-500/30 hover:scale-[1.03]"
                      >
                        <span>Đặt Lịch Ngay</span>
                        <ArrowRightIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </SpotlightCard>
                </ScrollReveal>
              );
            })}
          </div>
        )}

        {/* View All Packages Link to /packages */}
        <div className="text-center mb-16">
          <Link
            to={ROUTES.USER.PACKAGES}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-neutral-900 border border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-neutral-950 text-sm font-bold shadow-lg transition-all duration-300 hover:scale-105"
          >
            <span>Xem Toàn Bộ Bảng Giá & Phòng Trưng Bày Sản Phẩm</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* Real Additional Services from Database */}
        {!isLoading && additionalServices.length > 0 && (
          <ScrollReveal direction="up" delay={0.2}>
            <div className="rounded-3xl border border-white/10 bg-neutral-900/40 p-8 sm:p-10 backdrop-blur-xl relative overflow-hidden shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-white/10 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-inner">
                    <WrenchScrewdriverIcon className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Dịch Vụ Phụ Trợ & Tiện Ích</h3>
                    <p className="text-xs text-neutral-400">Đồng bộ từ danh mục dịch vụ trong cơ sở dữ liệu</p>
                  </div>
                </div>
                <span className="text-xs text-amber-400 bg-amber-500/15 px-3.5 py-1.5 rounded-full border border-amber-500/30 w-fit">
                  ✨ {additionalServices.length} Dịch vụ khả dụng
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {additionalServices.map((service) => (
                  <div
                    key={service.id}
                    className="group relative p-6 rounded-2xl bg-neutral-950/70 border border-white/10 hover:border-amber-400/60 hover:bg-neutral-900/90 hover:shadow-xl hover:shadow-amber-500/15 transition-all duration-300 hover:-translate-y-1.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-md">
                      <SparklesIcon className="w-5 h-5 text-amber-400" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400/80 mb-1 block">
                      Loại: {service.type || 'Dịch vụ'}
                    </span>
                    <h4 className="text-sm font-bold text-neutral-200 group-hover:text-white mb-1.5 transition-colors">
                      {service.name}
                    </h4>
                    <p className="text-xs text-neutral-400 mb-4 font-light leading-relaxed min-h-[36px]">
                      {service.description || 'Dịch vụ tiện ích studio hỗ trợ buổi chụp'}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <p className="text-sm font-extrabold text-amber-400 group-hover:text-amber-300 transition-colors">
                        {service.price ? `${Number(service.price).toLocaleString('vi-VN')}đ` : 'Liên hệ'}
                      </p>
                      {service.duration ? (
                        <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                          <ClockIcon className="w-3 h-3 text-amber-400" />
                          {service.duration}p
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

      </div>
    </section>
  );
}
