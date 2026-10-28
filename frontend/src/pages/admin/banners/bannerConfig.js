export const BANNER_STATUS_OPTIONS = [
  { value: 'active', label: 'Đang hiện' },
  { value: 'inactive', label: 'Đang ẩn' },
];

export function getBannerErrorMessage(error) {
  return error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Không thể xử lý banner. Vui lòng thử lại.';
}
