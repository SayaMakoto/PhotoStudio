import { useEffect, useState } from 'react';
import { Image, X } from 'lucide-react';
import GlideSelect from '../../../components/admin/common/GlideSelect';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import { BACKGROUND_STATUS_OPTIONS, formatBackgroundDate, getBackgroundErrorMessage } from './backgroundConfig';

const EMPTY = { name: '', description: '', status: 'active' };
const inputClass = 'mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 outline-none transition focus:border-amber-400/60';

function Detail({ label, children }) {
  return <div className="border-b border-neutral-800/80 py-3 last:border-0"><dt className="text-[11px] text-neutral-500">{label}</dt><dd className="mt-1 wrap-break-word text-sm text-neutral-200">{children || '—'}</dd></div>;
}

export default function BackgroundDialog({ background, mode, onClose, onSave }) {
  const [form, setForm] = useState(() => ({ ...EMPTY, ...background }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const detail = mode === 'detail';
  const title = mode === 'create' ? 'Thêm bối cảnh' : mode === 'edit' ? 'Cập nhật bối cảnh' : 'Chi tiết bối cảnh';

  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape' && !saving) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, saving]);

  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    try { await onSave(form); } catch (e) { setError(getBackgroundErrorMessage(e)); } finally { setSaving(false); }
  };

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="background-dialog-title" className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/95 px-5 py-4 backdrop-blur">
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400/10 text-amber-300"><Image className="h-5 w-5" /></span><div><h2 id="background-dialog-title" className="font-semibold text-white">{title}</h2><p className="mt-0.5 text-xs text-neutral-500">{background?.id ? `Mã bối cảnh #${background.id}` : 'Danh mục bối cảnh studio'}</p></div></div>
        <button type="button" onClick={onClose} aria-label="Đóng" className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"><X className="h-4 w-4" /></button>
      </header>
      {detail ? <dl className="px-5 py-2"><Detail label="Tên bối cảnh">{background?.name}</Detail><Detail label="Trạng thái"><StatusBadge status={background?.status} domain="room" /></Detail><Detail label="Mô tả">{background?.description}</Detail>{background?.deletedAt && <Detail label="Ngày chuyển vào thùng rác">{formatBackgroundDate(background.deletedAt)}</Detail>}</dl> : <form onSubmit={submit} className="space-y-4 px-5 py-5">
        {error && <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs text-rose-200">{error}</div>}
        <label className="block text-xs font-medium text-neutral-300">Tên bối cảnh <span className="text-rose-300">*</span><input autoFocus required maxLength={255} value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} className={inputClass} placeholder="Ví dụ: Phông nền tối giản" /></label>
        <div className="text-xs font-medium text-neutral-300">Trạng thái<GlideSelect options={BACKGROUND_STATUS_OPTIONS} value={form.status} onChange={(status) => setForm((current) => ({ ...current, status }))} ariaLabel="Trạng thái bối cảnh" showTags={false} size="md" accentColor="#fbbf24" surfaceColor="#0a0a0a" highlightColor="#262626" textColor="#e5e5e5" menuWidth={240} className="mt-1.5 w-full [&>button]:min-h-10 [&>button]:w-full [&>button]:justify-between [&>button]:border [&>button]:border-neutral-800" /></div>
        <label className="block text-xs font-medium text-neutral-300">Mô tả<textarea rows={4} maxLength={255} value={form.description || ''} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} className={`${inputClass} resize-y`} placeholder="Mô tả concept, cách bố trí hoặc lưu ý sử dụng" /></label>
        <footer className="flex justify-end gap-2 border-t border-neutral-800 pt-4"><button type="button" disabled={saving} onClick={onClose} className="rounded-xl border border-neutral-700 px-4 py-2.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800">Hủy</button><button type="submit" disabled={saving} className="rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-amber-300 disabled:opacity-60">{saving ? 'Đang lưu...' : mode === 'create' ? 'Thêm bối cảnh' : 'Lưu thay đổi'}</button></footer>
      </form>}
      {detail && <footer className="flex justify-end border-t border-neutral-800 px-5 py-4"><button type="button" onClick={onClose} className="rounded-xl border border-neutral-700 px-4 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800">Đóng</button></footer>}
    </section>
  </div>;
}
