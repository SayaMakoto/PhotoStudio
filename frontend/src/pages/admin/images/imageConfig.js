export const IMAGEABLE_TYPES = [
  { value: 'room', label: 'Phòng chụp' },
  { value: 'background', label: 'Bối cảnh' },
  { value: 'equipment', label: 'Thiết bị' },
  { value: 'clothing', label: 'Trang phục' },
  { value: 'accessory', label: 'Phụ kiện' },
  { value: 'package', label: 'Gói chụp' },
  { value: 'service', label: 'Dịch vụ' },
];

export const IMAGE_TYPE_LABELS = Object.fromEntries([
  ...IMAGEABLE_TYPES,
  { value: 'banner', label: 'Banner' },
  { value: 'content', label: 'Nội dung' },
].map(({ value, label }) => [value, label]));

export function getImageErrorMessage(error) {
  return error?.response?.data?.message
    || error?.response?.data?.error
    || error?.message
    || 'Không thể xử lý hình ảnh. Vui lòng thử lại.';
}

export function formatImageDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}
