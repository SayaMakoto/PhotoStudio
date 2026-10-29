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
import ScrollReveal from '../../animations/ScrollReveal';
import customerPackageService from '../../../services/user/packageService';
import customerServiceService from '../../../services/user/serviceService';
import userImageService from '../../../services/user/imageService';
import { ROUTES } from '../../../routes/web';

const CURATED_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
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

const DEFAULT_ADDITIONAL_SERVICES = [
  { id: 1, name: 'Trang Điểm & Làm Tóc Chuyên Nghiệp (Layout 1)', type: 'makeup', description: 'Layout makeup cá nhân phù hợp từng đường nét gương mặt và concept chụp', duration: 60, price: 300000.0, status: 'active' },
  { id: 2, name: 'Trang Điểm Thay Layout Thứ 2 Trong Buổi Chụp', type: 'makeup', description: 'Dặm phấn, thay đổi màu son và kiểu tóc sang concept trang phục mới', duration: 30, price: 200000.0, status: 'active' },
  { id: 3, name: 'Chỉnh Sửa Ảnh Chuyên Sâu (Retouch Da & Dáng 10 Ảnh)', type: 'photography', description: 'Kỹ thuật Frequency Separation giữ vân da thật, cân chỉnh màu sắc điện ảnh', duration: 60, price: 250000.0, status: 'active' },
  { id: 4, name: 'Thuê Phụ Kiện Không Giới Hạn Toàn Buổi', type: 'accessory', description: 'Sử dụng toàn bộ vương miện, hoa cưới, đạo cụ trong studio', duration: 0, price: 150000.0, status: 'active' },
  { id: 5, name: 'In Album Photobook Mở Phẳng Cao Cấp 25x25 (20 Trang)', type: 'photography', description: 'In giấy mỹ thuật phủ màng UV chống ẩm mốc, bìa bọc da sang trọng', duration: 0, price: 850000.0, status: 'active' },
  { id: 6, name: 'In Ảnh Cổng Pha Lê Tráng Gương Khổ Lớn 60x90cm', type: 'photography', description: 'Khung viền mạ vàng, bề mặt tráng gương chống lóa sắc nét', duration: 0, price: 650000.0, status: 'active' },
  { id: 7, name: 'Quay Video Highlight Hậu Kỳ Cinematic 4K (60 Giây)', type: 'photography', description: 'Video dọc định dạng Reels/TikTok/Shorts ghi lại hậu trường lung linh', duration: 90, price: 900000.0, status: 'active' },
  { id: 8, name: 'Thuê Thêm Trang Phục Thiết Kế (1 Bộ / Concept)', type: 'clothing', description: 'Tự chọn váy cưới ren Pháp, áo dài hoặc vest cao cấp kèm hỗ trợ là ủi hơi nước', duration: 30, price: 200000.0, status: 'active' },
];

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

        if (srvRes.status === 'fulfilled' && Array.isArray(srvRes.value) && srvRes.value.length > 0) {
          const activeSrvs = srvRes.value.filter((s) => !s.status || s.status === 'active');
          setAdditionalServices(activeSrvs.length > 0 ? activeSrvs : DEFAULT_ADDITIONAL_SERVICES);
        } else {
          setAdditionalServices(DEFAULT_ADDITIONAL_SERVICES);
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
    <section id="services" className="py-24 relative overflow-hidden bg-[#FAF5F5]">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-rose-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal direction="down">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF0F3] border border-[#F5D5DC] text-[#B85064] text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <SparklesIcon className="w-4 h-4 text-[#B85064]" />
              <span>TRƯNG BÀY BỘ SƯU TẬP GÓI CHỤP</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2A1D22] font-serif-luxury tracking-tight mb-4">
              Bảng Giá & Gói Dịch Vụ
            </h2>

            <p className="text-[#7A6C71] text-base font-light leading-relaxed">
              Các gói chụp nổi bật kết hợp hình ảnh concept đặc sắc từ PhotoStudio.
            </p>
          </div>
        </ScrollReveal>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-3xl border border-[#F0E4E6] bg-white overflow-hidden animate-pulse shadow-sm"
              >
                <div className="h-56 bg-[#FDF0F3] w-full" />
                <div className="p-7 space-y-4">
                  <div className="h-6 w-24 bg-neutral-200 rounded-full" />
                  <div className="h-8 w-3/4 bg-neutral-200 rounded-lg" />
                  <div className="h-4 w-full bg-neutral-100 rounded" />
                  <div className="h-10 w-1/2 bg-[#B85064]/20 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Real Packages Grid from Database (Hiển thị đúng 3 gói nổi bật nhất trên trang chủ) */}
        {!isLoading && packages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {packages.slice(0, 3).map((pkg, idx) => {
              const features = getPackageFeatures(pkg);
              const formattedPrice = pkg.price
                ? Number(pkg.price).toLocaleString('vi-VN')
                : 'Liên hệ';

              return (
                <ScrollReveal
                  key={pkg.id}
                  direction="up"
                  delay={idx * 0.1}
                  duration={0.6}
                  className="flex"
                >
                  <div
                    className="group flex flex-col justify-between relative overflow-hidden rounded-3xl p-0 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#B85064]/20 hover:border-[#B85064] hover:ring-1 hover:ring-[#B85064]/40 w-full bg-white border border-[#F0E4E6] shadow-sm"
                  >
                    <div>
                      {/* Product Image Cover */}
                      <div className="relative h-56 w-full overflow-hidden bg-neutral-100">
                        <img
                          src={pkg.displayImage}
                          alt={pkg.name}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#B85064] text-white shadow-md">
                            {pkg.badgeTag}
                          </span>
                          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-[#F5D5DC] text-[#2A1D22] text-xs shadow-sm">
                            <StarIcon className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="font-bold">5.0</span>
                          </div>
                        </div>

                        {pkg.duration && (
                          <div className="absolute bottom-3 left-3">
                            <span className="flex items-center gap-1 text-[11px] font-bold text-[#B85064] bg-white/95 px-2.5 py-1 rounded-md border border-[#F5D5DC] shadow-sm">
                              <ClockIcon className="w-3 h-3 text-[#B85064]" />
                              <span>{pkg.duration} phút</span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Body */}
                      <div className="p-6 sm:p-7">
                        <h3 className="text-xl sm:text-2xl font-bold text-[#2A1D22] mb-2 group-hover:text-[#B85064] transition-colors">
                          {pkg.name}
                        </h3>

                        <p className="text-xs text-[#7A6C71] font-light mb-6 min-h-[38px] leading-relaxed line-clamp-2">
                          {pkg.description || 'Dịch vụ chụp ảnh nghệ thuật tại Studio.'}
                        </p>

                        {/* Price from Database */}
                        <div className="mb-6 pb-6 border-b border-[#F0E4E6]">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-3xl sm:text-4xl font-extrabold text-[#B85064] tracking-tight font-sans">
                              {formattedPrice}
                            </span>
                            <span className="text-base font-bold text-[#B85064]">VNĐ</span>
                          </div>
                          <span className="text-xs text-[#7A6C71] mt-1 block">
                            Trọn gói thiết bị & không gian phòng chụp
                          </span>
                        </div>

                        {/* Features */}
                        <div className="space-y-2.5 mb-6">
                          {features.slice(0, 3).map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-2.5">
                              <div className="w-4 h-4 rounded-full bg-[#FDF0F3] text-[#B85064] flex items-center justify-center shrink-0 mt-0.5">
                                <CheckIcon className="w-3 h-3 stroke-[3]" />
                              </div>
                              <span className="text-xs text-[#55464B] font-light leading-snug truncate">
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
                        className="cursor-pointer py-3 px-3 rounded-2xl font-bold text-xs tracking-wide transition-all border border-[#E8DCDE] bg-white text-[#2A1D22] hover:bg-[#FDF0F3] hover:text-[#B85064] text-center flex items-center justify-center shadow-sm"
                      >
                        Xem Chi Tiết
                      </Link>

                      <button
                        onClick={() => (onSelectPackage ? onSelectPackage(pkg.id) : null)}
                        className="cursor-pointer py-3 px-3 rounded-2xl font-bold text-xs tracking-wide transition-all duration-300 flex items-center justify-center gap-1.5 bg-[#B85064] text-white hover:bg-[#A33D50] shadow-md shadow-[#B85064]/20 hover:scale-[1.03]"
                      >
                        <span>Đặt Lịch Ngay</span>
                        <ArrowRightIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}

        {/* View All Packages Link to /packages */}
        <div className="text-center mb-16">
          <Link
            to={ROUTES.USER.PACKAGES}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white border border-[#B85064]/40 text-[#B85064] hover:bg-[#B85064] hover:text-white text-sm font-bold shadow-md transition-all duration-300 hover:scale-105"
          >
            <span>Xem Toàn Bộ Bảng Giá & Phòng Trưng Bày Sản Phẩm</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* Real Additional Services from Database */}
        {!isLoading && additionalServices.length > 0 && (
          <ScrollReveal direction="up" delay={0.2}>
            <div className="rounded-3xl border border-[#F0E4E6] bg-white p-8 sm:p-10 relative overflow-hidden shadow-[0_8px_30px_rgb(184,80,100,0.06)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-[#F0E4E6] pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FDF0F3] text-[#B85064] flex items-center justify-center border border-[#F5D5DC] shadow-inner">
                    <WrenchScrewdriverIcon className="w-6 h-6 text-[#B85064]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#2A1D22] font-serif-luxury">Dịch Vụ Phụ Trợ & Tiện Ích</h3>
                    <p className="text-xs text-[#7A6C71]">Đồng bộ từ danh mục dịch vụ trong cơ sở dữ liệu</p>
                  </div>
                </div>
                <span className="text-xs text-[#B85064] bg-[#FDF0F3] px-3.5 py-1.5 rounded-full border border-[#F5D5DC] w-fit font-medium">
                  ✨ {additionalServices.length} Dịch vụ khả dụng
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {additionalServices.map((service) => (
                  <div
                    key={service.id}
                    className="group relative p-6 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6] hover:border-[#B85064]/60 hover:bg-white hover:shadow-xl hover:shadow-[#B85064]/10 transition-all duration-300 hover:-translate-y-1.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#F5D5DC] flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-sm text-[#B85064]">
                      <SparklesIcon className="w-5 h-5 text-[#B85064]" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#B85064] mb-1 block">
                      Loại: {service.type || 'Dịch vụ'}
                    </span>
                    <h4 className="text-sm font-bold text-[#2A1D22] group-hover:text-[#B85064] mb-1.5 transition-colors">
                      {service.name}
                    </h4>
                    <p className="text-xs text-[#7A6C71] mb-4 font-light leading-relaxed min-h-[36px]">
                      {service.description || 'Dịch vụ tiện ích studio hỗ trợ buổi chụp'}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-[#F0E4E6]">
                      <p className="text-sm font-extrabold text-[#B85064]">
                        {service.price ? `${Number(service.price).toLocaleString('vi-VN')}đ` : 'Liên hệ'}
                      </p>
                      {service.duration ? (
                        <span className="text-[11px] text-[#7A6C71] flex items-center gap-1">
                          <ClockIcon className="w-3 h-3 text-[#B85064]" />
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
