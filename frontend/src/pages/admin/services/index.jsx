import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArchiveRestore, Camera, CheckCircle2, CircleAlert, Clock3, Plus, RotateCcw, Sparkles, Trash2 } from 'lucide-react';
import AdminFilterBar from '../../../components/admin/common/AdminFilterBar';
import AdminTable from '../../../components/admin/common/AdminTable';
import useAdminNotification from '../../../components/admin/common/useAdminNotification';
import adminStudioService from '../../../services/admin/studioService';
import adminImageService from '../../../services/admin/imageService';
import StudioServiceDialog from './StudioServiceDialog';
import { STUDIO_SERVICE_STATUS_OPTIONS, STUDIO_SERVICE_TYPE_LABELS, STUDIO_SERVICE_TYPE_OPTIONS, formatServiceDate, formatServicePrice, getServiceErrorMessage } from './serviceConfig';

const asRows = (rows) => Array.isArray(rows) ? rows : [];
const COLUMNS = [
  { key: 'id', title: 'Mã', cellClassName: 'font-mono text-neutral-400' },
  { key: 'name', title: 'Dịch vụ', render: (name, item) => <div className="min-w-48"><p className="font-medium text-neutral-100">{name || 'Chưa đặt tên'}</p><p className="mt-0.5 max-w-sm truncate text-[11px] text-neutral-500">{item.description || 'Chưa có mô tả'}</p></div> },
  { key: 'type', title: 'Loại', render: (type) => STUDIO_SERVICE_TYPE_LABELS[type] || type || '—' },
  { key: 'duration', title: 'Thời lượng', render: (duration) => `${duration ?? 0} phút` },
  { key: 'price', title: 'Giá', render: formatServicePrice },
  { key: 'status', title: 'Trạng thái', type: 'status', toggleable: true },
  { key: 'updatedAt', title: 'Cập nhật', render: formatServiceDate },
];

function SummaryCard({ label, value, icon: Icon, tone = 'amber' }) {
  const colors = { amber: 'border-amber-500/20 bg-amber-500/10 text-amber-300', green: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300', blue: 'border-sky-500/20 bg-sky-500/10 text-sky-300' };
  return <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs text-neutral-400">{label}</p><span className={`grid h-9 w-9 place-items-center rounded-xl border ${colors[tone]}`}><Icon className="h-4 w-4" /></span></div><p className="mt-3 text-2xl font-semibold text-white">{value}</p></div>;
}

export default function AdminServicesPage() {
  const { notify } = useAdminNotification();
  const [view, setView] = useState('active');
  const [services, setServices] = useState([]);
  const [trashCount, setTrashCount] = useState(0);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [dialog, setDialog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  const loadRows = async () => {
    setLoading(true); setPageError('');
    try {
      const [activeRows, trashRows] = await Promise.all([adminStudioService.getAll(), adminStudioService.getTrash()]);
      setServices(asRows(view === 'trash' ? trashRows : activeRows));
      setTrashCount(asRows(trashRows).length);
    }
    catch (error) { setPageError(getServiceErrorMessage(error)); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    let mounted = true;
    Promise.all([adminStudioService.getAll(), adminStudioService.getTrash()])
      .then(([activeRows, trashRows]) => { if (mounted) { setServices(asRows(view === 'trash' ? trashRows : activeRows)); setTrashCount(asRows(trashRows).length); } })
      .catch((error) => { if (mounted) setPageError(getServiceErrorMessage(error)); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [view]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return services.filter((service) => (!keyword || [service.name, service.description].filter(Boolean).some((value) => String(value).toLowerCase().includes(keyword))) && (!type || service.type === type) && (!status || service.status === status))
      .sort((a, b) => (sortOrder === 'oldest' ? 1 : -1) * ((Number(a.id) || 0) - (Number(b.id) || 0)));
  }, [search, services, sortOrder, status, type]);

  const stats = useMemo(() => ({ total: services.length, active: services.filter((service) => service.status === 'active').length, inactive: services.filter((service) => service.status === 'inactive').length, averagePrice: services.length ? services.reduce((sum, service) => sum + (Number(service.price) || 0), 0) / services.length : 0 }), [services]);
  const resetFilters = () => { setSearch(''); setType(''); setStatus(''); setSortOrder('newest'); };

  const saveService = async (payload) => {
    try {
      const { imageUrl, ...servicePayload } = payload;
      let savedService;
      if (dialog.mode === 'create') { savedService = await adminStudioService.create(servicePayload); setDialog({ mode: 'edit', service: { ...savedService, imageUrl } }); notify({ type: 'success', title: 'Thêm dịch vụ thành công', message: `Đã thêm “${payload.name}” vào danh mục dịch vụ.` }); }
      else { savedService = await adminStudioService.update(dialog.service.id, servicePayload); notify({ type: 'success', title: 'Cập nhật dịch vụ thành công', message: `Thông tin “${payload.name}” đã được lưu.` }); }
      if (imageUrl !== undefined && savedService?.id) await adminImageService.savePrimaryImage('service', savedService.id, imageUrl, payload.name || payload.description);
      setDialog(null); await loadRows();
    } catch (error) { setPageError(getServiceErrorMessage(error)); throw error; }
  };

  const changeStatus = async (service, nextStatus) => {
    const nextLabel = STUDIO_SERVICE_STATUS_OPTIONS.find((option) => option.value === nextStatus)?.label || nextStatus;
    if (!window.confirm(`Chuyển dịch vụ “${service.name}” sang trạng thái “${nextLabel}”? ${nextStatus === 'inactive' ? 'Dịch vụ sẽ không thể được thêm mới vào gói chụp hoặc đơn đặt lịch.' : 'Dịch vụ sẽ khả dụng trở lại cho các thao tác mới.'}`)) return;
    try {
      await adminStudioService.update(service.id, { name: service.name, type: service.type, description: service.description, duration: service.duration, price: service.price, status: nextStatus });
      notify({ type: 'success', title: 'Đã cập nhật trạng thái dịch vụ', message: `“${service.name}” hiện ở trạng thái ${nextLabel.toLowerCase()}.` });
      await loadRows();
    } catch (error) { notify({ type: 'error', message: getServiceErrorMessage(error) }); }
  };

  const moveToTrash = async (service) => {
    if (!window.confirm(`Đưa dịch vụ “${service.name}” vào thùng rác? Dịch vụ đã được sử dụng trong booking sẽ không thể chuyển vào thùng rác.`)) return;
    try {
      await adminStudioService.delete(service.id);
      notify({ type: 'success', title: 'Đã chuyển dịch vụ vào thùng rác', message: `“${service.name}” có thể được khôi phục sau.` });
      await loadRows();
    } catch (error) { notify({ type: 'error', message: getServiceErrorMessage(error) }); }
  };

  const restoreService = async (service) => {
    if (!window.confirm(`Khôi phục dịch vụ “${service.name}” về danh mục?`)) return;
    try {
      await adminStudioService.restore(service.id);
      notify({ type: 'success', title: 'Khôi phục dịch vụ thành công', message: `“${service.name}” đã trở lại danh mục dịch vụ.` });
      await loadRows();
    } catch (error) { notify({ type: 'error', message: getServiceErrorMessage(error) }); }
  };

  const permanentlyDelete = async (service) => {
    if (!window.confirm(`Xóa vĩnh viễn dịch vụ “${service.name}”? Thao tác không thể hoàn tác. Dịch vụ còn nằm trong gói chụp hoặc booking sẽ không thể xóa.`)) return;
    try {
      await adminStudioService.permanentlyDelete(service.id);
      notify({ type: 'success', title: 'Đã xóa dịch vụ vĩnh viễn', message: `“${service.name}” đã bị xóa khỏi hệ thống.` });
      await loadRows();
    } catch (error) { notify({ type: 'error', message: getServiceErrorMessage(error) }); }
  };

  const columns = view === 'trash'
    ? [
        ...COLUMNS.map((column) => column.key === 'status' ? { ...column, toggleable: false } : column),
        { key: 'deletedAt', title: 'Ngày xóa', render: formatServiceDate },
        { key: 'trashActions', title: 'Thùng rác', render: (_, service) => <div className="flex items-center gap-1"><button type="button" onClick={() => restoreService(service)} aria-label={`Khôi phục ${service.name}`} title="Khôi phục" className="rounded-lg p-2 text-emerald-300 hover:bg-emerald-500/10"><ArchiveRestore className="h-4 w-4" /></button><button type="button" onClick={() => permanentlyDelete(service)} aria-label={`Xóa vĩnh viễn ${service.name}`} title="Xóa vĩnh viễn" className="rounded-lg p-2 text-rose-300 hover:bg-rose-500/10"><Trash2 className="h-4 w-4" /></button></div> },
      ]
    : COLUMNS;

  return <section className="space-y-5">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">Dịch vụ &amp; gói chụp</p><h1 className="flex items-center gap-2 text-2xl font-semibold text-white"><Camera className="h-6 w-6 text-amber-300" />{view === 'trash' ? 'Thùng rác dịch vụ' : 'Quản lý dịch vụ'}</h1><p className="mt-1 text-xs text-neutral-400">{view === 'trash' ? 'Khôi phục dịch vụ hoặc xóa vĩnh viễn khi không còn liên kết.' : 'Quản lý dịch vụ đơn lẻ và dịch vụ có thể gắn vào gói chụp hoặc đơn đặt lịch.'}</p></div><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => { setLoading(true); setPageError(''); setView((current) => current === 'trash' ? 'active' : 'trash'); }} className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-xs font-medium ${view === 'trash' ? 'border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800' : 'border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/15'}`}>{view === 'trash' ? <RotateCcw className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}{view === 'trash' ? 'Quay lại dịch vụ' : 'Thùng rác'}{view !== 'trash' && <span className="rounded-full bg-rose-400/15 px-2 py-0.5 text-[10px] text-rose-100">{trashCount}</span>}</button>{view !== 'trash' && <button type="button" onClick={() => setDialog({ mode: 'create', service: null })} className="inline-flex min-h-11 items-center gap-2 self-start rounded-xl bg-amber-400 px-4 text-xs font-semibold text-neutral-950 transition hover:bg-amber-300 sm:self-auto"><Plus className="h-4 w-4" />Thêm dịch vụ</button>}</div></header>
    {view !== 'trash' && <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><SummaryCard icon={Sparkles} label="Tổng dịch vụ" value={stats.total} /><SummaryCard icon={CheckCircle2} label="Đang hoạt động" value={stats.active} tone="green" /><SummaryCard icon={CircleAlert} label="Ngừng hoạt động" value={stats.inactive} /><SummaryCard icon={Clock3} label="Giá trung bình" value={formatServicePrice(stats.averagePrice)} tone="blue" /></div>}
    <AdminFilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Tìm tên hoặc mô tả dịch vụ..." filters={[{ key: 'type', label: 'Loại dịch vụ', value: type, onChange: setType, options: STUDIO_SERVICE_TYPE_OPTIONS }, { key: 'status', label: 'Trạng thái', value: status, onChange: setStatus, options: STUDIO_SERVICE_STATUS_OPTIONS }]} sortValue={sortOrder} onSortChange={setSortOrder} onReset={resetFilters} />
    {pageError && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{pageError}</span><button type="button" onClick={loadRows} className="ml-auto whitespace-nowrap font-medium underline">Tải lại</button></div>}
    {loading ? <div className="flex min-h-48 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/50 text-sm text-neutral-400"><span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-amber-300" />Đang tải danh sách dịch vụ...</div> : <AdminTable columns={columns} data={filtered} emptyMessage={view === 'trash' ? 'Thùng rác đang trống.' : 'Không có dịch vụ phù hợp với bộ lọc.'} onDetail={(service) => setDialog({ mode: 'detail', service })} onEdit={view === 'trash' ? undefined : (service) => setDialog({ mode: 'edit', service })} onDelete={view === 'trash' ? undefined : moveToTrash} actions={view === 'trash' ? { edit: false, delete: false } : undefined} onStatusChange={view === 'trash' ? undefined : changeStatus} />}
    {view === 'active' && <p className="flex items-center gap-2 text-[11px] text-neutral-500"><CircleAlert className="h-3.5 w-3.5 shrink-0" />Dịch vụ đã dùng trong booking không thể chuyển vào thùng rác. Dịch vụ có thể gỡ khỏi danh mục bằng cách chuyển sang ngừng hoạt động.</p>}
    {dialog && <StudioServiceDialog key={`${dialog.mode}-${dialog.service?.id ?? 'new'}`} service={dialog.service} mode={dialog.mode} onClose={() => setDialog(null)} onSave={saveService} />}
  </section>;
}
