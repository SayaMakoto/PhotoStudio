import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, MessageSquareText, Star, Users } from 'lucide-react';
import AdminFilterBar from '../../../components/admin/common/AdminFilterBar';
import AdminTable from '../../../components/admin/common/AdminTable';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import useAdminNotification from '../../../components/admin/common/useAdminNotification';
import adminBookingService from '../../../services/admin/bookingService';
import adminEmployeeService from '../../../services/admin/employeeService';
import adminReviewService from '../../../services/admin/reviewService';
import ReviewDialog from './ReviewDialog';
import { formatReviewDate, getReviewErrorMessage, REVIEW_RATING_OPTIONS, REVIEW_REPLY_OPTIONS } from './reviewConfig';

const asRows = (rows) => Array.isArray(rows) ? rows : [];

function SummaryCard({ label, value, icon: Icon, tone = 'amber' }) {
  const colors = { amber: 'border-amber-500/20 bg-amber-500/10 text-amber-300', green: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300', blue: 'border-sky-500/20 bg-sky-500/10 text-sky-300' };
  return <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs text-neutral-400">{label}</p><span className={`grid h-9 w-9 place-items-center rounded-xl border ${colors[tone]}`}><Icon className="h-4 w-4" /></span></div><p className="mt-3 text-xl font-semibold text-white">{value}</p></div>;
}

export default function AdminReviewsPage() {
  const { notify } = useAdminNotification();
  const [reviews, setReviews] = useState([]);
  const [bookingMap, setBookingMap] = useState({});
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [rating, setRating] = useState('');
  const [replyState, setReplyState] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedReview, setSelectedReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [relatedDataWarning, setRelatedDataWarning] = useState('');

  const loadData = async () => {
    setLoading(true); setPageError(''); setRelatedDataWarning('');
    const [reviewResult, bookingResult, employeeResult] = await Promise.allSettled([
      adminReviewService.getAll(), adminBookingService.getAll(), adminEmployeeService.getAll(),
    ]);
    if (reviewResult.status === 'fulfilled') setReviews(asRows(reviewResult.value));
    else setPageError(getReviewErrorMessage(reviewResult.reason));
    if (bookingResult.status === 'fulfilled') setBookingMap(Object.fromEntries(asRows(bookingResult.value).map((booking) => [booking.id, booking])));
    if (employeeResult.status === 'fulfilled') setEmployees(asRows(employeeResult.value));
    if (bookingResult.status === 'rejected' || employeeResult.status === 'rejected') setRelatedDataWarning('Một số thông tin booking hoặc nhân viên không tải được; đánh giá vẫn được hiển thị.');
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([adminReviewService.getAll(), adminBookingService.getAll(), adminEmployeeService.getAll()]).then(([reviewResult, bookingResult, employeeResult]) => {
      if (!mounted) return;
      if (reviewResult.status === 'fulfilled') setReviews(asRows(reviewResult.value));
      else setPageError(getReviewErrorMessage(reviewResult.reason));
      if (bookingResult.status === 'fulfilled') setBookingMap(Object.fromEntries(asRows(bookingResult.value).map((booking) => [booking.id, booking])));
      if (employeeResult.status === 'fulfilled') setEmployees(asRows(employeeResult.value));
      if (bookingResult.status === 'rejected' || employeeResult.status === 'rejected') setRelatedDataWarning('Một số thông tin booking hoặc nhân viên không tải được; đánh giá vẫn được hiển thị.');
    }).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return reviews.filter((review) => {
      const booking = bookingMap[review.bookingId];
      const employeeComments = review.employeeReviews?.map((item) => item.comment).filter(Boolean) || [];
      const matchesSearch = !keyword || [review.id, review.bookingId, review.customerId, review.customerName, review.comment, review.adminReply, booking?.customerPhone, ...employeeComments].filter(Boolean).some((value) => String(value).toLowerCase().includes(keyword));
      const isReplied = Boolean(review.adminReply?.trim());
      return matchesSearch && (!rating || Number(review.rating) === Number(rating)) && (!replyState || (replyState === 'replied' ? isReplied : !isReplied));
    }).sort((a, b) => (sortOrder === 'oldest' ? 1 : -1) * ((Number(a.id) || 0) - (Number(b.id) || 0)));
  }, [bookingMap, rating, replyState, reviews, search, sortOrder]);

  const stats = useMemo(() => ({
    total: reviews.length,
    average: reviews.length ? reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0) / reviews.length : 0,
    waiting: reviews.filter((review) => !review.adminReply?.trim()).length,
    replied: reviews.filter((review) => Boolean(review.adminReply?.trim())).length,
  }), [reviews]);

  const replyToReview = async (review, reply) => {
    try {
      const updated = await adminReviewService.reply(review.id, reply);
      setReviews((current) => current.map((item) => item.id === review.id ? updated : item));
      setSelectedReview((current) => current?.id === review.id ? updated : current);
      notify({ type: 'success', title: 'Đã lưu phản hồi', message: `Phản hồi cho đánh giá #${review.id} đã được lưu.` });
      return updated;
    } catch (error) {
      notify({ type: 'error', message: getReviewErrorMessage(error) });
      throw error;
    }
  };

  const resetFilters = () => { setSearch(''); setRating(''); setReplyState(''); setSortOrder('newest'); };
  const columns = [
    { key: 'id', title: 'Mã đánh giá', cellClassName: 'font-mono text-neutral-400' },
    { key: 'customerName', title: 'Khách hàng', render: (name, review) => <div className="min-w-36"><p className="font-medium text-neutral-100">{name || `Khách hàng #${review.customerId}`}</p><p className="mt-0.5 text-[11px] text-neutral-500">Đơn #{review.bookingId}{bookingMap[review.bookingId]?.customerPhone ? ` · ${bookingMap[review.bookingId].customerPhone}` : ''}</p></div> },
    { key: 'rating', title: 'Số sao', render: (value) => <span className="inline-flex items-center gap-1 font-semibold text-amber-300"><Star className="h-3.5 w-3.5 fill-current" />{Number(value || 0).toFixed(1)}</span> },
    { key: 'comment', title: 'Nhận xét', render: (value) => <p className="max-w-sm min-w-48 truncate text-neutral-300" title={value || ''}>{value || 'Không có nhận xét'}</p> },
    { key: 'adminReply', title: 'Phản hồi', render: (value) => <StatusBadge status={value?.trim() ? 'replied' : 'unreplied'} domain="reviewReply" /> },
    { key: 'createdAt', title: 'Ngày đánh giá', render: formatReviewDate },
  ];

  return <section className="space-y-5">
    <header><p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">Quản lý đánh giá</p><h1 className="flex items-center gap-2 text-2xl font-semibold text-white"><MessageSquareText className="h-6 w-6 text-amber-300" />Đánh giá buổi chụp</h1><p className="mt-1 text-xs text-neutral-400">Theo dõi nhận xét của khách hàng và phản hồi với tư cách quản trị viên. Không chỉnh sửa hoặc xóa đánh giá.</p></header>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><SummaryCard icon={MessageSquareText} label="Tổng đánh giá" value={stats.total} /><SummaryCard icon={Star} label="Điểm trung bình" value={`${stats.average.toFixed(1)} / 5`} tone="blue" /><SummaryCard icon={AlertCircle} label="Chưa phản hồi" value={stats.waiting} /><SummaryCard icon={CheckCircle2} label="Đã phản hồi" value={stats.replied} tone="green" /></div>
    <AdminFilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Tìm mã review, booking, khách hàng, nội dung..." filters={[{ key: 'rating', label: 'Mức đánh giá', value: rating, onChange: setRating, options: REVIEW_RATING_OPTIONS }, { key: 'replyState', label: 'Trạng thái phản hồi', value: replyState, onChange: setReplyState, options: REVIEW_REPLY_OPTIONS }]} sortValue={sortOrder} onSortChange={setSortOrder} onReset={resetFilters} />
    {pageError && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{pageError}</span><button type="button" onClick={loadData} className="ml-auto whitespace-nowrap font-medium underline">Tải lại</button></div>}
    {relatedDataWarning && <p role="status" className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">{relatedDataWarning}</p>}
    {loading ? <div className="flex min-h-48 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/50 text-sm text-neutral-400"><span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-amber-300" />Đang tải đánh giá...</div> : <AdminTable columns={columns} data={filtered} emptyMessage="Không có đánh giá phù hợp với bộ lọc." onDetail={setSelectedReview} />}
    <p className="flex items-center gap-2 text-[11px] text-neutral-500"><Users className="h-3.5 w-3.5 shrink-0" />Admin chỉ xem đánh giá, thông tin đánh giá nhân viên và gửi/cập nhật phản hồi của studio.</p>
    {selectedReview && <ReviewDialog key={selectedReview.id} review={selectedReview} booking={bookingMap[selectedReview.bookingId]} employees={employees} onClose={() => setSelectedReview(null)} onReply={replyToReview} />}
  </section>;
}
