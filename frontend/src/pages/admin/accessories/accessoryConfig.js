export const ACCESSORY_TYPE_OPTIONS = [
  { value: 'fashion', label: 'Thời trang' },
  { value: 'concept', label: 'Đạo cụ concept' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'wedding', label: 'Phụ kiện cưới' },
  { value: 'other', label: 'Khác' },
];

export const ACCESSORY_STATUS_OPTIONS = [
  { value: 'available', label: 'Sẵn sàng' },
  { value: 'rented', label: 'Đang được thuê' },
  { value: 'maintenance', label: 'Đang bảo trì' },
  { value: 'damaged', label: 'Bị hư hỏng' },
  { value: 'retired', label: 'Ngừng sử dụng' },
];

export const ACCESSORY_TYPE_LABELS = Object.fromEntries(ACCESSORY_TYPE_OPTIONS.map(({ value, label }) => [value, label]));

export function formatAccessoryPrice(value) {
  const price = Number(value);
  return Number.isFinite(price) ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price) : '—';
}

export function formatAccessoryDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}

export function getAccessoryErrorMessage(error) {
  return error?.response?.data?.message || error?.message || 'Đã xảy ra lỗi khi xử lý phụ kiện. Vui lòng thử lại.';
}
