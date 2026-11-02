import { useEffect, useRef, useState } from 'react';
import { Image as ImageIcon, LoaderCircle, Trash2, Upload } from 'lucide-react';
import adminImageService from '../../../services/admin/imageService';
import adminMediaUploadService from '../../../services/admin/mediaUploadService';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const inputClass = 'mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 outline-none transition focus:border-rose-400/60';

function getErrorMessage(error) {
  return error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Không thể tải ảnh lên.';
}

export default function ImageUploadField({
  label = 'Hình ảnh',
  value = '',
  onChange,
  imageableType,
  imageableId,
  required = false,
  helperText = 'Có thể nhập URL hoặc chọn tệp JPG, PNG, WEBP, GIF (tối đa 10 MB).',
  disabled = false,
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loadingExisting, setLoadingExisting] = useState(Boolean(imageableType && imageableId && !value));
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  const dirtyRef = useRef(false);
  const initialValueRef = useRef(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    if (!imageableType || !imageableId || initialValueRef.current) {
      return undefined;
    }
    let mounted = true;
    adminImageService.getByImageable(imageableType, imageableId)
      .then((rows) => {
        if (!mounted || dirtyRef.current) return;
        const images = Array.isArray(rows) ? rows : [];
        const current = images.find((image) => image.isPrimary);
        if (current?.imageUrl) onChangeRef.current?.(current.imageUrl);
      })
      .catch(() => {})
      .finally(() => { if (mounted) setLoadingExisting(false); });
    return () => { mounted = false; };
  }, [imageableId, imageableType]);

  const uploadFile = async (file) => {
    setError('');
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Chỉ hỗ trợ ảnh JPG, PNG, WEBP hoặc GIF.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Dung lượng ảnh tối đa là 10 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    dirtyRef.current = true;
    setUploading(true);
    setProgress(0);
    try {
      const result = await adminMediaUploadService.uploadImage(file, (event) => {
        if (event.total) setProgress(Math.round((event.loaded / event.total) * 100));
      });
      onChangeRef.current?.(result?.imageUrl || '');
    } catch (uploadError) {
      setError(getErrorMessage(uploadError));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const setValue = (nextValue) => {
    dirtyRef.current = true;
    onChangeRef.current?.(nextValue);
  };

  return <div className="block text-xs font-medium text-neutral-300">
    {label}{required && <span className="ml-1 text-rose-300">*</span>}
    <div className="mt-1.5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
      <input type="text" maxLength={255} required={required} value={value || ''} disabled={disabled || uploading} onChange={(event) => setValue(event.target.value)} className={`${inputClass} mt-0 min-w-0`} placeholder="URL ảnh hoặc đường dẫn ảnh đã tải lên" />
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" disabled={disabled || uploading} onChange={(event) => uploadFile(event.target.files?.[0])} />
      <button type="button" disabled={disabled || uploading} onClick={() => fileInputRef.current?.click()} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-rose-500/30 px-3 text-xs font-medium text-rose-400 transition hover:bg-rose-500/10 disabled:cursor-wait disabled:opacity-60">
        {uploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {uploading ? `Đang tải ${progress}%` : 'Chọn ảnh'}
      </button>
    </div>
    {helperText && <p className="mt-1.5 text-[11px] font-normal text-neutral-500">{loadingExisting ? 'Đang tải ảnh hiện tại...' : helperText}</p>}
    {error && <p role="alert" className="mt-1.5 text-[11px] font-normal text-rose-300">{error}</p>}
    {value && <div className="mt-3 flex items-start gap-3 rounded-xl border border-neutral-800 bg-neutral-950 p-2.5">
      <img src={value} alt="Xem trước ảnh" className="h-20 w-28 rounded-lg border border-neutral-800 object-cover" onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }} />
      <div className="min-w-0 flex-1 self-center"><p className="flex items-center gap-1.5 text-[11px] text-neutral-400"><ImageIcon className="h-3.5 w-3.5 shrink-0" />Xem trước</p><p className="mt-1 truncate text-[11px] font-normal text-neutral-600" title={value}>{value}</p></div>
      {!required && <button type="button" disabled={disabled || uploading} onClick={() => setValue('')} aria-label="Gỡ ảnh" title="Gỡ ảnh" className="rounded-lg p-2 text-neutral-500 hover:bg-rose-500/10 hover:text-rose-300 disabled:opacity-50"><Trash2 className="h-4 w-4" /></button>}
    </div>}
  </div>;
}
