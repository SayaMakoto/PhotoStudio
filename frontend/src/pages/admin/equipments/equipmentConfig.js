export const EQUIPMENT_TYPE_OPTIONS = [
  { value: "camera", label: "Máy ảnh" },
  { value: "lens", label: "Ống kính" },
  { value: "lighting", label: "Thiết bị chiếu sáng" },
  { value: "tripod", label: "Chân máy" },
  { value: "other", label: "Thiết bị khác" },
];

export const EQUIPMENT_STATUS_OPTIONS = [
  { value: "available", label: "Sẵn sàng" },
  { value: "in_use", label: "Đang sử dụng" },
  { value: "maintenance", label: "Đang bảo trì" },
  { value: "broken", label: "Bị hỏng" },
  { value: "retired", label: "Ngừng sử dụng" },
];

export const EQUIPMENT_TYPE_LABELS = Object.fromEntries(
  EQUIPMENT_TYPE_OPTIONS.map(({ value, label }) => [value, label]),
);

export function formatEquipmentDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function getEquipmentErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Đã xảy ra lỗi khi xử lý thiết bị. Vui lòng thử lại."
  );
}
