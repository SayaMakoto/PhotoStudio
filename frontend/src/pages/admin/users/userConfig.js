export const ROLE_LABELS = {
  Customer: "Khách hàng",
  Employee: "Nhân viên",
  Admin: "Quản trị viên",
  ADMIN: "Quản trị viên",
};

export function getErrorMessage(error) {
  return (
    error?.response?.data?.message ??
    error?.message ??
    "Đã xảy ra lỗi. Vui lòng thử lại."
  );
}
