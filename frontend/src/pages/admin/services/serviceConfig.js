export const STUDIO_SERVICE_TYPE_OPTIONS = [
  { value: 'photography', label: 'Chụp ảnh' },
  { value: 'makeup', label: 'Trang điểm' },
  { value: 'clothing', label: 'Trang phục' },
  { value: 'accessory', label: 'Phụ kiện' },
  { value: 'background', label: 'Bối cảnh' },
];

export const STUDIO_SERVICE_STATUS_OPTIONS = [
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'inactive', label: 'Ngừng hoạt động' },
];

export const STUDIO_SERVICE_TYPE_LABELS = Object.fromEntries(STUDIO_SERVICE_TYPE_OPTIONS.map(({ value, label }) => [value, label]));

export function formatServicePrice(value) {
  const price = Number(value);
  return Number.isFinite(price) ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price) : '—';
}

export function formatServiceDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}

export function getServiceErrorMessage(error) {
  return error?.response?.data?.message || error?.message || 'Đã xảy ra lỗi khi xử lý dịch vụ. Vui lòng thử lại.';
}
