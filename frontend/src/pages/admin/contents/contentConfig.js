export const CONTENT_TYPES = [
  { value: 'page', label: 'Trang nội dung' },
  { value: 'post', label: 'Bài viết' },
];

export const CONTENT_STATUSES = [
  { value: 'draft', label: 'Bản nháp' },
  { value: 'published', label: 'Đã xuất bản' },
  { value: 'hidden', label: 'Đã ẩn' },
];

export const CONTENT_TYPE_LABELS = Object.fromEntries(CONTENT_TYPES.map(({ value, label }) => [value, label]));

export function getContentErrorMessage(error) {
  return error?.response?.data?.message
    || error?.response?.data?.error
    || error?.message
    || 'Không thể xử lý nội dung. Vui lòng thử lại.';
}

export function formatContentDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}

export function createSlug(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
