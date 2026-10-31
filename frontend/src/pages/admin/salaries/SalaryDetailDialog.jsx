import { useEffect, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  DollarSign,
  Package,
  Printer,
  Sparkles,
  User,
  Wallet,
  X,
  Clock,
  Send,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import {
  SALARY_STATUS_OPTIONS,
  formatSalaryDate,
  formatVND,
  getSalaryErrorMessage,
} from './salaryConfig';

export default function SalaryDetailDialog({
  salary,
  onClose,
  onUpdateStatus,
}) {
  const [status, setStatus] = useState(salary.status || 'pending');
  const [bonus, setBonus] = useState(salary.bonus || 0);
  const [deduction, setDeduction] = useState(salary.deduction || 0);
  const [note, setNote] = useState(salary.note || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [commissionPage, setCommissionPage] = useState(1);
  const COMMISSION_PER_PAGE = 8;

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape' && !saving) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, saving]);

  // Tính tạm tổng lương thực nhận khi Admin thay đổi thưởng/phạt
  const previewNetSalary =
    Number(salary.baseSalary || 0) +
    Number(salary.totalCommission || 0) +
    Number(bonus || 0) -
    Number(deduction || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onUpdateStatus(salary.id, {
        status,
        bonus: Number(bonus),
        deduction: Number(deduction),
        note: note.trim(),
      });
      onClose();
    } catch (err) {
      setError(getSalaryErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=850,height=900');
    if (!printWindow) return;

    const commissionRows =
      salary.commissionDetails && salary.commissionDetails.length > 0
        ? salary.commissionDetails
            .map(
              (item, idx) => `
          <tr>
            <td style="padding: 8px 6px; border-bottom: 1px solid #f0e4e6; font-family: monospace;">#BK-${item.bookingId || idx + 1}</td>
            <td style="padding: 8px 6px; border-bottom: 1px solid #f0e4e6;">${item.customerName || 'Khách hàng'}</td>
            <td style="padding: 8px 6px; border-bottom: 1px solid #f0e4e6; text-align: center;">${formatSalaryDate(item.shootDate)}</td>
            <td style="padding: 8px 6px; border-bottom: 1px solid #f0e4e6;"><strong>${item.packageName}</strong></td>
            <td style="padding: 8px 6px; border-bottom: 1px solid #f0e4e6; text-align: right;">${formatVND(item.packagePrice)}</td>
            <td style="padding: 8px 6px; border-bottom: 1px solid #f0e4e6; text-align: center; color: #BE4B5E; font-weight: bold;">10%</td>
            <td style="padding: 8px 6px; border-bottom: 1px solid #f0e4e6; text-align: right; font-weight: bold; color: #059669;">+${formatVND(item.commissionAmount)}</td>
          </tr>
        `
            )
            .join('')
        : '<tr><td colspan="7" style="padding: 16px; text-align: center; color: #9ca3af;">Chưa có chi tiết hoa hồng.</td></tr>';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Phiếu Lương & Hoa Hồng #${salary.id} - ${salary.employeeName}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; color: #1f2937; padding: 24px; font-size: 12px; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #BE4B5E; padding-bottom: 12px; margin-bottom: 16px; }
            .brand { font-size: 20px; font-weight: 800; color: #261A1E; }
            .brand span { color: #BE4B5E; }
            .card { background: #FAF5F5; border: 1px solid #F0E4E6; border-radius: 8px; padding: 12px; margin-bottom: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 11.5px; }
            th { text-align: left; padding: 6px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 10.5px; text-transform: uppercase; }
            .summary-box { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin: 16px 0; text-align: center; }
            .summary-item { background: #fff; border: 1px solid #F0E4E6; border-radius: 8px; padding: 10px; }
            .summary-label { font-size: 10.5px; color: #6b7280; }
            .summary-val { font-size: 14px; font-weight: 800; color: #111827; margin-top: 2px; }
            .net-box { background: #FFF1F3; border: 2px solid #BE4B5E; border-radius: 8px; padding: 12px; text-align: center; margin-top: 14px; }
            .signatures { display: grid; grid-template-columns: 1fr 1fr; text-align: center; margin-top: 36px; padding-top: 16px; border-top: 1px dashed #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">PHOTO<span>STUDIO</span></div>
              <div style="font-size: 11px; color: #6b7280;">Hệ Thống Studio Chụp Ảnh Nghệ Thuật & Concept Chuyên Nghiệp</div>
              <div style="margin-top: 6px; font-size: 13px; font-weight: bold; color: #BE4B5E;">PHIẾU LƯƠNG & HOA HỒNG TÁC NGHIỆP</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 13px; font-weight: bold;">Kỳ lương: Tháng ${salary.month}/${salary.year}</div>
              <div style="font-size: 11px; color: #6b7280;">Mã phiếu: #SAL-${salary.id}</div>
              <div style="font-size: 11px; color: #6b7280;">Ngày in: ${new Date().toLocaleDateString('vi-VN')}</div>
            </div>
          </div>

          <div class="card">
            <strong style="color: #BE4B5E; text-transform: uppercase; font-size: 11px;">Thông tin nhân viên:</strong>
            <div style="margin-top: 4px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <div>Họ và tên: <strong>${salary.employeeName || 'Nhân viên'}</strong></div>
              <div>Vị trí: <strong>${salary.position === 'photographer' ? 'Nhiếp ảnh gia (Photographer)' : salary.position}</strong></div>
              <div>Số điện thoại: <strong>${salary.employeePhone || '—'}</strong></div>
              <div>Email: <strong>${salary.employeeEmail || '—'}</strong></div>
            </div>
          </div>

          <div class="summary-box">
            <div class="summary-item">
              <div class="summary-label">Số ngày làm việc</div>
              <div class="summary-val">${salary.workDays} ngày</div>
              <div style="font-size: 10px; color: #9ca3af;">(Đơn giá ${formatVND(salary.dailyRate)}/ngày)</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Lương cơ bản</div>
              <div class="summary-val" style="color: #BE4B5E;">${formatVND(salary.baseSalary)}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Hoa hồng (${salary.totalShoots} gói chụp)</div>
              <div class="summary-val" style="color: #059669;">+${formatVND(salary.totalCommission)}</div>
            </div>
          </div>

          <div class="card">
            <div style="font-weight: bold; color: #BE4B5E; text-transform: uppercase; font-size: 11px; margin-bottom: 6px;">
              Bảng kê hoa hồng chi tiết trên từng gói chụp (10%/gói)
            </div>
            <table>
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th style="text-align: center;">Ngày chụp</th>
                  <th>Gói chụp</th>
                  <th style="text-align: right;">Giá gói</th>
                  <th style="text-align: center;">% Hoa hồng</th>
                  <th style="text-align: right;">Tiền nhận</th>
                </tr>
              </thead>
              <tbody>
                ${commissionRows}
              </tbody>
            </table>
          </div>

          <div class="net-box">
            <div style="font-size: 11.5px; color: #6b7280; text-transform: uppercase; font-weight: 600;">Tổng tiền lương thực nhận (Net Salary)</div>
            <div style="font-size: 22px; font-weight: 800; color: #BE4B5E; margin-top: 4px;">${formatVND(previewNetSalary)}</div>
            <div style="font-size: 10.5px; color: #9ca3af; margin-top: 2px;">
              (Lương cơ bản: ${formatVND(salary.baseSalary)} + Hoa hồng: ${formatVND(salary.totalCommission)} ${bonus > 0 ? `+ Thưởng: ${formatVND(bonus)}` : ''} ${deduction > 0 ? `- Khấu trừ: ${formatVND(deduction)}` : ''})
            </div>
          </div>

          <div class="signatures">
            <div>
              <strong>Người Lập Phiếu</strong><br>
              <em style="color: #9ca3af; font-size: 10px;">(Ký & ghi rõ họ tên)</em>
              <div style="height: 50px;"></div>
              <strong>Ban Quản Trị PhotoStudio</strong>
            </div>
            <div>
              <strong>Nhân Viên Nhận Lương</strong><br>
              <em style="color: #9ca3af; font-size: 10px;">(Ký & ghi rõ họ tên)</em>
              <div style="height: 50px;"></div>
              <strong>${salary.employeeName || 'Nhân viên'}</strong>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="salary-dialog-title"
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl"
      >
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/95 px-6 py-4 backdrop-blur">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">
              Chi tiết bảng lương & hoa hồng
            </p>
            <h2 id="salary-dialog-title" className="mt-0.5 text-base font-semibold text-white">
              Phiếu lương #{salary.id} • Tháng {salary.month}/{salary.year}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20"
            >
              <Printer className="h-3.5 w-3.5" />
              In phiếu lương
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="cursor-pointer rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Nội dung chi tiết */}
        <div className="space-y-5 px-6 py-5">
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200"
            >
              {error}
            </div>
          )}

          {/* 1. Thông tin nhân viên */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 font-bold">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {salary.employeeName || 'Nhân viên tác nghiệp'}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {salary.position === 'photographer'
                      ? 'Nhiếp ảnh gia chính (Photographer)'
                      : salary.position === 'makeup'
                      ? 'Chuyên viên trang điểm (Makeup Artist)'
                      : 'Hậu cần & Ánh sáng'}{' '}
                    • {salary.employeePhone}
                  </p>
                </div>
              </div>
              <StatusBadge status={salary.status} domain="salary" />
            </div>
          </div>

          {/* 2. Thống kê số ngày làm & Lương cơ bản & Hoa hồng */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 text-center">
              <span className="text-[11px] text-neutral-400 block">Số ngày làm việc</span>
              <strong className="text-base text-white mt-1 block">
                {salary.workDays} ngày
              </strong>
              <span className="text-[10px] text-neutral-500 block">
                ({formatVND(salary.dailyRate)}/ngày)
              </span>
            </div>

            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 text-center">
              <span className="text-[11px] text-rose-300 block">Tổng lương cơ bản</span>
              <strong className="text-base text-rose-400 mt-1 block">
                {formatVND(salary.baseSalary)}
              </strong>
              <span className="text-[10px] text-neutral-500 block">
                {salary.workDays} × {formatVND(salary.dailyRate)}
              </span>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 text-center">
              <span className="text-[11px] text-neutral-400 block">Số gói hoàn thành</span>
              <strong className="text-base text-white mt-1 block">
                {salary.totalShoots} gói
              </strong>
              <span className="text-[10px] text-neutral-500 block">
                Hoa hồng 10%/gói
              </span>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-center">
              <span className="text-[11px] text-emerald-300 block">Tổng tiền hoa hồng</span>
              <strong className="text-base text-emerald-400 mt-1 block">
                +{formatVND(salary.totalCommission)}
              </strong>
              <span className="text-[10px] text-neutral-500 block">
                Trích 10% gói chụp
              </span>
            </div>
          </div>

          {/* 3. Bảng kê chi tiết tiền hoa hồng nhận được trên từng gói */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-300">
                <Package className="h-4 w-4 text-rose-400" />
                Bảng kê hoa hồng trên từng gói chụp ({salary.commissionDetails?.length || 0} gói)
              </h4>
              <span className="text-xs font-medium text-emerald-400">
                Tổng: +{formatVND(salary.totalCommission)}
              </span>
            </div>

            {(() => {
              const details = salary.commissionDetails || [];
              const totalCommissionPages = Math.ceil(details.length / COMMISSION_PER_PAGE) || 1;
              const paginatedCommission = details.slice(
                (commissionPage - 1) * COMMISSION_PER_PAGE,
                commissionPage * COMMISSION_PER_PAGE
              );
              return (
                <>
                  <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-[11px] text-neutral-400 font-medium">
                    <th className="pb-2">Đơn & Ngày chụp</th>
                    <th className="pb-2">Khách hàng</th>
                    <th className="pb-2">Tên gói chụp</th>
                    <th className="pb-2 text-right">Đơn giá gói</th>
                    <th className="pb-2 text-center">% Hoa hồng</th>
                    <th className="pb-2 text-right">Tiền hoa hồng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80">
                  {salary.commissionDetails && salary.commissionDetails.length > 0 ? (
                    paginatedCommission.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-neutral-900/60 transition-colors">
                        <td className="py-2.5">
                          <span className="font-mono text-neutral-400">#BK-{item.bookingId || idx + 1}</span>
                          <span className="block text-[11px] text-neutral-500">
                            {formatSalaryDate(item.shootDate)}
                          </span>
                        </td>
                        <td className="py-2.5 text-neutral-200">
                          {item.customerName || 'Khách hàng'}
                        </td>
                        <td className="py-2.5 font-medium text-neutral-200 max-w-xs truncate">
                          {item.packageName}
                        </td>
                        <td className="py-2.5 text-right font-medium text-neutral-300">
                          {formatVND(item.packagePrice)}
                        </td>
                        <td className="py-2.5 text-center font-bold text-rose-400">
                          10%
                        </td>
                        <td className="py-2.5 text-right font-bold text-emerald-400">
                          +{formatVND(item.commissionAmount)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-xs text-neutral-500">
                        Chưa có dữ liệu hoa hồng chi tiết cho kỳ lương này.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {details.length > COMMISSION_PER_PAGE && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-neutral-800 text-[11px] text-neutral-400">
                <span>
                  Hiển thị <strong className="text-white">{(commissionPage - 1) * COMMISSION_PER_PAGE + 1}–{Math.min(commissionPage * COMMISSION_PER_PAGE, details.length)}</strong> trong <strong className="text-white">{details.length}</strong> gói chụp
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={commissionPage === 1}
                    onClick={() => setCommissionPage((p) => Math.max(1, p - 1))}
                    className="p-1 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  {Array.from({ length: totalCommissionPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      type="button"
                      onClick={() => setCommissionPage(i + 1)}
                      className={`min-w-6 h-6 rounded-md text-[11px] font-semibold ${
                        commissionPage === i + 1
                          ? 'bg-rose-500 text-white'
                          : 'border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={commissionPage === totalCommissionPages}
                    onClick={() => setCommissionPage((p) => Math.min(totalCommissionPages, p + 1))}
                    className="p-1 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
                </>
              );
            })()}
          </div>

          {/* 4. Tổng lương nhận nổi bật */}
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-300">
                Tổng lương nhận (Net Salary)
              </p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Lương cơ bản ({formatVND(salary.baseSalary)}) + Hoa hồng ({formatVND(salary.totalCommission)})
                {bonus > 0 ? ` + Thưởng (${formatVND(bonus)})` : ''}
                {deduction > 0 ? ` - Phạt (${formatVND(deduction)})` : ''}
              </p>
            </div>
            <div className="text-2xl font-extrabold text-rose-400">
              {formatVND(previewNetSalary)}
            </div>
          </div>

          {/* 5. Form Cập nhật trạng thái / Thưởng / Phạt của Admin */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-950/70 p-4"
          >
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-rose-400" />
              Điều chỉnh & Quyết toán của Quản trị viên
            </h4>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-400">
                  Trạng thái phiếu lương:
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-neutral-100 outline-none focus:border-rose-400"
                >
                  {SALARY_STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-400">
                  Thưởng thêm / KPI (VNĐ):
                </label>
                <input
                  type="number"
                  min="0"
                  step="50000"
                  value={bonus}
                  onChange={(e) => setBonus(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-neutral-100 outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-400">
                  Khấu trừ / Phạt (VNĐ):
                </label>
                <input
                  type="number"
                  min="0"
                  step="50000"
                  value={deduction}
                  onChange={(e) => setDeduction(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-neutral-100 outline-none focus:border-rose-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-400">
                Ghi chú quyết toán:
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi chú đánh giá KPI hoặc mã chuyển khoản ngân hàng..."
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-neutral-100 outline-none focus:border-rose-400"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div>
                {salary.status !== 'paid' && (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={async () => {
                      setStatus('paid');
                      setSaving(true);
                      try {
                        await onUpdateStatus(salary.id, {
                          status: 'paid',
                          bonus: Number(bonus),
                          deduction: Number(deduction),
                          note: note.trim() || 'Admin đã phát lương',
                        });
                        onClose();
                      } catch (err) {
                        setError(getSalaryErrorMessage(err));
                      } finally {
                        setSaving(false);
                      }
                    }}
                    className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-white hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 shadow-md shadow-emerald-500/20"
                  >
                    <DollarSign className="h-3.5 w-3.5" />
                    <span>Phát lương ngay ({formatVND(previewNetSalary)})</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer rounded-xl border border-neutral-700 px-4 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-600 disabled:opacity-50"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {saving ? 'Đang lưu...' : 'Lưu quyết toán lương'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
