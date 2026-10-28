export const PAYMENT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Chờ thanh toán' },
  { value: 'paid', label: 'Đã thanh toán' },
  { value: 'failed', label: 'Thất bại' },
  { value: 'refunded', label: 'Đã hoàn tiền' },
];

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'cash', label: 'Tiền mặt' },
  { value: 'vnpay', label: 'VNPay' },
  { value: 'credit_card', label: 'Thẻ tín dụng' },
];

export const PAYMENT_METHOD_LABELS = Object.fromEntries(PAYMENT_METHOD_OPTIONS.map(({ value, label }) => [value, label]));

export function formatPaymentDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(date);
}

export function formatPaymentDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}

export function formatPaymentAmount(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount) : '—';
}

export function getPaymentErrorMessage(error) {
  return error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Không thể tải lịch sử thanh toán. Vui lòng thử lại.';
}
