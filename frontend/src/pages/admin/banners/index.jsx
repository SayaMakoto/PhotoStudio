import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Image, Layers3, Plus, ToggleLeft } from 'lucide-react';
import AdminFilterBar from '../../../components/admin/common/AdminFilterBar';
import AdminTable from '../../../components/admin/common/AdminTable';
import useAdminNotification from '../../../components/admin/common/useAdminNotification';
import adminBannerService from '../../../services/admin/bannerService';
import BannerDialog from './BannerDialog';
import { BANNER_STATUS_OPTIONS, getBannerErrorMessage } from './bannerConfig';

const asRows = (rows) => Array.isArray(rows) ? rows : [];
const COLUMNS = [
  { key: 'id', title: 'Mã', cellClassName: 'font-mono text-neutral-400' },
  { key: 'imageUrl', title: 'Ảnh banner', render: (src, banner) => <div className="flex min-w-44 items-center gap-3"><img src={src} alt={banner.title || 'Banner'} className="h-12 w-20 rounded-lg border border-neutral-800 bg-neutral-950 object-cover" onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }} /><span className="max-w-56 truncate text-[11px] text-neutral-500" title={src}>{src || 'Chưa có URL ảnh'}</span></div> },
  { key: 'title', title: 'Tiêu đề', render: (title) => <p className="min-w-40 font-medium text-neutral-100">{title || 'Chưa có tiêu đề'}</p> },
  { key: 'link', title: 'Liên kết', render: (link) => <span className="block max-w-48 truncate text-neutral-400" title={link || ''}>{link || 'Không có liên kết'}</span> },
  { key: 'status', title: 'Trạng thái', type: 'status', statusDomain: 'visibility', toggleable: true },
];

function SummaryCard({ label, value, icon: Icon, tone = 'rose' }) {
  const colors = { amber: 'border-rose-500/20 bg-rose-500/10 text-rose-400', green: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300', blue: 'border-sky-500/20 bg-sky-500/10 text-sky-300' };
  return <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs text-neutral-400">{label}</p><span className={`grid h-9 w-9 place-items-center rounded-xl border ${colors[tone]}`}><Icon className="h-4 w-4" /></span></div><p className="mt-3 text-2xl font-semibold text-white">{value}</p></div>;
}

export default function AdminBannersPage() {
  const { notify } = useAdminNotification();
  const [banners, setBanners] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [dialog, setDialog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  const loadBanners = async () => {
    setLoading(true); setPageError('');
    try { setBanners(asRows(await adminBannerService.getAll())); }
    catch (error) { setPageError(getBannerErrorMessage(error)); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    let mounted = true;
    adminBannerService.getAll()
      .then((rows) => { if (mounted) setBanners(asRows(rows)); })
      .catch((error) => { if (mounted) setPageError(getBannerErrorMessage(error)); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return banners.filter((banner) => (!keyword || [banner.title, banner.imageUrl, banner.link].filter(Boolean).some((value) => String(value).toLowerCase().includes(keyword))) && (!status || banner.status === status))
      .sort((a, b) => (sortOrder === 'oldest' ? 1 : -1) * ((Number(a.id) || 0) - (Number(b.id) || 0)));
  }, [banners, search, sortOrder, status]);

  const stats = useMemo(() => ({ total: banners.length, active: banners.filter((banner) => banner.status === 'active').length, inactive: banners.filter((banner) => banner.status === 'inactive').length }), [banners]);
  const resetFilters = () => { setSearch(''); setStatus(''); setSortOrder('newest'); };

  const saveBanner = async (payload) => {
    try {
      if (dialog.mode === 'create') {
        await adminBannerService.create(payload);
        notify({ type: 'success', title: 'Thêm banner thành công', message: `Banner “${payload.title}” đã được thêm.` });
      } else {
        await adminBannerService.update(dialog.banner.id, payload);
        notify({ type: 'success', title: 'Cập nhật banner thành công', message: `Thông tin banner “${payload.title}” đã được lưu.` });
      }
      setDialog(null); await loadBanners();
    } catch (error) { setPageError(getBannerErrorMessage(error)); throw error; }
  };

  const changeStatus = async (banner, nextStatus) => {
    const nextLabel = BANNER_STATUS_OPTIONS.find((option) => option.value === nextStatus)?.label || nextStatus;
    if (!window.confirm(`${nextStatus === 'active' ? 'Hiển thị' : 'Ẩn'} banner “${banner.title}”?`)) return;
    try {
      await adminBannerService.updateStatus(banner.id, nextStatus);
      notify({ type: 'success', title: 'Đã cập nhật trạng thái banner', message: `“${banner.title}” hiện ở trạng thái ${nextLabel.toLowerCase()}.` });
      await loadBanners();
    } catch (error) { notify({ type: 'error', message: getBannerErrorMessage(error) }); }
  };

  const deleteBanner = async (banner) => {
    if (!window.confirm(`Xóa banner “${banner.title}”? Banner sẽ bị xóa vĩnh viễn khỏi hệ thống.`)) return;
    try {
      await adminBannerService.delete(banner.id);
      notify({ type: 'success', title: 'Đã xóa banner', message: `Banner “${banner.title}” đã được xóa.` });
      await loadBanners();
    } catch (error) { notify({ type: 'error', message: getBannerErrorMessage(error) }); }
  };

  return <section className="space-y-5">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-400">Quản lý hệ thống</p><h1 className="flex items-center gap-2 text-2xl font-semibold text-white"><Image className="h-6 w-6 text-rose-400" />Quản lý banner</h1><p className="mt-1 text-xs text-neutral-400">Quản lý ảnh quảng bá hiển thị trên trang chủ và liên kết khi khách hàng nhấn vào banner.</p></div><button type="button" onClick={() => setDialog({ mode: 'create', banner: null })} className="inline-flex min-h-11 items-center gap-2 self-start rounded-xl bg-rose-500 px-4 text-xs font-semibold text-neutral-950 transition hover:bg-rose-600 sm:self-auto"><Plus className="h-4 w-4" />Thêm banner</button></header>
    <div className="grid gap-3 sm:grid-cols-3"><SummaryCard icon={Layers3} label="Tổng banner" value={stats.total} /><SummaryCard icon={CheckCircle2} label="Đang hiển thị" value={stats.active} tone="green" /><SummaryCard icon={ToggleLeft} label="Đang ẩn" value={stats.inactive} tone="blue" /></div>
    <AdminFilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Tìm tiêu đề, URL ảnh hoặc liên kết..." filters={[{ key: 'status', label: 'Trạng thái hiển thị', value: status, onChange: setStatus, options: BANNER_STATUS_OPTIONS }]} sortValue={sortOrder} onSortChange={setSortOrder} onReset={resetFilters} />
    {pageError && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{pageError}</span><button type="button" onClick={loadBanners} className="ml-auto whitespace-nowrap font-medium underline">Tải lại</button></div>}
    {loading ? <div className="flex min-h-48 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/50 text-sm text-neutral-400"><span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-rose-400" />Đang tải danh sách banner...</div> : <AdminTable columns={COLUMNS} data={filtered} emptyMessage="Không có banner phù hợp với bộ lọc." onDetail={(banner) => setDialog({ mode: 'detail', banner })} onEdit={(banner) => setDialog({ mode: 'edit', banner })} onDelete={deleteBanner} onStatusChange={changeStatus} />}
    <p className="text-[11px] text-neutral-500">Banner đang hiển thị có thể được tải lên trang chủ. Khi ẩn banner, nội dung sẽ không còn được chọn làm banner hiển thị.</p>
    {dialog && <BannerDialog key={`${dialog.mode}-${dialog.banner?.id ?? 'new'}`} banner={dialog.banner} mode={dialog.mode} onClose={() => setDialog(null)} onSave={saveBanner} />}
  </section>;
}
