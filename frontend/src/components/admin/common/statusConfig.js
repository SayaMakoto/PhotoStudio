const neutral = "border-neutral-700 bg-neutral-800/70 text-neutral-300";
const green = "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
const red = "border-rose-500/30 bg-rose-500/10 text-rose-300";
const amber = "border-amber-500/30 bg-amber-500/10 text-amber-300";
const blue = "border-sky-500/30 bg-sky-500/10 text-sky-300";
const purple = "border-violet-500/30 bg-violet-500/10 text-violet-300";

export const STATUS_CONFIG = {
  active: { label: "Đang hoạt động", className: green },
  inactive: { label: "Ngừng hoạt động", className: neutral },
  available: { label: "Sẵn sàng", className: green },
  rented: { label: "Đang được thuê", className: amber },
  maintenance: { label: "Đang bảo trì", className: amber },
  damaged: { label: "Bị hư hỏng", className: red },
  retired: { label: "Ngừng sử dụng", className: neutral },
  in_use: { label: "Đang sử dụng", className: blue },
  broken: { label: "Bị hỏng", className: red },
  pending: { label: "Chờ xử lý", className: amber },
  confirmed: { label: "Đã xác nhận", className: blue },
  in_progress: { label: "Đang thực hiện", className: blue },
  completed: { label: "Hoàn tất", className: green },
  cancelled: { label: "Đã hủy", className: red },
  assigned: { label: "Đã phân công", className: blue },
  returned: { label: "Đã hoàn trả", className: green },
  paid: { label: "Đã thanh toán", className: green },
  failed: { label: "Thất bại", className: red },
  refunded: { label: "Đã hoàn tiền", className: purple },
  draft: { label: "Bản nháp", className: neutral },
  published: { label: "Đã xuất bản", className: green },
  hidden: { label: "Đã ẩn", className: neutral },
  banned: { label: "Đã khóa", className: red },
  on_leave: { label: "Đang nghỉ phép", className: amber },
};

export const STATUS_DOMAIN_CONFIG = {
  booking: {
    pending: { label: "Chờ xác nhận", className: amber },
    confirmed: { label: "Đã xác nhận", className: blue },
    in_progress: { label: "Đang thực hiện", className: blue },
    completed: { label: "Hoàn tất", className: green },
    cancelled: { label: "Đã hủy", className: red },
  },
  visibility: {
    active: { label: "Đang hiện", className: green },
    inactive: { label: "Đang ẩn", className: neutral },
  },
  room: {
    active: { label: "Sẵn sàng", className: green },
    inactive: { label: "Ngừng hoạt động", className: neutral },
    maintenance: { label: "Đang bảo trì", className: amber },
  },
  employee: {
    active: { label: "Đang làm việc", className: green },
    inactive: { label: "Ngừng hoạt động", className: neutral },
    on_leave: { label: "Đang nghỉ phép", className: amber },
  },
};

export function getStatusDefinition(status, domain) {
  const normalizedStatus = String(status ?? "").trim().toLowerCase();
  const domainDefinition = STATUS_DOMAIN_CONFIG[domain]?.[normalizedStatus];
  if (domainDefinition) return domainDefinition;

  return (
    STATUS_CONFIG[normalizedStatus] ?? {
      label: normalizedStatus
        ? normalizedStatus.replaceAll("_", " ")
        : "Chưa xác định",
      className: neutral,
    }
  );
}
