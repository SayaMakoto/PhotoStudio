import { useEffect, useState } from 'react';
import { BookOpenText, FileText, X } from 'lucide-react';
import GlideSelect from '../../../components/admin/common/GlideSelect';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import ImageUploadField from '../../../components/admin/common/ImageUploadField';
import { CONTENT_STATUSES, CONTENT_TYPES, CONTENT_TYPE_LABELS, createSlug, formatContentDate, getContentErrorMessage } from './contentConfig';

const inputClass = 'mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 outline-none transition focus:border-rose-400/60';

function Detail({ label, children }) {
  return <div className="border-b border-neutral-800/80 py-3 last:border-0"><dt className="text-[11px] text-neutral-500">{label}</dt><dd className="mt-1 break-words text-sm text-neutral-200">{children || '—'}</dd></div>;
}

export default function ContentDialog({ content, mode, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    type: content?.type ?? 'page',
    title: content?.title ?? '',
    slug: content?.slug ?? '',
    content: content?.content ?? '',
    imageUrl: content?.imageUrl ?? '',
    status: content?.status ?? 'draft',
  }));
  const [slugTouched, setSlugTouched] = useState(Boolean(content?.slug));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const detail = mode === 'detail';
  const title = mode === 'create' ? 'Tạo nội dung' : mode === 'edit' ? 'Chỉnh sửa nội dung' : 'Chi tiết nội dung';

  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape' && !saving) onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, saving]);

  const updateTitle = (value) => setForm((current) => ({
    ...current,
    title: value,
    ...(!slugTouched ? { slug: createSlug(value) } : {}),
  }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave({
        ...form,
        title: form.title.trim(),
        slug: form.slug.trim().toLowerCase(),
        content: form.content,
        imageUrl: form.imageUrl.trim() || null,
      });
    } catch (saveError) {
      setError(getContentErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  };

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="content-dialog-title" className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/95 px-5 py-4 backdrop-blur"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500/10 text-rose-400"><BookOpenText className="h-5 w-5" /></span><div><h2 id="content-dialog-title" className="font-semibold text-white">{title}</h2><p className="mt-0.5 text-xs text-neutral-500">{content?.id ? `Mã nội dung #${content.id}` : 'Trang nội dung hoặc bài viết của studio'}</p></div></div><button type="button" onClick={onClose} aria-label="Đóng" className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"><X className="h-4 w-4" /></button></header>
      {detail ? <><div className="px-5 py-4"><div className="mb-4 flex flex-wrap items-center gap-2"><StatusBadge status={content?.status} /><span className="rounded-full border border-neutral-700 bg-neutral-800/70 px-2.5 py-1 text-[11px] text-neutral-300">{CONTENT_TYPE_LABELS[content?.type] || content?.type}</span></div>{content?.imageUrl && <div className="mb-4 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950"><img src={content.imageUrl} alt={content.title || 'Ảnh nội dung'} className="max-h-72 w-full object-contain" onError={(event) => { event.currentTarget.style.display = 'none'; }} /></div>}<dl className="grid gap-x-8 sm:grid-cols-2"><Detail label="Tiêu đề">{content?.title}</Detail><Detail label="Slug"><span className="font-mono text-neutral-200">{content?.slug}</span></Detail><Detail label="Ngày tạo">{formatContentDate(content?.createdAt)}</Detail><Detail label="Cập nhật lần cuối">{formatContentDate(content?.updatedAt)}</Detail><div className="sm:col-span-2"><Detail label="URL ảnh đại diện">{content?.imageUrl ? <a href={content.imageUrl} target="_blank" rel="noreferrer" className="break-all text-rose-400 hover:underline">{content.imageUrl}</a> : 'Không có ảnh'}</Detail></div></dl><div className="mt-4"><p className="mb-2 text-[11px] text-neutral-500">Nội dung</p><pre className="max-h-[40vh] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-neutral-800 bg-neutral-950 p-4 font-sans text-sm leading-6 text-neutral-200">{content?.content || 'Chưa có nội dung.'}</pre></div></div><footer className="flex justify-end border-t border-neutral-800 px-5 py-4"><button type="button" onClick={onClose} className="rounded-xl border border-neutral-700 px-4 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800">Đóng</button></footer></> : <form onSubmit={submit} className="space-y-4 px-5 py-5">
        {error && <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs text-rose-200">{error}</div>}
        <div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-medium text-neutral-300">Loại nội dung<GlideSelect options={CONTENT_TYPES} value={form.type} onChange={(type) => setForm((current) => ({ ...current, type }))} ariaLabel="Loại nội dung" showTags={false} size="md" accentColor="#fbbf24" surfaceColor="#0a0a0a" highlightColor="#262626" textColor="#e5e5e5" menuWidth={220} className="mt-1.5 w-full [&>button]:min-h-10 [&>button]:w-full [&>button]:justify-between [&>button]:border [&>button]:border-neutral-800" /></label><label className="block text-xs font-medium text-neutral-300">Trạng thái<GlideSelect options={CONTENT_STATUSES} value={form.status} onChange={(status) => setForm((current) => ({ ...current, status }))} ariaLabel="Trạng thái nội dung" showTags={false} size="md" accentColor="#fbbf24" surfaceColor="#0a0a0a" highlightColor="#262626" textColor="#e5e5e5" menuWidth={220} className="mt-1.5 w-full [&>button]:min-h-10 [&>button]:w-full [&>button]:justify-between [&>button]:border [&>button]:border-neutral-800" /></label></div>
        <label className="block text-xs font-medium text-neutral-300">Tiêu đề <span className="text-rose-300">*</span><input autoFocus required maxLength={255} value={form.title} onChange={(event) => updateTitle(event.target.value)} className={inputClass} placeholder="Tiêu đề trang hoặc bài viết" /></label>
        <label className="block text-xs font-medium text-neutral-300">Slug <span className="text-rose-300">*</span><div className="relative"><input required maxLength={255} pattern="[a-z0-9]+(-[a-z0-9]+)*" title="Slug chỉ gồm chữ thường không dấu, số và dấu gạch ngang" value={form.slug} onChange={(event) => { setSlugTouched(true); setForm((current) => ({ ...current, slug: event.target.value.toLowerCase() })); }} className={`${inputClass} pr-10`} placeholder="gioi-thieu-studio" /><button type="button" onClick={() => { setSlugTouched(false); setForm((current) => ({ ...current, slug: createSlug(current.title) })); }} title="Tạo slug từ tiêu đề" className="absolute right-2 top-2.5 rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-800 hover:text-rose-400"><FileText className="h-4 w-4" /></button></div><span className="mt-1 block text-[11px] text-neutral-500">Slug phải duy nhất, chỉ gồm chữ thường không dấu, số và dấu gạch ngang.</span></label>
        <ImageUploadField label="Ảnh đại diện" value={form.imageUrl} onChange={(imageUrl) => setForm((current) => ({ ...current, imageUrl }))} helperText="Chọn ảnh JPG, PNG, WEBP hoặc GIF tối đa 10 MB, hoặc nhập URL ảnh." />
        <label className="block text-xs font-medium text-neutral-300">Nội dung<textarea rows={10} value={form.content} onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} className={`${inputClass} resize-y leading-6`} placeholder="Nhập nội dung trang hoặc bài viết..." /></label>
        <footer className="flex justify-end gap-2 border-t border-neutral-800 pt-4"><button type="button" disabled={saving} onClick={onClose} className="rounded-xl border border-neutral-700 px-4 py-2.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800">Hủy</button><button type="submit" disabled={saving} className="rounded-xl bg-rose-500 px-4 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-rose-600 disabled:opacity-60">{saving ? 'Đang lưu...' : mode === 'create' ? 'Tạo nội dung' : 'Lưu thay đổi'}</button></footer>
      </form>}
    </section>
  </div>;
}
