import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, MessageSquareText, Star, UserRoundCheck } from 'lucide-react';
import AdminFilterBar from '../../../components/admin/common/AdminFilterBar';
import AdminTable from '../../../components/admin/common/AdminTable';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import useAdminNotification from '../../../components/admin/common/useAdminNotification';
import adminBookingService from '../../../services/admin/bookingService';
import adminEmployeeReviewService from '../../../services/admin/employeeReviewService';
import adminReviewService from '../../../services/admin/reviewService';
import EmployeeReviewDialog from './EmployeeReviewDialog';
import { getReviewErrorMessage, REVIEW_RATING_OPTIONS, REVIEW_REPLY_OPTIONS } from '../reviews/reviewConfig';

const asRows = (rows) => Array.isArray(rows) ? rows : [];

function SummaryCard({ label, value, icon: Icon, tone = 'amber' }) {
  const colors = { amber: 'border-amber-500/20 bg-amber-500/10 text-amber-300', green: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300', blue: 'border-sky-500/20 bg-sky-500/10 text-sky-300' };
  return <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs text-neutral-400">{label}</p><span className={`grid h-9 w-9 place-items-center rounded-xl border ${colors[tone]}`}><Icon className="h-4 w-4" /></span></div><p className="mt-3 text-xl font-semibold text-white">{value}</p></div>;
}

export default function AdminEmployeeReviewsPage() {
  const { notify } = useAdminNotification();
  const [employeeReviews, setEmployeeReviews] = useState([]);
  const [reviewMap, setReviewMap] = useState({});
  const [bookingMap, setBookingMap] = useState({});
  const [search, setSearch] = useState('');
  const [rating, setRating] = useState('');
  const [replyState, setReplyState] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedReview, setSelectedReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [relatedWarning, setRelatedWarning] = useState('');

  const loadData = async () => {
    setLoading(true); setPageError(''); setRelatedWarning('');
    const [employeeResult, reviewResult, bookingResult] = await Promise.allSettled([
      adminEmployeeReviewService.getAll(), adminReviewService.getAll(), adminBookingService.getAll(),
    ]);
    if (employeeResult.status === 'fulfilled') setEmployeeReviews(asRows(employeeResult.value));
    else setPageError(getReviewErrorMessage(employeeResult.reason));
    if (reviewResult.status === 'fulfilled') setReviewMap(Object.fromEntries(asRows(reviewResult.value).map((review) => [review.id, review])));
    if (bookingResult.status === 'fulfilled') setBookingMap(Object.fromEntries(asRows(bookingResult.value).map((booking) => [booking.id, booking])));
    if (reviewResult.status === 'rejected' || bookingResult.status === 'rejected') setRelatedWarning('Không tải được một số thông tin review hoặc booking liên quan.');
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([adminEmployeeReviewService.getAll(), adminReviewService.getAll(), adminBookingService.getAll()]).then(([employeeResult, reviewResult, bookingResult]) => {
      if (!mounted) return;
      if (employeeResult.status === 'fulfilled') setEmployeeReviews(asRows(employeeResult.value));
      else setPageError(getReviewErrorMessage(employeeResult.reason));
      if (reviewResult.status === 'fulfilled') setReviewMap(Object.fromEntries(asRows(reviewResult.value).map((review) => [review.id, review])));
      if (bookingResult.status === 'fulfilled') setBookingMap(Object.fromEntries(asRows(bookingResult.value).map((booking) => [booking.id, booking])));
      if (reviewResult.status === 'rejected' || bookingResult.status === 'rejected') setRelatedWarning('Không tải được một số thông tin review hoặc booking liên quan.');
    }).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return employeeReviews.filter((item) => {
      const review = reviewMap[item.reviewId];
      const booking = review ? bookingMap[review.bookingId] : null;
      const matchesSearch = !keyword || [item.id, item.reviewId, item.employeeId, item.employeeName, item.employeePosition, item.comment, item.adminReply, review?.customerName, review?.comment, booking?.customerPhone].filter(Boolean).some((value) => String(value).toLowerCase().includes(keyword));
      const isReplied = Boolean(item.adminReply?.trim());
      return matchesSearch && (!rating || Number(item.rating) === Number(rating)) && (!replyState || (replyState === 'replied' ? isReplied : !isReplied));
    }).sort((a, b) => (sortOrder === 'oldest' ? 1 : -1) * ((Number(a.id) || 0) - (Number(b.id) || 0)));
  }, [bookingMap, employeeReviews, rating, replyState, reviewMap, search, sortOrder]);

  const stats = useMemo(() => ({
    total: employeeReviews.length,
    average: employeeReviews.length ? employeeReviews.reduce((sum, item) => sum + (Number(item.rating) || 0), 0) / employeeReviews.length : 0,
    waiting: employeeReviews.filter((item) => !item.adminReply?.trim()).length,
    replied: employeeReviews.filter((item) => Boolean(item.adminReply?.trim())).length,
  }), [employeeReviews]);

  const replyToEmployeeReview = async (employeeReview, reply) => {
    try {
      const updated = await adminEmployeeReviewService.reply(employeeReview.id, reply);
      setEmployeeReviews((current) => current.map((item) => item.id === employeeReview.id ? updated : item));
      setSelectedReview((current) => current?.id === employeeReview.id ? updated : current);
      notify({ type: 'success', title: 'Đã lưu phản hồi', message: `Phản hồi cho đánh giá nhân viên #${employeeReview.id} đã được lưu.` });
      return updated;
    } catch (error) {
      notify({ type: 'error', message: getReviewErrorMessage(error) });
      throw error;
    }
  };

  const resetFilters = () => { setSearch(''); setRating(''); setReplyState(''); setSortOrder('newest'); };
  const columns = [
    { key: 'id', title: 'Mã đánh giá', cellClassName: 'font-mono text-neutral-400' },
    { key: 'employeeName', title: 'Nhân viên', render: (name, item) => <div className="min-w-40"><p className="font-medium text-neutral-100">{name || `Nhân viên #${item.employeeId}`}</p><p className="mt-0.5 text-[11px] text-neutral-500">{item.employeePosition || 'Chưa có chức vụ'}</p></div> },
    { key: 'customerName', title: 'Khách hàng', render: (_, item) => { const review = reviewMap[item.reviewId]; const booking = review ? bookingMap[review.bookingId] : null; return <div className="min-w-36"><p className="font-medium text-neutral-100">{review?.customerName || 'Chưa có dữ liệu'}</p><p className="mt-0.5 text-[11px] text-neutral-500">Booking #{review?.bookingId ?? '—'}{booking?.customerPhone ? ` · ${booking.customerPhone}` : ''}</p></div>; } },
    { key: 'rating', title: 'Điểm nhân viên', render: (value) => <span className="inline-flex items-center gap-1 font-semibold text-amber-300"><Star className="h-3.5 w-3.5 fill-current" />{Number(value || 0).toFixed(1)}</span> },
    { key: 'comment', title: 'Nhận xét', render: (value) => <p className="max-w-sm min-w-48 truncate text-neutral-300" title={value || ''}>{value || 'Không có nhận xét'}</p> },
    { key: 'adminReply', title: 'Phản hồi', render: (value) => <StatusBadge status={value?.trim() ? 'replied' : 'unreplied'} domain="reviewReply" /> },
  ];

  const selectedParentReview = selectedReview ? reviewMap[selectedReview.reviewId] : null;
  const selectedBooking = selectedParentReview ? bookingMap[selectedParentReview.bookingId] : null;

  return <section className="space-y-5">
    <header><p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">Quản lý đánh giá</p><h1 className="flex items-center gap-2 text-2xl font-semibold text-white"><UserRoundCheck className="h-6 w-6 text-amber-300" />Đánh giá nhân viên</h1><p className="mt-1 text-xs text-neutral-400">Xem đánh giá riêng của khách hàng dành cho nhân viên và phản hồi với tư cách quản trị viên.</p></header>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><SummaryCard icon={MessageSquareText} label="Tổng đánh giá" value={stats.total} /><SummaryCard icon={Star} label="Điểm trung bình" value={`${stats.average.toFixed(1)} / 5`} tone="blue" /><SummaryCard icon={AlertCircle} label="Chưa phản hồi" value={stats.waiting} /><SummaryCard icon={CheckCircle2} label="Đã phản hồi" value={stats.replied} tone="green" /></div>
    <AdminFilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Tìm nhân viên, khách hàng, booking, nội dung..." filters={[{ key: 'rating', label: 'Mức đánh giá', value: rating, onChange: setRating, options: REVIEW_RATING_OPTIONS }, { key: 'replyState', label: 'Trạng thái phản hồi', value: replyState, onChange: setReplyState, options: REVIEW_REPLY_OPTIONS }]} sortValue={sortOrder} onSortChange={setSortOrder} onReset={resetFilters} />
    {pageError && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{pageError}</span><button type="button" onClick={loadData} className="ml-auto whitespace-nowrap font-medium underline">Tải lại</button></div>}
    {relatedWarning && <p role="status" className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">{relatedWarning}</p>}
    {loading ? <div className="flex min-h-48 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/50 text-sm text-neutral-400"><span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-amber-300" />Đang tải đánh giá nhân viên...</div> : <AdminTable columns={columns} data={filtered} emptyMessage="Không có đánh giá nhân viên phù hợp với bộ lọc." onDetail={setSelectedReview} />}
    <p className="flex items-center gap-2 text-[11px] text-neutral-500"><MessageSquareText className="h-3.5 w-3.5 shrink-0" />Admin chỉ xem đánh giá và gửi/cập nhật phản hồi; không thêm, sửa hoặc xóa đánh giá của khách hàng.</p>
    {selectedReview && <EmployeeReviewDialog key={selectedReview.id} employeeReview={selectedReview} review={selectedParentReview} booking={selectedBooking} onClose={() => setSelectedReview(null)} onReply={replyToEmployeeReview} />}
  </section>;
}
