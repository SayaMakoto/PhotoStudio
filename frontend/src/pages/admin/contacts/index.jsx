import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Mail,
  MessageSquare,
  Trash2,
  XCircle,
} from 'lucide-react';
import AdminFilterBar from '../../../components/admin/common/AdminFilterBar';
import AdminTable from '../../../components/admin/common/AdminTable';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import useAdminNotification from '../../../components/admin/common/useAdminNotification';
import adminContactService from '../../../services/admin/contactService';
import ContactDialog from './ContactDialog';
import {
  CONTACT_STATUS_OPTIONS,
  formatContactDate,
  getContactErrorMessage,
} from './contactConfig';

const asRows = (rows) => (Array.isArray(rows) ? rows : []);

function SummaryCard({ label, value, icon: Icon, tone = 'amber' }) {
  const colors = {
    amber: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
    green: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    blue: 'border-sky-500/20 bg-sky-500/10 text-sky-300',
    neutral: 'border-neutral-700 bg-neutral-800 text-neutral-300',
  };
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-neutral-400">{label}</p>
        <span className={`grid h-9 w-9 place-items-center rounded-xl border ${colors[tone] || colors.amber}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

export default function AdminContactsPage() {
  const { notify } = useAdminNotification();
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedContact, setSelectedContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setPageError('');
    try {
      const data = await adminContactService.getAll();
      setContacts(asRows(data));
    } catch (err) {
      setPageError(getContactErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    adminContactService
      .getAll()
      .then((data) => {
        if (mounted) setContacts(asRows(data));
      })
      .catch((err) => {
        if (mounted) setPageError(getContactErrorMessage(err));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return contacts
      .filter((item) => {
        const matchesSearch =
          !keyword ||
          [
            item.id,
            item.fullname,
            item.email,
            item.phone,
            item.subject,
            item.message,
            item.replyMessage,
          ]
            .filter(Boolean)
            .some((val) => String(val).toLowerCase().includes(keyword));

        const matchesStatus = !statusFilter || item.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const idA = Number(a.id) || 0;
        const idB = Number(b.id) || 0;
        return sortOrder === 'oldest' ? idA - idB : idB - idA;
      });
  }, [contacts, search, statusFilter, sortOrder]);

  const stats = useMemo(
    () => ({
      total: contacts.length,
      pending: contacts.filter((c) => c.status === 'pending').length,
      completed: contacts.filter((c) => c.status === 'completed').length,
      cancelled: contacts.filter((c) => c.status === 'cancelled').length,
    }),
    [contacts]
  );

  const handleUpdateStatus = async (id, status, replyMessage) => {
    try {
      const updated = await adminContactService.updateStatus(id, status, replyMessage);
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
      setSelectedContact((prev) => (prev?.id === id ? { ...prev, ...updated } : prev));
      notify({
        type: 'success',
        title: 'Cập nhật thành công',
        message: `Đã lưu trạng thái và phản hồi cho liên hệ #${id}.`,
      });
      setSelectedContact(null);
    } catch (err) {
      notify({ type: 'error', message: getContactErrorMessage(err) });
      throw err;
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminContactService.delete(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (selectedContact?.id === id) setSelectedContact(null);
      notify({
        type: 'success',
        title: 'Đã xóa liên hệ',
        message: `Thư liên hệ #${id} đã được xóa thành công.`,
      });
    } catch (err) {
      notify({ type: 'error', message: getContactErrorMessage(err) });
      throw err;
    }
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setSortOrder('newest');
  };

  const columns = [
    {
      key: 'id',
      title: 'Mã thư',
      cellClassName: 'font-mono text-neutral-400',
      render: (id) => `#CT-${id}`,
    },
    {
      key: 'fullname',
      title: 'Khách hàng',
      render: (name, item) => (
        <div className="min-w-40">
          <p className="font-semibold text-neutral-100">{name || 'Khách hàng'}</p>
          <p className="mt-0.5 text-[11px] text-neutral-400">
            {item.email} {item.phone ? `· ${item.phone}` : ''}
          </p>
        </div>
      ),
    },
    {
      key: 'subject',
      title: 'Tiêu đề & Nội dung',
      render: (subject, item) => (
        <div className="max-w-md min-w-56 space-y-0.5">
          <p className="font-medium text-neutral-200 truncate" title={subject || ''}>
            {subject || 'Yêu cầu tư vấn'}
          </p>
          <p className="text-[11px] text-neutral-400 line-clamp-1 truncate" title={item.message || ''}>
            {item.message || '—'}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Trạng thái',
      render: (val) => <StatusBadge status={val} domain="contact" />,
    },
    {
      key: 'replyMessage',
      title: 'Phản hồi',
      render: (val) =>
        val?.trim() ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
            <CheckCircle2 className="h-3 w-3" />
            Đã trả lời
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-300">
            <Clock className="h-3 w-3" />
            Chưa trả lời
          </span>
        ),
    },
    {
      key: 'createdAt',
      title: 'Ngày gửi',
      render: formatContactDate,
    },
  ];

  return (
    <section className="space-y-5">
      {/* Header */}
      <header>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
          Chăm sóc khách hàng
        </p>
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-white">
          <Mail className="h-6 w-6 text-amber-300" />
          Quản lý liên hệ & tư vấn
        </h1>
        <p className="mt-1 text-xs text-neutral-400">
          Tiếp nhận tin nhắn liên hệ, yêu cầu tư vấn chụp ảnh và xử lý phản hồi cho khách hàng từ website.
        </p>
      </header>

      {/* Summary Cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={Mail} label="Tổng số liên hệ" value={stats.total} tone="blue" />
        <SummaryCard icon={Clock} label="Chờ phản hồi" value={stats.pending} tone="amber" />
        <SummaryCard icon={CheckCircle2} label="Đã phản hồi" value={stats.completed} tone="green" />
        <SummaryCard icon={XCircle} label="Đã đóng / Hủy" value={stats.cancelled} tone="neutral" />
      </div>

      {/* Filter Bar */}
      <AdminFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm theo tên khách, email, số điện thoại, tiêu đề, nội dung..."
        filters={[
          {
            key: 'status',
            label: 'Trạng thái',
            value: statusFilter,
            onChange: setStatusFilter,
            options: CONTACT_STATUS_OPTIONS,
          },
        ]}
        sortValue={sortOrder}
        onSortChange={setSortOrder}
        onReset={resetFilters}
      />

      {/* Error alert */}
      {pageError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{pageError}</span>
          <button
            type="button"
            onClick={loadData}
            className="cursor-pointer ml-auto whitespace-nowrap font-medium underline"
          >
            Tải lại
          </button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex min-h-48 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/50 text-sm text-neutral-400">
          <span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-amber-300" />
          Đang tải danh sách liên hệ...
        </div>
      ) : (
        <AdminTable
          columns={columns}
          data={filtered}
          emptyMessage="Không có yêu cầu liên hệ nào phù hợp với bộ lọc."
          onDetail={setSelectedContact}
        />
      )}

      <p className="flex items-center gap-2 text-[11px] text-neutral-500">
        <MessageSquare className="h-3.5 w-3.5 shrink-0" />
        Nhấn vào dòng hoặc nút thao tác để xem chi tiết, cập nhật trạng thái xử lý và gửi nội dung phản hồi cho khách hàng.
      </p>

      {/* Detail & Reply Dialog */}
      {selectedContact && (
        <ContactDialog
          key={selectedContact.id}
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
        />
      )}
    </section>
  );
}
