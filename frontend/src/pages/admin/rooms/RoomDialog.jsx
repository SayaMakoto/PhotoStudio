import { useEffect, useState } from 'react';
import { Building2, Users, X } from 'lucide-react';
import GlideSelect from '../../../components/admin/common/GlideSelect';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import ImageUploadField from '../../../components/admin/common/ImageUploadField';
import ImageDetailPreview from '../../../components/admin/common/ImageDetailPreview';
import { ROOM_STATUS_OPTIONS, formatRoomDate, getRoomErrorMessage } from './roomConfig';

const EMPTY = { name: '', description: '', capacity: 1, status: 'active' };
const inputClass = 'mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 outline-none transition focus:border-rose-400/60';

function Detail({ label, children }) {
  return <div className="border-b border-neutral-800/80 py-3 last:border-0"><dt className="text-[11px] text-neutral-500">{label}</dt><dd className="mt-1 wrap-break-word text-sm text-neutral-200">{children || '—'}</dd></div>;
}

export default function RoomDialog({ room, mode, onClose, onSave }) {
  const [form, setForm] = useState(() => ({ ...EMPTY, ...room }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const detail = mode === 'detail';
  const title = mode === 'create' ? 'Thêm phòng chụp' : mode === 'edit' ? 'Cập nhật phòng chụp' : 'Chi tiết phòng chụp';

  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape' && !saving) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, saving]);

  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    try { await onSave({ ...form, capacity: Number(form.capacity) }); }
    catch (e) { setError(getRoomErrorMessage(e)); }
    finally { setSaving(false); }
  };

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="room-dialog-title" className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/95 px-5 py-4 backdrop-blur"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500/10 text-rose-400"><Building2 className="h-5 w-5" /></span><div><h2 id="room-dialog-title" className="font-semibold text-white">{title}</h2><p className="mt-0.5 text-xs text-neutral-500">{room?.id ? `Mã phòng #${room.id}` : 'Danh sách phòng chụp studio'}</p></div></div><button type="button" onClick={onClose} aria-label="Đóng" className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"><X className="h-4 w-4" /></button></header>
      {detail ? <><div className="px-5 pt-4"><ImageDetailPreview imageableType="room" imageableId={room?.id} alt={`Ảnh phòng ${room?.name || ''}`} /></div><dl className="px-5 py-2"><Detail label="Tên phòng">{room?.name}</Detail><Detail label="Sức chứa tối đa"><span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-neutral-400" />{room?.capacity} người</span></Detail><Detail label="Trạng thái"><StatusBadge status={room?.status} domain="room" /></Detail><Detail label="Mô tả">{room?.description}</Detail>{room?.deletedAt && <Detail label="Ngày chuyển vào thùng rác">{formatRoomDate(room.deletedAt)}</Detail>}</dl></> : <form onSubmit={submit} className="space-y-4 px-5 py-5">
        {error && <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs text-rose-200">{error}</div>}
        <ImageUploadField label="Ảnh phòng chụp" imageableType="room" imageableId={room?.id} value={form.imageUrl || ''} onChange={(imageUrl) => setForm((current) => ({ ...current, imageUrl }))} />
        <label className="block text-xs font-medium text-neutral-300">Tên phòng <span className="text-rose-300">*</span><input autoFocus required maxLength={255} value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} className={inputClass} placeholder="Ví dụ: Studio A - phòng chân dung" /></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-medium text-neutral-300">Sức chứa tối đa <span className="text-rose-300">*</span><input type="number" min="1" max="20" step="1" required value={form.capacity ?? 1} onChange={(e) => setForm((current) => ({ ...current, capacity: e.target.value }))} className={inputClass} /></label><div className="text-xs font-medium text-neutral-300">Trạng thái<GlideSelect options={ROOM_STATUS_OPTIONS} value={form.status} onChange={(status) => setForm((current) => ({ ...current, status }))} ariaLabel="Trạng thái phòng" showTags={false} size="md" accentColor="#fbbf24" surfaceColor="#0a0a0a" highlightColor="#262626" textColor="#e5e5e5" menuWidth={240} className="mt-1.5 w-full [&>button]:min-h-10 [&>button]:w-full [&>button]:justify-between [&>button]:border [&>button]:border-neutral-800" /></div></div>
        <label className="block text-xs font-medium text-neutral-300">Mô tả<textarea rows={4} maxLength={255} value={form.description || ''} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} className={`${inputClass} resize-y`} placeholder="Mô tả diện tích, ánh sáng, trang thiết bị hoặc lưu ý sử dụng" /></label>
        <footer className="flex justify-end gap-2 border-t border-neutral-800 pt-4"><button type="button" disabled={saving} onClick={onClose} className="rounded-xl border border-neutral-700 px-4 py-2.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800">Hủy</button><button type="submit" disabled={saving} className="rounded-xl bg-rose-500 px-4 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-rose-600 disabled:opacity-60">{saving ? 'Đang lưu...' : mode === 'create' ? 'Thêm phòng' : 'Lưu thay đổi'}</button></footer>
      </form>}
      {detail && <footer className="flex justify-end border-t border-neutral-800 px-5 py-4"><button type="button" onClick={onClose} className="rounded-xl border border-neutral-700 px-4 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800">Đóng</button></footer>}
    </section>
  </div>;
}
