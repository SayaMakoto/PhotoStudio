import { useEffect } from 'react';
import { CalendarDays, CreditCard, FileText, Hash, Wallet, X } from 'lucide-react';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import { formatPaymentAmount, formatPaymentDateTime, PAYMENT_METHOD_LABELS } from './paymentConfig';

function Detail({ label, children }) {
  return <div className="border-b border-neutral-800/80 py-3 last:border-0"><dt className="text-[11px] text-neutral-500">{label}</dt><dd className="mt-1 break-words text-sm text-neutral-200">{children || '—'}</dd></div>;
}

export default function PaymentDialog({ payment, booking, onClose }) {
  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="payment-dialog-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
      <header className="flex items-center justify-between border-b border-neutral-800 px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400/10 text-amber-300"><Wallet className="h-5 w-5" /></span><div><p className="text-[11px] font-semibold uppercase tracking-wider text-amber-300">Lịch sử thanh toán</p><h2 id="payment-dialog-title" className="mt-1 font-semibold text-white">Giao dịch #{payment.id}</h2></div></div><button type="button" onClick={onClose} aria-label="Đóng" className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"><X className="h-4 w-4" /></button></header>
      <div className="space-y-5 px-5 py-4"><section><h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-200"><CreditCard className="h-4 w-4 text-amber-300" />Thông tin giao dịch</h3><dl className="grid gap-x-8 sm:grid-cols-2"><Detail label="Số tiền"><span className="text-base font-semibold text-white">{formatPaymentAmount(payment.amount)}</span></Detail><Detail label="Trạng thái"><StatusBadge status={payment.status} domain="payment" /></Detail><Detail label="Phương thức thanh toán">{PAYMENT_METHOD_LABELS[payment.paymentMethod] || payment.paymentMethod}</Detail><Detail label="Thời điểm ghi nhận"><span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-neutral-500" />{formatPaymentDateTime(payment.paidAt)}</span></Detail><div className="sm:col-span-2"><Detail label="Ghi chú"><span className="inline-flex items-start gap-1.5"><FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-500" />{payment.note || 'Không có ghi chú'}</span></Detail></div></dl></section>
        <section><h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-200"><Hash className="h-4 w-4 text-amber-300" />Đơn đặt lịch liên quan</h3><dl className="grid gap-x-8 sm:grid-cols-2"><Detail label="Mã đơn">#{payment.bookingId}</Detail><Detail label="Khách hàng">{booking?.customerName || (booking?.customerId ? `Khách hàng #${booking.customerId}` : 'Không có dữ liệu booking')}</Detail><Detail label="Số điện thoại">{booking?.customerPhone}</Detail><Detail label="Phòng chụp">{booking?.roomName || (booking?.roomId ? `Phòng #${booking.roomId}` : null)}</Detail><Detail label="Ngày chụp">{booking?.bookingDate ? formatPaymentDateTime(booking.bookingDate) : '—'}</Detail><Detail label="Trạng thái đơn">{booking?.status ? <StatusBadge status={booking.status} domain="booking" /> : '—'}</Detail></dl></section>
      </div>
      <footer className="flex justify-end border-t border-neutral-800 px-5 py-4"><button type="button" onClick={onClose} className="rounded-xl border border-neutral-700 px-4 py-2.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800">Đóng</button></footer>
    </section>
  </div>;
}
