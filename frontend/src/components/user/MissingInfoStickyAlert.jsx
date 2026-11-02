import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ExclamationTriangleIcon,
  PhoneIcon,
  MapPinIcon,
  CheckCircleIcon,
  XMarkIcon,
  PencilSquareIcon,
  CheckIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/solid';
import { customerAuth } from '../../lib/axiosCustomer';
import customerAuthService from '../../services/user/authService';
import { ROUTES } from '../../routes/web';
import {
  validateVietnamesePhone,
  isValidPhone,
  isAddressValid,
} from '../../utils/phoneValidator';

export default function MissingInfoStickyAlert() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => customerAuth.getUser());
  const [isDismissed, setIsDismissed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form cập nhật nhanh trong modal
  const [phoneInput, setPhoneInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [suggestedPhone, setSuggestedPhone] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [generalError, setGeneralError] = useState('');

  // Lắng nghe sự kiện cập nhật user profile
  useEffect(() => {
    const handleProfileUpdated = (e) => {
      if (e.detail) {
        setCurrentUser(e.detail);
      } else {
        setCurrentUser(customerAuth.getUser());
      }
    };

    window.addEventListener('user_profile_updated', handleProfileUpdated);
    window.addEventListener('storage', handleProfileUpdated);

    return () => {
      window.removeEventListener('user_profile_updated', handleProfileUpdated);
      window.removeEventListener('storage', handleProfileUpdated);
    };
  }, []);

  const isAuthenticated = customerAuth.isAuthenticated();

  // Kiểm tra số điện thoại: bắt đầu bằng 0, số thứ hai là 3, 5, 7, 8, 9 và đủ 10 ký tự
  const hasValidPhone = isValidPhone(currentUser?.phone);
  const hasValidAddress = isAddressValid(currentUser?.address);

  // Nếu chưa đăng nhập hoặc đã có đủ SĐT hợp lệ + Địa chỉ hoặc người dùng đã tạm tắt => Ẩn thông báo
  if (!isAuthenticated || (hasValidPhone && hasValidAddress) || isDismissed) {
    return null;
  }

  // Mở modal cập nhật nhanh
  const handleOpenModal = () => {
    setPhoneInput(currentUser?.phone || '');
    setAddressInput(currentUser?.address || '');
    setPhoneError('');
    setAddressError('');
    setGeneralError('');
    setSuggestedPhone(null);
    setIsModalOpen(true);
  };

  // Xử lý kiểm tra thời gian thực số điện thoại
  const handlePhoneChange = (val) => {
    setPhoneInput(val);
    setGeneralError('');
    if (!val.trim()) {
      setPhoneError('Số điện thoại không được để trống.');
      setSuggestedPhone(null);
      return;
    }
    const valResult = validateVietnamesePhone(val);
    if (!valResult.isValid) {
      setPhoneError(valResult.message);
      setSuggestedPhone(valResult.suggestedPhone);
    } else {
      setPhoneError('');
      setSuggestedPhone(null);
    }
  };

  // Xử lý lưu thông tin
  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setGeneralError('');

    const phoneVal = validateVietnamesePhone(phoneInput);
    let hasErr = false;

    if (!phoneVal.isValid) {
      setPhoneError(phoneVal.message);
      setSuggestedPhone(phoneVal.suggestedPhone);
      hasErr = true;
    } else {
      setPhoneError('');
    }

    if (!addressInput || !addressInput.trim()) {
      setAddressError('Vui lòng nhập địa chỉ nhận ảnh.');
      hasErr = true;
    } else if (addressInput.trim().length < 5) {
      setAddressError('Địa chỉ quá ngắn. Vui lòng nhập địa chỉ chi tiết hơn.');
      hasErr = true;
    } else {
      setAddressError('');
    }

    if (hasErr) return;

    setIsSubmitting(true);
    try {
      const updateData = {
        ...(currentUser || {}),
        phone: phoneVal.normalizedPhone,
        address: addressInput.trim(),
      };

      await customerAuthService.updateProfile(updateData);
      setSaveSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSaveSuccess(false);
      }, 1000);
    } catch (err) {
      setGeneralError(err.message || 'Không thể lưu thông tin. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* THANH NHẮC NHỞ NGANG DƯỚI THANH MENU (Độ rộng bằng thanh menu, chiều cao vừa vặn) */}
      <section
        aria-label="Cập nhật thông tin tài khoản"
        className="w-full bg-[#181114] border-b border-[#BE4B5E]/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-white text-xs sm:text-sm">
            {/* Cột trái: Biểu tượng & Lời nhắc */}
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <ExclamationTriangleIcon className="w-4 h-4" />
              </span>
              <p className="truncate sm:whitespace-normal text-gray-200">
                <span className="font-bold text-amber-300 mr-1.5">[Cần cập nhật]</span>
                Quý khách vui lòng bổ sung{' '}
                {!hasValidPhone && (
                  <span className="text-pink-300 font-semibold underline decoration-pink-400/50 mr-1">
                    Số điện thoại (đầu 0, 10 số)
                  </span>
                )}
                {!hasValidPhone && !hasValidAddress && 'và '}
                {!hasValidAddress && (
                  <span className="text-pink-300 font-semibold underline decoration-pink-400/50 mr-1">
                    Địa chỉ nhận ảnh
                  </span>
                )}
                để được đặt lịch và nhận ảnh tận nơi.
              </p>
            </div>

            {/* Cột phải: Các nút bấm thao tác */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleOpenModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#BE4B5E] hover:bg-[#a93e50] text-white font-medium text-xs shadow-sm hover:scale-105 active:scale-95 transition-all"
              >
                <PencilSquareIcon className="w-3.5 h-3.5" />
                <span>Cập nhật ngay</span>
              </button>
              <button
                type="button"
                onClick={() => navigate(ROUTES.USER.PROFILE)}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-gray-300 text-xs transition-colors"
              >
                Hồ sơ
              </button>
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                title="Tạm ẩn thanh nhắc nhở"
                className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL CẬP NHẬT NHANH SỐ ĐIỆN THOẠI & ĐỊA CHỈ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className="relative w-full max-w-lg rounded-2xl bg-[#191215] border border-[#BE4B5E]/40 shadow-2xl p-6 text-white font-sans overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modal */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#BE4B5E]/20 border border-[#BE4B5E]/40 flex items-center justify-center text-[#BE4B5E]">
                  <ShieldCheckIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-white">
                    Cập nhật Số điện thoại & Địa chỉ
                  </h3>
                  <p className="text-xs text-gray-400">
                    SĐT 10 chữ số (đầu 0) & Địa chỉ để studio liên hệ và gửi ảnh
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Thông báo thành công */}
            {saveSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-3 mb-4">
                <CheckCircleIcon className="w-6 h-6 shrink-0 text-emerald-400" />
                <div>
                  <div className="font-semibold">Cập nhật thông tin thành công!</div>
                  <div className="text-xs text-emerald-200/80">
                    Thanh nhắc nhở sẽ tự động biến mất. Bạn hiện có thể đặt lịch và nhận ảnh ngay.
                  </div>
                </div>
              </div>
            ) : null}

            {generalError ? (
              <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 mb-4">
                <ExclamationTriangleIcon className="w-5 h-5 shrink-0 text-rose-400" />
                <span>{generalError}</span>
              </div>
            ) : null}

            <form onSubmit={handleSaveInfo} className="space-y-4">
              {/* TRƯỜNG 1: SỐ ĐIỆN THOẠI */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center justify-between">
                  <span>
                    Số điện thoại liên hệ <span className="text-rose-400">*</span>
                  </span>
                  <span className="text-[11px] text-gray-400">10 chữ số, bắt đầu bằng 0 (03, 05, 07, 08, 09)</span>
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <PhoneIcon className="w-4 h-4 text-[#BE4B5E]" />
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phoneInput}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="VD: 0901234567"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border text-sm text-white placeholder-gray-500 focus:outline-none transition-colors ${
                      phoneError
                        ? 'border-rose-500 focus:border-rose-400'
                        : isValidPhone(phoneInput)
                        ? 'border-emerald-500/60 focus:border-emerald-400'
                        : 'border-white/15 focus:border-[#BE4B5E]'
                    }`}
                  />
                  {isValidPhone(phoneInput) && !phoneError && (
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-400">
                      <CheckCircleIcon className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {phoneError && (
                  <div className="mt-1.5 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex flex-col gap-1.5">
                    <div className="flex items-start gap-1.5">
                      <ExclamationTriangleIcon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{phoneError}</span>
                    </div>
                    {suggestedPhone && (
                      <button
                        type="button"
                        onClick={() => {
                          setPhoneInput(suggestedPhone);
                          setPhoneError('');
                          setSuggestedPhone(null);
                        }}
                        className="self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#BE4B5E]/30 hover:bg-[#BE4B5E]/50 text-pink-200 text-[11px] font-medium border border-[#BE4B5E]/40"
                      >
                        <CheckIcon className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Đổi thành: <strong>{suggestedPhone}</strong></span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* TRƯỜNG 2: ĐỊA CHỈ NHẬN ẢNH */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Địa chỉ giao nhận ảnh tận nơi <span className="text-rose-400">*</span>
                </label>

                <div className="relative">
                  <div className="absolute top-3 left-3.5 pointer-events-none text-gray-400">
                    <MapPinIcon className="w-4 h-4 text-[#BE4B5E]" />
                  </div>
                  <textarea
                    rows={2}
                    value={addressInput}
                    onChange={(e) => {
                      setAddressInput(e.target.value);
                      if (addressError) setAddressError('');
                      if (generalError) setGeneralError('');
                    }}
                    placeholder="Ví dụ: 123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border text-sm text-white placeholder-gray-500 focus:outline-none transition-colors ${
                      addressError
                        ? 'border-rose-500 focus:border-rose-400'
                        : isAddressValid(addressInput)
                        ? 'border-emerald-500/60 focus:border-emerald-400'
                        : 'border-white/15 focus:border-[#BE4B5E]'
                    }`}
                  />
                </div>

                {addressError && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                    <ExclamationTriangleIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>{addressError}</span>
                  </p>
                )}
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 text-xs sm:text-sm font-medium transition-colors"
                >
                  Để sau
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#BE4B5E] hover:bg-[#a93e50] text-white text-xs sm:text-sm font-medium shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>Lưu thông tin</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
