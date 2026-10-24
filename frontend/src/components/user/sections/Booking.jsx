import { useState, useEffect, useRef } from 'react';
import {
  SparklesIcon,
  CalendarDaysIcon,
  PhoneIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  ClockIcon,
  ShieldCheckIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  TrophyIcon,
  UserGroupIcon,
  CameraIcon,
} from '@heroicons/react/24/solid';
import ShinyText from '../../animations/ShinyText';
import ScrollReveal from '../../animations/ScrollReveal';
import customerPackageService from '../../../services/user/packageService';
import customerRoomService from '../../../services/user/roomService';
import customerBookingService from '../../../services/user/bookingService';
import { customerAuth } from '../../../lib/axiosCustomer';

const MONTH_NAMES = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];
const WEEK_DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

const padZero = (n) => (n < 10 ? `0${n}` : `${n}`);

const formatDateDisplay = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts.map(Number);
  const dateObj = new Date(y, m - 1, d);
  const dayOfWeekIndex = dateObj.getDay();
  const dayNames = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  return `${dayNames[dayOfWeekIndex]}, ${padZero(d)}/${padZero(m)}/${y}`;
};

export default function CTA({ selectedPackage }) {
  const [packageOptions, setPackageOptions] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    packageId: selectedPackage ? selectedPackage.name : '',
    date: '',
    note: '',
  });

  const [isPackageOpen, setIsPackageOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const packageRef = useRef(null);
  const datePickerRef = useRef(null);

  // Tải danh sách Gói chụp và Phòng từ database
  useEffect(() => {
    void customerPackageService
      .getAllPackages()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const icons = [HeartIcon, TrophyIcon, UserGroupIcon, CameraIcon];
          const colors = ['text-rose-400', 'text-amber-400', 'text-sky-400', 'text-emerald-400'];
          const bgs = [
            'bg-rose-500/15 border-rose-500/30',
            'bg-amber-500/15 border-amber-500/30',
            'bg-sky-500/15 border-sky-500/30',
            'bg-emerald-500/15 border-emerald-500/30',
          ];
          const active = data.filter((p) => !p.status || p.status === 'active');
          const mapped = active.map((pkg, idx) => ({
            id: pkg.id,
            name: pkg.name,
            price: pkg.price ? `${Number(pkg.price).toLocaleString('vi-VN')}đ` : 'Liên hệ',
            badge: pkg.duration ? `${pkg.duration}p` : 'Gói Chụp',
            tag: idx === 1 ? 'Best Seller' : 'Phổ Biến',
            icon: icons[idx % icons.length],
            iconColor: colors[idx % colors.length],
            iconBg: bgs[idx % bgs.length],
          }));
          setPackageOptions(mapped);
          if (mapped.length > 0) {
            setFormData((prev) => ({
              ...prev,
              packageId: prev.packageId || mapped[0].name,
            }));
          }
        }
      })
      .catch((err) => {
        console.warn('[Booking] Lỗi tải gói chụp từ database:', err.message);
      });

    void customerRoomService
      .getAllRooms()
      .then((data) => {
        if (Array.isArray(data)) setRooms(data);
      })
      .catch((err) => {
        console.warn('[Booking] Lỗi tải phòng:', err);
      });
  }, []);

  const [prevSelectedPkg, setPrevSelectedPkg] = useState(selectedPackage);
  if (selectedPackage !== prevSelectedPkg) {
    setPrevSelectedPkg(selectedPackage);
    if (selectedPackage?.name) {
      setFormData((prev) => ({ ...prev, packageId: selectedPackage.name }));
    }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (packageRef.current && !packageRef.current.contains(e.target)) {
        setIsPackageOpen(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
        setIsDatePickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyPromo = () => {
    navigator.clipboard.writeText('STUDIO2026');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const canGoPrev = !(
    currentYear < today.getFullYear() ||
    (currentYear === today.getFullYear() && currentMonth <= today.getMonth())
  );

  const handlePrevMonth = () => {
    if (!canGoPrev) return;
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleSelectToday = () => {
    const now = new Date();
    const str = `${now.getFullYear()}-${padZero(now.getMonth() + 1)}-${padZero(now.getDate())}`;
    setFormData((prev) => ({ ...prev, date: str }));
    setIsDatePickerOpen(false);
  };

  const handleSelectTomorrow = () => {
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    const str = `${tmr.getFullYear()}-${padZero(tmr.getMonth() + 1)}-${padZero(tmr.getDate())}`;
    setFormData((prev) => ({ ...prev, date: str }));
    setIsDatePickerOpen(false);
  };

  const handleSelectWeekend = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = (6 - day + 7) % 7 || 7;
    const sat = new Date();
    sat.setDate(now.getDate() + diff);
    const str = `${sat.getFullYear()}-${padZero(sat.getMonth() + 1)}-${padZero(sat.getDate())}`;
    setFormData((prev) => ({ ...prev, date: str }));
    setIsDatePickerOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Vui lòng điền họ tên và số điện thoại liên hệ!');
      return;
    }
    if (formData.date) {
      const [y, m, d] = formData.date.split('-').map(Number);
      const chosen = new Date(y, m - 1, d);
      chosen.setHours(0, 0, 0, 0);
      if (chosen < today) {
        alert('Ngày chụp không thể nhỏ hơn ngày hiện tại. Vui lòng chọn lại ngày chụp!');
        return;
      }
    }

    setIsSubmitting(true);

    const bookingDateStr = formData.date || `${today.getFullYear()}-${padZero(today.getMonth() + 1)}-${padZero(today.getDate())}`;
    const roomIdToUse = rooms.length > 0 ? rooms[0].id : 1;
    const currentCustomer = customerAuth.getUser();

    const payload = {
      customerId: currentCustomer?.id || 1,
      roomId: roomIdToUse,
      bookingDate: `${bookingDateStr}T09:00:00`,
      startTime: '09:00:00',
      endTime: '11:00:00',
      status: 'pending',
      customerNote: `Khách: ${formData.name} - SĐT: ${formData.phone} - Gói: ${formData.packageId}${formData.note ? ` - ${formData.note}` : ''}`,
    };

    try {
      await customerBookingService.createBooking(payload);
    } catch (err) {
      console.warn('[Booking] Lỗi gửi đơn đặt lịch tới database:', err.message);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <section id="booking" className="py-24 bg-neutral-950 relative overflow-hidden border-t border-white/10">
      {/* Background Studio Illumination */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-amber-500/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-600/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Promotional Banner */}
        <ScrollReveal direction="down">
          <div className="mb-16 relative overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-r from-neutral-900 via-amber-950/40 to-neutral-900 p-8 sm:p-12 shadow-2xl shadow-amber-500/15">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/30">
                  <SparklesIcon className="w-4 h-4 text-amber-400 animate-pulse" />
                  <ShinyText text="ƯU ĐÃI ĐẶC BIỆT MÙA CƯỚI 2026" />
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3">
                  Giảm Ngay 20% Khi Đặt Lịch Chụp Trong Tháng Này
                </h3>
                <p className="text-neutral-300 text-sm sm:text-base font-light max-w-2xl leading-relaxed">
                  Tặng kèm 01 Album Mini cao cấp khổ 15x21cm, miễn phí toàn bộ phụ kiện hoa cưới và trang phục khi đăng ký gói chụp studio.
                </p>
              </div>

              {/* Promo Code Box with Functional Copy Button */}
              <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
                <div className="p-5 rounded-2xl bg-neutral-950/90 border-2 border-amber-500/40 text-center shadow-xl backdrop-blur-md">
                  <span className="text-xs text-neutral-300 block mb-1 font-semibold">Mã Ưu Đãi Áp Dụng:</span>
                  <div className="text-2xl font-mono font-extrabold text-amber-400 tracking-widest mb-3 select-all">
                    STUDIO2026
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyPromo}
                    className={`cursor-pointer w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                      copied
                        ? 'bg-emerald-500 text-neutral-950 shadow-lg shadow-emerald-500/30'
                        : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-neutral-950 shadow-lg shadow-amber-500/20 hover:scale-105'
                    }`}
                  >
                    {copied ? (
                      <>
                        <CheckIcon className="w-4 h-4 text-white stroke-[3]" />
                        <span>Đã Sao Chép Mã!</span>
                      </>
                    ) : (
                      <>
                        <DocumentDuplicateIcon className="w-4 h-4 text-white" />
                        <span>Sao Chép Mã Ưu Đãi</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </ScrollReveal>

        {/* Booking Consultation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Studio Information */}
          <div className="lg:col-span-5 space-y-6">
            <ScrollReveal direction="right" delay={0.1}>
              <div>
                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block mb-2">
                  Liên Hệ & Giữ Lịch
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Sẵn Sàng Cho Bộ Ảnh Tuyệt Vời Nhất Của Bạn?
                </h2>
              </div>

              <p className="text-neutral-300 text-sm sm:text-base font-light leading-relaxed mt-4">
                Điền thông tin vào mẫu bên cạnh, đội ngũ tư vấn của PhotoStudio sẽ liên hệ lại với bạn trong vòng 15 phút để tư vấn concept, trang phục và sắp xếp lịch chụp thuận tiện nhất.
              </p>
            </ScrollReveal>

            {/* 3 Interactive Info Cards */}
            <div className="space-y-4 pt-4">
              
              {/* Card 1: Giờ làm việc */}
              <ScrollReveal direction="right" delay={0.2}>
                <div className="group relative p-4 rounded-2xl bg-neutral-900/90 border border-white/15 hover:border-amber-400/60 hover:bg-neutral-850 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-neutral-950 transition-all duration-300 shadow-md">
                    <ClockIcon className="w-6 h-6 text-amber-400 group-hover:text-neutral-950" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                        Giờ Làm Việc Linh Hoạt
                      </h4>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        Mở cửa
                      </span>
                    </div>
                    <p className="text-xs text-neutral-200 mt-0.5">
                      08:00 - 21:00 hàng ngày (Cả thứ 7 & Chủ Nhật)
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Card 2: Hotline */}
              <ScrollReveal direction="right" delay={0.3}>
                <a
                  href="tel:0901234567"
                  className="group relative p-4 rounded-2xl bg-neutral-900/90 border border-white/15 hover:border-amber-400/60 hover:bg-neutral-850 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 flex items-center gap-4 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-neutral-950 transition-all duration-300 shadow-md">
                    <PhoneIcon className="w-6 h-6 text-amber-400 group-hover:text-neutral-950" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                        Hotline Hỗ Trợ 24/7
                      </h4>
                      <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                        Gọi ngay
                      </span>
                    </div>
                    <p className="text-xs font-mono font-bold text-amber-300 mt-0.5">
                      0901 234 567 - 0912 345 678
                    </p>
                  </div>
                </a>
              </ScrollReveal>

              {/* Card 3: Cam kết */}
              <ScrollReveal direction="right" delay={0.4}>
                <div className="group relative p-4 rounded-2xl bg-neutral-900/90 border border-white/15 hover:border-amber-400/60 hover:bg-neutral-850 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-neutral-950 transition-all duration-300 shadow-md">
                    <ShieldCheckIcon className="w-6 h-6 text-amber-400 group-hover:text-neutral-950" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                        Bảo Hành & Lưu Trữ Trọn Đời
                      </h4>
                      <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/15 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                        Cloud VIP
                      </span>
                    </div>
                    <p className="text-xs text-neutral-200 mt-0.5">
                      Lưu trữ file gốc đám mây, hỗ trợ chỉnh sửa lại miễn phí
                    </p>
                  </div>
                </div>
              </ScrollReveal>

            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <ScrollReveal direction="left" delay={0.2}>
              <div className="relative rounded-3xl border border-white/20 bg-neutral-900/85 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl">
                {submitted ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-500/40 shadow-xl shadow-emerald-500/20 animate-bounce">
                      <CheckCircleIcon className="w-9 h-9 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Gửi Yêu Cầu Thành Công!</h3>
                    <p className="text-neutral-300 text-sm max-w-md mx-auto leading-relaxed">
                      Cảm ơn <strong>{formData.name}</strong> đã tin tưởng lựa chọn PhotoStudio. Chuyên viên tư vấn sẽ liên hệ tới số điện thoại <strong>{formData.phone}</strong> trong ít phút!
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', phone: '', packageId: packageOptions[0]?.name || '', date: '', note: '' });
                      }}
                      className="cursor-pointer mt-4 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
                    >
                      Gửi Yêu Cầu Khác
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-neutral-200 mb-2">
                          Họ và Tên của bạn *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Nguyễn Văn A"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl bg-neutral-950 border border-white/20 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-200 mb-2">
                          Số Điện Thoại / Zalo *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="0901 234 567"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl bg-neutral-950 border border-white/20 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Package Dropdown */}
                      <div className="relative" ref={packageRef}>
                        <label className="block text-xs font-bold text-neutral-200 mb-2">
                          Gói Chụp Quan Tâm *
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setIsPackageOpen(!isPackageOpen);
                            setIsDatePickerOpen(false);
                          }}
                          className={`w-full h-[52px] px-3.5 rounded-xl bg-neutral-950 border text-left text-sm flex items-center justify-between transition-all duration-300 cursor-pointer ${
                            isPackageOpen
                              ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-lg shadow-amber-500/10'
                              : 'border-white/20 hover:border-amber-400/60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            {(() => {
                              const curr = packageOptions.find((pkg) => pkg.name === formData.packageId) || packageOptions[0];
                              if (!curr) {
                                return (
                                  <div className="flex items-center gap-2 text-neutral-400 text-xs">
                                    <SparklesIcon className="w-4 h-4 text-amber-400 animate-pulse" />
                                    <span>Đang tải gói chụp từ CSDL...</span>
                                  </div>
                                );
                              }
                              const CurrIcon = curr.icon || SparklesIcon;
                              return (
                                <>
                                  <div className={`w-8 h-8 rounded-lg ${curr.iconBg || 'bg-amber-500/20'} border flex items-center justify-center shrink-0`}>
                                    <CurrIcon className={`w-4 h-4 ${curr.iconColor || 'text-amber-400'}`} />
                                  </div>
                                  <div className="truncate">
                                    <span className="block text-white font-semibold text-xs sm:text-sm truncate">
                                      {curr.name}
                                    </span>
                                    <span className="text-[11px] text-amber-400 font-bold">
                                      {curr.price}
                                    </span>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                          <ChevronDownIcon className={`w-4 h-4 text-neutral-400 transition-transform duration-300 shrink-0 ml-2 ${isPackageOpen ? 'rotate-180 text-amber-400' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isPackageOpen && (
                          <div className="absolute top-full left-0 right-0 mt-2 z-30 rounded-2xl border border-amber-500/40 bg-neutral-900/98 backdrop-blur-2xl shadow-2xl shadow-black/80 overflow-hidden p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            {packageOptions.map((pkg) => {
                              const PkgIcon = pkg.icon || SparklesIcon;
                              const isSelected = formData.packageId === pkg.name;
                              return (
                                <button
                                  key={pkg.id}
                                  type="button"
                                  onClick={() => {
                                    setFormData((prev) => ({ ...prev, packageId: pkg.name }));
                                    setIsPackageOpen(false);
                                  }}
                                  className={`cursor-pointer w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all duration-200 ${
                                    isSelected
                                      ? 'bg-amber-500/20 border border-amber-500/40'
                                      : 'hover:bg-neutral-800/80'
                                  }`}
                                >
                                  <div className="flex items-center gap-3 truncate">
                                    <div className={`w-8 h-8 rounded-lg ${pkg.iconBg || 'bg-amber-500/20'} border flex items-center justify-center shrink-0`}>
                                      <PkgIcon className={`w-4 h-4 ${pkg.iconColor || 'text-amber-400'}`} />
                                    </div>
                                    <div className="truncate">
                                      <span className="text-white font-semibold text-xs sm:text-sm block truncate">
                                        {pkg.name}
                                      </span>
                                      <span className="text-[11px] text-neutral-400">
                                        {pkg.price}
                                      </span>
                                    </div>
                                  </div>
                                  {isSelected && (
                                    <CheckIcon className="w-4 h-4 text-amber-400 shrink-0 stroke-[3]" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Calendar Dropdown */}
                      <div className="relative" ref={datePickerRef}>
                        <label className="block text-xs font-bold text-neutral-200 mb-2">
                          Ngày Chụp Dự Kiến
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setIsDatePickerOpen(!isDatePickerOpen);
                            setIsPackageOpen(false);
                          }}
                          className={`w-full h-[52px] px-3.5 rounded-xl bg-neutral-950 border text-left text-sm flex items-center justify-between transition-all duration-300 cursor-pointer ${
                            isDatePickerOpen
                              ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-lg shadow-amber-500/10'
                              : 'border-white/20 hover:border-amber-400/60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                              <CalendarDaysIcon className="w-4 h-4 text-amber-400" />
                            </div>
                            <span className={formData.date ? 'text-white font-semibold text-xs sm:text-sm' : 'text-neutral-500 text-xs sm:text-sm'}>
                              {formData.date ? formatDateDisplay(formData.date) : 'Chọn ngày chụp mong muốn'}
                            </span>
                          </div>
                          <ChevronDownIcon className={`w-4 h-4 text-neutral-400 transition-transform duration-300 shrink-0 ml-2 ${isDatePickerOpen ? 'rotate-180 text-amber-400' : ''}`} />
                        </button>

                        {/* Calendar Popover */}
                        {isDatePickerOpen && (
                          <div className="absolute top-full right-0 sm:left-0 sm:right-auto mt-2 z-40 w-full sm:w-[320px] rounded-2xl border border-amber-500/40 bg-neutral-900/98 backdrop-blur-2xl shadow-2xl shadow-black/90 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                            
                            {/* Calendar Header with navigation */}
                            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/10">
                              <div>
                                <span className="text-sm font-bold text-white block">
                                  {MONTH_NAMES[currentMonth]} {currentYear}
                                </span>
                                <span className="text-[10px] text-amber-400 font-medium">
                                  🔒 Chọn từ hôm nay trở đi
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={handlePrevMonth}
                                  disabled={!canGoPrev}
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
                                    canGoPrev
                                      ? 'border-white/15 bg-neutral-800 text-white hover:bg-neutral-700 hover:border-amber-400 cursor-pointer'
                                      : 'border-transparent text-neutral-600 opacity-20 cursor-not-allowed'
                                  }`}
                                  title="Tháng trước"
                                >
                                  <ChevronLeftIcon className="w-4 h-4" />
                                </button>

                                <button
                                  type="button"
                                  onClick={handleNextMonth}
                                  className="cursor-pointer w-7 h-7 rounded-lg border border-white/15 bg-neutral-800 text-white hover:bg-neutral-700 hover:border-amber-400 flex items-center justify-center transition-all"
                                  title="Tháng sau"
                                >
                                  <ChevronRightIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Weekday Labels */}
                            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                              {WEEK_DAYS.map((day, idx) => (
                                <span
                                  key={day}
                                  className={`text-[11px] font-bold py-0.5 ${
                                    idx >= 5 ? 'text-amber-400' : 'text-neutral-400'
                                  }`}
                                >
                                  {day}
                                </span>
                              ))}
                            </div>

                            {/* Days Grid */}
                            <div className="grid grid-cols-7 gap-1 text-center mb-3">
                              {(() => {
                                const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                                const firstDayRaw = new Date(currentYear, currentMonth, 1).getDay();
                                const blankDays = firstDayRaw === 0 ? 6 : firstDayRaw - 1;

                                const elements = [];
                                for (let i = 0; i < blankDays; i++) {
                                  elements.push(<div key={`blank-${i}`} className="h-8 w-8" />);
                                }

                                for (let dayNum = 1; dayNum <= daysInCurrentMonth; dayNum++) {
                                  const cellDate = new Date(currentYear, currentMonth, dayNum);
                                  cellDate.setHours(0, 0, 0, 0);
                                  const isPast = cellDate < today;
                                  const isToday = cellDate.getTime() === today.getTime();
                                  const dateStr = `${currentYear}-${padZero(currentMonth + 1)}-${padZero(dayNum)}`;
                                  const isSelected = formData.date === dateStr;

                                  if (isPast) {
                                    elements.push(
                                      <div
                                        key={`day-${dayNum}`}
                                        className="h-8 w-8 mx-auto rounded-lg flex items-center justify-center text-xs text-neutral-600 line-through opacity-25 cursor-not-allowed select-none"
                                        title="Không thể chọn ngày trong quá khứ"
                                      >
                                        {dayNum}
                                      </div>
                                    );
                                  } else {
                                    elements.push(
                                      <button
                                        key={`day-${dayNum}`}
                                        type="button"
                                        onClick={() => {
                                          setFormData((prev) => ({ ...prev, date: dateStr }));
                                          setIsDatePickerOpen(false);
                                        }}
                                        className={`cursor-pointer h-8 w-8 mx-auto rounded-lg flex items-center justify-center text-xs font-semibold transition-all duration-200 relative group ${
                                          isSelected
                                            ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-neutral-950 font-extrabold shadow-lg shadow-amber-500/40 scale-105'
                                            : isToday
                                            ? 'border border-amber-400 text-amber-300 hover:bg-amber-400/20'
                                            : 'text-neutral-200 hover:bg-neutral-800 hover:text-white'
                                        }`}
                                      >
                                        {dayNum}
                                      </button>
                                    );
                                  }
                                }
                                return elements;
                              })()}
                            </div>

                            {/* Quick Select Buttons */}
                            <div className="pt-2 border-t border-white/10 flex items-center gap-1.5 text-xs">
                              <button
                                type="button"
                                onClick={handleSelectToday}
                                className="cursor-pointer flex-1 py-1.5 px-2 rounded-lg bg-neutral-800/80 hover:bg-amber-500/20 text-neutral-300 hover:text-amber-300 border border-white/10 hover:border-amber-400/40 transition-all font-medium text-center"
                              >
                                Hôm nay
                              </button>
                              <button
                                type="button"
                                onClick={handleSelectTomorrow}
                                className="cursor-pointer flex-1 py-1.5 px-2 rounded-lg bg-neutral-800/80 hover:bg-amber-500/20 text-neutral-300 hover:text-amber-300 border border-white/10 hover:border-amber-400/40 transition-all font-medium text-center"
                              >
                                Ngày mai
                              </button>
                              <button
                                type="button"
                                onClick={handleSelectWeekend}
                                className="cursor-pointer flex-1 py-1.5 px-2 rounded-lg bg-neutral-800/80 hover:bg-amber-500/20 text-neutral-300 hover:text-amber-300 border border-white/10 hover:border-amber-400/40 transition-all font-medium text-center"
                              >
                                Cuối tuần
                              </button>
                            </div>

                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-200 mb-2">
                        Ghi Chú Hoặc Ý Tưởng Concept Riêng
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Ví dụ: Mình muốn chụp tone màu ấm Hàn Quốc, cần hỗ trợ thêm làm tóc..."
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/20 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="cursor-pointer w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-neutral-950 font-extrabold text-base shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-50"
                    >
                      <PaperAirplaneIcon className="w-4 h-4 text-white" />
                      <span>{isSubmitting ? 'Đang Gửi Đơn Đặt...' : 'Xác Nhận Đặt Lịch & Nhận Ưu Đãi 20%'}</span>
                    </button>

                    <p className="text-[11px] text-center text-neutral-400 font-light">
                      * Thông tin của bạn được cam kết bảo mật 100%. Không làm phiền ngoài lịch tư vấn chụp ảnh.
                    </p>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
}
