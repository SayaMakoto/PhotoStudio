export const BOOKING_STATUS_OPTIONS = [
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'in_progress', label: 'Đang thực hiện' },
  { value: 'completed', label: 'Hoàn tất' },
  { value: 'cancelled', label: 'Đã hủy' },
];

const NEXT_BOOKING_STATUS = {
  pending: 'confirmed',
  confirmed: 'in_progress',
  in_progress: 'completed',
};

export function getNextBookingStatus(status) {
  const nextStatus = NEXT_BOOKING_STATUS[status];
  return BOOKING_STATUS_OPTIONS.find((option) => option.value === nextStatus) || null;
}

export function formatBookingDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(date);
}

export function formatBookingDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}

export function formatBookingTime(value) {
  if (!value) return '—';
  return String(value).slice(0, 5);
}

export function formatBookingPrice(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount) : '—';
}

export function getBookingErrorMessage(error) {
  return error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Không thể xử lý đơn đặt lịch. Vui lòng thử lại.';
}
