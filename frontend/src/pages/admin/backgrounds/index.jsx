import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArchiveRestore, CircleAlert, Image, Layers3, Plus, RotateCcw, Trash2 } from 'lucide-react';
import AdminFilterBar from '../../../components/admin/common/AdminFilterBar';
import AdminTable from '../../../components/admin/common/AdminTable';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import useAdminNotification from '../../../components/admin/common/useAdminNotification';
import adminBackgroundService from '../../../services/admin/backgroundService';
import BackgroundDialog from './BackgroundDialog';
import { BACKGROUND_STATUS_OPTIONS, formatBackgroundDate, getBackgroundErrorMessage } from './backgroundConfig';

const rowsOrEmpty = (rows) => Array.isArray(rows) ? rows : [];
const COLUMNS = [
  { key: 'id', title: 'Mã', cellClassName: 'font-mono text-neutral-400' },
  { key: 'name', title: 'Bối cảnh', render: (name, item) => <div className="min-w-44"><p className="font-medium text-neutral-100">{name || 'Chưa đặt tên'}</p><p className="mt-0.5 max-w-sm truncate text-[11px] text-neutral-500">{item.description || 'Chưa có mô tả'}</p></div> },
  { key: 'status', title: 'Trạng thái', render: (status) => <StatusBadge status={status} domain="room" /> },
];

function SummaryCard({ label, value, icon: Icon, tone = 'amber' }) {
  const colors = { amber: 'border-amber-500/20 bg-amber-500/10 text-amber-300', green: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300', blue: 'border-sky-500/20 bg-sky-500/10 text-sky-300' };
  return <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs text-neutral-400">{label}</p><span className={`grid h-9 w-9 place-items-center rounded-xl border ${colors[tone]}`}><Icon className="h-4 w-4" /></span></div><p className="mt-3 text-2xl font-semibold text-white">{value}</p></div>;
}

export default function AdminBackgroundsPage() {
  const { notify } = useAdminNotification();
  const [view, setView] = useState('active');
  const [backgrounds, setBackgrounds] = useState([]);
  const [trashCount, setTrashCount] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [dialog, setDialog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  const loadRows = async () => {
    setLoading(true); setPageError('');
    try {
      const [activeRows, trashRows] = await Promise.all([adminBackgroundService.getAll(), adminBackgroundService.getTrash()]);
      setBackgrounds(rowsOrEmpty(view === 'trash' ? trashRows : activeRows));
      setTrashCount(rowsOrEmpty(trashRows).length);
    } catch (error) { setPageError(getBackgroundErrorMessage(error)); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    let mounted = true;
    Promise.all([adminBackgroundService.getAll(), adminBackgroundService.getTrash()])
      .then(([activeRows, trashRows]) => {
        if (!mounted) return;
        setBackgrounds(rowsOrEmpty(view === 'trash' ? trashRows : activeRows));
        setTrashCount(rowsOrEmpty(trashRows).length);
      })
      .catch((error) => { if (mounted) setPageError(getBackgroundErrorMessage(error)); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [view]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return backgrounds.filter((item) => (!keyword || [item.name, item.description].filter(Boolean).some((value) => String(value).toLowerCase().includes(keyword))) && (!status || item.status === status))
      .sort((a, b) => (sortOrder === 'oldest' ? 1 : -1) * ((Number(a.id) || 0) - (Number(b.id) || 0)));
  }, [backgrounds, search, sortOrder, status]);

  const resetFilters = () => { setSearch(''); setStatus(''); setSortOrder('newest'); };
  const saveBackground = async (payload) => {
    try {
      if (dialog.mode === 'create') {
        await adminBackgroundService.create(payload);
        notify({ type: 'success', title: 'Thêm bối cảnh thành công', message: `Đã thêm “${payload.name}” vào danh mục bối cảnh.` });
      } else {
        await adminBackgroundService.update(dialog.background.id, payload);
        notify({ type: 'success', title: 'Cập nhật bối cảnh thành công', message: `Thông tin “${payload.name}” đã được lưu.` });
      }
      setDialog(null); await loadRows();
    } catch (error) { setPageError(getBackgroundErrorMessage(error)); throw error; }
  };
  const moveToTrash = async (item) => {
    if (!window.confirm(`Đưa bối cảnh “${item.name}” vào thùng rác? Các lịch sử đặt/gói liên quan vẫn được giữ.`)) return;
    try { await adminBackgroundService.delete(item.id); notify({ type: 'success', title: 'Đã chuyển bối cảnh vào thùng rác', message: `“${item.name}” có thể được khôi phục sau.` }); await loadRows(); }
    catch (error) { notify({ type: 'error', message: getBackgroundErrorMessage(error) }); }
  };
  const restore = async (item) => {
    if (!window.confirm(`Khôi phục bối cảnh “${item.name}” về danh sách quản lý?`)) return;
    try { await adminBackgroundService.restore(item.id); notify({ type: 'success', title: 'Khôi phục thành công', message: `“${item.name}” đã trở lại danh mục bối cảnh.` }); await loadRows(); }
    catch (error) { notify({ type: 'error', message: getBackgroundErrorMessage(error) }); }
  };
  const permanentlyDelete = async (item) => {
    if (!window.confirm(`Xóa vĩnh viễn bối cảnh “${item.name}”? Lịch sử gói chụp hoặc booking đang tham chiếu sẽ khiến thao tác bị từ chối.`)) return;
    try { await adminBackgroundService.permanentlyDelete(item.id); notify({ type: 'success', title: 'Đã xóa bối cảnh vĩnh viễn', message: `“${item.name}” đã bị xóa khỏi hệ thống.` }); await loadRows(); }
    catch (error) { notify({ type: 'error', message: getBackgroundErrorMessage(error) }); }
  };

  const columns = view === 'trash' ? [...COLUMNS, { key: 'deletedAt', title: 'Ngày xóa', render: formatBackgroundDate }, { key: 'trashActions', title: 'Thùng rác', render: (_, item) => <div className="flex items-center gap-1"><button type="button" onClick={() => restore(item)} aria-label={`Khôi phục ${item.name}`} title="Khôi phục" className="rounded-lg p-2 text-emerald-300 hover:bg-emerald-500/10"><ArchiveRestore className="h-4 w-4" /></button><button type="button" onClick={() => permanentlyDelete(item)} aria-label={`Xóa vĩnh viễn ${item.name}`} title="Xóa vĩnh viễn" className="rounded-lg p-2 text-rose-300 hover:bg-rose-500/10"><Trash2 className="h-4 w-4" /></button></div> }] : COLUMNS;
  const stats = useMemo(() => ({ total: backgrounds.length, active: backgrounds.filter((item) => item.status === 'active').length, maintenance: backgrounds.filter((item) => item.status === 'maintenance').length }), [backgrounds]);

  return <section className="space-y-5">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">Quản lý tài nguyên</p><h1 className="flex items-center gap-2 text-2xl font-semibold text-white"><Image className="h-6 w-6 text-amber-300" />{view === 'trash' ? 'Thùng rác bối cảnh' : 'Quản lý bối cảnh'}</h1><p className="mt-1 text-xs text-neutral-400">{view === 'trash' ? 'Khôi phục bối cảnh hoặc xóa vĩnh viễn nếu không còn liên kết.' : 'Quản lý các concept, phông nền studio và bối cảnh chụp.'}</p></div><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => { setLoading(true); setPageError(''); setView((current) => current === 'trash' ? 'active' : 'trash'); }} className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-xs font-medium ${view === 'trash' ? 'border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800' : 'border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/15'}`}>{view === 'trash' ? <RotateCcw className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}{view === 'trash' ? 'Quay lại bối cảnh' : 'Thùng rác'}{view !== 'trash' && <span className="rounded-full bg-rose-400/15 px-2 py-0.5 text-[10px] text-rose-100">{trashCount}</span>}</button>{view !== 'trash' && <button type="button" onClick={() => setDialog({ mode: 'create', background: null })} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-400 px-4 text-xs font-semibold text-neutral-950 hover:bg-amber-300"><Plus className="h-4 w-4" />Thêm bối cảnh</button>}</div></header>
    {view !== 'trash' && <div className="grid gap-3 sm:grid-cols-3"><SummaryCard icon={Layers3} label="Tổng bối cảnh" value={stats.total} /><SummaryCard icon={Image} label="Đang hoạt động" value={stats.active} tone="green" /><SummaryCard icon={CircleAlert} label="Đang bảo trì" value={stats.maintenance} tone="blue" /></div>}
    <AdminFilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Tìm tên hoặc mô tả bối cảnh..." filters={[{ key: 'status', label: 'Trạng thái', value: status, onChange: setStatus, options: BACKGROUND_STATUS_OPTIONS }]} sortValue={sortOrder} onSortChange={setSortOrder} onReset={resetFilters} />
    {pageError && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{pageError}</span><button type="button" onClick={loadRows} className="ml-auto whitespace-nowrap font-medium underline">Tải lại</button></div>}
    {loading ? <div className="flex min-h-48 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/50 text-sm text-neutral-400"><span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-amber-300" />Đang tải danh sách bối cảnh...</div> : <AdminTable columns={columns} data={filtered} emptyMessage={view === 'trash' ? 'Thùng rác đang trống.' : 'Không có bối cảnh phù hợp với bộ lọc.'} onDetail={(item) => setDialog({ mode: 'detail', background: item })} onEdit={view === 'trash' ? undefined : (item) => setDialog({ mode: 'edit', background: item })} onDelete={view === 'trash' ? undefined : moveToTrash} actions={view === 'trash' ? { edit: false, delete: false } : undefined} />}
    {view === 'trash' && !loading && backgrounds.length > 0 && <p className="flex items-center gap-2 text-[11px] text-neutral-500"><CircleAlert className="h-3.5 w-3.5" />Bối cảnh đang được dùng trong gói chụp hoặc booking sẽ không thể xóa vĩnh viễn.</p>}
    {dialog && <BackgroundDialog key={`${dialog.mode}-${dialog.background?.id ?? 'new'}`} background={dialog.background} mode={dialog.mode} onClose={() => setDialog(null)} onSave={saveBackground} />}
  </section>;
}
