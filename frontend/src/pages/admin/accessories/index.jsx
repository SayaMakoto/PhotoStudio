import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArchiveRestore, CircleAlert, Gem, Layers3, PackageCheck, Plus, RotateCcw, Trash2 } from 'lucide-react';
import AdminFilterBar from '../../../components/admin/common/AdminFilterBar';
import AdminTable from '../../../components/admin/common/AdminTable';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import useAdminNotification from '../../../components/admin/common/useAdminNotification';
import adminAccessoryService from '../../../services/admin/accessoryService';
import adminImageService from '../../../services/admin/imageService';
import AccessoryDialog from './AccessoryDialog';
import { ACCESSORY_STATUS_OPTIONS, ACCESSORY_TYPE_LABELS, ACCESSORY_TYPE_OPTIONS, formatAccessoryDate, formatAccessoryPrice, getAccessoryErrorMessage } from './accessoryConfig';

const asRows = (rows) => Array.isArray(rows) ? rows : [];
const COLUMNS = [
  { key: 'id', title: 'Mã', cellClassName: 'font-mono text-neutral-400' },
  { key: 'name', title: 'Phụ kiện', render: (name, item) => <div className="min-w-44"><p className="font-medium text-neutral-100">{name || 'Chưa đặt tên'}</p><p className="mt-0.5 max-w-sm truncate text-[11px] text-neutral-500">{item.description || 'Chưa có mô tả'}</p></div> },
  { key: 'type', title: 'Loại', render: (type) => ACCESSORY_TYPE_LABELS[type] || type || '—' },
  { key: 'quantity', title: 'Số lượng', render: (quantity) => `${quantity ?? 0} món` },
  { key: 'price', title: 'Giá thuê', render: formatAccessoryPrice },
  { key: 'status', title: 'Trạng thái', render: (status) => <StatusBadge status={status} /> },
];

function SummaryCard({ label, value, icon: Icon, tone = 'rose' }) {
  const colors = { amber: 'border-rose-500/20 bg-rose-500/10 text-rose-400', green: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300', blue: 'border-sky-500/20 bg-sky-500/10 text-sky-300' };
  return <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs text-neutral-400">{label}</p><span className={`grid h-9 w-9 place-items-center rounded-xl border ${colors[tone]}`}><Icon className="h-4 w-4" /></span></div><p className="mt-3 text-2xl font-semibold text-white">{value}</p></div>;
}

export default function AdminAccessoriesPage() {
  const { notify } = useAdminNotification();
  const [view, setView] = useState('active');
  const [accessories, setAccessories] = useState([]);
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
      const [activeRows, trashRows] = await Promise.all([adminAccessoryService.getAll(), adminAccessoryService.getTrash()]);
      setAccessories(asRows(view === 'trash' ? trashRows : activeRows)); setTrashCount(asRows(trashRows).length);
    } catch (error) { setPageError(getAccessoryErrorMessage(error)); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    let mounted = true;
    Promise.all([adminAccessoryService.getAll(), adminAccessoryService.getTrash()])
      .then(([activeRows, trashRows]) => { if (!mounted) return; setAccessories(asRows(view === 'trash' ? trashRows : activeRows)); setTrashCount(asRows(trashRows).length); })
      .catch((error) => { if (mounted) setPageError(getAccessoryErrorMessage(error)); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [view]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return accessories.filter((item) => (!keyword || [item.name, item.description].filter(Boolean).some((value) => String(value).toLowerCase().includes(keyword))) && (!type || item.type === type) && (!status || item.status === status))
      .sort((a, b) => (sortOrder === 'oldest' ? 1 : -1) * ((Number(a.id) || 0) - (Number(b.id) || 0)));
  }, [accessories, search, sortOrder, status, type]);

  const resetFilters = () => { setSearch(''); setType(''); setStatus(''); setSortOrder('newest'); };
  const saveAccessory = async (payload) => {
    try {
      const { imageUrl, ...accessoryPayload } = payload;
      let savedAccessory;
      if (dialog.mode === 'create') { savedAccessory = await adminAccessoryService.create(accessoryPayload); setDialog({ mode: 'edit', accessory: { ...savedAccessory, imageUrl } }); notify({ type: 'success', title: 'Thêm phụ kiện thành công', message: `Đã thêm “${payload.name}” vào kho phụ kiện.` }); }
      else { savedAccessory = await adminAccessoryService.update(dialog.accessory.id, accessoryPayload); notify({ type: 'success', title: 'Cập nhật phụ kiện thành công', message: `Thông tin “${payload.name}” đã được lưu.` }); }
      if (imageUrl !== undefined && savedAccessory?.id) await adminImageService.savePrimaryImage('accessory', savedAccessory.id, imageUrl, payload.name || payload.description);
      setDialog(null); await loadRows();
    } catch (error) { setPageError(getAccessoryErrorMessage(error)); throw error; }
  };
  const moveToTrash = async (accessory) => {
    if (!window.confirm(`Đưa phụ kiện “${accessory.name}” vào thùng rác? Dữ liệu các đơn đặt trước đây vẫn được giữ.`)) return;
    try { await adminAccessoryService.delete(accessory.id); notify({ type: 'success', title: 'Đã chuyển phụ kiện vào thùng rác', message: `“${accessory.name}” có thể được khôi phục sau.` }); await loadRows(); }
    catch (error) { notify({ type: 'error', message: getAccessoryErrorMessage(error) }); }
  };
  const restore = async (accessory) => {
    if (!window.confirm(`Khôi phục phụ kiện “${accessory.name}” về kho?`)) return;
    try { await adminAccessoryService.restore(accessory.id); notify({ type: 'success', title: 'Khôi phục thành công', message: `“${accessory.name}” đã trở lại kho phụ kiện.` }); await loadRows(); }
    catch (error) { notify({ type: 'error', message: getAccessoryErrorMessage(error) }); }
  };
  const permanentlyDelete = async (accessory) => {
    if (!window.confirm(`Xóa vĩnh viễn phụ kiện “${accessory.name}”? Các đơn đặt lịch đang tham chiếu sẽ khiến thao tác bị từ chối.`)) return;
    try { await adminAccessoryService.permanentlyDelete(accessory.id); notify({ type: 'success', title: 'Đã xóa phụ kiện vĩnh viễn', message: `“${accessory.name}” đã bị xóa khỏi hệ thống.` }); await loadRows(); }
    catch (error) { notify({ type: 'error', message: getAccessoryErrorMessage(error) }); }
  };

  const columns = view === 'trash' ? [...COLUMNS, { key: 'deletedAt', title: 'Ngày xóa', render: formatAccessoryDate }, { key: 'trashActions', title: 'Thùng rác', render: (_, accessory) => <div className="flex items-center gap-1"><button type="button" onClick={() => restore(accessory)} aria-label={`Khôi phục ${accessory.name}`} title="Khôi phục" className="rounded-lg p-2 text-emerald-300 hover:bg-emerald-500/10"><ArchiveRestore className="h-4 w-4" /></button><button type="button" onClick={() => permanentlyDelete(accessory)} aria-label={`Xóa vĩnh viễn ${accessory.name}`} title="Xóa vĩnh viễn" className="rounded-lg p-2 text-rose-300 hover:bg-rose-500/10"><Trash2 className="h-4 w-4" /></button></div> }] : COLUMNS;
  const stats = useMemo(() => ({ total: accessories.length, stock: accessories.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0), available: accessories.filter((item) => item.status === 'available').length }), [accessories]);

  return <section className="space-y-5">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-400">Quản lý tài nguyên</p><h1 className="flex items-center gap-2 text-2xl font-semibold text-white"><Gem className="h-6 w-6 text-rose-400" />{view === 'trash' ? 'Thùng rác phụ kiện' : 'Quản lý phụ kiện'}</h1><p className="mt-1 text-xs text-neutral-400">{view === 'trash' ? 'Khôi phục phụ kiện hoặc xóa vĩnh viễn nếu không có lịch sử sử dụng.' : 'Quản lý đạo cụ, trang sức, hoa cầm tay và số lượng phụ kiện trong kho.'}</p></div><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => { setLoading(true); setPageError(''); setView((current) => current === 'trash' ? 'active' : 'trash'); }} className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-xs font-medium ${view === 'trash' ? 'border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800' : 'border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/15'}`}>{view === 'trash' ? <RotateCcw className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}{view === 'trash' ? 'Quay lại kho phụ kiện' : 'Thùng rác'}{view !== 'trash' && <span className="rounded-full bg-rose-400/15 px-2 py-0.5 text-[10px] text-rose-100">{trashCount}</span>}</button>{view !== 'trash' && <button type="button" onClick={() => setDialog({ mode: 'create', accessory: null })} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-rose-500 px-4 text-xs font-semibold text-neutral-950 hover:bg-rose-600"><Plus className="h-4 w-4" />Thêm phụ kiện</button>}</div></header>
    {view !== 'trash' && <div className="grid gap-3 sm:grid-cols-3"><SummaryCard icon={Layers3} label="Tổng mặt hàng" value={stats.total} /><SummaryCard icon={PackageCheck} label="Tổng số lượng kho" value={`${stats.stock} món`} tone="blue" /><SummaryCard icon={Gem} label="Đang sẵn sàng" value={stats.available} tone="green" /></div>}
    <AdminFilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Tìm tên hoặc mô tả phụ kiện..." filters={[{ key: 'type', label: 'Loại phụ kiện', value: type, onChange: setType, options: ACCESSORY_TYPE_OPTIONS }, { key: 'status', label: 'Trạng thái', value: status, onChange: setStatus, options: ACCESSORY_STATUS_OPTIONS }]} sortValue={sortOrder} onSortChange={setSortOrder} onReset={resetFilters} />
    {pageError && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{pageError}</span><button type="button" onClick={loadRows} className="ml-auto whitespace-nowrap font-medium underline">Tải lại</button></div>}
    {loading ? <div className="flex min-h-48 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/50 text-sm text-neutral-400"><span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-rose-400" />Đang tải kho phụ kiện...</div> : <AdminTable columns={columns} data={filtered} emptyMessage={view === 'trash' ? 'Thùng rác đang trống.' : 'Không có phụ kiện phù hợp với bộ lọc.'} onDetail={(accessory) => setDialog({ mode: 'detail', accessory })} onEdit={view === 'trash' ? undefined : (accessory) => setDialog({ mode: 'edit', accessory })} onDelete={view === 'trash' ? undefined : moveToTrash} actions={view === 'trash' ? { edit: false, delete: false } : undefined} />}
    {view === 'trash' && !loading && accessories.length > 0 && <p className="flex items-center gap-2 text-[11px] text-neutral-500"><CircleAlert className="h-3.5 w-3.5" />Phụ kiện có liên kết đơn đặt lịch sẽ không thể xóa vĩnh viễn.</p>}
    {dialog && <AccessoryDialog key={`${dialog.mode}-${dialog.accessory?.id ?? 'new'}`} accessory={dialog.accessory} mode={dialog.mode} onClose={() => setDialog(null)} onSave={saveAccessory} />}
  </section>;
}
