import React, { useState, useMemo } from 'react';
import {
  Star,
  MessageSquare,
  MessageCircle,
  CheckCircle2,
  Clock,
  Send,
  Edit3,
  Filter,
  User,
  Calendar,
  X,
  AlertCircle,
  ThumbsUp,
  Search,
  Heart,
  Smile,
  ShieldCheck,
} from 'lucide-react';
import employeeReviewService from '../../../services/employee/reviewService';

// Các câu phản hồi/cảm ơn khách hàng mẫu chuyên nghiệp và lịch sự
const QUICK_TEMPLATES = [
  'PhotoStudio và ekip chân thành cảm ơn quý khách đã tin tưởng và ủng hộ! Rất mong được tiếp tục đồng hành cùng bạn trong những dịp kỷ niệm tới.',
  'Cảm ơn bạn rất nhiều vì những nhận xét tuyệt vời! Ekip chụp và makeup rất hạnh phúc khi mang lại những khung hình đẹp nhất cho bạn.',
  'Ekip xin gửi lời cảm ơn sâu sắc. Sự hài lòng và nụ cười của quý khách là nguồn động lực to lớn để chúng tôi không ngừng hoàn thiện.',
  'PhotoStudio xin ghi nhận ý kiến đóng góp quý báu của quý khách để tiếp tục nâng tầm chất lượng bối cảnh và dịch vụ chăm sóc.',
];

export default function CustomerReviewsSection({
  reviews = [],
  generalReviews = [],
  currentEmployee = null,
  onReviewUpdated,
}) {
  // 1. Phân loại xem: Đánh giá cá nhân của nhân viên vs Đánh giá chung studio
  const [scopeTab, setScopeTab] = useState('personal'); // 'personal' | 'all'
  const [replyFilter, setReplyFilter] = useState('unreplied'); // 'all' | 'unreplied' | 'replied'
  const [ratingFilter, setRatingFilter] = useState('all'); // 'all' | '5' | '4' | '3'
  const [searchTerm, setSearchTerm] = useState('');

  // 2. State cho Modal phản hồi / cảm ơn khách hàng
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Tập hợp danh sách đánh giá theo Scope
  const activeDataset = useMemo(() => {
    if (scopeTab === 'personal') {
      return reviews.length > 0 ? reviews : generalReviews;
    }
    return generalReviews.length > 0 ? generalReviews : reviews;
  }, [scopeTab, reviews, generalReviews]);

  // Bộ lọc danh sách đánh giá
  const filteredReviews = useMemo(() => {
    return activeDataset.filter((item) => {
      // Lọc trạng thái phản hồi
      const hasReply = Boolean(item.adminReply && item.adminReply.trim().length > 0);
      if (replyFilter === 'replied' && !hasReply) return false;
      if (replyFilter === 'unreplied' && hasReply) return false;

      // Lọc số sao (Đầy đủ 1 đến 5 sao)
      if (ratingFilter !== 'all') {
        const starVal = Math.round(Number(item.rating) || 0);
        if (starVal !== Number(ratingFilter)) return false;
      }

      // Tìm kiếm từ khóa
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const name = (item.customerName || '').toLowerCase();
        const comment = (item.comment || '').toLowerCase();
        const reply = (item.adminReply || '').toLowerCase();
        if (!name.includes(term) && !comment.includes(term) && !reply.includes(term)) {
          return false;
        }
      }

      return true;
    });
  }, [activeDataset, replyFilter, ratingFilter, searchTerm]);

  // Thống kê nhanh
  const stats = useMemo(() => {
    const total = activeDataset.length;
    const avg =
      total > 0
        ? (
            activeDataset.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) /
            total
          ).toFixed(1)
        : '5.0';
    const repliedCount = activeDataset.filter(
      (r) => r.adminReply && r.adminReply.trim().length > 0
    ).length;
    const unrepliedCount = total - repliedCount;

    return { total, avg, repliedCount, unrepliedCount };
  }, [activeDataset]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Mở modal phản hồi
  const handleOpenReplyModal = (review) => {
    setSelectedReview(review);
    setReplyText(review.adminReply || '');
    setActionError('');
    setActionSuccess('');
    setIsModalOpen(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setSelectedReview(null);
    setReplyText('');
    setActionError('');
  };

  // Chọn template mẫu
  const handleSelectTemplate = (template) => {
    setReplyText(template);
  };

  // Gửi phản hồi qua API lưu vào CSDL
  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedReview) return;

    setIsSubmitting(true);
    setActionError('');

    try {
      let updatedReview;
      const isEmployeeReview =
        selectedReview.isEmployeeReview ||
        Boolean(selectedReview.employeeId && !selectedReview.bookingId);

      if (isEmployeeReview) {
        // Phản hồi đánh giá cá nhân nhân viên
        updatedReview = await employeeReviewService.replyEmployeeReview(
          selectedReview.id,
          replyText.trim()
        );
      } else {
        // Phản hồi đánh giá đơn ca chụp chung
        updatedReview = await employeeReviewService.replyReview(
          selectedReview.id,
          replyText.trim()
        );
      }

      // Giữ lại các metadata hiển thị nếu backend chỉ trả về entity gốc
      const merged = {
        ...selectedReview,
        ...(updatedReview || {}),
        adminReply: replyText.trim(),
        adminRepliedAt: new Date().toISOString(),
      };

      if (onReviewUpdated) {
        onReviewUpdated(merged);
      }

      setActionSuccess('Đã gửi phản hồi thành công và lưu vào hệ thống!');
      setTimeout(() => {
        handleCloseModal();
      }, 1200);
    } catch (err) {
      console.error('Lỗi khi gửi phản hồi:', err);
      setActionError(
        err.response?.data?.message ||
          err.message ||
          'Không thể gửi phản hồi. Vui lòng kiểm tra lại kết nối mạng hoặc quyền truy cập.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Summary KPI Cards */}
      <div className="rounded-3xl border border-[#F0E4E6] bg-white p-6 shadow-[0_4px_20px_rgb(184,80,100,0.04)] space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-[#F0E4E6]">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-2xl bg-[#FDF0F3] text-[#B85064] border border-[#F5D5DC]">
                <MessageSquare className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#261A1E]">
                  Trung Tâm Phản Hồi & Đánh Giá Khách Hàng
                </h3>
                <p className="text-xs text-[#7A6C71] mt-0.5">
                  Lắng nghe nhận xét thực tế từ khách hàng và gửi lời cảm ơn / phản hồi tương tác tay nghề.
                </p>
              </div>
            </div>
          </div>

          {/* Scope Tab Switcher */}
          <div className="flex items-center bg-[#FAF5F5] p-1 rounded-2xl border border-[#F0E4E6] self-start lg:self-auto">
            <button
              type="button"
              onClick={() => setScopeTab('personal')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                scopeTab === 'personal'
                  ? 'bg-white text-[#B85064] shadow-sm border border-[#F0E4E6]'
                  : 'text-[#7A6C71] hover:text-[#261A1E]'
              }`}
            >
              Đánh giá về tôi ({reviews.length})
            </button>
            <button
              type="button"
              onClick={() => setScopeTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                scopeTab === 'all'
                  ? 'bg-white text-[#B85064] shadow-sm border border-[#F0E4E6]'
                  : 'text-[#7A6C71] hover:text-[#261A1E]'
              }`}
            >
              Tất cả đánh giá Studio ({generalReviews.length || reviews.length})
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6] flex flex-col justify-between">
            <span className="text-[11px] font-bold text-[#7A6C71] uppercase tracking-wider">
              Tổng lượt đánh giá
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-[#261A1E] font-sans">
                {stats.total}
              </span>
              <span className="text-xs text-[#B85064] font-semibold">lượt</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6] flex flex-col justify-between">
            <span className="text-[11px] font-bold text-[#7A6C71] uppercase tracking-wider">
              Điểm hài lòng TB
            </span>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-2xl font-extrabold text-[#B85064] font-sans">
                ★ {stats.avg}
              </span>
              <span className="text-xs text-[#7A6C71] font-medium">/ 5.0</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6] flex flex-col justify-between">
            <span className="text-[11px] font-bold text-[#7A6C71] uppercase tracking-wider">
              Chưa gửi phản hồi
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-amber-600 font-sans">
                {stats.unrepliedCount}
              </span>
              <span className="text-xs text-amber-700 font-semibold">chờ phản hồi</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6] flex flex-col justify-between">
            <span className="text-[11px] font-bold text-[#7A6C71] uppercase tracking-wider">
              Đã gửi phản hồi
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-emerald-600 font-sans">
                {stats.repliedCount}
              </span>
              <span className="text-xs text-emerald-700 font-semibold">hoàn tất</span>
            </div>
          </div>
        </div>

        {/* 2. Filter & Search Bar */}
        <div className="flex flex-col md:flex-row gap-3 pt-2">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E8E93]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên khách hàng, nội dung nhận xét hoặc phản hồi..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-[#F0E4E6] bg-[#FAF5F5]/60 text-xs text-[#261A1E] font-medium placeholder:text-[#9E8E93] focus:border-[#B85064] focus:bg-white focus:outline-none transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7A6C71] hover:text-[#261A1E]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Reply Status Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-[#7A6C71] flex items-center gap-1 shrink-0 ml-1">
              <Filter className="h-3.5 w-3.5" /> Lọc:
            </span>

            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'unreplied', label: 'Chưa phản hồi' },
              { id: 'replied', label: 'Đã phản hồi' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setReplyFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  replyFilter === f.id
                    ? 'bg-[#B85064] text-white shadow-sm'
                    : 'bg-[#FAF5F5] text-[#7A6C71] hover:bg-[#FDF0F3] hover:text-[#B85064] border border-[#F0E4E6]'
                }`}
              >
                {f.label}
              </button>
            ))}

            {/* Rating Stars Filter (Đầy đủ từ 1 đến 5 sao) */}
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FAF5F5] border border-[#F0E4E6] text-[#7A6C71] focus:border-[#B85064] focus:outline-none shrink-0"
            >
              <option value="all">Tất cả sao</option>
              <option value="5">★ 5 Sao</option>
              <option value="4">★ 4 Sao</option>
              <option value="3">★ 3 Sao</option>
              <option value="2">★ 2 Sao</option>
              <option value="1">★ 1 Sao</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Reviews List Grid */}
      {filteredReviews.length === 0 ? (
        <div className="py-16 text-center text-xs text-[#9E8E93] bg-white rounded-3xl border border-[#F0E4E6] flex flex-col items-center justify-center gap-3 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#FAF5F5] border border-[#F0E4E6] flex items-center justify-center text-[#B85064]">
            <MessageCircle className="h-7 w-7 text-[#D4C5C8]" />
          </div>
          <p className="font-bold text-sm text-[#261A1E]">
            {searchTerm || replyFilter !== 'all' || ratingFilter !== 'all'
              ? 'Không tìm thấy đánh giá nào phù hợp với bộ lọc hiện tại.'
              : 'Hiện tại chưa có đánh giá nào từ khách hàng.'}
          </p>
          {(searchTerm || replyFilter !== 'all' || ratingFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setReplyFilter('all');
                setRatingFilter('all');
              }}
              className="text-xs font-bold text-[#B85064] hover:underline"
            >
              Đặt lại tất cả bộ lọc
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredReviews.map((rev) => {
            const hasReply = Boolean(rev.adminReply && rev.adminReply.trim().length > 0);
            const customerTitle =
              rev.customerName ||
              (rev.reviewId
                ? `Khách hàng (Đơn #${rev.reviewId})`
                : `Khách hàng #${rev.id}`);

            return (
              <div
                key={rev.id}
                className="rounded-3xl border border-[#F0E4E6] bg-white p-6 space-y-4 flex flex-col justify-between shadow-[0_4px_20px_rgb(184,80,100,0.03)] hover:border-[#F5D5DC] hover:shadow-[0_8px_25px_rgb(184,80,100,0.08)] transition-all"
              >
                {/* Review Header */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#B85064] to-[#E28E9E] text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                        {customerTitle.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-[#261A1E] flex items-center gap-1.5">
                          <span>{customerTitle}</span>
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#9E8E93]">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {rev.createdAt ? formatDate(rev.createdAt) : `Mã #${rev.id}`}
                          </span>
                          {(rev.bookingId || rev.reviewId) && (
                            <span className="bg-[#FAF5F5] border border-[#F0E4E6] px-2 py-0.2 rounded-md font-mono text-[10px] text-[#7A6C71]">
                              {rev.bookingId ? `Đơn #${rev.bookingId}` : `Review #${rev.reviewId}`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Badge: Đã phản hồi / Chưa phản hồi */}
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 shrink-0 ${
                        hasReply
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {hasReply ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          <span>Đã gửi phản hồi</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 text-amber-600" />
                          <span>Chưa phản hồi</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Stars Rating */}
                  <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[#F0E4E6]">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(Number(rev.rating) || 0)
                              ? 'text-[#B85064] fill-[#B85064]'
                              : 'text-[#E8D5D8]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-extrabold text-[#B85064] ml-1">
                      {Number(rev.rating || 0).toFixed(1)} / 5.0
                    </span>

                    {rev.employeePosition && (
                      <span className="ml-auto text-[10px] font-semibold bg-[#FDF0F3] text-[#B85064] border border-[#F5D5DC] px-2 py-0.5 rounded-full">
                        {rev.employeePosition}
                      </span>
                    )}
                  </div>

                  {/* Customer Comment Text */}
                  <div className="mt-3 p-3.5 rounded-2xl bg-[#FAF5F5]/70 border border-[#F0E4E6]">
                    <p className="text-xs text-[#261A1E] leading-relaxed italic">
                      "{rev.comment || 'Khách hàng không để lại nhận xét chi tiết.'}"
                    </p>
                  </div>
                </div>

                {/* Reply Section (Phản hồi của Nhân viên / Studio) */}
                <div className="pt-2">
                  {hasReply ? (
                    <div className="p-3.5 rounded-2xl bg-[#FDF0F3]/60 border border-[#F5D5DC] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#B85064] flex items-center gap-1.5">
                          <MessageCircle className="h-3.5 w-3.5 text-[#B85064]" />
                          <span>Lời cảm ơn & phản hồi đã gửi:</span>
                        </span>
                        {rev.adminRepliedAt && (
                          <span className="text-[10px] text-[#9E8E93]">
                            {formatDate(rev.adminRepliedAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#261A1E] leading-relaxed font-medium">
                        {rev.adminReply}
                      </p>
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => handleOpenReplyModal(rev)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B85064] hover:text-[#913B4D] hover:underline"
                        >
                          <Edit3 className="h-3 w-3" />
                          <span>Chỉnh sửa phản hồi</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenReplyModal(rev)}
                      className="w-full py-2.5 px-4 rounded-2xl bg-[#B85064] hover:bg-[#913B4D] text-white text-xs font-bold shadow-md shadow-[#B85064]/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Phản Hồi & Gửi Lời Cảm Ơn Khách Hàng</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Modal Phản Hồi Khách Hàng Chuyên Nghiệp */}
      {isModalOpen && selectedReview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto animate-fadeIn"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <div className="relative w-full max-w-xl rounded-3xl border border-[#F0E4E6] bg-white p-6 sm:p-7 shadow-[0_20px_60px_rgb(184,80,100,0.2)] text-[#261A1E] max-h-[90vh] flex flex-col space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#F0E4E6] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FDF0F3] border border-[#F5D5DC] flex items-center justify-center text-[#B85064]">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#261A1E]">
                    {selectedReview.adminReply
                      ? 'Cập Nhật Lời Cảm Ơn / Phản Hồi'
                      : 'Gửi Phản Hồi & Cảm Ơn Khách Hàng'}
                  </h3>
                  <p className="text-xs text-[#7A6C71]">
                    Gửi lời tri ân trực tiếp đến khách hàng và lưu lại trên hệ thống Studio.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="p-2 rounded-xl text-[#7A6C71] hover:bg-[#FAF5F5] hover:text-[#261A1E] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto space-y-4 text-xs pr-1">
              {/* Alert Feedback Messages */}
              {actionSuccess && (
                <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold shadow-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{actionSuccess}</span>
                </div>
              )}

              {actionError && (
                <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 font-bold shadow-sm">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Review Info Card to Reference */}
              <div className="p-4 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#261A1E]">
                    {selectedReview.customerName ||
                      (selectedReview.reviewId
                        ? `Khách hàng (Đơn #${selectedReview.reviewId})`
                        : `Khách hàng #${selectedReview.id}`)}
                  </span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < Math.floor(Number(selectedReview.rating) || 0)
                            ? 'text-[#B85064] fill-[#B85064]'
                            : 'text-[#E8D5D8]'
                        }`}
                      />
                    ))}
                    <span className="font-bold text-[#B85064] ml-1">
                      {Number(selectedReview.rating || 0).toFixed(1)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#7A6C71] italic leading-relaxed">
                  "{selectedReview.comment || 'Không có nhận xét chi tiết'}"
                </p>
              </div>

              {/* Quick Template Suggestions */}
              <div>
                <label className="block text-xs font-bold text-[#7A6C71] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MessageCircle className="h-3.5 w-3.5 text-[#B85064]" />
                  <span>Chọn mẫu câu cảm ơn nhanh (Click để chọn):</span>
                </label>
                <div className="space-y-1.5">
                  {QUICK_TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectTemplate(tmpl)}
                      className="w-full text-left p-2.5 rounded-xl border border-[#F0E4E6] bg-[#FAF5F5]/60 hover:bg-[#FDF0F3] hover:border-[#F5D5DC] text-[#261A1E] text-[11px] leading-relaxed transition-all cursor-pointer flex items-start gap-2"
                    >
                      <ThumbsUp className="h-3.5 w-3.5 text-[#B85064] shrink-0 mt-0.5" />
                      <span>{tmpl}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reply Form Textarea */}
              <form onSubmit={handleSubmitReply} className="space-y-4 pt-1">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-xs text-[#261A1E]">
                      Nội dung phản hồi của bạn *
                    </label>
                    <span className="text-[11px] text-[#9E8E93]">
                      {replyText.length} / 2000 ký tự
                    </span>
                  </div>
                  <textarea
                    required
                    maxLength={2000}
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Nhập lời cảm ơn hoặc giải đáp của bạn gửi đến khách hàng một cách lịch sự, tận tâm..."
                    className="w-full p-3.5 rounded-2xl border border-[#F0E4E6] bg-white text-xs text-[#261A1E] font-medium placeholder:text-[#9E8E93] focus:border-[#B85064] focus:outline-none resize-none shadow-sm leading-relaxed"
                  />
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0E4E6]">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                    className="px-4 py-2.5 rounded-xl border border-[#F0E4E6] bg-[#FAF5F5] text-xs font-bold text-[#7A6C71] hover:text-[#261A1E] transition-all cursor-pointer"
                  >
                    Hủy bỏ
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || !replyText.trim()}
                    className="flex items-center gap-2 rounded-xl bg-[#B85064] hover:bg-[#913B4D] text-white text-xs font-bold px-6 py-2.5 shadow-md shadow-[#B85064]/20 hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>
                          {selectedReview.adminReply
                            ? 'Cập Nhật Phản Hồi'
                            : 'Gửi Phản Hồi Cho Khách Hàng'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
