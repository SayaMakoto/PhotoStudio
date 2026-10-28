export const NOTIFICATION_TYPES = [
  { value: 'booking', label: 'Đơn đặt lịch' },
  { value: 'payment', label: 'Thanh toán' },
  { value: 'employee_assignment', label: 'Phân công nhân viên' },
  { value: 'equipment', label: 'Thiết bị' },
  { value: 'system', label: 'Hệ thống' },
];

export const NOTIFICATION_READ_OPTIONS = [
  { value: 'unread', label: 'Chưa đọc' },
  { value: 'read', label: 'Đã đọc' },
];

export const NOTIFICATION_TYPE_LABELS = Object.fromEntries(
  NOTIFICATION_TYPES.map(({ value, label }) => [value, label]),
);

export function getNotificationErrorMessage(error) {
  return error?.response?.data?.message
    || error?.response?.data?.error
    || error?.message
    || 'Không thể xử lý thông báo. Vui lòng thử lại.';
}

export function formatNotificationDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}
