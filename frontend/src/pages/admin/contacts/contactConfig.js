export const CONTACT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Chờ phản hồi' },
  { value: 'completed', label: 'Đã phản hồi' },
  { value: 'cancelled', label: 'Đã đóng' },
];

export function formatContactDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
}

export function getContactErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'Không thể xử lý yêu cầu liên hệ. Vui lòng thử lại.'
  );
}
