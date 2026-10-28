export const CLOTH_TYPE_OPTIONS = [
  { value: 'wedding', label: 'Trang phục cưới' },
  { value: 'traditional', label: 'Trang phục truyền thống' },
  { value: 'casual', label: 'Trang phục thường ngày' },
  { value: 'suit', label: 'Vest / Suit' },
  { value: 'cosplay', label: 'Cosplay' },
  { value: 'other', label: 'Khác' },
];

export const CLOTH_STATUS_OPTIONS = [
  { value: 'available', label: 'Sẵn sàng' },
  { value: 'rented', label: 'Đang được thuê' },
  { value: 'maintenance', label: 'Đang bảo trì' },
  { value: 'damaged', label: 'Bị hư hỏng' },
  { value: 'retired', label: 'Ngừng sử dụng' },
];

export const CLOTH_GENDER_OPTIONS = [
  { value: '', label: 'Không phân biệt' },
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
];

export const CLOTH_TYPE_LABELS = Object.fromEntries(CLOTH_TYPE_OPTIONS.map(({ value, label }) => [value, label]));

export function formatClothPrice(value) {
  const price = Number(value);
  return Number.isFinite(price) ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price) : '—';
}

export function getClothErrorMessage(error) {
  return error?.response?.data?.message || error?.message || 'Đã xảy ra lỗi khi xử lý trang phục. Vui lòng thử lại.';
}

export function formatClothDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}
