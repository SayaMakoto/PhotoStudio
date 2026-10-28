export const PACKAGE_STATUS_OPTIONS = [
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'inactive', label: 'Ngừng hoạt động' },
];

export const PACKAGE_EQUIPMENT_OPTIONS = [
  { value: 'camera', label: 'Máy ảnh' },
  { value: 'lens', label: 'Ống kính' },
  { value: 'lighting', label: 'Thiết bị chiếu sáng' },
  { value: 'tripod', label: 'Chân máy' },
  { value: 'other', label: 'Thiết bị khác' },
];

export const PACKAGE_EQUIPMENT_LABELS = Object.fromEntries(PACKAGE_EQUIPMENT_OPTIONS.map(({ value, label }) => [value, label]));

export function formatPackagePrice(value) {
  const price = Number(value);
  return Number.isFinite(price) ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price) : '—';
}

export function formatPackageDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}

export function getPackageErrorMessage(error) {
  return error?.response?.data?.message || error?.message || 'Đã xảy ra lỗi khi xử lý gói chụp. Vui lòng thử lại.';
}
