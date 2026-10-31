import { useEffect, useState } from 'react';
import { CalendarDays, Clock3, FileText, MapPin, Package, Users, Wallet, X, UserMinus, UserPlus } from 'lucide-react';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import GlideSelect from '../../../components/admin/common/GlideSelect';
import adminBookingService from '../../../services/admin/bookingService';
import adminPackageService from '../../../services/admin/packageService';
import BookingStatusSelect from './BookingStatusSelect';
import { formatBookingDate, formatBookingDateTime, formatBookingPrice, formatBookingTime, getAdminBookingStatusOptions } from './bookingConfig';
import { EMPLOYEE_POSITION_LABELS } from '../employees/employeeConfig';

function Info({ label, children }) {
  return <div className="border-b border-neutral-800/80 py-3 last:border-0"><dt className="text-[11px] text-neutral-500">{label}</dt><dd className="mt-1 break-words text-sm text-neutral-200">{children || '—'}</dd></div>;
}

function ItemSection({ title, icon: Icon, items, loading, renderItem, empty = 'Không có dữ liệu.', error }) {
  return <section className="space-y-2"><h3 className="flex items-center gap-2 text-sm font-medium text-neutral-200"><Icon className="h-4 w-4 text-rose-400" />{title}</h3>{loading ? <p className="text-xs text-neutral-500">Đang tải...</p> : error ? <p className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-3 text-xs text-red-300">Không tải được dữ liệu mục này.</p> : items?.length ? <div className="space-y-2">{items.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-950/40 px-3 py-2.5 text-xs">{renderItem(item)}</div>)}</div> : <p className="rounded-xl border border-dashed border-neutral-800 px-3 py-3 text-xs text-neutral-500">{empty}</p>}</section>;
}

const INITIAL_ITEMS = { packages: [], services: [], backgrounds: [], equipments: [], accessories: [], clothes: [], employees: [], payments: [], review: null };

export default function BookingDialog({ booking, onClose, onStatusChange, updating }) {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [failedSections, setFailedSections] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [assignmentBusy, setAssignmentBusy] = useState(false);
  const [assignmentError, setAssignmentError] = useState('');

  useEffect(() => {
    let mounted = true;
    const loadDetails = async () => {
      const results = await Promise.allSettled([
        adminBookingService.getPackages(booking.id),
        adminBookingService.getEmployeeAssignments(booking.id),
        adminBookingService.getPayments(booking.id),
        adminBookingService.getReview(booking.id),
        adminBookingService.getEmployees(),
      ]);
      if (!mounted) return;
      const next = { ...INITIAL_ITEMS };
      results.forEach((result, index) => {
        if (result.status !== 'fulfilled') return;
        const value = result.value;
        if (index === 3) next.review = value;
        else if (index === 4) setEmployees(Array.isArray(value) ? value : []);
        else next[['packages', 'employees', 'payments'][index]] = Array.isArray(value) ? value : [];
      });

      const packageDetails = await Promise.allSettled(next.packages.map(async (bookingPackage) => {
        const [packageResult, servicesResult, backgroundsResult] = await Promise.allSettled([
          adminPackageService.getById(bookingPackage.packageId),
          adminPackageService.getPackageServices(bookingPackage.packageId),
          adminPackageService.getPackageBackgrounds(bookingPackage.packageId),
        ]);
        return {
          bookingPackage,
          packageData: packageResult.status === 'fulfilled' ? packageResult.value : null,
          services: servicesResult.status === 'fulfilled' && Array.isArray(servicesResult.value) ? servicesResult.value : [],
          backgrounds: backgroundsResult.status === 'fulfilled' && Array.isArray(backgroundsResult.value) ? backgroundsResult.value : [],
        };
      }));
      if (!mounted) return;
      const linkedPackages = packageDetails.flatMap((result) => result.status === 'fulfilled' ? [result.value] : []);
      const withPackageItemIds = (items, bookingPackage, kind) => (items || []).map((item, index) => ({
        ...item,
        id: `${kind}-${bookingPackage.id}-${item.id ?? index}`,
        packageName: bookingPackage.packageName,
      }));
      next.equipments = linkedPackages.flatMap(({ bookingPackage, packageData }) => withPackageItemIds(packageData?.equipments, bookingPackage, 'equipment'));
      next.clothes = linkedPackages.flatMap(({ bookingPackage, packageData }) => withPackageItemIds(packageData?.clothes, bookingPackage, 'cloth'));
      next.accessories = linkedPackages.flatMap(({ bookingPackage, packageData }) => withPackageItemIds(packageData?.accessories, bookingPackage, 'accessory'));
      next.services = linkedPackages.flatMap(({ bookingPackage, services }) => withPackageItemIds(services, bookingPackage, 'service'));
      next.backgrounds = linkedPackages.flatMap(({ bookingPackage, backgrounds }) => withPackageItemIds(backgrounds, bookingPackage, 'background'));

      const depositPayment = next.payments.find((payment) => ['deposit_30', 'deposit_50'].includes((payment.status || '').toLowerCase()));
      const successfulPaid = next.payments
        .filter((payment) => ['paid', 'deposit_30', 'deposit_50', 'completed', 'success'].includes((payment.status || '').toLowerCase()))
        .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);
      const packagePriceById = new Map(linkedPackages.map(({ bookingPackage, packageData }) => [
        String(bookingPackage.packageId), Number(packageData?.price) || 0,
      ]));
      next.packages = next.packages.map((item) => {
        const quantity = Number(item.quantity || 1);
        const storedSubtotal = Number(item.subTotal ?? item.subtotal) || 0;
        const catalogUnitPrice = packagePriceById.get(String(item.packageId)) || 0;
        const catalogSubtotal = catalogUnitPrice * quantity;
        const isDepositStoredAsPackagePrice = depositPayment
          && Math.abs(storedSubtotal - Number(depositPayment.amount || 0)) < 1;
        const isOrderTotalStoredAsPackagePrice = successfulPaid > catalogSubtotal
          && Math.abs(storedSubtotal - successfulPaid) < 1;
        const exceedsCatalogPrice = catalogSubtotal > 0 && storedSubtotal > catalogSubtotal;

        if (catalogUnitPrice > 0 && (isDepositStoredAsPackagePrice || isOrderTotalStoredAsPackagePrice || exceedsCatalogPrice)) {
          return { ...item, unitPrice: catalogUnitPrice, subTotal: catalogSubtotal };
        }
        return item;
      });

      const sectionNames = ['Gói chụp', 'Nhân viên phụ trách', 'Thanh toán'];
      const failures = results.flatMap((result, index) => {
        if (result.status !== 'rejected') return [];
        // Booking chưa được đánh giá là tình huống bình thường, backend hiện trả 4xx.
        const reviewErrorMessage = result.reason?.response?.data?.message || '';
        if (index === 3 && (result.reason?.response?.status === 404 || reviewErrorMessage.includes('chưa có đánh giá'))) return [];
        if (index === 4) return [];
        return index < 3 ? [sectionNames[index]] : ['Đánh giá'];
      });
      setFailedSections(failures);
      if (failures.length) setLoadError(`Không tải được: ${failures.join(', ')}.`);
      setItems(next);
    };
    loadDetails().catch((error) => setLoadError(error?.message || 'Không thể tải chi tiết đơn đặt lịch.'))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [booking.id]);

  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const packageTotal = items.packages.reduce((sum, item) => sum + (Number(item.subTotal ?? item.subtotal) || 0), 0);
  const paid = items.payments.filter((payment) => ['paid', 'deposit_30', 'deposit_50', 'completed', 'success'].includes((payment.status || '').toLowerCase())).reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);
  const depositPayment = items.payments.find((payment) => ['deposit_30', 'deposit_50'].includes((payment.status || '').toLowerCase()));
  const inferredDepositTotal = depositPayment
    ? Number(depositPayment.amount || 0) / (depositPayment.status.toLowerCase() === 'deposit_50' ? 0.5 : 0.3)
    : 0;
  // Booking-package stores only package price; successful payments can also include room/services/surcharges.
  const total = Math.max(packageTotal, inferredDepositTotal, paid);
  const remaining = Math.max(0, total - paid);
  const nextStatuses = getAdminBookingStatusOptions(booking.status);
  const activeAssignments = items.employees.filter((item) => item.status === 'assigned');
  const visibleAssignments = items.employees.filter((item) => item.status !== 'cancelled');
  const availableEmployees = employees.filter((employee) => employee.status === 'active' && !activeAssignments.some((item) => String(item.employeeId) === String(employee.id)));
  const employeeOptions = availableEmployees.map((employee) => ({
    value: String(employee.id),
    label: `${employee.fullname || `Nhân viên #${employee.id}`} · ${EMPLOYEE_POSITION_LABELS[employee.position] || employee.position || 'Nhân viên'}`,
  }));
  const reloadAssignments = async () => {
    const assignments = await adminBookingService.getEmployeeAssignments(booking.id);
    setItems((current) => ({ ...current, employees: assignments }));
  };
  const changeBookingStatus = async (selectedBooking, status) => {
    await onStatusChange(selectedBooking, status);
    if (status === 'completed' || status === 'cancelled') {
      try { await reloadAssignments(); } catch { /* Keep the last loaded assignment list if refresh fails. */ }
    }
  };
  const assignEmployee = async () => {
    if (!employeeId || assignmentBusy) return;
    setAssignmentBusy(true); setAssignmentError('');
    try { await adminBookingService.assignEmployee(booking.id, Number(employeeId)); await reloadAssignments(); setEmployeeId(''); }
    catch (error) { setAssignmentError(error?.response?.data?.message || 'Không thể phân công nhân viên.'); }
    finally { setAssignmentBusy(false); }
  };
  const releaseEmployee = async (assignment) => {
    setAssignmentBusy(true); setAssignmentError('');
    try { await adminBookingService.updateAssignmentStatus(assignment.id, 'cancelled'); await reloadAssignments(); }
    catch (error) { setAssignmentError(error?.response?.data?.message || 'Không thể giải phóng nhân viên.'); }
    finally { setAssignmentBusy(false); }
  };

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="booking-dialog-title" className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/95 px-5 py-4 backdrop-blur"><div><p className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">Chi tiết đơn đặt lịch</p><h2 id="booking-dialog-title" className="mt-1 text-lg font-semibold text-white">Đơn #{booking.id}</h2></div><button type="button" onClick={onClose} aria-label="Đóng" className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"><X className="h-4 w-4" /></button></header>
      <div className="space-y-6 px-5 py-5">
        <section>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-200"><CalendarDays className="h-4 w-4 text-rose-400" />Thông tin lịch</h3>
          <dl className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            <Info label="Khách hàng">{booking.customerName}</Info><Info label="Số điện thoại">{booking.customerPhone}</Info>
            <Info label="Phòng chụp"><span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-neutral-500" />{booking.roomName || `Phòng #${booking.roomId}`}</span></Info>
            <Info label="Ngày chụp">{formatBookingDate(booking.bookingDate)}</Info>
            <Info label="Khung giờ"><span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5 text-neutral-500" />{formatBookingTime(booking.startTime)} – {formatBookingTime(booking.endTime)}</span></Info>
            <Info label="Trạng thái hiện tại"><StatusBadge status={booking.status} domain="booking" /></Info>
            <Info label="Ghi chú khách hàng"><span className="inline-flex items-start gap-1"><FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-500" />{booking.customerNote || 'Không có ghi chú'}</span></Info>
            <Info label="Ngày tạo đơn">{formatBookingDateTime(booking.createdAt)}</Info><Info label="Cập nhật lần cuối">{formatBookingDateTime(booking.updatedAt)}</Info>
          </dl>
          {nextStatuses.length ? <div className="mt-4 max-w-sm space-y-1.5"><p className="text-[11px] font-medium text-neutral-400">Quyết định đơn đặt lịch</p><BookingStatusSelect options={nextStatuses} onChange={(status) => changeBookingStatus(booking, status)} disabled={updating} /></div> : <p className="mt-3 text-[11px] text-neutral-500">{booking.status === 'cancelled' ? 'Đơn đã từ chối hoặc bị hủy, không thể cập nhật tiếp.' : 'Admin chỉ xử lý đơn đang chờ xác nhận; các trạng thái sau do nhân viên cập nhật.'}</p>}
        </section>
        {loadError && <p role="status" className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-amber-200">{loadError}</p>}
        <div className="grid gap-6 lg:grid-cols-2">
          <ItemSection title="Gói chụp" icon={Package} items={items.packages} error={failedSections.includes('Gói chụp')} loading={loading} renderItem={(item) => <><span className="font-medium text-neutral-200">{item.packageName} <span className="text-neutral-500">× {item.quantity}</span></span><span>{formatBookingPrice(item.subTotal)}</span></>} />
          <ItemSection title="Dịch vụ trong gói" icon={Package} items={items.services} loading={loading} renderItem={(item) => <><span className="font-medium text-neutral-200">{item.serviceName} <span className="text-neutral-500">· {item.packageName} · × {item.quantity}</span></span><span>{formatBookingPrice(item.subtotal)}</span></>} />
          <ItemSection title="Bối cảnh trong gói" icon={MapPin} items={items.backgrounds} loading={loading} renderItem={(item) => <span className="font-medium text-neutral-200">{item.backgroundName} <span className="text-neutral-500">· {item.packageName}</span></span>} />
          <ItemSection title="Thiết bị theo gói" icon={Package} items={items.equipments} loading={loading} renderItem={(item) => <span className="font-medium text-neutral-200">{item.equipmentType} <span className="text-neutral-500">· {item.packageName} · × {item.quantity}</span></span>} />
          <ItemSection title="Phụ kiện trong gói" icon={Package} items={items.accessories} loading={loading} renderItem={(item) => <span className="font-medium text-neutral-200">{item.accessoryName} <span className="text-neutral-500">· {item.packageName} · × {item.quantity}</span></span>} />
          <ItemSection title="Trang phục trong gói" icon={Package} items={items.clothes} loading={loading} renderItem={(item) => <span className="font-medium text-neutral-200">{item.clothName} <span className="text-neutral-500">{[item.size, item.color, item.packageName, `× ${item.quantity}`].filter(Boolean).join(' · ')}</span></span>} />
          <section className="space-y-2"><h3 className="flex items-center gap-2 text-sm font-medium text-neutral-200"><Users className="h-4 w-4 text-rose-400" />Nhân viên phụ trách</h3>{loading ? <p className="text-xs text-neutral-500">Đang tải...</p> : failedSections.includes('Nhân viên phụ trách') ? <p className="text-xs text-red-300">Không tải được danh sách phân công.</p> : <><div className="flex items-end gap-2"><div className="min-w-0 flex-1"><GlideSelect options={employeeOptions} value={employeeId} onChange={setEmployeeId} placeholder="Chọn nhân viên đang hoạt động" ariaLabel="Chọn nhân viên phân công" showTags={false} disabled={assignmentBusy || !['pending','confirmed','in_progress'].includes(booking.status)} size="md" accentColor="#fbbf24" surfaceColor="#0a0a0a" highlightColor="#262626" textColor="#e5e5e5" menuWidth={320} className="w-full [&>button]:min-h-10 [&>button]:w-full [&>button]:justify-between [&>button]:border [&>button]:border-neutral-800" /></div><button type="button" onClick={assignEmployee} disabled={!employeeId || assignmentBusy || !['pending','confirmed','in_progress'].includes(booking.status)} className="inline-flex h-10 shrink-0 items-center gap-1 rounded-xl bg-rose-500 px-3 text-xs font-semibold text-neutral-950 disabled:opacity-40"><UserPlus className="h-3.5 w-3.5"/>Giao</button></div>{assignmentError && <p role="alert" className="text-xs text-rose-300">{assignmentError}</p>}{visibleAssignments.length ? <div className="space-y-2">{visibleAssignments.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-neutral-800 bg-neutral-950/40 px-3 py-2 text-xs"><span className="font-medium text-neutral-200">{item.employeeName} <span className="text-neutral-500">{EMPLOYEE_POSITION_LABELS[item.position] || item.position || ''}{item.employeePhone ? ` · ${item.employeePhone}` : ''}</span></span><span className="flex items-center gap-2"><StatusBadge status={item.status} />{item.status === 'assigned' && <button type="button" onClick={() => releaseEmployee(item)} disabled={assignmentBusy} aria-label={`Giải phóng ${item.employeeName}`} title="Giải phóng nhân viên" className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-rose-300 disabled:opacity-40"><UserMinus className="h-4 w-4"/></button>}</span></div>)}</div> : <p className="rounded-xl border border-dashed border-neutral-800 px-3 py-3 text-xs text-neutral-500">Chưa có nhân viên được phân công.</p>}<p className="text-[11px] text-neutral-500">Nhân viên được giải phóng tự động khi buổi chụp hoàn tất hoặc bị hủy.</p></>}</section>
          <ItemSection title="Thanh toán" icon={Wallet} items={items.payments} error={failedSections.includes('Thanh toán')} loading={loading} empty="Chưa phát sinh thanh toán." renderItem={(item) => <><span className="font-medium text-neutral-200">{item.paymentMethod || 'Thanh toán'} · <StatusBadge status={item.status} /></span><span>{formatBookingPrice(item.amount)}{item.paidAt ? ` · ${formatBookingDateTime(item.paidAt)}` : ''}</span></>} />
        </div>
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-3"><p className="text-[11px] text-neutral-500">Tổng tiền cả đơn (100%)</p><p className="mt-1 text-sm font-semibold text-white">{formatBookingPrice(total)}</p></div><div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-3"><p className="text-[11px] text-neutral-500">Đã thanh toán</p><p className="mt-1 text-sm font-semibold text-emerald-300">{formatBookingPrice(paid)}</p></div><div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-3"><p className="text-[11px] text-neutral-500">Còn lại tại studio</p><p className="mt-1 text-sm font-semibold text-rose-300">{formatBookingPrice(remaining)}</p></div><div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-3"><p className="text-[11px] text-neutral-500">Đánh giá</p><p className="mt-1 text-sm text-neutral-200">{items.review ? `★ ${items.review.rating ?? '—'}${items.review.comment ? ` · ${items.review.comment}` : ''}` : 'Chưa có đánh giá'}</p></div></section>
      </div>
      <footer className="flex justify-end border-t border-neutral-800 px-5 py-4"><button type="button" onClick={onClose} className="rounded-xl border border-neutral-700 px-4 py-2.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800">Đóng</button></footer>
    </section>
  </div>;
}
