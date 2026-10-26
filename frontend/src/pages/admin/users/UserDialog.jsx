import { X } from "lucide-react";
import StatusBadge from "../../../components/admin/common/StatusBadge";
import { ROLE_LABELS } from "./userConfig";

export default function UserDialog({ user, onClose }) {
  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-dialog-title"
        className="w-full max-w-xl rounded-2xl border border-neutral-700 bg-neutral-950 p-5 shadow-2xl shadow-black/50"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2
              id="user-dialog-title"
              className="text-lg font-semibold text-white"
            >
              Thông tin người dùng
            </h2>
            <p className="mt-1 text-xs text-neutral-400">
              Mã người dùng: {user.id}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            ["Họ và tên", user.fullname],
            ["Tên đăng nhập", user.username],
            ["Email", user.email],
            ["Số điện thoại", user.phone],
            ["Vai trò", ROLE_LABELS[user.role] ?? user.role],
            ["Trạng thái", user.status],
            ["Địa chỉ", user.address],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0">
              <p className="text-[11px] text-neutral-500">{label}</p>
              {label === "Trạng thái" ? (
                <div className="mt-1">
                  <StatusBadge status={user.status} domain="user" />
                </div>
              ) : (
                <p className="mt-1 wrap-break-word text-sm text-neutral-200">
                  {value || "—"}
                </p>
              )}
            </div>
          ))}
          <div className="col-span-full flex justify-end border-t border-neutral-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-neutral-700 px-4 py-2 text-xs font-medium text-neutral-300 transition-colors hover:bg-neutral-800"
            >
              Đóng
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
