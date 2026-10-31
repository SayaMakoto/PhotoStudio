import { useEffect, useState, useMemo } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  DollarSign,
  Package,
  Printer,
  Sparkles,
  TrendingUp,
  Wallet,
  ChevronLeft,
  ChevronRight,
  FileDown,
} from 'lucide-react';
import employeeSalaryService from '../../../services/employee/salaryService';

function formatVND(amount) {
  return Number(amount || 0).toLocaleString('vi-VN') + ' đ';
}

function formatDate(val) {
  if (!val) return '—';
  const d = new Date(val);
  return Number.isNaN(d.getTime())
    ? '—'
    : new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'medium',
      }).format(d);
}

const ITEMS_PER_PAGE = 8;

export default function EmployeeSalarySection({ profile, employeeDetails }) {
  const [salaries, setSalaries] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('10/2026');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let mounted = true;
    const fetchSalaries = async () => {
      setLoading(true);
      try {
        const data = await employeeSalaryService.getMySalaries(
          profile?.id,
          employeeDetails?.id
        );
        if (mounted && Array.isArray(data)) {
          setSalaries(data);
          if (data.length > 0) {
            setSelectedPeriod(`${data[0].month}/${data[0].year}`);
          }
        }
      } catch (err) {
        console.warn('Lỗi tải dữ liệu lương nhân viên:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSalaries();
    return () => {
      mounted = false;
    };
  }, [profile, employeeDetails]);

  // Lọc phiếu lương theo kỳ được chọn
  const currentSalary = useMemo(() => {
    if (!salaries.length) return null;
    const [m, y] = selectedPeriod.split('/').map(Number);
    return (
      salaries.find((s) => s.month === m && s.year === y) || salaries[0]
    );
  }, [salaries, selectedPeriod]);

  // Reset trang khi đổi kỳ lương
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPeriod]);

  const commissionList = useMemo(() => {
    return currentSalary?.commissionDetails || [];
  }, [currentSalary]);

  const totalPages = Math.ceil(commissionList.length / ITEMS_PER_PAGE) || 1;
  const paginatedCommissionList = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return commissionList.slice(start, start + ITEMS_PER_PAGE);
  }, [commissionList, currentPage]);

  const isPhotographer =
    !employeeDetails?.position ||
    employeeDetails?.position === 'photographer' ||
    currentSalary?.position === 'photographer';

  const dailyRateText = isPhotographer
    ? '250.000 đ/ngày'
    : formatVND(currentSalary?.dailyRate || 200000) + '/ngày';

  // Xuất file PDF / In phiếu lương chuyên nghiệp
  const handlePrintPDF = () => {
    if (!currentSalary) return;
    const printWindow = window.open('', '_blank', 'width=900,height=950');
    if (!printWindow) return;

    const commissionRows =
      commissionList && commissionList.length > 0
        ? commissionList
            .map(
              (item, idx) => `
          <tr>
            <td style="padding: 9px 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${idx + 1}</td>
            <td style="padding: 9px 8px; border-bottom: 1px solid #e5e7eb; font-family: monospace; font-weight: 600;">#BK-${item.bookingId || idx + 1}</td>
            <td style="padding: 9px 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${formatDate(item.shootDate)}</td>
            <td style="padding: 9px 8px; border-bottom: 1px solid #e5e7eb;">${item.customerName || 'Khách hàng'}</td>
            <td style="padding: 9px 8px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">${item.packageName || 'Gói chụp'}</td>
            <td style="padding: 9px 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatVND(item.packagePrice)}</td>
            <td style="padding: 9px 8px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #BE4B5E; font-weight: bold;">10%</td>
            <td style="padding: 9px 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold; color: #059669;">+${formatVND(item.commissionAmount)}</td>
          </tr>
        `
            )
            .join('')
        : '<tr><td colspan="8" style="padding: 20px; text-align: center; color: #9ca3af;">Không có chi tiết hoa hồng ca chụp trong kỳ này.</td></tr>';

    const employeeName = profile?.fullname || currentSalary.employeeName || 'Nhân viên tác nghiệp';
    const positionName = isPhotographer ? 'Nhiếp ảnh gia (Photographer)' : (employeeDetails?.position || 'Chuyên viên studio');
    const phone = profile?.phone || currentSalary.employeePhone || '—';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="vi">
        <head>
          <meta charset="utf-8" />
          <title>Phiếu Lương & Hoa Hồng - ${employeeName} - Tháng ${currentSalary.month}/${currentSalary.year}</title>
          <style>
            @page { size: A4; margin: 15mm; }
            * { box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              color: #1f2937;
              padding: 20px;
              font-size: 13px;
              line-height: 1.5;
              background: #fff;
            }
            .header-bar {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 2px solid #BE4B5E;
              padding-bottom: 16px;
              margin-bottom: 20px;
            }
            .brand-name {
              font-size: 22px;
              font-weight: 800;
              color: #261A1E;
              letter-spacing: -0.5px;
            }
            .brand-sub {
              font-size: 11px;
              color: #6b7280;
              margin-top: 3px;
            }
            .slip-title {
              text-align: center;
              margin: 18px 0;
            }
            .slip-title h1 {
              font-size: 19px;
              font-weight: 800;
              color: #BE4B5E;
              margin: 0;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .slip-title p {
              font-size: 12px;
              color: #4b5563;
              margin: 4px 0 0;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px 24px;
              background: #faf5f6;
              padding: 16px;
              border-radius: 10px;
              border: 1px solid #f3e8eb;
              margin-bottom: 20px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
            }
            .info-label { color: #6b7280; }
            .info-val { font-weight: 600; color: #111827; }
            .summary-table, .commission-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
              font-size: 12px;
            }
            .summary-table th, .commission-table th {
              background: #fdf2f4;
              color: #261A1E;
              font-weight: 700;
              padding: 10px 8px;
              border-top: 1px solid #f3d5dc;
              border-bottom: 1px solid #f3d5dc;
            }
            .total-row {
              background: #fff1f3;
              font-weight: bold;
              font-size: 14px;
              color: #BE4B5E;
            }
            .signatures {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              text-align: center;
              margin-top: 40px;
              page-break-inside: avoid;
            }
            .sign-col { font-size: 12px; }
            .sign-title { font-weight: bold; color: #1f2937; margin-bottom: 4px; }
            .sign-hint { font-size: 10px; color: #9ca3af; font-style: italic; }
            .sign-space { height: 65px; }
            .print-btn-bar {
              margin-bottom: 20px;
              text-align: right;
            }
            .print-btn {
              background: #BE4B5E;
              color: #fff;
              border: none;
              padding: 9px 20px;
              border-radius: 8px;
              font-weight: bold;
              font-size: 13px;
              cursor: pointer;
            }
            @media print {
              .print-btn-bar { display: none; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="print-btn-bar">
            <button class="print-btn" onclick="window.print()">🖨️ In Phiếu Lương / Lưu PDF</button>
          </div>

          <div class="header-bar">
            <div>
              <div class="brand-name">PHOTOSTUDIO</div>
              <div class="brand-sub">Hệ thống Studio Chụp Ảnh Nghệ Thuật & Sự Kiện Chuyên Nghiệp</div>
              <div class="brand-sub">Địa chỉ: 123 Đường Điện Ảnh, Quận 1, TP. Hồ Chí Minh · Hotline: 1900 8888</div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: bold; color: #BE4B5E;">MÃ PHIẾU: #SAL-${currentSalary.id || '2026-10'}</div>
              <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}</div>
            </div>
          </div>

          <div class="slip-title">
            <h1>PHIẾU THANH TOÁN LƯƠNG & HOA HỒNG NHÂN VIÊN</h1>
            <p>Kỳ Lương: <strong>Tháng ${currentSalary.month} Năm ${currentSalary.year}</strong></p>
          </div>

          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">Họ và tên nhân viên:</span>
              <span class="info-val">${employeeName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Vị trí tác nghiệp:</span>
              <span class="info-val">${positionName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Số điện thoại:</span>
              <span class="info-val">${phone}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Trạng thái phiếu:</span>
              <span class="info-val" style="color: #059669;">${currentSalary.status === 'paid' ? 'Đã chi trả' : 'Đã duyệt / Sẵn sàng chi'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Số ngày làm việc thực tế:</span>
              <span class="info-val">${currentSalary.workDays} ngày công</span>
            </div>
            <div class="info-row">
              <span class="info-label">Đơn giá ngày công:</span>
              <span class="info-val">${dailyRateText}</span>
            </div>
          </div>

          <h3 style="font-size: 13px; font-weight: bold; color: #261A1E; margin-bottom: 8px;">I. TỔNG HỢP CÁC KHOẢN THU NHẬP</h3>
          <table class="summary-table">
            <thead>
              <tr>
                <th style="width: 50px; text-align: center;">STT</th>
                <th>Khoản mục thu nhập / Khấu trừ</th>
                <th style="width: 160px; text-align: center;">Căn cứ tính</th>
                <th style="width: 160px; text-align: right;">Số tiền (VNĐ)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 8px; text-align: center; border-bottom: 1px solid #e5e7eb;">1</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Lương cơ bản ngày công</strong></td>
                <td style="padding: 8px; text-align: center; border-bottom: 1px solid #e5e7eb;">${currentSalary.workDays} ngày × ${dailyRateText}</td>
                <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e5e7eb; font-weight: 600;">${formatVND(currentSalary.baseSalary)}</td>
              </tr>
              <tr>
                <td style="padding: 8px; text-align: center; border-bottom: 1px solid #e5e7eb;">2</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Tổng hoa hồng các gói chụp hoàn thành</strong></td>
                <td style="padding: 8px; text-align: center; border-bottom: 1px solid #e5e7eb;">10% trên ${currentSalary.totalShoots} gói</td>
                <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #059669;">+${formatVND(currentSalary.totalCommission)}</td>
              </tr>
              <tr>
                <td style="padding: 8px; text-align: center; border-bottom: 1px solid #e5e7eb;">3</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">Thưởng chỉ tiêu KPI & chuyên cần</td>
                <td style="padding: 8px; text-align: center; border-bottom: 1px solid #e5e7eb;">Hoàn thành tốt ca chụp</td>
                <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #d97706;">+${formatVND(currentSalary.bonus)}</td>
              </tr>
              <tr>
                <td style="padding: 8px; text-align: center; border-bottom: 1px solid #e5e7eb;">4</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">Các khoản khấu trừ / phạt vi phạm</td>
                <td style="padding: 8px; text-align: center; border-bottom: 1px solid #e5e7eb;">Nội quy studio</td>
                <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e5e7eb;">-${formatVND(currentSalary.deduction || 0)}</td>
              </tr>
              <tr class="total-row">
                <td colspan="3" style="padding: 10px 8px; text-align: right;">TỔNG LƯƠNG THỰC NHẬN:</td>
                <td style="padding: 10px 8px; text-align: right;">${formatVND(currentSalary.netSalary)}</td>
              </tr>
            </tbody>
          </table>

          <h3 style="font-size: 13px; font-weight: bold; color: #261A1E; margin-top: 24px; margin-bottom: 8px;">II. BẢNG KÊ CHI TIẾT HOA HỒNG TRÊN TỪNG GÓI CHỤP HOÀN THÀNH</h3>
          <table class="commission-table">
            <thead>
              <tr>
                <th style="width: 40px; text-align: center;">STT</th>
                <th style="width: 90px;">Mã đơn</th>
                <th style="width: 95px; text-align: center;">Ngày chụp</th>
                <th>Khách hàng</th>
                <th>Tên gói chụp</th>
                <th style="width: 105px; text-align: right;">Giá gói</th>
                <th style="width: 65px; text-align: center;">% HH</th>
                <th style="width: 110px; text-align: right;">Tiền nhận</th>
              </tr>
            </thead>
            <tbody>
              ${commissionRows}
            </tbody>
          </table>

          <div style="font-size: 11px; color: #6b7280; margin-top: 8px; font-style: italic;">
            * Ghi chú của quản trị viên: ${currentSalary.note || 'Hoàn thành tốt nhiệm vụ tác nghiệp trong tháng.'}
          </div>

          <div class="signatures">
            <div class="sign-col">
              <div class="sign-title">NGƯỜI LẬP PHIẾU</div>
              <div class="sign-hint">(Ký & ghi rõ họ tên)</div>
              <div class="sign-space"></div>
              <div style="font-weight: 600;">Kế toán Studio</div>
            </div>
            <div class="sign-col">
              <div class="sign-title">GIÁM ĐỐC / QUẢN LÝ</div>
              <div class="sign-hint">(Ký duyệt)</div>
              <div class="sign-space"></div>
              <div style="font-weight: 600;">Ban Quản Trị</div>
            </div>
            <div class="sign-col">
              <div class="sign-title">NHÂN VIÊN KÝ NHẬN</div>
              <div class="sign-hint">(Ký & ghi rõ họ tên)</div>
              <div class="sign-space"></div>
              <div style="font-weight: 600;">${employeeName}</div>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header & Bộ chọn kỳ lương & Nút Xuất PDF */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#F0E4E6] shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#BE4B5E] tracking-wider uppercase">
            Thu Nhập & Hoa Hồng Tác Nghiệp
          </span>
          <h2 className="text-xl font-bold text-[#261A1E] mt-0.5 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#BE4B5E]" />
            Bảng Lương & KPI Tháng {currentSalary?.month || 10}/{currentSalary?.year || 2026}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Chính sách: Lương cơ bản <strong className="text-gray-800">{dailyRateText}</strong> theo số ngày làm việc + hoa hồng <strong className="text-[#BE4B5E]">10%/gói chụp</strong> hoàn thành.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Kỳ lương:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-800 outline-none focus:border-[#BE4B5E]"
            >
              {salaries.map((s) => (
                <option key={`${s.month}/${s.year}`} value={`${s.month}/${s.year}`}>
                  Tháng {s.month}/{s.year}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handlePrintPDF}
            className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#BE4B5E] to-[#9E3A4B] hover:from-[#A83D4E] hover:to-[#8E2F3F] text-xs font-semibold text-white shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>In phiếu lương / Xuất PDF</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-48 items-center justify-center rounded-2xl border border-gray-100 bg-white p-8 text-xs text-gray-500">
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-rose-300 border-t-[#BE4B5E]" />
          Đang tải dữ liệu lương...
        </div>
      ) : currentSalary ? (
        <>
          {/* Thông báo trạng thái cấp phát lương của Admin */}
          {currentSalary.status === 'paid' ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-emerald-900">
                    Admin đã cấp phát lương Kỳ Tháng {currentSalary.month}/{currentSalary.year}
                  </p>
                  <p className="text-emerald-700 mt-0.5">
                    Số tiền thực nhận: <strong className="font-extrabold text-sm text-emerald-900">{formatVND(currentSalary.netSalary)}</strong> đã được kế toán/admin chi trả vào ngày {formatDate(currentSalary.paidAt || currentSalary.updatedAt)}.
                  </p>
                </div>
              </div>
              <span className="self-start sm:self-center px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-[11px] shadow-xs shrink-0">
                ✓ ĐÃ CẤP PHÁT
              </span>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-amber-950">
                    Kỳ Lương Tháng {currentSalary.month}/{currentSalary.year} đang chờ Admin cấp phát
                  </p>
                  <p className="text-amber-800 mt-0.5">
                    Số lương dự kiến sẽ nhận: <strong className="font-extrabold text-sm text-amber-950">{formatVND(currentSalary.netSalary)}</strong> (Đang chờ ban quản trị phê duyệt chi trả).
                  </p>
                </div>
              </div>
              <span className="self-start sm:self-center px-3 py-1 rounded-full bg-amber-500 text-white font-bold text-[11px] shadow-xs shrink-0">
                ⏳ CHỜ CẤP PHÁT
              </span>
            </div>
          )}

          {/* Thẻ Thống kê 4 số liệu quan trọng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Số lương đã được cấp phát */}
            <div
              className={`p-5 rounded-2xl border shadow-xs relative overflow-hidden ${
                currentSalary.status === 'paid'
                  ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'
                  : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold uppercase tracking-wider block ${
                    currentSalary.status === 'paid' ? 'text-emerald-700' : 'text-amber-800'
                  }`}
                >
                  Số Lương Đã Cấp Phát
                </span>
                <span
                  className={`p-1.5 rounded-lg ${
                    currentSalary.status === 'paid'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                </span>
              </div>
              <div
                className={`text-2xl font-extrabold mt-2 ${
                  currentSalary.status === 'paid' ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {currentSalary.status === 'paid'
                  ? formatVND(currentSalary.netSalary)
                  : '0 đ'}
              </div>
              <div className="mt-2 text-[11px]">
                {currentSalary.status === 'paid' ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Đã nhận ngày {formatDate(currentSalary.paidAt || currentSalary.updatedAt)}
                  </span>
                ) : (
                  <span className="text-amber-800 font-medium">
                    Chưa cấp phát (Dự kiến: {formatVND(currentSalary.netSalary)})
                  </span>
                )}
              </div>
            </div>

            {/* 2. Lương cơ bản */}
            <div className="p-5 rounded-2xl bg-white border border-[#F0E4E6] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Lương Cơ Bản
                </span>
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
              <div className="text-xl font-bold text-gray-800 mt-2">
                {formatVND(currentSalary.baseSalary)}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                <strong>{currentSalary.workDays} ngày làm</strong> × {dailyRateText}
              </p>
            </div>

            {/* 3. Tổng tiền hoa hồng */}
            <div className="p-5 rounded-2xl bg-white border border-[#F0E4E6] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tổng Hoa Hồng Gói
                </span>
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <Coins className="w-4 h-4" />
                </span>
              </div>
              <div className="text-xl font-bold text-emerald-600 mt-2">
                +{formatVND(currentSalary.totalCommission)}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Từ <strong>{currentSalary.totalShoots} gói chụp</strong> (10%/gói)
              </p>
            </div>

            {/* 4. Tổng thực nhận dự kiến */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FFF1F3] to-[#FDF0F3] border border-[#FECDD3] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#BE4B5E] uppercase tracking-wider">
                  Tổng Thực Nhận
                </span>
                <span className="p-1.5 rounded-lg bg-rose-100 text-[#BE4B5E]">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-extrabold text-[#BE4B5E] mt-2">
                {formatVND(currentSalary.netSalary)}
              </div>
              <p className="text-[11px] text-[#8C3A48] font-medium mt-1">
                Cơ bản + Hoa hồng + Thưởng ({formatVND(currentSalary.bonus)})
              </p>
            </div>
          </div>

          {/* Bảng Kê Chi Tiết Tiền Hoa Hồng Nhận Được Trên Từng Gói (Có phân trang 8 cái/lần) */}
          <div className="p-6 rounded-2xl bg-white border border-[#F0E4E6] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-[#BE4B5E]" />
                  Bảng Kê Chi Tiết Hoa Hồng Trên Từng Gói Chụp Hoàn Thành
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Hoa hồng được trích 10% trực tiếp trên mỗi gói chụp mà bạn tác nghiệp hoàn thành ({commissionList.length} gói chụp).
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-100">
                Tổng cộng: +{formatVND(currentSalary.totalCommission)}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-medium">
                    <th className="pb-3">Mã đơn & Ngày chụp</th>
                    <th className="pb-3">Khách hàng</th>
                    <th className="pb-3">Tên gói chụp</th>
                    <th className="pb-3 text-right">Giá trị gói</th>
                    <th className="pb-3 text-center">% Hoa hồng</th>
                    <th className="pb-3 text-right">Tiền hoa hồng nhận được</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedCommissionList.length > 0 ? (
                    paginatedCommissionList.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3">
                          <strong className="text-gray-800 block font-mono">
                            #BK-{item.bookingId || idx + 1}
                          </strong>
                          <span className="text-[11px] text-gray-400">
                            {formatDate(item.shootDate)}
                          </span>
                        </td>
                        <td className="py-3 text-gray-700 font-medium">
                          {item.customerName || 'Khách hàng'}
                        </td>
                        <td className="py-3 font-semibold text-gray-800 max-w-xs">
                          {item.packageName}
                        </td>
                        <td className="py-3 text-right font-medium text-gray-700">
                          {formatVND(item.packagePrice)}
                        </td>
                        <td className="py-3 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-[#BE4B5E] font-bold text-[11px]">
                            10%
                          </span>
                        </td>
                        <td className="py-3 text-right font-extrabold text-emerald-600 text-sm">
                          +{formatVND(item.commissionAmount)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-gray-400">
                        Chưa có gói chụp nào được ghi nhận hoa hồng trong kỳ này.
                      </td>
                    </tr>
                  )}
                </tbody>
                {commissionList.length > 0 && (
                  <tfoot>
                    <tr className="border-t-2 border-gray-200">
                      <td colSpan={5} className="py-3 text-right font-bold text-gray-700">
                        Tổng tiền hoa hồng tất cả gói chụp:
                      </td>
                      <td className="py-3 text-right font-extrabold text-emerald-600 text-sm">
                        +{formatVND(currentSalary.totalCommission)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Phân trang 8 mục / lần */}
            {commissionList.length > ITEMS_PER_PAGE && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs">
                <span className="text-gray-500">
                  Hiển thị{' '}
                  <strong className="text-gray-800">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(currentPage * ITEMS_PER_PAGE, commissionList.length)}
                  </strong>{' '}
                  trong tổng số <strong className="text-gray-800">{commissionList.length}</strong> gói chụp
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 transition-colors"
                    title="Trang trước"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`min-w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                          currentPage === pageNum
                            ? 'bg-[#BE4B5E] text-white shadow-xs'
                            : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 transition-colors"
                    title="Trang sau"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="p-8 text-center rounded-2xl bg-white border border-[#F0E4E6] text-xs text-gray-500">
          Chưa có bảng lương nào được ghi nhận cho bạn.
        </div>
      )}
    </div>
  );
}
