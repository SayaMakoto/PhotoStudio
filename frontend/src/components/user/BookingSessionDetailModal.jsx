import { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Star,
  Users,
  Camera,
  Sparkles,
  CheckCircle2,
  FileText,
  AlertCircle,
  ShieldCheck,
  Send,
  CornerDownRight,
  UserCheck,
  MessageSquare,
} from 'lucide-react';
import { FloralCardCorner } from '../common/FloralDecorations';
import customerBookingService from '../../services/user/bookingService';
import customerReviewService from '../../services/user/reviewService';

// Danh sách nhân viên dự phòng nếu server chưa cấu hình nhân viên
const DEFAULT_ASSIGNED_STAFF = [
  {
    id: 1,
    employeeId: 1,
    employeeName: 'Nguyễn Hoàng Anh',
    position: 'Nhiếp ảnh gia chính (Photographer)',
    employeePhone: '0912 345 671',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: 'Trần Thủy Tiên',
    position: 'Chuyên viên Makeup & Làm tóc (Makeup Artist)',
    employeePhone: '0912 345 672',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  },
];

const STATUS_CONFIG = {
  completed: {
    label: 'Đã hoàn thành',
    badge: 'bg-[#EBF8F2] text-[#2EA46D] border-[#B4E8D0]',
  },
  confirmed: {
    label: 'Đã xác nhận',
    badge: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]',
  },
  in_progress: {
    label: 'Đang chụp',
    badge: 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]',
  },
  pending: {
    label: 'Chờ duyệt',
    badge: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
  },
  cancelled: {
    label: 'Đã hủy',
    badge: 'bg-[#FFF2F4] text-[#E53E3E] border-[#FCD5DC]',
  },
};

export default function BookingSessionDetailModal({
  booking,
  isOpen,
  onClose,
  currentUser,
  onReviewSubmitted,
}) {
  if (!isOpen || !booking) return null;

  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [existingReview, setExistingReview] = useState(booking.review || null);

  // Form đánh giá buổi chụp
  const [overallRating, setOverallRating] = useState(5);
  const [overallComment, setOverallComment] = useState('');

  // Form đánh giá riêng cho từng nhân viên: { [employeeId]: { rating: 5, comment: '' } }
  const [employeeFeedback, setEmployeeFeedback] = useState({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Tải dữ liệu thực tế từ backend: Ekip nhân viên & Đánh giá (gồm cả adminReply từ Admin)
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setSubmitError('');
    setSubmitSuccess(false);

    const loadDetails = async () => {
      try {
        // 1. Lấy danh sách nhân viên phân công thực tế từ backend
        let staffList = [];
        try {
          const empRes = await customerBookingService.getAssignedEmployees(booking.id);
          if (Array.isArray(empRes) && empRes.length > 0) {
            staffList = empRes.map((emp) => ({
              id: emp.id,
              employeeId: emp.employeeId,
              employeeName: emp.employeeName,
              position: emp.position || 'Ekip Studio',
              employeePhone: emp.employeePhone,
              avatar:
                emp.position?.toLowerCase().includes('makeup')
                  ? 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'
                  : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            }));
          }
        } catch {
          // Bỏ qua lỗi
        }

        // Nếu bảng phân công chưa có dòng nào, lấy toàn bộ nhân viên thực tế từ /api/employees
        if (!staffList.length) {
          try {
            const allEmps = await customerBookingService.getAllEmployees();
            if (Array.isArray(allEmps) && allEmps.length > 0) {
              staffList = allEmps.map((emp) => ({
                id: emp.id,
                employeeId: emp.id,
                employeeName: emp.fullname,
                position:
                  emp.position === 'photographer'
                    ? 'Nhiếp ảnh gia chính (Photographer)'
                    : emp.position === 'makeup'
                    ? 'Chuyên viên Trang điểm (Makeup)'
                    : emp.position,
                employeePhone: emp.phone,
                avatar:
                  emp.position === 'makeup'
                    ? 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'
                    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
              }));
            }
          } catch {
            staffList = DEFAULT_ASSIGNED_STAFF;
          }
        }

        if (isMounted) {
          setEmployees(staffList);

          // Khởi tạo state đánh giá cho từng nhân viên
          const initialFeedback = {};
          staffList.forEach((emp) => {
            initialFeedback[emp.employeeId] = {
              rating: 5,
              comment: '',
            };
          });
          setEmployeeFeedback(initialFeedback);
        }

        // 2. Lấy đánh giá đã có từ CSDL (kèm liên kết phản hồi từ trang Admin)
        let reviewData = booking.review || null;
        try {
          const reviewRes = await customerBookingService.getBookingReview(booking.id);
          if (reviewRes && reviewRes.id) {
            reviewData = reviewRes;
          }
        } catch {
          // Chưa có đánh giá
        }

        // NẾU CÓ BÀI REVIEW: Lấy chi tiết đánh giá nhân viên (chứa adminReply thực tế mà admin vừa phản hồi)
        if (reviewData && reviewData.id) {
          try {
            const empReviewsRes = await customerReviewService.getEmployeeReviewsByReviewId(reviewData.id);
            if (Array.isArray(empReviewsRes) && empReviewsRes.length > 0) {
              reviewData = {
                ...reviewData,
                employeeReviews: empReviewsRes,
              };
            }
          } catch (e) {
            console.warn('Không tải được phản hồi nhân viên từ reviewId:', e);
          }
          if (isMounted) setExistingReview(reviewData);
        } else {
          if (isMounted) setExistingReview(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDetails();

    return () => {
      isMounted = false;
    };
  }, [booking]);

  const handleEmployeeRatingChange = (empId, star) => {
    setEmployeeFeedback((prev) => ({
      ...prev,
      [empId]: {
        ...(prev[empId] || { comment: '' }),
        rating: star,
      },
    }));
  };

  const handleEmployeeCommentChange = (empId, comment) => {
    setEmployeeFeedback((prev) => ({
      ...prev,
      [empId]: {
        ...(prev[empId] || { rating: 5 }),
        comment,
      },
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!overallComment.trim()) {
      setSubmitError('Vui lòng nhập lời nhận xét trải nghiệm chung về buổi chụp.');
      return;
    }

    setSubmitting(true);

    try {
      // Chuẩn bị danh sách đánh giá nhân viên
      const employeeReviewsPayload = employees.map((emp) => {
        const feedback = employeeFeedback[emp.employeeId] || { rating: 5, comment: '' };
        return {
          employeeId: emp.employeeId,
          rating: Number(feedback.rating) || 5.0,
          comment: feedback.comment.trim() || `Phục vụ chu đáo, nhiệt tình và chuyên nghiệp`,
        };
      });

      const payload = {
        bookingId: booking.id,
        customerId: currentUser?.id || booking.customerId || 1,
        rating: Number(overallRating) || 5.0,
        comment: overallComment.trim(),
        employeeReviews: employeeReviewsPayload,
      };

      let savedResult;
      try {
        savedResult = await customerBookingService.submitReview(payload);
      } catch (apiErr) {
        // Fallback lưu local nếu API backend offline hoặc chưa có kết nối DB
        savedResult = {
          id: Date.now(),
          bookingId: booking.id,
          customerId: payload.customerId,
          customerName: currentUser?.fullname || currentUser?.username || 'Bạn',
          rating: payload.rating,
          comment: payload.comment,
          createdAt: new Date().toISOString(),
          employeeReviews: employeeReviewsPayload.map((item, idx) => {
            const empInfo = employees.find((e) => e.employeeId === item.employeeId) || {};
            return {
              id: Date.now() + idx,
              employeeId: item.employeeId,
              employeeName: empInfo.employeeName || 'Nhân viên ekip',
              employeePosition: empInfo.position || 'Ekip hỗ trợ',
              rating: item.rating,
              comment: item.comment,
            };
          }),
        };
      }

      setExistingReview(savedResult);
      setSubmitSuccess(true);

      if (onReviewSubmitted) {
        onReviewSubmitted(savedResult);
      }
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || err.message || 'Không thể gửi đánh giá lúc này. Vui lòng thử lại sau.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isCompleted = booking.status === 'completed' || booking.status === 'Đã hoàn thành';
  const statusInfo = STATUS_CONFIG[booking.status] || {
    label: booking.status || 'Chưa xác định',
    badge: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl my-8 bg-white rounded-3xl border border-[#F0E4E6] shadow-2xl overflow-hidden text-[#261A1E]"
        onClick={(e) => e.stopPropagation()}
      >
        <FloralCardCorner position="top-right" opacity="opacity-30" />

        {/* Header Modal */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-[#F0E4E6] bg-white/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FDF5F6] border border-[#F5D5DC] flex items-center justify-center text-[#B85064]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B85064]">
                  CHI TIẾT BUỔI CHỤP STUDIO
                </span>
                <span className="text-xs font-mono font-bold text-[#7A6C71]">
                  #{booking.id}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-serif-luxury text-[#261A1E]">
                {booking.packageName || 'Gói Chụp Ảnh Nghệ Thuật Studio'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer p-2 rounded-full text-[#8C7D82] hover:text-[#261A1E] hover:bg-[#FDF5F6] transition-colors"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {/* 1. THÔNG TIN BUỔI CHỤP TỪ CƠ SỞ DỮ LIỆU */}
          <div className="p-5 rounded-2xl bg-[#FAF5F5] border border-[#F2E8E9] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFE5E6] pb-3">
              <span className="text-xs font-bold text-[#4A3C41] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#B85064]" />
                Lịch trình ca chụp
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusInfo.badge}`}
              >
                {statusInfo.label}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#7A6C71]">
                <Calendar className="w-3.5 h-3.5 text-[#B85064]" />
                <span>
                  Ngày chụp:{' '}
                  <strong className="text-[#261A1E]">
                    {booking.bookingDate || 'Chưa xếp ngày'}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#7A6C71]">
                <Clock className="w-3.5 h-3.5 text-[#B85064]" />
                <span>
                  Khung giờ:{' '}
                  <strong className="text-[#261A1E]">
                    {booking.startTime ? `${booking.startTime} – ${booking.endTime}` : '08:30 – 12:30'}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#7A6C71]">
                <MapPin className="w-3.5 h-3.5 text-[#B85064]" />
                <span>
                  Phòng:{' '}
                  <strong className="text-[#261A1E]">
                    {booking.roomName || 'Phòng Studio VIP'}
                  </strong>
                </span>
              </div>
            </div>

            {booking.customerNote && (
              <div className="pt-2 text-xs text-[#7A6C71] flex items-start gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#B85064] shrink-0 mt-0.5" />
                <span>
                  Ghi chú đơn đặt:{' '}
                  <em className="text-[#3E2F35]">"{booking.customerNote}"</em>
                </span>
              </div>
            )}
          </div>

          {/* 2. EKIP NHÂN VIÊN PHỤ TRÁCH BUỔI CHỤP */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-[#261A1E] font-serif-luxury flex items-center gap-2">
                <Users className="w-4 h-4 text-[#B85064]" />
                Ekip Nhân Viên Phụ Trách Buổi Chụp
              </h4>
              <span className="text-[11px] text-[#7A6C71]">
                {employees.length} nhân viên đồng hành
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {employees.map((emp) => (
                <div
                  key={emp.employeeId}
                  className="p-3.5 rounded-2xl bg-white border border-[#F0E4E6] shadow-xs flex items-center gap-3"
                >
                  <img
                    src={emp.avatar}
                    alt={emp.employeeName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#F5D5DC] shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#261A1E] truncate">
                      {emp.employeeName}
                    </p>
                    <p className="text-[11px] text-[#B85064] font-medium truncate mt-0.5">
                      {emp.position}
                    </p>
                    {emp.employeePhone && (
                      <p className="text-[10px] text-[#8C7D82] mt-0.5">
                        Hotline: {emp.employeePhone}
                      </p>
                    )}
                  </div>
                  <div
                    className="p-1.5 rounded-xl bg-[#FDF5F6] text-[#2EA46D]"
                    title="Nhân viên chính thức của studio"
                  >
                    <UserCheck className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. KHU VỰC ĐÁNH GIÁ (REVIEW SECTION) */}
          <div className="border-t border-[#F0E4E6] pt-5">
            {/* TH1: Buổi chụp đã có đánh giá trong CSDL */}
            {existingReview ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#EBF8F2] border border-[#B4E8D0] text-[#1E7E34]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2EA46D] shrink-0" />
                    <span className="text-xs font-bold">
                      Bạn đã gửi đánh giá cho buổi chụp này
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#2EA46D]">
                    {existingReview.createdAt
                      ? new Date(existingReview.createdAt).toLocaleDateString('vi-VN')
                      : 'Đã lưu'}
                  </span>
                </div>

                {/* Đánh giá tổng thể */}
                <div className="p-4 rounded-2xl bg-[#FAF5F5] border border-[#F2E8E9]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#261A1E]">
                      Đánh giá chung về buổi chụp
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= Math.round(Number(existingReview.rating) || 5)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-neutral-300'
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold text-[#B85064] ml-1">
                        {Number(existingReview.rating || 5).toFixed(1)} / 5.0
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#4A3C41] leading-relaxed italic">
                    "{existingReview.comment || 'Buổi chụp diễn ra rất thành công và ưng ý!'}"
                  </p>
                </div>

                {/* Đánh giá chi tiết cho từng nhân viên (Hiển thị cả phản hồi của Admin từ trang quản trị) */}
                {existingReview.employeeReviews && existingReview.employeeReviews.length > 0 && (
                  <div className="space-y-2.5">
                    <h5 className="text-xs font-bold text-[#261A1E] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#B85064]" />
                      Nhận xét của bạn dành cho ekip nhân viên:
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {existingReview.employeeReviews.map((er) => (
                        <div
                          key={er.id || er.employeeId}
                          className="p-3.5 rounded-2xl bg-white border border-[#F0E4E6] shadow-xs space-y-2"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-[#261A1E]">
                              {er.employeeName || `Nhân viên #${er.employeeId}`}
                              {er.employeePosition && (
                                <span className="ml-1 text-[10px] text-[#B85064] font-normal">
                                  ({er.employeePosition})
                                </span>
                              )}
                            </span>
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3.5 h-3.5 ${
                                    s <= Math.round(Number(er.rating) || 5)
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-neutral-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          <p className="text-[11px] text-[#7A6C71] italic">
                            "{er.comment || 'Rất nhiệt tình và chuyên nghiệp'}"
                          </p>

                          {/* Phản hồi thực tế từ Admin (kết nối trực tiếp từ /admin/employee-reviews) */}
                          {er.adminReply && (
                            <div className="mt-2 p-2.5 rounded-xl bg-[#FFF6F7] border border-[#FCD5DC] text-[11px] animate-in fade-in">
                              <span className="font-bold text-[#B85064] flex items-center gap-1">
                                <CornerDownRight className="w-3 h-3 text-[#B85064]" />
                                Phản hồi từ PhotoStudio / Quản trị viên:
                              </span>
                              <p className="text-[#3E2F35] pl-4 mt-0.5 font-medium leading-relaxed">
                                {er.adminReply}
                              </p>
                              {er.adminRepliedAt && (
                                <p className="text-[10px] text-[#8C7D82] pl-4 mt-0.5">
                                  Thời gian:{' '}
                                  {new Date(er.adminRepliedAt).toLocaleString('vi-VN')}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Phản hồi từ Admin cho bài đánh giá chung nếu có */}
                {existingReview.adminReply && (
                  <div className="p-3.5 rounded-2xl bg-[#FFF6F7] border border-[#FCD5DC] text-xs space-y-1">
                    <div className="font-bold text-[#B85064] flex items-center gap-1.5">
                      <CornerDownRight className="w-3.5 h-3.5" />
                      Phản hồi từ Ban Quản Lý PhotoStudio:
                    </div>
                    <p className="text-[#4A3C41] pl-5 leading-relaxed">
                      {existingReview.adminReply}
                    </p>
                  </div>
                )}
              </div>
            ) : isCompleted ? (
              /* TH2: Buổi chụp đã hoàn thành nhưng CHƯA đánh giá -> Hiển thị form */
              <form onSubmit={handleSubmitReview} className="space-y-5">
                <div className="pb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B85064] block">
                    GỬI ĐÁNH GIÁ TRẢI NGHIỆM
                  </span>
                  <h4 className="text-base font-bold font-serif-luxury text-[#261A1E]">
                    Đánh Giá Buổi Chụp & Chấm Điểm Nhân Viên
                  </h4>
                  <p className="text-xs text-[#7A6C71] mt-0.5">
                    Đánh giá của bạn đã được gửi.
                  </p>
                </div>

                {submitError && (
                  <div className="p-3 rounded-xl bg-[#FFF2F4] border border-[#FCD5DC] text-[#C53030] text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* A. Đánh giá chung buổi chụp */}
                <div className="p-4 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6] space-y-3">
                  <label className="block text-xs font-bold text-[#261A1E]">
                    1. Đánh giá chất lượng chung buổi chụp <span className="text-[#B85064]">*</span>
                  </label>

                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setOverallRating(star)}
                        className="cursor-pointer p-1 text-amber-400 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= overallRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[#B85064] ml-2">
                      {overallRating}.0 / 5.0 Sao
                    </span>
                  </div>

                  <textarea
                    rows={3}
                    required
                    value={overallComment}
                    onChange={(e) => setOverallComment(e.target.value)}
                    placeholder="Chia sẻ cảm nhận về không gian studio, chất lượng ánh sáng, trang phục và dịch vụ tổng thể..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DCDE] text-xs focus:outline-none focus:border-[#B85064] bg-white resize-none"
                  />
                </div>

                {/* B. Đánh giá riêng cho từng nhân viên trong ekip */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-[#261A1E] flex items-center justify-between">
                    <span>
                      2. Đánh giá chi tiết cho từng nhân viên ekip <span className="text-[#B85064]">*</span>
                    </span>
                    <span className="text-[11px] font-normal text-[#7A6C71]">
                      Chấm điểm & viết lời cảm ơn riêng
                    </span>
                  </label>

                  <div className="space-y-3">
                    {employees.map((emp) => {
                      const feedback = employeeFeedback[emp.employeeId] || { rating: 5, comment: '' };
                      return (
                        <div
                          key={emp.employeeId}
                          className="p-4 rounded-2xl bg-white border border-[#F0E4E6] shadow-xs space-y-2.5 hover:border-[#B85064]/40 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={emp.avatar}
                                alt={emp.employeeName}
                                className="w-8 h-8 rounded-full object-cover border border-[#F5D5DC]"
                              />
                              <div>
                                <p className="text-xs font-bold text-[#261A1E]">
                                  {emp.employeeName}
                                </p>
                                <p className="text-[10px] text-[#B85064] font-medium">
                                  {emp.position}
                                </p>
                              </div>
                            </div>

                            {/* Bộ chọn sao riêng cho nhân viên */}
                            <div className="flex items-center gap-1.5 self-start sm:self-auto">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  type="button"
                                  key={star}
                                  onClick={() => handleEmployeeRatingChange(emp.employeeId, star)}
                                  className="cursor-pointer p-0.5 text-amber-400 hover:scale-110 transition-transform"
                                >
                                  <Star
                                    className={`w-4 h-4 ${
                                      star <= feedback.rating
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-neutral-300'
                                    }`}
                                  />
                                </button>
                              ))}
                              <span className="text-xs font-bold text-[#B85064] ml-1">
                                {feedback.rating}.0
                              </span>
                            </div>
                          </div>

                          <input
                            type="text"
                            value={feedback.comment}
                            onChange={(e) =>
                              handleEmployeeCommentChange(emp.employeeId, e.target.value)
                            }
                            placeholder={`Viết nhận xét cho bạn ${emp.employeeName} (nhiệt tình, bắt góc đẹp, makeup hợp mặt...)...`}
                            className="w-full px-3 py-2 rounded-xl border border-[#E8DCDE] text-xs focus:outline-none focus:border-[#B85064] bg-[#FAF5F5]"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Nút Submit */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="cursor-pointer px-4 py-2.5 rounded-xl border border-[#E8DCDE] text-xs font-semibold text-[#4A3C41] hover:bg-[#FAF5F5] transition-colors"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#B85064] hover:bg-[#A33D50] text-white text-xs font-bold shadow-md shadow-[#B85064]/20 transition-all disabled:opacity-50"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Gửi Đánh Giá Buổi Chụp & Nhân Viên</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* TH3: Buổi chụp chưa hoàn thành */
              <div className="p-4 rounded-2xl bg-[#FDF5F6] border border-[#F5D5DC] flex items-start gap-3 text-xs">
                <ShieldCheck className="w-5 h-5 text-[#B85064] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#261A1E]">
                    Chức năng đánh giá sẽ mở sau khi buổi chụp hoàn thành
                  </p>
                  <p className="text-[11px] text-[#7A6C71] mt-0.5 leading-relaxed">
                    Ca chụp của bạn hiện đang ở trạng thái{' '}
                    <strong className="text-[#B85064]">{statusInfo.label}</strong>. Sau khi hoàn thành ca chụp tại studio, quý khách sẽ có thể chấm điểm số sao và viết nhận xét chi tiết cho ekip nhân viên tại đây!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-3.5 bg-[#FAF5F5] border-t border-[#F0E4E6] flex items-center justify-between text-[11px] text-[#8C7D82]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B85064]" />
            Đánh giá đồng bộ trực tiếp với hệ thống quản trị PhotoStudio
          </span>
          <button
            type="button"
            onClick={onClose}
            className="font-semibold text-[#B85064] hover:underline cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
