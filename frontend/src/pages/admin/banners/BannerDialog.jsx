import { useEffect, useState } from 'react';
import { Image, Link2, X } from 'lucide-react';
import GlideSelect from '../../../components/admin/common/GlideSelect';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import { BANNER_STATUS_OPTIONS, getBannerErrorMessage } from './bannerConfig';

const EMPTY = { title: '', imageUrl: '', link: '', status: 'active' };
const inputClass = 'mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 outline-none transition focus:border-amber-400/60';

function Detail({ label, children }) {
  return <div className="border-b border-neutral-800/80 py-3 last:border-0"><dt className="text-[11px] text-neutral-500">{label}</dt><dd className="mt-1 break-words text-sm text-neutral-200">{children || '—'}</dd></div>;
}

export default function BannerDialog({ banner, mode, onClose, onSave }) {
  const [form, setForm] = useState(() => ({ ...EMPTY, ...banner }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const detail = mode === 'detail';
  const title = mode === 'create' ? 'Thêm banner' : mode === 'edit' ? 'Cập nhật banner' : 'Chi tiết banner';

  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape' && !saving) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, saving]);

  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    try { await onSave({ ...form, title: form.title.trim(), imageUrl: form.imageUrl.trim(), link: form.link.trim() || null }); }
    catch (saveError) { setError(getBannerErrorMessage(saveError)); }
    finally { setSaving(false); }
  };

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="banner-dialog-title" className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/95 px-5 py-4 backdrop-blur"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400/10 text-amber-300"><Image className="h-5 w-5" /></span><div><h2 id="banner-dialog-title" className="font-semibold text-white">{title}</h2><p className="mt-0.5 text-xs text-neutral-500">{banner?.id ? `Mã banner #${banner.id}` : 'Banner quảng bá trên trang chủ'}</p></div></div><button type="button" onClick={onClose} aria-label="Đóng" className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"><X className="h-4 w-4" /></button></header>
      {detail ? <div className="space-y-4 px-5 py-4"><div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950"><img src={banner?.imageUrl} alt={banner?.title || 'Banner'} className="max-h-80 w-full object-contain" onError={(event) => { event.currentTarget.style.display = 'none'; }} /><p className="px-3 py-2 text-center text-[11px] text-neutral-500">{banner?.title || 'Banner'}</p></div><dl className="grid gap-x-8 sm:grid-cols-2"><Detail label="Tiêu đề">{banner?.title}</Detail><Detail label="Trạng thái"><StatusBadge status={banner?.status} domain="visibility" /></Detail><div className="sm:col-span-2"><Detail label="Đường dẫn ảnh"><a href={banner?.imageUrl} target="_blank" rel="noreferrer" className="break-all text-amber-300 hover:underline">{banner?.imageUrl}</a></Detail></div><div className="sm:col-span-2"><Detail label="Liên kết khi nhấn banner">{banner?.link ? <a href={banner.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-amber-300 hover:underline"><Link2 className="h-3.5 w-3.5" />{banner.link}</a> : 'Không có liên kết'}</Detail></div></dl></div> : <form onSubmit={submit} className="space-y-4 px-5 py-5">
        {error && <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs text-rose-200">{error}</div>}
        <label className="block text-xs font-medium text-neutral-300">Tiêu đề banner <span className="text-rose-300">*</span><input autoFocus required maxLength={255} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className={inputClass} placeholder="Ví dụ: Ưu đãi mùa cưới" /></label>
        <label className="block text-xs font-medium text-neutral-300">Đường dẫn ảnh <span className="text-rose-300">*</span><input required maxLength={255} type="text" value={form.imageUrl} onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))} className={inputClass} placeholder="https://... hoặc đường dẫn ảnh trong ứng dụng" /><span className="mt-1 block text-[11px] text-neutral-500">Backend lưu URL ảnh (tối đa 255 ký tự); trang này chưa có API tải tệp ảnh lên.</span></label>
        {form.imageUrl.trim() && <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950"><img src={form.imageUrl.trim()} alt="Xem trước banner" className="max-h-72 w-full object-contain" onError={(event) => { event.currentTarget.style.display = 'none'; }} /><p className="px-3 py-2 text-center text-[11px] text-neutral-500">Xem trước banner</p></div>}
        <label className="block text-xs font-medium text-neutral-300">Liên kết khi nhấn banner<input maxLength={255} type="text" value={form.link || ''} onChange={(event) => setForm((current) => ({ ...current, link: event.target.value }))} className={inputClass} placeholder="https://... hoặc đường dẫn nội bộ" /></label>
        <div className="max-w-sm text-xs font-medium text-neutral-300">Trạng thái<GlideSelect options={BANNER_STATUS_OPTIONS} value={form.status} onChange={(status) => setForm((current) => ({ ...current, status }))} ariaLabel="Trạng thái banner" showTags={false} size="md" accentColor="#fbbf24" surfaceColor="#0a0a0a" highlightColor="#262626" textColor="#e5e5e5" menuWidth={220} className="mt-1.5 w-full [&>button]:min-h-10 [&>button]:w-full [&>button]:justify-between [&>button]:border [&>button]:border-neutral-800" /></div>
        <footer className="flex justify-end gap-2 border-t border-neutral-800 pt-4"><button type="button" disabled={saving} onClick={onClose} className="rounded-xl border border-neutral-700 px-4 py-2.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800">Hủy</button><button type="submit" disabled={saving} className="rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-amber-300 disabled:opacity-60">{saving ? 'Đang lưu...' : mode === 'create' ? 'Thêm banner' : 'Lưu thay đổi'}</button></footer>
      </form>}
      {detail && <footer className="flex justify-end border-t border-neutral-800 px-5 py-4"><button type="button" onClick={onClose} className="rounded-xl border border-neutral-700 px-4 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800">Đóng</button></footer>}
    </section>
  </div>;
}
