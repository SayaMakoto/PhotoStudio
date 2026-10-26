export const EMPLOYEE_POSITION_LABELS = {
  photographer: "Nhiếp ảnh gia",
  makeup: "Chuyên viên trang điểm",
  logistics: "Hậu cần",
};

export const EMPLOYEE_STATUS_OPTIONS = [
  { value: "active", label: "Đang làm việc" },
  { value: "inactive", label: "Ngừng hoạt động" },
  { value: "on_leave", label: "Đang nghỉ phép" },
];

export function getErrorMessage(error) {
  return (
    error?.response?.data?.message ??
    error?.message ??
    "Đã xảy ra lỗi. Vui lòng thử lại."
  );
}
