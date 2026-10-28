import { useEffect, useState } from 'react';
import { CalendarDays, Clock3, FileText, MapPin, Package, Users, Wallet, X } from 'lucide-react';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import adminBookingService from '../../../services/admin/bookingService';
import BookingStatusSelect from './BookingStatusSelect';
import { formatBookingDate, formatBookingDateTime, formatBookingPrice, formatBookingTime } from './bookingConfig';

function Info({ label, children }) {
  return <div className="border-b border-neutral-800/80 py-3 last:border-0"><dt className="text-[11px] text-neutral-500">{label}</dt><dd className="mt-1 break-words text-sm text-neutral-200">{children || '—'}</dd></div>;
}

function ItemSection({ title, icon: Icon, items, loading, renderItem, empty = 'Không có dữ liệu.' }) {
  return <section className="space-y-2"><h3 className="flex items-center gap-2 text-sm font-medium text-neutral-200"><Icon className="h-4 w-4 text-amber-300" />{title}</h3>{loading ? <p className="text-xs text-neutral-500">Đang tải...</p> : items?.length ? <div className="space-y-2">{items.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-950/40 px-3 py-2.5 text-xs">{renderItem(item)}</div>)}</div> : <p className="rounded-xl border border-dashed border-neutral-800 px-3 py-3 text-xs text-neutral-500">{empty}</p>}</section>;
}

const INITIAL_ITEMS = { packages: [], services: [], backgrounds: [], equipments: [], accessories: [], clothes: [], employees: [], payments: [], review: null };

export default function BookingDialog({ booking, onClose, onStatusChange, updating }) {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let mounted = true;
    const requests = [
      adminBookingService.getPackages(booking.id),
      adminBookingService.getServices(booking.id),
      adminBookingService.getBackgrounds(booking.id),
      adminBookingService.getBookingEquipments(booking.id),
      adminBookingService.getBookingAccessories(booking.id),
      adminBookingService.getBookingClothes(booking.id),
      adminBookingService.getEmployeeAssignments(booking.id),
      adminBookingService.getPayments(booking.id),
      adminBookingService.getReview(booking.id),
    ];
    Promise.allSettled(requests).then((results) => {
      if (!mounted) return;
      const next = { ...INITIAL_ITEMS };
      results.forEach((result, index) => {
        if (result.status !== 'fulfilled') return;
        const value = result.value;
        if (index === 8) next.review = value;
        else next[['packages', 'services', 'backgrounds', 'equipments', 'accessories', 'clothes', 'employees', 'payments'][index]] = Array.isArray(value) ? value : [];
      });
      if (results.some((result) => result.status === 'rejected')) setLoadError('Một số thông tin chi tiết chưa tải được. Bạn có thể đóng hộp thoại và thử xem lại sau.');
      setItems(next);
    }).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [booking.id]);

  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const total = [...items.packages, ...items.services, ...items.accessories, ...items.clothes].reduce((sum, item) => sum + (Number(item.subTotal ?? item.subtotal) || 0), 0);
  const paid = items.payments.filter((payment) => payment.status === 'paid').reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="booking-dialog-title" className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/95 px-5 py-4 backdrop-blur"><div><p className="text-[11px] font-semibold uppercase tracking-wider text-amber-300">Chi tiết đơn đặt lịch</p><h2 id="booking-dialog-title" className="mt-1 text-lg font-semibold text-white">Đơn #{booking.id}</h2></div><button type="button" onClick={onClose} aria-label="Đóng" className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"><X className="h-4 w-4" /></button></header>
      <div className="space-y-6 px-5 py-5">
        <section><h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-200"><CalendarDays className="h-4 w-4 text-amber-300" />Thông tin lịch</h3><dl className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3"><Info label="Khách hàng">{booking.customerName}</Info><Info label="Số điện thoại">{booking.customerPhone}</Info><Info label="Phòng chụp"><span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-neutral-500" />{booking.roomName || `Phòng #${booking.roomId}`}</span></Info><Info label="Ngày chụp">{formatBookingDate(booking.bookingDate)}</Info><Info label="Khung giờ"><span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5 text-neutral-500" />{formatBookingTime(booking.startTime)} – {formatBookingTime(booking.endTime)}</span></Info><Info label="Trạng thái"><BookingStatusSelect value={booking.status} onChange={(status) => onStatusChange(booking, status)} disabled={updating} /></Info><Info label="Ghi chú khách hàng"><span className="inline-flex items-start gap-1"><FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-500" />{booking.customerNote || 'Không có ghi chú'}</span></Info><Info label="Ngày tạo đơn">{formatBookingDateTime(booking.createdAt)}</Info><Info label="Cập nhật lần cuối">{formatBookingDateTime(booking.updatedAt)}</Info></dl></section>
        {loadError && <p role="status" className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">{loadError}</p>}
        <div className="grid gap-6 lg:grid-cols-2">
          <ItemSection title="Gói chụp" icon={Package} items={items.packages} loading={loading} renderItem={(item) => <><span className="font-medium text-neutral-200">{item.packageName} <span className="text-neutral-500">× {item.quantity}</span></span><span>{formatBookingPrice(item.subTotal)}</span></>} />
          <ItemSection title="Dịch vụ kèm theo" icon={Package} items={items.services} loading={loading} renderItem={(item) => <><span className="font-medium text-neutral-200">{item.serviceName} <span className="text-neutral-500">× {item.quantity}</span></span><span>{formatBookingPrice(item.subtotal)}</span></>} />
          <ItemSection title="Bối cảnh" icon={MapPin} items={items.backgrounds} loading={loading} renderItem={(item) => <span className="font-medium text-neutral-200">{item.backgroundName}</span>} />
          <ItemSection title="Thiết bị" icon={Package} items={items.equipments} loading={loading} renderItem={(item) => <><span className="font-medium text-neutral-200">{item.equipmentName} <span className="text-neutral-500">{item.equipmentSerialNumber ? `· ${item.equipmentSerialNumber}` : ''}</span></span><StatusBadge status={item.status} /></>} />
          <ItemSection title="Phụ kiện" icon={Package} items={items.accessories} loading={loading} renderItem={(item) => <><span className="font-medium text-neutral-200">{item.accessoryName} <span className="text-neutral-500">× {item.quantity}</span></span><span>{formatBookingPrice(item.subTotal)}</span></>} />
          <ItemSection title="Trang phục" icon={Package} items={items.clothes} loading={loading} renderItem={(item) => <><span className="font-medium text-neutral-200">{item.clothName} <span className="text-neutral-500">{[item.size, item.color, item.gender].filter(Boolean).join(' · ')}</span></span><span>{item.quantity} × {formatBookingPrice(item.unitPrice)}</span></>} />
          <ItemSection title="Nhân viên phụ trách" icon={Users} items={items.employees} loading={loading} renderItem={(item) => <><span className="font-medium text-neutral-200">{item.employeeName} <span className="text-neutral-500">{item.position || ''}{item.employeePhone ? ` · ${item.employeePhone}` : ''}</span></span><StatusBadge status={item.status} /></>} />
          <ItemSection title="Thanh toán" icon={Wallet} items={items.payments} loading={loading} empty="Chưa phát sinh thanh toán." renderItem={(item) => <><span className="font-medium text-neutral-200">{item.paymentMethod || 'Thanh toán'} · <StatusBadge status={item.status} /></span><span>{formatBookingPrice(item.amount)}{item.paidAt ? ` · ${formatBookingDateTime(item.paidAt)}` : ''}</span></>} />
        </div>
        <section className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-3"><p className="text-[11px] text-neutral-500">Tổng tiền các hạng mục</p><p className="mt-1 text-sm font-semibold text-white">{formatBookingPrice(total)}</p></div><div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-3"><p className="text-[11px] text-neutral-500">Đã thanh toán</p><p className="mt-1 text-sm font-semibold text-emerald-300">{formatBookingPrice(paid)}</p></div><div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-3"><p className="text-[11px] text-neutral-500">Đánh giá</p><p className="mt-1 text-sm text-neutral-200">{items.review ? `★ ${items.review.rating ?? '—'}${items.review.comment ? ` · ${items.review.comment}` : ''}` : 'Chưa có đánh giá'}</p></div></section>
      </div>
      <footer className="flex justify-end border-t border-neutral-800 px-5 py-4"><button type="button" onClick={onClose} className="rounded-xl border border-neutral-700 px-4 py-2.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800">Đóng</button></footer>
    </section>
  </div>;
}
