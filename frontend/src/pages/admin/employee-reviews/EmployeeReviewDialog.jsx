import { useEffect, useState } from 'react';
import { MessageSquareText, Star, X } from 'lucide-react';
import { formatReviewDate, getReviewErrorMessage } from '../reviews/reviewConfig';

function Detail({ label, children }) {
  return <div className="border-b border-neutral-800/80 py-3 last:border-0"><dt className="text-[11px] text-neutral-500">{label}</dt><dd className="mt-1 break-words text-sm text-neutral-200">{children || '—'}</dd></div>;
}

export default function EmployeeReviewDialog({ employeeReview, review, booking, onClose, onReply }) {
  const [reply, setReply] = useState(employeeReview.adminReply || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape' && !saving) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, saving]);

  const submitReply = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    try { await onReply(employeeReview, reply); }
    catch (saveError) { setError(getReviewErrorMessage(saveError)); }
    finally { setSaving(false); }
  };

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="employee-review-dialog-title" className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/95 px-5 py-4 backdrop-blur"><div><p className="text-[11px] font-semibold uppercase tracking-wider text-amber-300">Đánh giá nhân viên</p><h2 id="employee-review-dialog-title" className="mt-1 font-semibold text-white">Đánh giá #{employeeReview.id}</h2></div><button type="button" onClick={onClose} aria-label="Đóng" className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"><X className="h-4 w-4" /></button></header>
      <div className="space-y-5 px-5 py-4">
        <section><h3 className="mb-2 text-sm font-medium text-neutral-200">Nội dung đánh giá</h3><dl className="grid gap-x-8 sm:grid-cols-2"><Detail label="Nhân viên">{employeeReview.employeeName || `Nhân viên #${employeeReview.employeeId}`}{employeeReview.employeePosition ? ` · ${employeeReview.employeePosition}` : ''}</Detail><Detail label="Khách hàng">{review?.customerName || (review?.customerId ? `Khách hàng #${review.customerId}` : '—')}</Detail><Detail label="Điểm dành cho nhân viên"><span className="inline-flex items-center gap-1 font-semibold text-amber-300"><Star className="h-4 w-4 fill-current" />{Number(employeeReview.rating || 0).toFixed(1)} / 5</span></Detail><Detail label="Đơn đặt lịch">{employeeReview.reviewId ? `Đánh giá chung #${employeeReview.reviewId} · Booking #${review?.bookingId ?? '—'}` : '—'}</Detail><Detail label="Ngày chụp">{booking?.bookingDate ? formatReviewDate(booking.bookingDate) : '—'}</Detail><Detail label="Ngày đánh giá chung">{review?.createdAt ? formatReviewDate(review.createdAt) : '—'}</Detail><div className="sm:col-span-2"><Detail label="Nhận xét về nhân viên">{employeeReview.comment || 'Khách hàng không để lại nhận xét riêng cho nhân viên.'}</Detail></div></dl></section>
        {review && <section className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-4"><h3 className="mb-2 text-sm font-medium text-neutral-200">Đánh giá chung của khách hàng</h3><p className="flex items-center gap-1 text-xs font-semibold text-amber-300"><Star className="h-3.5 w-3.5 fill-current" />{Number(review.rating || 0).toFixed(1)} / 5</p><p className="mt-2 text-sm leading-6 text-neutral-300">{review.comment || 'Không có nhận xét chung.'}</p></section>}
        <form onSubmit={submitReply} className="space-y-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="flex items-center gap-2 text-sm font-medium text-neutral-100"><MessageSquareText className="h-4 w-4 text-amber-300" />Phản hồi của admin</h3><p className="mt-1 text-[11px] text-neutral-500">Phản hồi này gắn với đánh giá cụ thể dành cho nhân viên.</p></div>{employeeReview.adminRepliedAt && <span className="text-right text-[10px] text-neutral-500">Đã phản hồi · {formatReviewDate(employeeReview.adminRepliedAt)}</span>}</div>
          {error && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">{error}</p>}
          <textarea required maxLength={2000} rows={4} value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Nhập phản hồi lịch sự, phù hợp với nội dung đánh giá..." className="w-full resize-y rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 outline-none placeholder:text-neutral-600 focus:border-amber-400/60" />
          <footer className="flex flex-wrap items-center justify-between gap-3"><span className="text-[11px] text-neutral-500">{reply.length}/2000 ký tự</span><button type="submit" disabled={saving || !reply.trim()} className="rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50">{saving ? 'Đang lưu...' : employeeReview.adminReply ? 'Cập nhật phản hồi' : 'Gửi phản hồi'}</button></footer>
        </form>
      </div>
      <footer className="flex justify-end border-t border-neutral-800 px-5 py-4"><button type="button" onClick={onClose} className="rounded-xl border border-neutral-700 px-4 py-2.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800">Đóng</button></footer>
    </section>
  </div>;
}
