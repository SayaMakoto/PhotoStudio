import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, BookOpenText, CheckCircle2, FileText, Plus, ScrollText } from 'lucide-react';
import AdminFilterBar from '../../../components/admin/common/AdminFilterBar';
import AdminTable from '../../../components/admin/common/AdminTable';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import useAdminNotification from '../../../components/admin/common/useAdminNotification';
import adminContentService from '../../../services/admin/contentService';
import ContentDialog from './ContentDialog';
import { CONTENT_STATUSES, CONTENT_TYPES, CONTENT_TYPE_LABELS, formatContentDate, getContentErrorMessage } from './contentConfig';

const asRows = (rows) => Array.isArray(rows) ? rows : [];

function SummaryCard({ label, value, icon: Icon, tone = 'amber' }) {
  const colors = { amber: 'border-amber-500/20 bg-amber-500/10 text-amber-300', green: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300', blue: 'border-sky-500/20 bg-sky-500/10 text-sky-300' };
  return <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs text-neutral-400">{label}</p><span className={`grid h-9 w-9 place-items-center rounded-xl border ${colors[tone]}`}><Icon className="h-4 w-4" /></span></div><p className="mt-3 text-2xl font-semibold text-white">{value}</p></div>;
}

export default function AdminContentsPage() {
  const { notify } = useAdminNotification();
  const [contents, setContents] = useState([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [dialog, setDialog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  const loadContents = async () => {
    setLoading(true);
    setPageError('');
    try { setContents(asRows(await adminContentService.getAll())); }
    catch (error) { setPageError(getContentErrorMessage(error)); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    let mounted = true;
    adminContentService.getAll()
      .then((rows) => { if (mounted) setContents(asRows(rows)); })
      .catch((error) => { if (mounted) setPageError(getContentErrorMessage(error)); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return contents.filter((item) => {
      const matchesSearch = !keyword || [item.id, item.title, item.slug, item.content].filter(Boolean).some((value) => String(value).toLowerCase().includes(keyword));
      return matchesSearch && (!type || item.type === type) && (!status || item.status === status);
    }).sort((a, b) => (sortOrder === 'oldest' ? 1 : -1) * ((Number(a.id) || 0) - (Number(b.id) || 0)));
  }, [contents, search, sortOrder, status, type]);

  const stats = useMemo(() => ({
    total: contents.length,
    pages: contents.filter((item) => item.type === 'page').length,
    posts: contents.filter((item) => item.type === 'post').length,
    published: contents.filter((item) => item.status === 'published').length,
  }), [contents]);

  const saveContent = async (payload) => {
    try {
      if (dialog.mode === 'create') {
        await adminContentService.create(payload);
        notify({ type: 'success', title: 'Tạo nội dung thành công', message: `“${payload.title}” đã được tạo.` });
      } else {
        await adminContentService.update(dialog.content.id, payload);
        notify({ type: 'success', title: 'Đã cập nhật nội dung', message: `“${payload.title}” đã được lưu.` });
      }
      setDialog(null);
      await loadContents();
    } catch (error) {
      setPageError(getContentErrorMessage(error));
      throw error;
    }
  };

  const deleteContent = async (content) => {
    if (!window.confirm(`Xóa vĩnh viễn nội dung “${content.title}” (/${content.slug})?`)) return;
    try {
      await adminContentService.delete(content.id);
      setContents((current) => current.filter((item) => item.id !== content.id));
      notify({ type: 'success', title: 'Đã xóa nội dung', message: `“${content.title}” đã được xóa.` });
    } catch (error) { notify({ type: 'error', message: getContentErrorMessage(error) }); }
  };

  const resetFilters = () => { setSearch(''); setType(''); setStatus(''); setSortOrder('newest'); };
  const columns = [
    { key: 'id', title: 'Mã', cellClassName: 'font-mono text-neutral-400' },
    { key: 'title', title: 'Tiêu đề', render: (title, item) => <div className="flex min-w-52 items-center gap-3">{item.imageUrl ? <img src={item.imageUrl} alt="" className="h-12 w-16 shrink-0 rounded-lg border border-neutral-800 bg-neutral-950 object-cover" onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }} /> : <span className="grid h-12 w-16 shrink-0 place-items-center rounded-lg border border-neutral-800 bg-neutral-950 text-neutral-600"><FileText className="h-5 w-5" /></span>}<div className="min-w-0"><p className="max-w-64 truncate font-medium text-neutral-100" title={title || ''}>{title || 'Chưa có tiêu đề'}</p><p className="mt-0.5 max-w-64 truncate text-[11px] text-neutral-500" title={item.slug}>/{item.slug}</p></div></div> },
    { key: 'type', title: 'Loại nội dung', render: (value) => <span className="inline-flex rounded-full border border-neutral-700 bg-neutral-800/70 px-2.5 py-1 text-[11px] font-medium text-neutral-300">{CONTENT_TYPE_LABELS[value] || value || '—'}</span> },
    { key: 'status', title: 'Trạng thái', render: (value) => <StatusBadge status={value} /> },
    { key: 'updatedAt', title: 'Cập nhật', render: formatContentDate },
  ];

  return <section className="space-y-5">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">Quản lý hệ thống</p><h1 className="flex items-center gap-2 text-2xl font-semibold text-white"><BookOpenText className="h-6 w-6 text-amber-300" />Quản lý nội dung</h1><p className="mt-1 max-w-3xl text-xs text-neutral-400">Quản lý các trang nội dung tĩnh và bài viết, bao gồm slug, nội dung, ảnh đại diện và trạng thái xuất bản.</p></div><button type="button" onClick={() => setDialog({ mode: 'create', content: null })} className="inline-flex min-h-11 items-center gap-2 self-start rounded-xl bg-amber-400 px-4 text-xs font-semibold text-neutral-950 transition hover:bg-amber-300 sm:self-auto"><Plus className="h-4 w-4" />Thêm nội dung</button></header>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><SummaryCard icon={ScrollText} label="Tổng nội dung" value={stats.total} /><SummaryCard icon={FileText} label="Trang nội dung" value={stats.pages} tone="blue" /><SummaryCard icon={BookOpenText} label="Bài viết" value={stats.posts} /><SummaryCard icon={CheckCircle2} label="Đã xuất bản" value={stats.published} tone="green" /></div>
    <AdminFilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Tìm tiêu đề, slug hoặc nội dung..." filters={[{ key: 'type', label: 'Loại nội dung', value: type, onChange: setType, options: CONTENT_TYPES }, { key: 'status', label: 'Trạng thái', value: status, onChange: setStatus, options: CONTENT_STATUSES }]} sortValue={sortOrder} onSortChange={setSortOrder} onReset={resetFilters} />
    {pageError && <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{pageError}</span><button type="button" onClick={loadContents} className="ml-auto whitespace-nowrap font-medium underline">Tải lại</button></div>}
    {loading ? <div className="flex min-h-48 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/50 text-sm text-neutral-400"><span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-amber-300" />Đang tải nội dung...</div> : <AdminTable columns={columns} data={filtered} emptyMessage="Không có nội dung phù hợp với bộ lọc." onDetail={(content) => setDialog({ mode: 'detail', content })} onEdit={(content) => setDialog({ mode: 'edit', content })} onDelete={deleteContent} />}
    <p className="text-[11px] text-neutral-500">Trạng thái hợp lệ: bản nháp, đã xuất bản và đã ẩn. Slug phải duy nhất; API từ chối lưu slug trùng hoặc không đúng định dạng.</p>
    {dialog && <ContentDialog key={`${dialog.mode}-${dialog.content?.id ?? 'new'}`} content={dialog.content} mode={dialog.mode} onClose={() => setDialog(null)} onSave={saveContent} />}
  </section>;
}
