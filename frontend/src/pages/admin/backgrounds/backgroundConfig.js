export const BACKGROUND_STATUS_OPTIONS = [
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'inactive', label: 'Ngừng hoạt động' },
  { value: 'maintenance', label: 'Đang bảo trì' },
];

export const BACKGROUND_STATUS_LABELS = Object.fromEntries(
  BACKGROUND_STATUS_OPTIONS.map(({ value, label }) => [value, label]),
);

export function getBackgroundErrorMessage(error) {
  return error?.response?.data?.message || error?.message || 'Đã xảy ra lỗi khi xử lý bối cảnh. Vui lòng thử lại.';
}

export function formatBackgroundDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}
