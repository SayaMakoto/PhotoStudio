export const ROOM_STATUS_OPTIONS = [
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'inactive', label: 'Ngừng hoạt động' },
  { value: 'maintenance', label: 'Đang bảo trì' },
];

export function getRoomErrorMessage(error) {
  return error?.response?.data?.message || error?.message || 'Đã xảy ra lỗi khi xử lý phòng chụp. Vui lòng thử lại.';
}

export function formatRoomDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}
