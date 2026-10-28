import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, BookImage, Camera, Image as ImageIcon, Layers3, Star } from 'lucide-react';
import AdminFilterBar from '../../../components/admin/common/AdminFilterBar';
import AdminTable from '../../../components/admin/common/AdminTable';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import adminImageService from '../../../services/admin/imageService';
import adminBannerService from '../../../services/admin/bannerService';
import adminContentService from '../../../services/admin/contentService';
import { formatImageDate, getImageErrorMessage, IMAGE_TYPE_LABELS } from './imageConfig';

const IMAGE_TYPE_OPTIONS = [
  { value: 'room', label: 'Phòng chụp' },
  { value: 'background', label: 'Bối cảnh' },
  { value: 'equipment', label: 'Thiết bị' },
  { value: 'clothing', label: 'Trang phục' },
  { value: 'accessory', label: 'Phụ kiện' },
  { value: 'package', label: 'Gói chụp' },
  { value: 'service', label: 'Dịch vụ' },
  { value: 'banner', label: 'Banner' },
  { value: 'content', label: 'Nội dung' },
];

const asRows = (rows) => Array.isArray(rows) ? rows : [];
const getCreatedTime = (item) => {
  const timestamp = new Date(item.createdAt || item.updatedAt || 0).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

function SummaryCard({ label, value, icon: Icon, tone = 'amber' }) {
  const colors = { amber: 'border-amber-500/20 bg-amber-500/10 text-amber-300', green: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300', blue: 'border-sky-500/20 bg-sky-500/10 text-sky-300' };
  return <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs text-neutral-400">{label}</p><span className={`grid h-9 w-9 place-items-center rounded-xl border ${colors[tone]}`}><Icon className="h-4 w-4" /></span></div><p className="mt-3 text-2xl font-semibold text-white">{value}</p></div>;
}

export default function AdminImagesPage() {
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [partialWarning, setPartialWarning] = useState('');

  const loadImages = async () => {
    setLoading(true);
    setPageError('');
    setPartialWarning('');
    const results = await Promise.allSettled([
      adminImageService.getAll(),
      adminBannerService.getAll(),
      adminContentService.getAll(),
    ]);

    const failures = results.filter((result) => result.status === 'rejected');
    const imageRows = results[0].status === 'fulfilled' ? asRows(results[0].value).map((image) => ({
      ...image,
      rowId: `image-${image.id}`,
      source: 'images',
      sourceName: image.description || 'Ảnh liên kết với danh mục',
    })) : [];
    const bannerRows = results[1].status === 'fulfilled' ? asRows(results[1].value).filter((banner) => banner.imageUrl).map((banner) => ({
      id: banner.id,
      rowId: `banner-${banner.id}`,
      imageableType: 'banner',
      imageableId: banner.id,
      imageUrl: banner.imageUrl,
      description: banner.title || 'Banner',
      sourceName: banner.title || `Banner #${banner.id}`,
      source: 'banners',
      createdAt: banner.createdAt,
      updatedAt: banner.updatedAt,
      isPrimary: true,
    })) : [];
    const contentRows = results[2].status === 'fulfilled' ? asRows(results[2].value).filter((content) => content.imageUrl).map((content) => ({
      id: content.id,
      rowId: `content-${content.id}`,
      imageableType: 'content',
      imageableId: content.id,
      imageUrl: content.imageUrl,
      description: content.title || 'Ảnh nội dung',
      sourceName: content.title || `Nội dung #${content.id}`,
      source: 'contents',
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      isPrimary: true,
    })) : [];

    setImages([...imageRows, ...bannerRows, ...contentRows]);
    if (failures.length === results.length) setPageError(getImageErrorMessage(failures[0].reason));
    else if (failures.length) setPartialWarning('Một số nguồn ảnh chưa tải được. Danh sách đang hiển thị những nguồn phản hồi thành công.');
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([adminImageService.getAll(), adminBannerService.getAll(), adminContentService.getAll()])
      .then((results) => {
        if (!mounted) return;
        const failures = results.filter((result) => result.status === 'rejected');
        const imageRows = results[0].status === 'fulfilled' ? asRows(results[0].value).map((image) => ({ ...image, rowId: `image-${image.id}`, source: 'images', sourceName: image.description || 'Ảnh liên kết với danh mục' })) : [];
        const bannerRows = results[1].status === 'fulfilled' ? asRows(results[1].value).filter((banner) => banner.imageUrl).map((banner) => ({ id: banner.id, rowId: `banner-${banner.id}`, imageableType: 'banner', imageableId: banner.id, imageUrl: banner.imageUrl, description: banner.title || 'Banner', sourceName: banner.title || `Banner #${banner.id}`, source: 'banners', createdAt: banner.createdAt, updatedAt: banner.updatedAt, isPrimary: true })) : [];
        const contentRows = results[2].status === 'fulfilled' ? asRows(results[2].value).filter((content) => content.imageUrl).map((content) => ({ id: content.id, rowId: `content-${content.id}`, imageableType: 'content', imageableId: content.id, imageUrl: content.imageUrl, description: content.title || 'Ảnh nội dung', sourceName: content.title || `Nội dung #${content.id}`, source: 'contents', createdAt: content.createdAt, updatedAt: content.updatedAt, isPrimary: true })) : [];
        setImages([...imageRows, ...bannerRows, ...contentRows]);
        if (failures.length === results.length) setPageError(getImageErrorMessage(failures[0].reason));
        else if (failures.length) setPartialWarning('Một số nguồn ảnh chưa tải được. Danh sách đang hiển thị những nguồn phản hồi thành công.');
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return images.filter((image) => {
      const matchesSearch = !keyword || [image.id, image.imageableId, image.description, image.imageUrl, image.sourceName, IMAGE_TYPE_LABELS[image.imageableType]].filter(Boolean).some((value) => String(value).toLowerCase().includes(keyword));
      return matchesSearch && (!type || image.imageableType === type);
    }).sort((a, b) => (sortOrder === 'oldest' ? 1 : -1) * (getCreatedTime(a) - getCreatedTime(b)));
  }, [images, search, sortOrder, type]);

  const stats = useMemo(() => ({
    total: images.length,
    linked: images.filter((image) => image.source === 'images').length,
    standalone: images.filter((image) => image.source !== 'images').length,
    primary: images.filter((image) => image.isPrimary).length,
  }), [images]);

  const resetFilters = () => { setSearch(''); setType(''); setSortOrder('newest'); };
  const columns = [
    { key: 'imageUrl', title: 'Ảnh', render: (url, image) => <div className="flex min-w-56 items-center gap-3"><a href={url} target="_blank" rel="noreferrer" aria-label={`Mở ảnh ${image.sourceName}`}><img src={url} alt={image.description || 'Hình ảnh'} className="h-14 w-20 rounded-lg border border-neutral-800 bg-neutral-950 object-cover" onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }} /></a><div className="min-w-0"><p className="max-w-64 truncate font-medium text-neutral-200" title={image.description || ''}>{image.description || 'Không có mô tả'}</p><a href={url} target="_blank" rel="noreferrer" className="block max-w-64 truncate text-[11px] text-neutral-500 hover:text-amber-300" title={url}>{url}</a></div></div> },
    { key: 'imageableType', title: 'Phân loại', render: (value) => <span className="inline-flex rounded-full border border-neutral-700 bg-neutral-800/70 px-2.5 py-1 text-[11px] font-medium text-neutral-300">{IMAGE_TYPE_LABELS[value] || IMAGE_TYPE_OPTIONS.find((option) => option.value === value)?.label || value || '—'}</span> },
    { key: 'sourceName', title: 'Đối tượng', render: (value, image) => <div className="min-w-40"><p className="font-medium text-neutral-200">{value || `Đối tượng #${image.imageableId}`}</p><p className="mt-0.5 text-[11px] text-neutral-500">Mã: {image.imageableId}</p></div> },
    { key: 'isPrimary', title: 'Vai trò', render: (value, image) => image.source === 'images' ? <StatusBadge status={value ? 'primary' : 'additional'} domain="imagePrimary" /> : <span className="text-neutral-500">Ảnh gắn trực tiếp</span> },
    { key: 'createdAt', title: 'Ngày tạo', render: formatImageDate },
  ];

  return <section className="space-y-5">
    <header><p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">Quản lý hệ thống</p><h1 className="flex items-center gap-2 text-2xl font-semibold text-white"><ImageIcon className="h-6 w-6 text-amber-300" />Thư viện hình ảnh</h1><p className="mt-1 max-w-3xl text-xs text-neutral-400">Tổng hợp hình ảnh đang được sử dụng trong phòng chụp, bối cảnh, thiết bị, trang phục, phụ kiện, dịch vụ, gói chụp, banner và nội dung. Tải ảnh lên và gắn ảnh tại màn hình quản lý từng chức năng.</p></header>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><SummaryCard icon={Layers3} label="Tổng hình ảnh" value={stats.total} /><SummaryCard icon={Camera} label="Ảnh liên kết danh mục" value={stats.linked} tone="blue" /><SummaryCard icon={BookImage} label="Ảnh banner / nội dung" value={stats.standalone} tone="green" /><SummaryCard icon={Star} label="Ảnh đại diện" value={stats.primary} /></div>
    <AdminFilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Tìm URL, mô tả hoặc đối tượng..." filters={[{ key: 'type', label: 'Loại đối tượng', value: type, onChange: setType, options: IMAGE_TYPE_OPTIONS }]} sortValue={sortOrder} onSortChange={setSortOrder} onReset={resetFilters} />
    {pageError && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{pageError}</span><button type="button" onClick={loadImages} className="ml-auto whitespace-nowrap font-medium underline">Tải lại</button></div>}
    {partialWarning && <p role="status" className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">{partialWarning}</p>}
    {loading ? <div className="flex min-h-48 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/50 text-sm text-neutral-400"><span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-amber-300" />Đang tổng hợp hình ảnh...</div> : <AdminTable columns={columns} data={filtered} rowKey="rowId" emptyMessage="Chưa có hình ảnh nào trong các chức năng quản lý." />}
  </section>;
}
