export const REVIEW_RATING_OPTIONS = [
  { value: '5', label: '5 sao' },
  { value: '4', label: '4 sao' },
  { value: '3', label: '3 sao' },
  { value: '2', label: '2 sao' },
  { value: '1', label: '1 sao' },
];

export const REVIEW_REPLY_OPTIONS = [
  { value: 'replied', label: 'Đã phản hồi' },
  { value: 'unreplied', label: 'Chưa phản hồi' },
];

export function formatReviewDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function getReviewErrorMessage(error) {
  return error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Không thể xử lý đánh giá. Vui lòng thử lại.';
}
