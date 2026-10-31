import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  Package,
  Sparkles,
  Users,
  Wallet,
  User,
  Send,
  Coins,
} from 'lucide-react';
import AdminFilterBar from '../../../components/admin/common/AdminFilterBar';
import AdminTable from '../../../components/admin/common/AdminTable';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import useAdminNotification from '../../../components/admin/common/useAdminNotification';
import adminSalaryService from '../../../services/admin/salaryService';
import SalaryDetailDialog from './SalaryDetailDialog';
import {
  MONTH_OPTIONS,
  SALARY_STATUS_OPTIONS,
  YEAR_OPTIONS,
  formatSalaryDate,
  formatVND,
  getSalaryErrorMessage,
} from './salaryConfig';

const asRows = (rows) => (Array.isArray(rows) ? rows : []);

function SummaryCard({ label, value, icon: Icon, tone = 'rose' }) {
  const colors = {
    rose: 'border-rose-500/20 bg-rose-500/10 text-rose-300',
    green: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    blue: 'border-sky-500/20 bg-sky-500/10 text-sky-300',
    neutral: 'border-neutral-700 bg-neutral-800 text-neutral-300',
  };
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-neutral-400">{label}</p>
        <span className={`grid h-9 w-9 place-items-center rounded-xl border ${colors[tone] || colors.rose}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

export default function AdminSalariesPage() {
  const { notify } = useAdminNotification();
  const [salaries, setSalaries] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('10');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [disbursingAll, setDisbursingAll] = useState(false);
  const [pageError, setPageError] = useState('');

  // Tự động tải và tự động tính toán lương tháng nếu chưa có dữ liệu
  const loadData = async (m = selectedMonth, y = selectedYear) => {
    setLoading(true);
    setPageError('');
    try {
      let data = await adminSalaryService.getAll(m, y);
      const rows = asRows(data);
      // Tự động tính toán lương nếu kỳ lương này chưa có bản ghi
      if (rows.length === 0) {
        const calculated = await adminSalaryService.calculateSalaries(
          Number(m),
          Number(y)
        );
        setSalaries(asRows(calculated));
      } else {
        setSalaries(rows);
      }
    } catch (err) {
      setPageError(getSalaryErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const handleUpdateStatus = async (id, payload) => {
    try {
      const updated = await adminSalaryService.updateStatus(id, payload);
      setSalaries((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
      );
      setSelectedSalary(null);
      notify({
        type: 'success',
        title: 'Cập nhật thành công',
        message: `Đã lưu quyết toán phiếu lương #${id}.`,
      });
      return updated;
    } catch (err) {
      notify({ type: 'error', message: getSalaryErrorMessage(err) });
      throw err;
    }
  };

  // Phát lương cho 1 nhân viên
  const handleDisburseSingle = async (item) => {
    const confirmMessage = `Xác nhận phát lương Tháng ${selectedMonth}/${selectedYear} cho nhân viên "${item.employeeName}" với tổng số tiền ${formatVND(item.netSalary)}?`;
    if (!window.confirm(confirmMessage)) return;

    try {
      await handleUpdateStatus(item.id, {
        status: 'paid',
        note: item.note ? `${item.note} (Admin đã phát lương)` : 'Admin đã phát lương',
      });
      notify({
        type: 'success',
        title: 'Phát lương thành công',
        message: `Đã phát lương ${formatVND(item.netSalary)} cho "${item.employeeName}".`,
      });
    } catch (err) {
      // lỗi đã notify trong handleUpdateStatus
    }
  };

  // Danh sách các nhân viên duy nhất trong kỳ lương
  const employeeOptions = useMemo(() => {
    const map = new Map();
    salaries.forEach((s) => {
      if (s.employeeId && !map.has(s.employeeId)) {
        map.set(s.employeeId, {
          id: s.employeeId,
          name: s.employeeName || `Nhân viên #${s.employeeId}`,
          position: s.position,
          phone: s.employeePhone,
        });
      }
    });
    return Array.from(map.values());
  }, [salaries]);

  const selectedEmployee = useMemo(() => {
    if (!selectedEmployeeId) return null;
    return employeeOptions.find((e) => String(e.id) === String(selectedEmployeeId));
  }, [employeeOptions, selectedEmployeeId]);

  // Bộ lọc danh sách bảng lương
  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return salaries
      .filter((item) => {
        const matchesSearch =
          !keyword ||
          [
            item.id,
            item.employeeName,
            item.employeePhone,
            item.employeeEmail,
            item.position,
            item.note,
          ]
            .filter(Boolean)
            .some((val) => String(val).toLowerCase().includes(keyword));

        const matchesStatus = !statusFilter || item.status === statusFilter;
        const matchesEmployee = !selectedEmployeeId || String(item.employeeId) === String(selectedEmployeeId);
        return matchesSearch && matchesStatus && matchesEmployee;
      })
      .sort((a, b) => {
        const idA = Number(a.id) || 0;
        const idB = Number(b.id) || 0;
        return sortOrder === 'oldest' ? idA - idB : idB - idA;
      });
  }, [salaries, search, statusFilter, sortOrder, selectedEmployeeId]);

  // Thống kê tổng hợp: TÙY THEO PHẦN LỌC hiển thị chính xác theo nhân viên và số lượng nhân viên
  const stats = useMemo(() => {
    const targetList = filtered;
    const totalNet = targetList.reduce((sum, s) => sum + Number(s.netSalary || 0), 0);
    const totalBase = targetList.reduce((sum, s) => sum + Number(s.baseSalary || 0), 0);
    const totalCommission = targetList.reduce((sum, s) => sum + Number(s.totalCommission || 0), 0);
    const totalWorkDays = targetList.reduce((sum, s) => sum + Number(s.workDays || 0), 0);
    const uniqueEmployees = new Set(targetList.map((s) => s.employeeId || s.id));
    const totalStaff = uniqueEmployees.size;

    return {
      totalNet,
      totalBase,
      totalCommission,
      totalWorkDays,
      totalStaff,
    };
  }, [filtered]);

  // Danh sách nhân sự chưa phát lương trong phần lọc
  const unpaidInFiltered = useMemo(() => {
    return filtered.filter((s) => s.status !== 'paid');
  }, [filtered]);

  // Phát lương đồng loạt cho các nhân viên chưa nhận trong bộ lọc
  const handleDisburseAllFiltered = async () => {
    if (unpaidInFiltered.length === 0) return;
    const totalUnpaidAmount = unpaidInFiltered.reduce(
      (sum, s) => sum + Number(s.netSalary || 0),
      0
    );
    const confirmMessage = `Xác nhận phát lương đồng loạt cho ${unpaidInFiltered.length} nhân viên với tổng số tiền ${formatVND(totalUnpaidAmount)}?`;
    if (!window.confirm(confirmMessage)) return;

    setDisbursingAll(true);
    try {
      for (const item of unpaidInFiltered) {
        await adminSalaryService.updateStatus(item.id, {
          status: 'paid',
          note: item.note ? `${item.note} (Admin đã phát lương)` : 'Admin đã phát lương',
        });
      }
      await loadData(selectedMonth, selectedYear);
      notify({
        type: 'success',
        title: 'Phát lương thành công',
        message: `Đã hoàn tất phát lương cho toàn bộ ${unpaidInFiltered.length} nhân viên.`,
      });
    } catch (err) {
      notify({ type: 'error', message: getSalaryErrorMessage(err) });
    } finally {
      setDisbursingAll(false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setSelectedEmployeeId('');
    setSortOrder('newest');
  };

  const columns = [
    {
      key: 'id',
      title: 'Mã phiếu',
      cellClassName: 'font-mono text-neutral-400',
      render: (id) => `#SAL-${id}`,
    },
    {
      key: 'employeeName',
      title: 'Nhân viên',
      render: (name, item) => (
        <div className="min-w-40">
          <p className="font-semibold text-neutral-100">{name || 'Nhân viên'}</p>
          <p className="mt-0.5 text-[11px] text-neutral-400">
            {item.position === 'photographer'
              ? 'Nhiếp ảnh gia (250k/ngày)'
              : item.position === 'makeup'
              ? 'Makeup Artist'
              : item.position}{' '}
            {item.employeePhone ? `· ${item.employeePhone}` : ''}
          </p>
        </div>
      ),
    },
    {
      key: 'workDays',
      title: 'Số ngày làm',
      render: (days, item) => (
        <div>
          <span className="font-bold text-neutral-100">{days} ngày</span>
          <span className="block text-[11px] text-neutral-500">
            ({formatVND(item.dailyRate)}/ngày)
          </span>
        </div>
      ),
    },
    {
      key: 'baseSalary',
      title: 'Lương cơ bản',
      render: (val) => (
        <span className="font-medium text-neutral-200">{formatVND(val)}</span>
      ),
    },
    {
      key: 'totalShoots',
      title: 'Gói chụp',
      render: (shoots) => (
        <span className="inline-flex items-center gap-1 font-semibold text-neutral-100">
          <Package className="h-3.5 w-3.5 text-rose-400" />
          {shoots} gói
        </span>
      ),
    },
    {
      key: 'totalCommission',
      title: 'Tổng hoa hồng',
      render: (val) => (
        <span className="font-bold text-emerald-400">+{formatVND(val)}</span>
      ),
    },
    {
      key: 'netSalary',
      title: 'Tổng thực nhận',
      render: (val, item) => (
        <div>
          <span className="font-extrabold text-rose-400 text-sm">
            {formatVND(val)}
          </span>
          <div className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
            <span>CB: {formatVND(item.baseSalary)}</span>
            <span>+</span>
            <span className="text-emerald-400">HH: {formatVND(item.totalCommission)}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Trạng thái',
      render: (val) => <StatusBadge status={val} domain="salary" />,
    },
    {
      key: 'payout',
      title: 'Phát lương',
      headerClassName: 'text-center',
      cellClassName: 'text-center',
      render: (_, item) => {
        const isPaid = item.status === 'paid';
        return (
          <div className="flex items-center justify-center">
            {isPaid ? (
              <div className="text-center">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Đã phát lương
                </span>
                {item.paidAt && (
                  <span className="block text-[10px] text-neutral-500 mt-0.5">
                    {formatSalaryDate(item.paidAt)}
                  </span>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDisburseSingle(item);
                }}
                title="Bấm để phát lương cho nhân viên này"
                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Phát lương</span>
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <section className="space-y-5">
      {/* Header - Tự động tính toán lương, không cần nút thủ công */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-400">
            Kế toán & Nhân sự
          </p>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-white">
            <Wallet className="h-6 w-6 text-rose-400" />
            Quản lý lương & hoa hồng
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            Hệ thống tự động tính lương theo ngày làm việc (250.000 đ/ngày) và hoa hồng 10% trên mỗi gói chụp hoàn thành.
          </p>
        </div>

        {/* Nút phát lương đồng loạt cho các nhân viên chưa nhận */}
        {unpaidInFiltered.length > 0 && (
          <button
            type="button"
            onClick={handleDisburseAllFiltered}
            disabled={disbursingAll}
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50 transition-all shadow-md shadow-emerald-500/20"
          >
            <DollarSign className="h-4 w-4" />
            <span>
              {disbursingAll
                ? 'Đang phát lương...'
                : `Phát lương cho ${unpaidInFiltered.length} nhân viên`}
            </span>
          </button>
        )}
      </header>

      {/* Summary Cards - Cập nhật tự động theo bộ lọc nhân viên */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={Wallet}
          label={
            selectedEmployee
              ? `Tổng thực nhận: ${selectedEmployee.name}`
              : `Tổng quỹ lương T${selectedMonth}/${selectedYear} (${stats.totalStaff} nhân sự)`
          }
          value={formatVND(stats.totalNet)}
          tone="rose"
        />
        <SummaryCard
          icon={DollarSign}
          label={`Tổng lương cơ bản (${stats.totalStaff} nhân sự)`}
          value={formatVND(stats.totalBase)}
          tone="blue"
        />
        <SummaryCard
          icon={Sparkles}
          label="Tổng hoa hồng trích thưởng (10%)"
          value={`+${formatVND(stats.totalCommission)}`}
          tone="green"
        />
        <SummaryCard
          icon={Users}
          label="Tổng ngày công / Nhân sự"
          value={`${stats.totalWorkDays} ngày công • ${stats.totalStaff} nhân viên`}
          tone="neutral"
        />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Chọn tháng */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400 font-medium">Kỳ lương:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 outline-none focus:border-rose-400"
          >
            {MONTH_OPTIONS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 outline-none focus:border-rose-400"
          >
            {YEAR_OPTIONS.map((y) => (
              <option key={y.value} value={y.value}>
                {y.label}
              </option>
            ))}
          </select>
        </div>

        {/* Chọn nhân viên theo dõi riêng */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400 font-medium">Chọn nhân viên:</span>
          <select
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs font-semibold text-neutral-100 outline-none focus:border-rose-400"
          >
            <option value="">-- Tất cả nhân viên ({employeeOptions.length}) --</option>
            {employeeOptions.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.position === 'photographer' ? 'Nhiếp ảnh gia' : emp.position === 'makeup' ? 'Makeup' : emp.position || 'Nhân sự'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedEmployee && (
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs text-rose-200">
          <div className="flex items-center gap-2.5">
            <User className="h-4 w-4 text-rose-400 shrink-0" />
            <span>
              Đang lọc xem bảng lương & KPI của: <strong className="text-white font-bold">{selectedEmployee.name}</strong> ({selectedEmployee.position === 'photographer' ? 'Nhiếp ảnh gia' : selectedEmployee.position === 'makeup' ? 'Makeup Artist' : selectedEmployee.position})
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedEmployeeId('')}
            className="cursor-pointer text-xs font-semibold text-rose-300 hover:text-white underline shrink-0"
          >
            Xem tất cả nhân viên
          </button>
        </div>
      )}

      <AdminFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm kiếm nhân viên, số điện thoại, chức vụ..."
        filters={[
          {
            key: 'status',
            label: 'Trạng thái',
            value: statusFilter,
            onChange: setStatusFilter,
            options: SALARY_STATUS_OPTIONS,
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
            onClick={() => loadData(selectedMonth, selectedYear)}
            className="cursor-pointer ml-auto whitespace-nowrap font-medium underline"
          >
            Tải lại
          </button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex min-h-48 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/50 text-sm text-neutral-400">
          <span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-rose-400" />
          Đang tự động tải & tính toán bảng lương...
        </div>
      ) : (
        <AdminTable
          columns={columns}
          data={filtered}
          emptyMessage={`Chưa có dữ liệu bảng lương cho Tháng ${selectedMonth}/${selectedYear}.`}
          onDetail={setSelectedSalary}
        />
      )}

      <p className="flex items-center gap-2 text-[11px] text-neutral-500">
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-rose-400" />
        Nhấn vào dòng nhân viên để xem bảng kê chi tiết hoa hồng từng gói chụp, số ngày làm việc, xuất phiếu lương hoặc nhấn nút "Phát lương".
      </p>

      {/* Detail Dialog */}
      {selectedSalary && (
        <SalaryDetailDialog
          key={selectedSalary.id}
          salary={selectedSalary}
          onClose={() => setSelectedSalary(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </section>
  );
}
