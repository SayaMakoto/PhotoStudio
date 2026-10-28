import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArchiveRestore, Building2, CircleAlert, DoorOpen, Plus, RotateCcw, Trash2, Users } from 'lucide-react';
import AdminFilterBar from '../../../components/admin/common/AdminFilterBar';
import AdminTable from '../../../components/admin/common/AdminTable';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import useAdminNotification from '../../../components/admin/common/useAdminNotification';
import adminRoomService from '../../../services/admin/roomService';
import RoomDialog from './RoomDialog';
import { ROOM_STATUS_OPTIONS, formatRoomDate, getRoomErrorMessage } from './roomConfig';

const asRows = (rows) => Array.isArray(rows) ? rows : [];
const COLUMNS = [
  { key: 'id', title: 'Mã', cellClassName: 'font-mono text-neutral-400' },
  { key: 'name', title: 'Phòng chụp', render: (name, item) => <div className="min-w-44"><p className="font-medium text-neutral-100">{name || 'Chưa đặt tên'}</p><p className="mt-0.5 max-w-sm truncate text-[11px] text-neutral-500">{item.description || 'Chưa có mô tả'}</p></div> },
  { key: 'capacity', title: 'Sức chứa', render: (value) => <span className="inline-flex items-center gap-1.5 text-neutral-300"><Users className="h-3.5 w-3.5 text-neutral-500" />{value ?? '—'} người</span> },
  { key: 'status', title: 'Trạng thái', render: (status) => <StatusBadge status={status} domain="room" /> },
];

function SummaryCard({ label, value, icon: Icon, tone = 'amber' }) {
  const colors = { amber: 'border-amber-500/20 bg-amber-500/10 text-amber-300', green: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300', blue: 'border-sky-500/20 bg-sky-500/10 text-sky-300' };
  return <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs text-neutral-400">{label}</p><span className={`grid h-9 w-9 place-items-center rounded-xl border ${colors[tone]}`}><Icon className="h-4 w-4" /></span></div><p className="mt-3 text-2xl font-semibold text-white">{value}</p></div>;
}

export default function AdminRoomsPage() {
  const { notify } = useAdminNotification();
  const [view, setView] = useState('active');
  const [rooms, setRooms] = useState([]);
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
      const [activeRows, trashRows] = await Promise.all([adminRoomService.getAll(), adminRoomService.getTrash()]);
      setRooms(asRows(view === 'trash' ? trashRows : activeRows)); setTrashCount(asRows(trashRows).length);
    } catch (error) { setPageError(getRoomErrorMessage(error)); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    let mounted = true;
    Promise.all([adminRoomService.getAll(), adminRoomService.getTrash()])
      .then(([activeRows, trashRows]) => { if (!mounted) return; setRooms(asRows(view === 'trash' ? trashRows : activeRows)); setTrashCount(asRows(trashRows).length); })
      .catch((error) => { if (mounted) setPageError(getRoomErrorMessage(error)); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [view]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return rooms.filter((room) => (!keyword || [room.name, room.description].filter(Boolean).some((value) => String(value).toLowerCase().includes(keyword))) && (!status || room.status === status))
      .sort((a, b) => (sortOrder === 'oldest' ? 1 : -1) * ((Number(a.id) || 0) - (Number(b.id) || 0)));
  }, [rooms, search, sortOrder, status]);

  const resetFilters = () => { setSearch(''); setStatus(''); setSortOrder('newest'); };
  const saveRoom = async (payload) => {
    try {
      if (dialog.mode === 'create') { await adminRoomService.create(payload); notify({ type: 'success', title: 'Thêm phòng thành công', message: `Đã thêm “${payload.name}” vào danh sách phòng chụp.` }); }
      else { await adminRoomService.update(dialog.room.id, payload); notify({ type: 'success', title: 'Cập nhật phòng thành công', message: `Thông tin “${payload.name}” đã được lưu.` }); }
      setDialog(null); await loadRows();
    } catch (error) { setPageError(getRoomErrorMessage(error)); throw error; }
  };
  const moveToTrash = async (room) => {
    if (!window.confirm(`Đưa phòng “${room.name}” vào thùng rác? Lịch sử booking vẫn được giữ.`)) return;
    try { await adminRoomService.delete(room.id); notify({ type: 'success', title: 'Đã chuyển phòng vào thùng rác', message: `“${room.name}” có thể được khôi phục sau.` }); await loadRows(); }
    catch (error) { notify({ type: 'error', message: getRoomErrorMessage(error) }); }
  };
  const restore = async (room) => {
    if (!window.confirm(`Khôi phục phòng “${room.name}” về danh sách quản lý?`)) return;
    try { await adminRoomService.restore(room.id); notify({ type: 'success', title: 'Khôi phục thành công', message: `“${room.name}” đã trở lại danh sách phòng.` }); await loadRows(); }
    catch (error) { notify({ type: 'error', message: getRoomErrorMessage(error) }); }
  };
  const permanentlyDelete = async (room) => {
    if (!window.confirm(`Xóa vĩnh viễn phòng “${room.name}”? Lịch sử đặt phòng đang tham chiếu sẽ khiến thao tác bị từ chối.`)) return;
    try { await adminRoomService.permanentlyDelete(room.id); notify({ type: 'success', title: 'Đã xóa phòng vĩnh viễn', message: `“${room.name}” đã bị xóa khỏi hệ thống.` }); await loadRows(); }
    catch (error) { notify({ type: 'error', message: getRoomErrorMessage(error) }); }
  };

  const columns = view === 'trash' ? [...COLUMNS, { key: 'deletedAt', title: 'Ngày xóa', render: formatRoomDate }, { key: 'trashActions', title: 'Thùng rác', render: (_, room) => <div className="flex items-center gap-1"><button type="button" onClick={() => restore(room)} aria-label={`Khôi phục ${room.name}`} title="Khôi phục" className="rounded-lg p-2 text-emerald-300 hover:bg-emerald-500/10"><ArchiveRestore className="h-4 w-4" /></button><button type="button" onClick={() => permanentlyDelete(room)} aria-label={`Xóa vĩnh viễn ${room.name}`} title="Xóa vĩnh viễn" className="rounded-lg p-2 text-rose-300 hover:bg-rose-500/10"><Trash2 className="h-4 w-4" /></button></div> }] : COLUMNS;
  const stats = useMemo(() => ({ total: rooms.length, active: rooms.filter((room) => room.status === 'active').length, capacity: rooms.reduce((sum, room) => sum + (Number(room.capacity) || 0), 0) }), [rooms]);

  return <section className="space-y-5">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">Quản lý tài nguyên</p><h1 className="flex items-center gap-2 text-2xl font-semibold text-white"><Building2 className="h-6 w-6 text-amber-300" />{view === 'trash' ? 'Thùng rác phòng chụp' : 'Quản lý phòng chụp'}</h1><p className="mt-1 text-xs text-neutral-400">{view === 'trash' ? 'Khôi phục phòng hoặc xóa vĩnh viễn nếu chưa có lịch đặt tham chiếu.' : 'Quản lý phòng studio, sức chứa và tình trạng sẵn sàng phục vụ.'}</p></div><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => { setLoading(true); setPageError(''); setView((current) => current === 'trash' ? 'active' : 'trash'); }} className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-xs font-medium ${view === 'trash' ? 'border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800' : 'border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/15'}`}>{view === 'trash' ? <RotateCcw className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}{view === 'trash' ? 'Quay lại phòng chụp' : 'Thùng rác'}{view !== 'trash' && <span className="rounded-full bg-rose-400/15 px-2 py-0.5 text-[10px] text-rose-100">{trashCount}</span>}</button>{view !== 'trash' && <button type="button" onClick={() => setDialog({ mode: 'create', room: null })} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-400 px-4 text-xs font-semibold text-neutral-950 hover:bg-amber-300"><Plus className="h-4 w-4" />Thêm phòng</button>}</div></header>
    {view !== 'trash' && <div className="grid gap-3 sm:grid-cols-3"><SummaryCard icon={DoorOpen} label="Tổng số phòng" value={stats.total} /><SummaryCard icon={Building2} label="Đang hoạt động" value={stats.active} tone="green" /><SummaryCard icon={Users} label="Tổng sức chứa" value={`${stats.capacity} người`} tone="blue" /></div>}
    <AdminFilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Tìm tên hoặc mô tả phòng..." filters={[{ key: 'status', label: 'Trạng thái', value: status, onChange: setStatus, options: ROOM_STATUS_OPTIONS }]} sortValue={sortOrder} onSortChange={setSortOrder} onReset={resetFilters} />
    {pageError && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{pageError}</span><button type="button" onClick={loadRows} className="ml-auto whitespace-nowrap font-medium underline">Tải lại</button></div>}
    {loading ? <div className="flex min-h-48 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/50 text-sm text-neutral-400"><span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-amber-300" />Đang tải danh sách phòng...</div> : <AdminTable columns={columns} data={filtered} emptyMessage={view === 'trash' ? 'Thùng rác đang trống.' : 'Không có phòng phù hợp với bộ lọc.'} onDetail={(room) => setDialog({ mode: 'detail', room })} onEdit={view === 'trash' ? undefined : (room) => setDialog({ mode: 'edit', room })} onDelete={view === 'trash' ? undefined : moveToTrash} actions={view === 'trash' ? { edit: false, delete: false } : undefined} />}
    {view === 'trash' && !loading && rooms.length > 0 && <p className="flex items-center gap-2 text-[11px] text-neutral-500"><CircleAlert className="h-3.5 w-3.5" />Phòng đã được booking sử dụng sẽ không thể xóa vĩnh viễn để bảo toàn lịch sử.</p>}
    {dialog && <RoomDialog key={`${dialog.mode}-${dialog.room?.id ?? 'new'}`} room={dialog.room} mode={dialog.mode} onClose={() => setDialog(null)} onSave={saveRoom} />}
  </section>;
}
