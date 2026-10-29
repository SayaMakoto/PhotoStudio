import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  HeartIcon,
  TagIcon,
} from '@heroicons/react/24/solid';
import { ROUTES } from '../../routes/web';
import { customerAuth } from '../../lib/axiosCustomer';
import customerContactService from '../../services/user/contactService';
import { FloralBranchCorner, FloralCardCorner } from '../../components/common/FloralDecorations';

const SUBJECT_OPTIONS = [
  { value: 'Tư vấn concept độc bản riêng', label: 'Tư vấn concept độc bản riêng' },
  { value: 'Tư vấn gói chụp cưới Studio & váy cưới', label: 'Tư vấn gói chụp cưới Studio & váy cưới' },
  { value: 'Báo giá chụp lookbook thời trang / doanh nhân', label: 'Báo giá chụp lookbook thời trang / doanh nhân' },
  { value: 'Chụp ảnh gia đình đoàn viên & kỷ yếu', label: 'Chụp ảnh gia đình đoàn viên & kỷ yếu' },
  { value: 'Thuê phòng studio & thiết bị ánh sáng', label: 'Thuê phòng studio & thiết bị ánh sáng' },
  { value: 'Thắc mắc khác & Góp ý dịch vụ', label: 'Thắc mắc khác & Góp ý dịch vụ' },
];

export default function ContactPage() {
  const currentUser = useMemo(() => {
    return customerAuth.isAuthenticated() ? customerAuth.getUser() : null;
  }, []);

  const [formData, setFormData] = useState({
    fullname: currentUser?.fullname || currentUser?.username || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    subject: 'Tư vấn concept độc bản riêng',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullname.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên của bạn.');
      return;
    }
    if (!formData.email.trim() && !formData.phone.trim()) {
      setErrorMessage('Vui lòng cung cấp ít nhất số điện thoại hoặc email để chúng tôi có thể liên hệ.');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMessage('Vui lòng nhập nội dung ý tưởng hoặc yêu cầu cần tư vấn.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        userId: currentUser?.id || null,
        fullname: formData.fullname.trim(),
        email: formData.email.trim() || `${formData.phone.trim()}@photostudio.customer`,
        phone: formData.phone.trim(),
        subject: formData.subject,
        message: formData.message.trim(),
      };

      await customerContactService.sendContact(payload);
      setIsSuccess(true);
      setFormData({
        fullname: currentUser?.fullname || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        subject: 'Tư vấn concept độc bản riêng',
        message: '',
      });
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || 'Có lỗi xảy ra khi gửi liên hệ. Vui lòng thử lại hoặc gọi Hotline!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF5F5] min-h-screen text-[#261A1E] font-sans selection:bg-[#B85064]/20 selection:text-[#B85064] relative overflow-hidden pb-24">
      {/* ========================================================================= */}
      {/* 1. HERO BANNER ĐIỆN ẢNH VỚI BREADCRUMB */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[400px] lg:min-h-[440px] bg-[#141012] overflow-hidden flex items-center pt-28 pb-16 mb-12">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70 scale-105 pointer-events-none"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141012]/92 via-[#141012]/70 to-[#141012]/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#FAF5F5] pointer-events-none" />

        {/* Ambient spotlight glow */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[350px] bg-[#E5A8B4]/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Họa tiết cành hoa đào nghệ thuật trên nền Hero */}
        <FloralBranchCorner position="top-left" opacity="opacity-90" />
        <FloralBranchCorner position="top-right" opacity="opacity-80" />

        {/* Chữ script viết tay góc phải */}
        <div className="absolute top-28 right-8 sm:right-16 text-white/50 font-handwriting text-2xl sm:text-3xl select-none pointer-events-none transform rotate-3 hidden sm:block">
          Không gian nghệ thuật của riêng bạn ♡
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <div className="max-w-3xl space-y-4 pt-2">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <Link to={ROUTES.USER.HOME} className="hover:text-[#E899A8] transition-colors">
                Trang Chủ
              </Link>
              <span>/</span>
              <span className="text-[#E899A8] font-semibold">Liên Hệ & Tư Vấn Concept</span>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-[#E899A8] text-xs font-semibold uppercase tracking-wider shadow-lg backdrop-blur-md">
              <ChatBubbleLeftRightIcon className="w-4 h-4 text-white" />
              <span>HỆ THỐNG TƯ VẤN & HỖ TRỢ KHÁCH HÀNG PHOTOSTUDIO</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.2] font-serif-luxury tracking-tight">
              Kết Nối & Tư Vấn
              <br />
              <span className="italic font-normal text-[#E899A8] font-serif-luxury mr-2">
                Concept Độc Bản
              </span>
              Cùng Ekip
            </h1>

            <p className="text-[#E2D5D9] text-xs sm:text-sm md:text-base font-light max-w-2xl leading-relaxed pt-1">
              Bạn đang ấp ủ ý tưởng cho một bộ ảnh cưới, lookbook thương mại hay chân dung cá nhân độc đáo? Hãy gửi thông tin cho PhotoStudio, đội ngũ Stylist & Nhiếp ảnh gia sẽ liên hệ tư vấn bối cảnh, trang phục và dự toán chi tiết hoàn toàn miễn phí.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. BODY CONTENT: 2 CỘT (THÔNG TIN LIÊN HỆ & FORM GỬI VÀO CSDL) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* CỘT TRÁI: THÔNG TIN LIÊN HỆ & BẢN ĐỒ / CAM KẾT (5 CỘT) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Thẻ Thông tin nhanh */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E4E6] shadow-sm relative overflow-hidden">
              <FloralCardCorner position="top-right" />
              
              <h3 className="text-xl font-bold font-serif-luxury text-[#261A1E] mb-6 flex items-center gap-2.5">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-[#B85064]" />
                <span>Kênh Liên Hệ Trực Tiếp</span>
              </h3>

              <div className="space-y-5 text-sm">
                {/* Địa chỉ */}
                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6]/60">
                  <div className="w-10 h-10 rounded-xl bg-[#B85064]/10 text-[#B85064] flex items-center justify-center shrink-0">
                    <MapPinIcon className="w-5 h-5 text-[#B85064]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#261A1E] text-xs uppercase tracking-wider mb-0.5">Địa Chỉ Trụ Sở Studio</h4>
                    <p className="text-xs text-[#55464B] leading-relaxed">
                      123 Đường Sáng Tạo, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh
                    </p>
                  </div>
                </div>

                {/* Hotline */}
                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6]/60">
                  <div className="w-10 h-10 rounded-xl bg-[#B85064]/10 text-[#B85064] flex items-center justify-center shrink-0">
                    <PhoneIcon className="w-5 h-5 text-[#B85064]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#261A1E] text-xs uppercase tracking-wider mb-0.5">Hotline Tư Vấn 24/7</h4>
                    <a href="tel:0901234567" className="text-sm font-bold text-[#B85064] hover:underline">
                      0901 234 567
                    </a>
                    <span className="text-[11px] text-[#7A6C71] block">Hỗ trợ đặt lịch khẩn cấp & tư vấn báo giá</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6]/60">
                  <div className="w-10 h-10 rounded-xl bg-[#B85064]/10 text-[#B85064] flex items-center justify-center shrink-0">
                    <EnvelopeIcon className="w-5 h-5 text-[#B85064]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#261A1E] text-xs uppercase tracking-wider mb-0.5">Email Hòm Thư</h4>
                    <a href="mailto:support@photostudio.vn" className="text-xs font-semibold text-[#B85064] hover:underline">
                      support@photostudio.vn
                    </a>
                    <span className="text-[11px] text-[#7A6C71] block">Tiếp nhận hồ sơ hợp tác & hợp đồng tài trợ</span>
                  </div>
                </div>

                {/* Giờ mở cửa */}
                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6]/60">
                  <div className="w-10 h-10 rounded-xl bg-[#B85064]/10 text-[#B85064] flex items-center justify-center shrink-0">
                    <ClockIcon className="w-5 h-5 text-[#B85064]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#261A1E] text-xs uppercase tracking-wider mb-0.5">Thời Gian Làm Việc</h4>
                    <p className="text-xs text-[#55464B]">
                      <strong className="text-[#261A1E]">08:00 – 21:30</strong> hàng ngày
                    </p>
                    <span className="text-[11px] text-[#7A6C71] block">Mở cửa tất cả các ngày trong tuần & ngày lễ</span>
                  </div>
                </div>
              </div>

              {/* Cam kết của Studio */}
              <div className="mt-6 pt-5 border-t border-[#F0E4E6] space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-[#55464B]">
                  <ShieldCheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cam kết bảo mật 100% thông tin cá nhân khách hàng</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#55464B]">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Phản hồi trong vòng 15 – 30 phút qua điện thoại/Zalo</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#55464B]">
                  <HeartIcon className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Hỗ trợ phối layout concept miễn phí trước ngày chụp</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1C1619] to-[#2B1B22] text-white border border-rose-500/20 shadow-md">
              <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
                <TagIcon className="w-4 h-4 text-white" />
                <span>Khám Phá Dịch Vụ</span>
              </div>
              <h4 className="text-base font-bold font-serif-luxury text-white mb-2">
                Xem Bảng Giá Trực Tuyến & 12 Phòng Chụp
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                Bạn cũng có thể xem trực tiếp thông số kích thước phòng, bối cảnh và toàn bộ bảng giá các gói chụp tại đây.
              </p>
              <div className="flex items-center gap-3">
                <Link
                  to={ROUTES.USER.PACKAGES}
                  className="px-4 py-2 rounded-full bg-[#B85064] hover:bg-[#A33D50] text-white text-xs font-semibold transition-all shadow-sm"
                >
                  Xem Gói Chụp
                </Link>
                <Link
                  to={ROUTES.USER.STUDIOS}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/20"
                >
                  Không Gian Phòng
                </Link>
              </div>
            </div>

          </div>

          {/* CỘT PHẢI: FORM GỬI LIÊN HỆ LƯU VÀO CSDL (7 CỘT) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F0E4E6] shadow-sm relative overflow-hidden">
              <FloralCardCorner position="top-right" />
              
              <div className="mb-6 pb-5 border-b border-[#F0E4E6]">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B85064] block mb-1">
                  GỬI YÊU CẦU TRỰC TUYẾN
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#261A1E]">
                  Gửi Tin Nhắn / Yêu Cầu Tư Vấn Concept
                </h2>
                <p className="text-xs sm:text-sm text-[#7A6C71] mt-1.5 leading-relaxed">
                  Thông tin của bạn sẽ được lưu trực tiếp vào cơ sở dữ liệu PhotoStudio và gửi thông báo tức thì đến quản trị viên và ekip chuyên môn.
                </p>
              </div>

              {/* Thông báo thành công */}
              {isSuccess && (
                <div className="mb-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3.5 animate-fadeIn">
                  <CheckCircleIcon className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-emerald-900">Gửi Yêu Cầu Liên Hệ Thành Công!</h4>
                    <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                      Cảm ơn bạn đã tin tưởng PhotoStudio! Yêu cầu tư vấn của bạn đã được lưu vào hệ thống cơ sở dữ liệu. Ekip tư vấn sẽ liên hệ lại với bạn trong thời gian sớm nhất qua số điện thoại hoặc email.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSuccess(false)}
                      className="mt-3 text-xs font-bold text-emerald-800 underline hover:text-emerald-950"
                    >
                      Gửi thêm tin nhắn khác
                    </button>
                  </div>
                </div>
              )}

              {/* Thông báo lỗi */}
              {errorMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Họ và tên */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#261A1E] mb-1.5">
                      Họ và tên của bạn <span className="text-[#B85064]">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      placeholder="Ví dụ: Nguyễn Thị Mai Phương"
                      required
                      className="w-full px-4 py-3 rounded-2xl border border-[#E8DCDE] bg-[#FAF5F5] text-xs sm:text-sm text-[#261A1E] focus:outline-none focus:border-[#B85064] focus:bg-white transition-all shadow-2xs"
                    />
                  </div>

                  {/* Số điện thoại */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#261A1E] mb-1.5">
                      Số điện thoại liên hệ <span className="text-[#B85064]">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Ví dụ: 0912 345 678"
                      required
                      className="w-full px-4 py-3 rounded-2xl border border-[#E8DCDE] bg-[#FAF5F5] text-xs sm:text-sm text-[#261A1E] focus:outline-none focus:border-[#B85064] focus:bg-white transition-all shadow-2xs"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#261A1E] mb-1.5">
                      Địa chỉ Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Ví dụ: maiphuong@gmail.com"
                      className="w-full px-4 py-3 rounded-2xl border border-[#E8DCDE] bg-[#FAF5F5] text-xs sm:text-sm text-[#261A1E] focus:outline-none focus:border-[#B85064] focus:bg-white transition-all shadow-2xs"
                    />
                  </div>
                </div>

                {/* Chủ đề tư vấn */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#261A1E] mb-1.5">
                    Chủ đề tư vấn mong muốn
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border border-[#E8DCDE] bg-[#FAF5F5] text-xs sm:text-sm text-[#261A1E] focus:outline-none focus:border-[#B85064] focus:bg-white transition-all shadow-2xs cursor-pointer"
                  >
                    {SUBJECT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nội dung tin nhắn */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#261A1E] mb-1.5">
                    Nội dung ý tưởng / Yêu cầu chi tiết <span className="text-[#B85064]">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Mô tả ý tưởng concept bạn mong muốn (ví dụ: chụp kỷ niệm ngày cưới tone vintage cổ điển, số lượng người tham gia, ngày dự kiến chụp, hoặc bất kỳ thắc mắc nào)..."
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-[#E8DCDE] bg-[#FAF5F5] text-xs sm:text-sm text-[#261A1E] focus:outline-none focus:border-[#B85064] focus:bg-white transition-all shadow-2xs resize-none"
                  />
                </div>

                {/* Nút gửi */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#BE4B5E] via-[#B85064] to-[#A8394C] hover:from-[#A8394C] hover:to-[#91283B] text-white text-sm font-bold shadow-lg shadow-[#B85064]/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Đang ghi nhận vào cơ sở dữ liệu...</span>
                      </>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="w-4 h-4 text-white" />
                        <span>Gửi Yêu Cầu Liên Hệ & Nhận Tư Vấn</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-[#7A6C71] mt-2.5">
                    Bằng việc gửi biểu mẫu, bạn đồng ý để nhân viên PhotoStudio liên hệ hỗ trợ bạn theo số điện thoại đã cung cấp.
                  </p>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
