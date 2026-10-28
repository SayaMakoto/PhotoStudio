import { useEffect, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import adminImageService from '../../../services/admin/imageService';

export default function ImageDetailPreview({ imageableType, imageableId, alt = 'Hình ảnh hiện tại' }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (imageableId == null) return undefined;
    let mounted = true;
    adminImageService.getByImageable(imageableType, imageableId)
      .then((rows) => {
        if (!mounted) return;
        const images = Array.isArray(rows) ? rows : [];
        setImage(images.find((item) => item.isPrimary) || images[0] || null);
      })
      .catch(() => { if (mounted) setLoadFailed(true); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [imageableId, imageableType]);

  return <section aria-label="Ảnh hiện tại" className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
    {loading ? <div className="grid min-h-48 place-items-center text-xs text-neutral-500"><span className="inline-flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-700 border-t-amber-300" />Đang tải ảnh hiện tại...</span></div>
      : image && !loadFailed ? <><img src={image.imageUrl} alt={image.description || alt} className="max-h-80 w-full object-contain" onError={() => setLoadFailed(true)} /><p className="border-t border-neutral-800 px-3 py-2.5 text-center text-xs text-neutral-500">{image.description || alt}{image.isPrimary ? ' · Ảnh đại diện' : ''}</p></>
        : <div className="grid min-h-40 place-items-center px-4 text-center"><div><ImageIcon className="mx-auto mb-2 h-6 w-6 text-neutral-600" /><p className="text-xs text-neutral-500">{loadFailed ? 'Không tải được ảnh hiện tại.' : 'Chưa có ảnh được gắn cho mục này.'}</p></div></div>}
  </section>;
}
