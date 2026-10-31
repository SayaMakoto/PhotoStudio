import { Star, X } from "lucide-react";
import StatusBadge from "../../../components/admin/common/StatusBadge";
import { EMPLOYEE_POSITION_LABELS } from "./employeeConfig";

function InfoItem({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] text-neutral-500">{label}</p>
      <p className="mt-1 break-words text-sm text-neutral-200">{value || "—"}</p>
    </div>
  );
}

export default function EmployeeDetailDialog({ employee, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="employee-dialog-title"
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-neutral-700 bg-neutral-950 p-5 shadow-2xl shadow-black/50"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="employee-dialog-title" className="text-lg font-semibold text-white">
              Chi tiết nhân viên
            </h2>
            <p className="mt-1 text-xs text-neutral-400">
              {employee.fullname || employee.username} · Mã nhân viên: {employee.id}
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

        <div className="space-y-6">
          <section>
            <h3 className="mb-3 text-sm font-semibold text-rose-400">Thông tin tài khoản</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem label="Mã người dùng" value={employee.userId} />
              <InfoItem label="Tên đăng nhập" value={employee.username} />
              <InfoItem
                label="Vai trò tài khoản"
                value={employee.role === "Employee" ? "Nhân viên" : employee.role}
              />
              <InfoItem label="Họ và tên" value={employee.fullname} />
              <InfoItem label="Email" value={employee.email} />
              <InfoItem label="Số điện thoại" value={employee.phone} />
              <InfoItem label="Ngày sinh" value={employee.dateOfBirth} />
              <InfoItem
                label="Giới tính"
                value={
                  employee.gender === "Male"
                    ? "Nam"
                    : employee.gender === "Female"
                      ? "Nữ"
                      : employee.gender
                }
              />
              <InfoItem label="Địa chỉ" value={employee.address} />
              <div>
                <p className="text-[11px] text-neutral-500">Trạng thái tài khoản</p>
                <div className="mt-1">
                  <StatusBadge status={employee.accountStatus} domain="user" />
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-rose-400">Hồ sơ nhân viên</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem
                label="Vị trí"
                value={EMPLOYEE_POSITION_LABELS[employee.position] || employee.position}
              />
              <InfoItem label="Ngày tuyển dụng" value={employee.hireDate} />
              <div>
                <p className="text-[11px] text-neutral-500">Trạng thái nhân viên</p>
                <div className="mt-1">
                  <StatusBadge status={employee.employeeStatus} domain="employee" />
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-rose-400">Đánh giá của khách hàng</h3>
              <p className="flex items-center gap-1.5 text-xs text-neutral-300">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-rose-400" />
                {employee.averageRating == null ? "Chưa có điểm" : `${employee.averageRating.toFixed(1)} / 5`}
                <span className="text-neutral-500">({employee.reviews.length} đánh giá)</span>
              </p>
            </div>

            {employee.reviews.length === 0 ? (
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 py-8 text-center text-xs text-neutral-500">
                Nhân viên chưa có đánh giá.
              </div>
            ) : (
              <ul className="space-y-3">
                {employee.reviews.map((review) => (
                  <li
                    key={review.id}
                    className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4"
                  >
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-medium text-neutral-300">
                        Mã đánh giá #{review.reviewId}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-rose-400">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-rose-400" />
                        {Number(review.rating || 0).toFixed(1)} / 5
                      </p>
                    </div>
                    <p className="whitespace-pre-wrap break-words text-sm text-neutral-200">
                      {review.comment || "Khách hàng không để lại nhận xét."}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="flex justify-end border-t border-neutral-800 pt-4">
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
