export const SALARY_STATUS_OPTIONS = [
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'paid', label: 'Đã thanh toán' },
];

export const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: `Tháng ${i + 1}`,
}));

export const YEAR_OPTIONS = [
  { value: '2026', label: 'Năm 2026' },
  { value: '2025', label: 'Năm 2025' },
];

export function formatVND(amount) {
  return Number(amount || 0).toLocaleString('vi-VN') + ' đ';
}

export function formatSalaryDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? '—'
    : new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'medium',
      }).format(d);
}

export function getSalaryErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'Không thể xử lý dữ liệu lương. Vui lòng thử lại.'
  );
}
