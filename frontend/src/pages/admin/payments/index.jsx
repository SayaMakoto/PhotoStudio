import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, CircleAlert, CreditCard, Eye, Wallet } from 'lucide-react';
import AdminFilterBar from '../../../components/admin/common/AdminFilterBar';
import AdminTable from '../../../components/admin/common/AdminTable';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import adminBookingService from '../../../services/admin/bookingService';
import adminPaymentService from '../../../services/admin/paymentService';
import PaymentDialog from './PaymentDialog';
import { formatPaymentAmount, formatPaymentDateTime, getPaymentErrorMessage, PAYMENT_METHOD_LABELS, PAYMENT_METHOD_OPTIONS, PAYMENT_STATUS_OPTIONS } from './paymentConfig';

const asRows = (rows) => Array.isArray(rows) ? rows : [];
const inputClass = 'min-h-11 rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-xs text-neutral-100 outline-none focus:border-amber-400/60';
async function getBookingTotals(bookings, payments) {
  const entries = await Promise.all(asRows(bookings).map(async (booking) => {
    try {
      const packages = asRows(await adminBookingService.getPackages(booking.id));
      const packageTotal = packages.reduce((sum, item) => sum + (Number(item.subTotal ?? item.subtotal) || 0), 0);
      const bookingPayments = asRows(payments).filter((payment) => Number(payment.bookingId) === Number(booking.id));
      const deposit = bookingPayments.find((payment) => ['deposit_30', 'deposit_50'].includes((payment.status || '').toLowerCase()));
      const looksLikeDeposit = deposit && packages.length === 1 && Math.abs(packageTotal - Number(deposit.amount || 0)) < 1;
      const total = looksLikeDeposit
        ? Number(deposit.amount || 0) / (deposit.status.toLowerCase() === 'deposit_50' ? 0.5 : 0.3)
        : packageTotal;
      return [booking.id, total];
    } catch {
      return [booking.id, null];
    }
  }));
  return Object.fromEntries(entries);
}

function SummaryCard({ label, value, icon: Icon, tone = 'amber' }) {
  const colors = { amber: 'border-amber-500/20 bg-amber-500/10 text-amber-300', green: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300', blue: 'border-sky-500/20 bg-sky-500/10 text-sky-300', red: 'border-rose-500/20 bg-rose-500/10 text-rose-300' };
  return <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs text-neutral-400">{label}</p><span className={`grid h-9 w-9 place-items-center rounded-xl border ${colors[tone]}`}><Icon className="h-4 w-4" /></span></div><p className="mt-3 text-xl font-semibold text-white">{value}</p></div>;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [bookingMap, setBookingMap] = useState({});
  const [bookingTotals, setBookingTotals] = useState({});
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [method, setMethod] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [bookingWarning, setBookingWarning] = useState('');

  const loadData = async () => {
    setLoading(true); setPageError(''); setBookingWarning('');
    const [paymentResult, bookingResult] = await Promise.allSettled([adminPaymentService.getAll(), adminBookingService.getAll()]);
    if (paymentResult.status === 'fulfilled') setPayments(asRows(paymentResult.value));
    else setPageError(getPaymentErrorMessage(paymentResult.reason));
    if (bookingResult.status === 'fulfilled') {
      const bookings = asRows(bookingResult.value);
      setBookingMap(Object.fromEntries(bookings.map((booking) => [booking.id, booking])));
      if (paymentResult.status === 'fulfilled') setBookingTotals(await getBookingTotals(bookings, asRows(paymentResult.value)));
    } else setBookingWarning('Không tải được thông tin booking liên quan; danh sách thanh toán vẫn hiển thị mã đơn.');
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([adminPaymentService.getAll(), adminBookingService.getAll()]).then(([paymentResult, bookingResult]) => {
      if (!mounted) return;
      if (paymentResult.status === 'fulfilled') setPayments(asRows(paymentResult.value));
      else setPageError(getPaymentErrorMessage(paymentResult.reason));
      if (bookingResult.status === 'fulfilled') {
        const bookings = asRows(bookingResult.value);
        setBookingMap(Object.fromEntries(bookings.map((booking) => [booking.id, booking])));
        if (paymentResult.status === 'fulfilled') getBookingTotals(bookings, asRows(paymentResult.value)).then((totals) => { if (mounted) setBookingTotals(totals); });
      }
      else setBookingWarning('Không tải được thông tin booking liên quan; danh sách thanh toán vẫn hiển thị mã đơn.');
    }).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return payments.filter((payment) => {
      const booking = bookingMap[payment.bookingId];
      const paidDay = payment.paidAt?.slice?.(0, 10) || '';
      const matchesSearch = !keyword || [payment.id, payment.bookingId, payment.paymentMethod, payment.note, booking?.customerName, booking?.customerPhone].filter(Boolean).some((value) => String(value).toLowerCase().includes(keyword));
      return matchesSearch && (!status || payment.status === status) && (!method || payment.paymentMethod === method) && (!dateFrom || paidDay >= dateFrom) && (!dateTo || paidDay <= dateTo);
    }).sort((a, b) => (sortOrder === 'oldest' ? 1 : -1) * ((Number(a.id) || 0) - (Number(b.id) || 0)));
  }, [bookingMap, dateFrom, dateTo, method, payments, search, sortOrder, status]);

  const stats = useMemo(() => ({
    count: payments.length,
    paid: payments.filter((payment) => payment.status === 'paid').reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0),
    pending: payments.filter((payment) => payment.status === 'pending').reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0),
    deposit30: payments.filter((payment) => payment.status === 'deposit_30').reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0),
    deposit50: payments.filter((payment) => payment.status === 'deposit_50').reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0),
  }), [payments]);

  const resetFilters = () => { setSearch(''); setStatus(''); setMethod(''); setSortOrder('newest'); setDateFrom(''); setDateTo(''); };
  const columns = [
    { key: 'id', title: 'Mã giao dịch', cellClassName: 'font-mono text-neutral-400' },
    { key: 'bookingId', title: 'Đơn đặt lịch', render: (bookingId) => <span className="font-mono text-amber-200">#{bookingId ?? '—'}</span> },
    { key: 'customer', title: 'Khách hàng', render: (_, payment) => { const booking = bookingMap[payment.bookingId]; return <div className="min-w-36"><p className="font-medium text-neutral-100">{booking?.customerName || 'Chưa có dữ liệu'}</p><p className="mt-0.5 text-[11px] text-neutral-500">{booking?.customerPhone || `Đơn #${payment.bookingId ?? '—'}`}</p></div>; } },
    { key: 'paymentMethod', title: 'Phương thức', render: (value) => PAYMENT_METHOD_LABELS[value] || value || '—' },
    { key: 'amount', title: 'Số tiền', render: (value) => <span className="font-semibold text-white">{formatPaymentAmount(value)}</span> },
    { key: 'bookingTotal', title: 'Tổng đơn', render: (_, payment) => bookingTotals[payment.bookingId] == null ? '—' : <span className="font-medium text-neutral-200">{formatPaymentAmount(bookingTotals[payment.bookingId])}</span> },
    { key: 'paidAt', title: 'Thời điểm ghi nhận', render: formatPaymentDateTime },
    { key: 'status', title: 'Trạng thái', render: (value) => <StatusBadge status={value} domain="payment" /> },
  ];

  return <section className="space-y-5">
    <header><p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">Tài chính</p><h1 className="flex items-center gap-2 text-2xl font-semibold text-white"><Wallet className="h-6 w-6 text-amber-300" />Lịch sử thanh toán</h1><p className="mt-1 text-xs text-neutral-400">Theo dõi các giao dịch phát sinh từ booking, phương thức, số tiền và trạng thái thanh toán.</p></header>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5"><SummaryCard icon={CreditCard} label="Tổng giao dịch" value={stats.count} /><SummaryCard icon={CircleAlert} label="Đang chờ thanh toán" value={formatPaymentAmount(stats.pending)} tone="blue" /><SummaryCard icon={Wallet} label="Đã cọc 30%" value={formatPaymentAmount(stats.deposit30)} tone="blue" /><SummaryCard icon={Wallet} label="Đã cọc 50%" value={formatPaymentAmount(stats.deposit50)} tone="blue" /><SummaryCard icon={CheckCircle2} label="Đã thanh toán" value={formatPaymentAmount(stats.paid)} tone="green" /></div>
    <AdminFilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Tìm mã giao dịch, đơn, khách hàng, ghi chú..." filters={[{ key: 'status', label: 'Trạng thái', value: status, onChange: setStatus, options: PAYMENT_STATUS_OPTIONS }, { key: 'method', label: 'Phương thức', value: method, onChange: setMethod, options: PAYMENT_METHOD_OPTIONS }]} sortValue={sortOrder} onSortChange={setSortOrder} onReset={resetFilters} />
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-3"><label className="grid gap-1.5 text-[11px] font-medium text-neutral-400">Từ ngày ghi nhận<input aria-label="Lọc thanh toán từ ngày" type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className={inputClass} /></label><label className="grid gap-1.5 text-[11px] font-medium text-neutral-400">Đến ngày ghi nhận<input aria-label="Lọc thanh toán đến ngày" type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className={inputClass} /></label><p className="ml-auto text-xs text-neutral-500">{filtered.length} giao dịch phù hợp</p></div>
    {pageError && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{pageError}</span><button type="button" onClick={loadData} className="ml-auto whitespace-nowrap font-medium underline">Tải lại</button></div>}
    {bookingWarning && <p role="status" className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">{bookingWarning}</p>}
    {loading ? <div className="flex min-h-48 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/50 text-sm text-neutral-400"><span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-amber-300" />Đang tải lịch sử thanh toán...</div> : <AdminTable columns={columns} data={filtered} emptyMessage="Chưa có giao dịch phù hợp với bộ lọc." onDetail={setSelectedPayment} />}
    <p className="flex items-center gap-2 text-[11px] text-neutral-500"><Eye className="h-3.5 w-3.5 shrink-0" />Trang admin chỉ cung cấp quyền xem lịch sử và chi tiết giao dịch.</p>
    {selectedPayment && <PaymentDialog key={selectedPayment.id} payment={selectedPayment} booking={bookingMap[selectedPayment.bookingId]} bookingTotal={bookingTotals[selectedPayment.bookingId]} bookingPayments={payments.filter((item) => Number(item.bookingId) === Number(selectedPayment.bookingId))} onClose={() => setSelectedPayment(null)} />}
  </section>;
}
