/**
 * Helper to get badge style and Vietnamese label for booking/resource statuses
 */
export const STATUS_MAP = {
  PENDING: { label: 'Chờ xác nhận', color: 'amber' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'blue' },
  COMPLETED: { label: 'Hoàn thành', color: 'emerald' },
  CANCELLED: { label: 'Đã hủy', color: 'rose' },
  ACTIVE: { label: 'Đang hoạt động', color: 'emerald' },
  INACTIVE: { label: 'Ngừng hoạt động', color: 'gray' },
  MAINTENANCE: { label: 'Bảo trì', color: 'amber' },
};

export function getStatusInfo(statusKey) {
  return STATUS_MAP[statusKey] || { label: statusKey || 'Không xác định', color: 'gray' };
}

export default { STATUS_MAP, getStatusInfo };
