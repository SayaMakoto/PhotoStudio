import { useEffect, useState } from 'react';
import { Gem, X } from 'lucide-react';
import GlideSelect from '../../../components/admin/common/GlideSelect';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import ImageUploadField from '../../../components/admin/common/ImageUploadField';
import ImageDetailPreview from '../../../components/admin/common/ImageDetailPreview';
import { ACCESSORY_STATUS_OPTIONS, ACCESSORY_TYPE_LABELS, ACCESSORY_TYPE_OPTIONS, formatAccessoryDate, formatAccessoryPrice, getAccessoryErrorMessage } from './accessoryConfig';

const EMPTY = { type: 'concept', name: '', description: '', quantity: 0, price: 0, status: 'available' };
const inputClass = 'mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 outline-none transition focus:border-rose-400/60';

function Detail({ label, children }) {
  return <div className="border-b border-neutral-800/80 py-3 last:border-0"><dt className="text-[11px] text-neutral-500">{label}</dt><dd className="mt-1 wrap-break-word text-sm text-neutral-200">{children || '—'}</dd></div>;
}

export default function AccessoryDialog({ accessory, mode, onClose, onSave }) {
  const [form, setForm] = useState(() => ({ ...EMPTY, ...accessory }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const detail = mode === 'detail';
  const title = mode === 'create' ? 'Thêm phụ kiện' : mode === 'edit' ? 'Cập nhật phụ kiện' : 'Chi tiết phụ kiện';

  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape' && !saving) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, saving]);

  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    try { await onSave({ ...form, quantity: Number(form.quantity), price: Number(form.price) }); }
    catch (e) { setError(getAccessoryErrorMessage(e)); }
    finally { setSaving(false); }
  };

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="accessory-dialog-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/95 px-5 py-4 backdrop-blur"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500/10 text-rose-400"><Gem className="h-5 w-5" /></span><div><h2 id="accessory-dialog-title" className="font-semibold text-white">{title}</h2><p className="mt-0.5 text-xs text-neutral-500">{accessory?.id ? `Mã phụ kiện #${accessory.id}` : 'Kho phụ kiện studio'}</p></div></div><button type="button" onClick={onClose} aria-label="Đóng" className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"><X className="h-4 w-4" /></button></header>
      {detail ? <><div className="px-5 pt-4"><ImageDetailPreview imageableType="accessory" imageableId={accessory?.id} alt={`Ảnh phụ kiện ${accessory?.name || ''}`} /></div><dl className="grid gap-x-8 px-5 py-2 sm:grid-cols-2"><Detail label="Tên phụ kiện">{accessory?.name}</Detail><Detail label="Loại phụ kiện">{ACCESSORY_TYPE_LABELS[accessory?.type] || accessory?.type}</Detail><Detail label="Số lượng trong kho">{accessory?.quantity} món</Detail><Detail label="Giá thuê">{formatAccessoryPrice(accessory?.price)}</Detail><Detail label="Trạng thái"><StatusBadge status={accessory?.status} /></Detail><div className="sm:col-span-2"><Detail label="Mô tả">{accessory?.description}</Detail></div>{accessory?.deletedAt && <div className="sm:col-span-2"><Detail label="Ngày chuyển vào thùng rác">{formatAccessoryDate(accessory.deletedAt)}</Detail></div>}</dl></> : <form onSubmit={submit} className="space-y-4 px-5 py-5">
        {error && <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs text-rose-200">{error}</div>}
        <ImageUploadField label="Ảnh phụ kiện" imageableType="accessory" imageableId={accessory?.id} value={form.imageUrl || ''} onChange={(imageUrl) => setForm((current) => ({ ...current, imageUrl }))} />
        <label className="block text-xs font-medium text-neutral-300">Tên phụ kiện <span className="text-rose-300">*</span><input autoFocus required maxLength={255} value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} className={inputClass} placeholder="Ví dụ: Hoa cầm tay, trang sức..." /></label>
        <div className="grid gap-4 sm:grid-cols-2"><div className="text-xs font-medium text-neutral-300">Loại phụ kiện <span className="text-rose-300">*</span><GlideSelect options={ACCESSORY_TYPE_OPTIONS} value={form.type} onChange={(type) => setForm((current) => ({ ...current, type }))} ariaLabel="Loại phụ kiện" showTags={false} size="md" accentColor="#fbbf24" surfaceColor="#0a0a0a" highlightColor="#262626" textColor="#e5e5e5" menuWidth={260} className="mt-1.5 w-full [&>button]:min-h-10 [&>button]:w-full [&>button]:justify-between [&>button]:border [&>button]:border-neutral-800" /></div><div className="text-xs font-medium text-neutral-300">Trạng thái<GlideSelect options={ACCESSORY_STATUS_OPTIONS} value={form.status} onChange={(status) => setForm((current) => ({ ...current, status }))} ariaLabel="Trạng thái phụ kiện" showTags={false} size="md" accentColor="#fbbf24" surfaceColor="#0a0a0a" highlightColor="#262626" textColor="#e5e5e5" menuWidth={260} className="mt-1.5 w-full [&>button]:min-h-10 [&>button]:w-full [&>button]:justify-between [&>button]:border [&>button]:border-neutral-800" /></div>
          <label className="block text-xs font-medium text-neutral-300">Số lượng trong kho<input type="number" min="0" step="1" required value={form.quantity ?? 0} onChange={(e) => setForm((current) => ({ ...current, quantity: e.target.value }))} className={inputClass} /></label><label className="block text-xs font-medium text-neutral-300">Giá thuê (VND)<input type="number" min="0" step="1000" required value={form.price ?? 0} onChange={(e) => setForm((current) => ({ ...current, price: e.target.value }))} className={inputClass} /></label>
        </div>
        <label className="block text-xs font-medium text-neutral-300">Mô tả<textarea rows={3} maxLength={255} value={form.description || ''} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} className={`${inputClass} resize-y`} placeholder="Mô tả công dụng hoặc lưu ý bảo quản" /></label>
        <footer className="flex justify-end gap-2 border-t border-neutral-800 pt-4"><button type="button" disabled={saving} onClick={onClose} className="rounded-xl border border-neutral-700 px-4 py-2.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800">Hủy</button><button type="submit" disabled={saving} className="rounded-xl bg-rose-500 px-4 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-rose-600 disabled:opacity-60">{saving ? 'Đang lưu...' : mode === 'create' ? 'Thêm phụ kiện' : 'Lưu thay đổi'}</button></footer>
      </form>}
      {detail && <footer className="flex justify-end border-t border-neutral-800 px-5 py-4"><button type="button" onClick={onClose} className="rounded-xl border border-neutral-700 px-4 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800">Đóng</button></footer>}
    </section>
  </div>;
}
