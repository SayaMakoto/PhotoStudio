import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArchiveRestore, CircleAlert, Plus, RotateCcw, Shirt, ShoppingBag, Sparkles, Trash2 } from 'lucide-react';
import AdminFilterBar from '../../../components/admin/common/AdminFilterBar';
import AdminTable from '../../../components/admin/common/AdminTable';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import useAdminNotification from '../../../components/admin/common/useAdminNotification';
import adminClothService from '../../../services/admin/clothService';
import adminImageService from '../../../services/admin/imageService';
import ClothDialog from './ClothDialog';
import { CLOTH_GENDER_OPTIONS, CLOTH_STATUS_OPTIONS, CLOTH_TYPE_LABELS, CLOTH_TYPE_OPTIONS, formatClothDate, formatClothPrice, getClothErrorMessage } from './clothConfig';

const asRows = (rows) => Array.isArray(rows) ? rows : [];
const GENDER_LABELS = Object.fromEntries(CLOTH_GENDER_OPTIONS.map(({ value, label }) => [value.toLowerCase(), label]));
const COLUMNS = [
  { key: 'id', title: 'Mã', cellClassName: 'font-mono text-neutral-400' },
  { key: 'name', title: 'Trang phục', render: (name, item) => <div className="min-w-44"><p className="font-medium text-neutral-100">{name || 'Chưa đặt tên'}</p><p className="mt-0.5 max-w-sm truncate text-[11px] text-neutral-500">{[item.size, item.color].filter(Boolean).join(' · ') || 'Chưa có thông tin kích cỡ / màu sắc'}</p></div> },
  { key: 'type', title: 'Loại', render: (type) => CLOTH_TYPE_LABELS[type] || type || '—' },
  { key: 'gender', title: 'Dành cho', render: (gender) => GENDER_LABELS[String(gender || '').toLowerCase()] || 'Không phân biệt' },
  { key: 'price', title: 'Giá thuê', render: formatClothPrice },
  { key: 'status', title: 'Trạng thái', render: (status) => <StatusBadge status={status} /> },
];

function SummaryCard({ label, value, icon: Icon, tone = 'amber' }) {
  const colors = { amber: 'border-amber-500/20 bg-amber-500/10 text-amber-300', green: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300', blue: 'border-sky-500/20 bg-sky-500/10 text-sky-300' };
  return <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs text-neutral-400">{label}</p><span className={`grid h-9 w-9 place-items-center rounded-xl border ${colors[tone]}`}><Icon className="h-4 w-4" /></span></div><p className="mt-3 text-2xl font-semibold text-white">{value}</p></div>;
}

export default function AdminClothesPage() {
  const { notify } = useAdminNotification();
  const [view, setView] = useState('active');
  const [clothes, setClothes] = useState([]);
  const [trashCount, setTrashCount] = useState(0);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [gender, setGender] = useState('');
  const [status, setStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [dialog, setDialog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  const loadRows = async () => {
    setLoading(true); setPageError('');
    try {
      const [activeRows, trashRows] = await Promise.all([adminClothService.getAll(), adminClothService.getTrash()]);
      setClothes(asRows(view === 'trash' ? trashRows : activeRows)); setTrashCount(asRows(trashRows).length);
    } catch (error) { setPageError(getClothErrorMessage(error)); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    let mounted = true;
    Promise.all([adminClothService.getAll(), adminClothService.getTrash()])
      .then(([activeRows, trashRows]) => { if (!mounted) return; setClothes(asRows(view === 'trash' ? trashRows : activeRows)); setTrashCount(asRows(trashRows).length); })
      .catch((error) => { if (mounted) setPageError(getClothErrorMessage(error)); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [view]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return clothes.filter((item) => (!keyword || [item.name, item.size, item.color, item.description].filter(Boolean).some((value) => String(value).toLowerCase().includes(keyword))) && (!type || item.type === type) && (!gender || String(item.gender || '').toLowerCase() === gender) && (!status || item.status === status))
      .sort((a, b) => (sortOrder === 'oldest' ? 1 : -1) * ((Number(a.id) || 0) - (Number(b.id) || 0)));
  }, [clothes, gender, search, sortOrder, status, type]);

  const resetFilters = () => { setSearch(''); setType(''); setGender(''); setStatus(''); setSortOrder('newest'); };
  const saveCloth = async (payload) => {
    try {
      const { imageUrl, ...clothPayload } = payload;
      let savedCloth;
      if (dialog.mode === 'create') { savedCloth = await adminClothService.create(clothPayload); setDialog({ mode: 'edit', cloth: { ...savedCloth, imageUrl } }); notify({ type: 'success', title: 'Thêm trang phục thành công', message: `Đã thêm “${payload.name}” vào kho trang phục.` }); }
      else { savedCloth = await adminClothService.update(dialog.cloth.id, clothPayload); notify({ type: 'success', title: 'Cập nhật trang phục thành công', message: `Thông tin “${payload.name}” đã được lưu.` }); }
      if (imageUrl !== undefined && savedCloth?.id) await adminImageService.savePrimaryImage('clothing', savedCloth.id, imageUrl, payload.name || payload.description);
      setDialog(null); await loadRows();
    } catch (error) { setPageError(getClothErrorMessage(error)); throw error; }
  };
  const moveToTrash = async (cloth) => {
    if (!window.confirm(`Đưa trang phục “${cloth.name}” vào thùng rác? Lịch sử thuê vẫn được giữ.`)) return;
    try { await adminClothService.delete(cloth.id); notify({ type: 'success', title: 'Đã chuyển trang phục vào thùng rác', message: `“${cloth.name}” có thể được khôi phục sau.` }); await loadRows(); }
    catch (error) { notify({ type: 'error', message: getClothErrorMessage(error) }); }
  };
  const restore = async (cloth) => {
    if (!window.confirm(`Khôi phục trang phục “${cloth.name}” về kho?`)) return;
    try { await adminClothService.restore(cloth.id); notify({ type: 'success', title: 'Khôi phục thành công', message: `“${cloth.name}” đã trở lại kho trang phục.` }); await loadRows(); }
    catch (error) { notify({ type: 'error', message: getClothErrorMessage(error) }); }
  };
  const permanentlyDelete = async (cloth) => {
    if (!window.confirm(`Xóa vĩnh viễn trang phục “${cloth.name}”? Lịch sử đơn đặt đang tham chiếu sẽ khiến thao tác bị từ chối.`)) return;
    try { await adminClothService.permanentlyDelete(cloth.id); notify({ type: 'success', title: 'Đã xóa trang phục vĩnh viễn', message: `“${cloth.name}” đã bị xóa khỏi hệ thống.` }); await loadRows(); }
    catch (error) { notify({ type: 'error', message: getClothErrorMessage(error) }); }
  };

  const columns = view === 'trash' ? [...COLUMNS, { key: 'deletedAt', title: 'Ngày xóa', render: formatClothDate }, { key: 'trashActions', title: 'Thùng rác', render: (_, cloth) => <div className="flex items-center gap-1"><button type="button" onClick={() => restore(cloth)} aria-label={`Khôi phục ${cloth.name}`} title="Khôi phục" className="rounded-lg p-2 text-emerald-300 hover:bg-emerald-500/10"><ArchiveRestore className="h-4 w-4" /></button><button type="button" onClick={() => permanentlyDelete(cloth)} aria-label={`Xóa vĩnh viễn ${cloth.name}`} title="Xóa vĩnh viễn" className="rounded-lg p-2 text-rose-300 hover:bg-rose-500/10"><Trash2 className="h-4 w-4" /></button></div> }] : COLUMNS;
  const stats = useMemo(() => ({ total: clothes.length, available: clothes.filter((item) => item.status === 'available').length, rented: clothes.filter((item) => item.status === 'rented').length }), [clothes]);

  return <section className="space-y-5">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">Quản lý tài nguyên</p><h1 className="flex items-center gap-2 text-2xl font-semibold text-white"><Shirt className="h-6 w-6 text-amber-300" />{view === 'trash' ? 'Thùng rác trang phục' : 'Quản lý trang phục'}</h1><p className="mt-1 text-xs text-neutral-400">{view === 'trash' ? 'Khôi phục trang phục hoặc xóa vĩnh viễn nếu không còn lịch sử thuê.' : 'Quản lý loại trang phục, kích cỡ, giá thuê và tình trạng sử dụng.'}</p></div><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => { setLoading(true); setPageError(''); setView((current) => current === 'trash' ? 'active' : 'trash'); }} className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-xs font-medium ${view === 'trash' ? 'border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800' : 'border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/15'}`}>{view === 'trash' ? <RotateCcw className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}{view === 'trash' ? 'Quay lại kho đồ' : 'Thùng rác'}{view !== 'trash' && <span className="rounded-full bg-rose-400/15 px-2 py-0.5 text-[10px] text-rose-100">{trashCount}</span>}</button>{view !== 'trash' && <button type="button" onClick={() => setDialog({ mode: 'create', cloth: null })} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-400 px-4 text-xs font-semibold text-neutral-950 hover:bg-amber-300"><Plus className="h-4 w-4" />Thêm trang phục</button>}</div></header>
    {view !== 'trash' && <div className="grid gap-3 sm:grid-cols-3"><SummaryCard icon={ShoppingBag} label="Tổng trang phục" value={stats.total} /><SummaryCard icon={Sparkles} label="Sẵn sàng cho thuê" value={stats.available} tone="green" /><SummaryCard icon={Shirt} label="Đang được thuê" value={stats.rented} tone="blue" /></div>}
    <AdminFilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Tìm tên, kích cỡ, màu sắc, mô tả..." filters={[{ key: 'type', label: 'Loại trang phục', value: type, onChange: setType, options: CLOTH_TYPE_OPTIONS }, { key: 'gender', label: 'Dành cho', value: gender, onChange: setGender, options: CLOTH_GENDER_OPTIONS.filter(({ value }) => value) }, { key: 'status', label: 'Trạng thái', value: status, onChange: setStatus, options: CLOTH_STATUS_OPTIONS }]} sortValue={sortOrder} onSortChange={setSortOrder} onReset={resetFilters} />
    {pageError && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{pageError}</span><button type="button" onClick={loadRows} className="ml-auto whitespace-nowrap font-medium underline">Tải lại</button></div>}
    {loading ? <div className="flex min-h-48 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/50 text-sm text-neutral-400"><span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-amber-300" />Đang tải kho trang phục...</div> : <AdminTable columns={columns} data={filtered} emptyMessage={view === 'trash' ? 'Thùng rác đang trống.' : 'Không có trang phục phù hợp với bộ lọc.'} onDetail={(cloth) => setDialog({ mode: 'detail', cloth })} onEdit={view === 'trash' ? undefined : (cloth) => setDialog({ mode: 'edit', cloth })} onDelete={view === 'trash' ? undefined : moveToTrash} actions={view === 'trash' ? { edit: false, delete: false } : undefined} />}
    {view === 'trash' && !loading && clothes.length > 0 && <p className="flex items-center gap-2 text-[11px] text-neutral-500"><CircleAlert className="h-3.5 w-3.5" />Trang phục có lịch sử trong đơn đặt lịch sẽ không thể xóa vĩnh viễn.</p>}
    {dialog && <ClothDialog key={`${dialog.mode}-${dialog.cloth?.id ?? 'new'}`} cloth={dialog.cloth} mode={dialog.mode} onClose={() => setDialog(null)} onSave={saveCloth} />}
  </section>;
}
