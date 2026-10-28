import { useEffect, useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import GlideSelect from '../../../components/admin/common/GlideSelect';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import { formatImageDate, getImageErrorMessage, IMAGEABLE_TYPES, IMAGE_PRIMARY_OPTIONS, IMAGE_TYPE_LABELS } from './imageConfig';

const inputClass = 'mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 outline-none transition focus:border-amber-400/60';

function Detail({ label, children }) {
  return <div className="border-b border-neutral-800/80 py-3 last:border-0"><dt className="text-[11px] text-neutral-500">{label}</dt><dd className="mt-1 break-words text-sm text-neutral-200">{children || '—'}</dd></div>;
}

export default function ImageDialog({ image, mode, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    imageableType: image?.imageableType ?? 'package',
    imageableId: image?.imageableId ?? '',
    imageUrl: image?.imageUrl ?? '',
    description: image?.description ?? '',
    isPrimary: String(Boolean(image?.isPrimary)),
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const detail = mode === 'detail';
  const title = mode === 'create' ? 'Thêm hình ảnh' : mode === 'edit' ? 'Chỉnh sửa hình ảnh' : 'Chi tiết hình ảnh';

  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape' && !saving) onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, saving]);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave({
        imageableType: form.imageableType,
        imageableId: Number(form.imageableId),
        imageUrl: form.imageUrl.trim(),
        description: form.description.trim() || null,
        isPrimary: form.isPrimary === 'true',
      });
    } catch (saveError) {
      setError(getImageErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  };

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="image-dialog-title" className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/95 px-5 py-4 backdrop-blur"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400/10 text-amber-300"><ImageIcon className="h-5 w-5" /></span><div><h2 id="image-dialog-title" className="font-semibold text-white">{title}</h2><p className="mt-0.5 text-xs text-neutral-500">{image?.id ? `Mã hình ảnh #${image.id}` : 'Quản lý metadata và liên kết hình ảnh'}</p></div></div><button type="button" onClick={onClose} aria-label="Đóng" className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"><X className="h-4 w-4" /></button></header>
      {detail ? <><div className="m-5 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950"><img src={image?.imageUrl} alt={image?.description || `Hình ảnh #${image?.id}`} className="max-h-[50vh] w-full object-contain" onError={(event) => { event.currentTarget.style.display = 'none'; }} /><p className="border-t border-neutral-800 px-3 py-2 text-center text-[11px] text-neutral-500">{image?.description || 'Không có mô tả'}</p></div><dl className="grid gap-x-8 px-5 pb-3 sm:grid-cols-2"><Detail label="Loại đối tượng">{IMAGE_TYPE_LABELS[image?.imageableType] || image?.imageableType}</Detail><Detail label="Mã đối tượng">{image?.imageableId}</Detail><Detail label="Vai trò ảnh"><StatusBadge status={image?.isPrimary ? 'primary' : 'additional'} domain="imagePrimary" /></Detail><Detail label="Ngày tạo">{formatImageDate(image?.createdAt)}</Detail><div className="sm:col-span-2"><Detail label="Đường dẫn ảnh"><a href={image?.imageUrl} target="_blank" rel="noreferrer" className="break-all text-amber-300 hover:underline">{image?.imageUrl}</a></Detail></div><div className="sm:col-span-2"><Detail label="Mô tả">{image?.description}</Detail></div></dl><footer className="flex justify-end border-t border-neutral-800 px-5 py-4"><button type="button" onClick={onClose} className="rounded-xl border border-neutral-700 px-4 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800">Đóng</button></footer></> : <form onSubmit={submit} className="space-y-4 px-5 py-5">
        {error && <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs text-rose-200">{error}</div>}
        <div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-medium text-neutral-300">Gắn với loại đối tượng <span className="text-rose-300">*</span><GlideSelect options={IMAGEABLE_TYPES} value={form.imageableType} onChange={(imageableType) => setForm((current) => ({ ...current, imageableType }))} ariaLabel="Loại đối tượng hình ảnh" showTags={false} size="md" accentColor="#fbbf24" surfaceColor="#0a0a0a" highlightColor="#262626" textColor="#e5e5e5" menuWidth={240} className="mt-1.5 w-full [&>button]:min-h-10 [&>button]:w-full [&>button]:justify-between [&>button]:border [&>button]:border-neutral-800" /></label><label className="block text-xs font-medium text-neutral-300">Mã đối tượng <span className="text-rose-300">*</span><input required min="1" type="number" value={form.imageableId} onChange={(event) => setForm((current) => ({ ...current, imageableId: event.target.value }))} className={inputClass} placeholder="ID phòng, gói chụp, dịch vụ..." /></label></div>
        <label className="block text-xs font-medium text-neutral-300">URL hình ảnh <span className="text-rose-300">*</span><input required maxLength={255} type="text" value={form.imageUrl} onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))} className={inputClass} placeholder="https://... hoặc đường dẫn tương đối" /><span className="mt-1 block text-[11px] text-neutral-500">API chỉ lưu đường dẫn, chưa hỗ trợ tải tệp ảnh lên máy chủ.</span></label>
        {form.imageUrl.trim() && <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950"><img src={form.imageUrl.trim()} alt="Xem trước hình ảnh" className="max-h-64 w-full object-contain" onError={(event) => { event.currentTarget.style.display = 'none'; }} /><p className="border-t border-neutral-800 px-3 py-2 text-center text-[11px] text-neutral-500">Xem trước</p></div>}
        <label className="block text-xs font-medium text-neutral-300">Mô tả<textarea maxLength={255} rows={2} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className={`${inputClass} resize-y`} placeholder="Mô tả hình ảnh (tối đa 255 ký tự)" /><span className="mt-1 block text-right text-[11px] text-neutral-500">{form.description.length}/255</span></label>
        <label className="block text-xs font-medium text-neutral-300">Vai trò hình ảnh <GlideSelect options={IMAGE_PRIMARY_OPTIONS} value={form.isPrimary} onChange={(isPrimary) => setForm((current) => ({ ...current, isPrimary }))} ariaLabel="Vai trò hình ảnh" showTags={false} size="md" accentColor="#fbbf24" surfaceColor="#0a0a0a" highlightColor="#262626" textColor="#e5e5e5" menuWidth={220} className="mt-1.5 w-full [&>button]:min-h-10 [&>button]:w-full [&>button]:justify-between [&>button]:border [&>button]:border-neutral-800" /><span className="mt-1 block text-[11px] text-neutral-500">Mỗi đối tượng chỉ có một ảnh đại diện; khi đặt ảnh mới làm đại diện, backend tự bỏ cờ đại diện ở ảnh trước.</span></label>
        <footer className="flex justify-end gap-2 border-t border-neutral-800 pt-4"><button type="button" disabled={saving} onClick={onClose} className="rounded-xl border border-neutral-700 px-4 py-2.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800">Hủy</button><button type="submit" disabled={saving} className="rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-amber-300 disabled:opacity-60">{saving ? 'Đang lưu...' : mode === 'create' ? 'Thêm hình ảnh' : 'Lưu thay đổi'}</button></footer>
      </form>}
    </section>
  </div>;
}
